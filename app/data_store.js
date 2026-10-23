/**
 * Signal Desk - Data Store & Replay Engine
 * Implements DATA_CONTRACT.md rules:
 * - Identity: (source_type, source_id)
 * - Revision ordering: higher revision replaces entire payload; same/older ignored
 * - Separate manual overrides: preserved across updates and re-imports
 * - Transcript usability detection
 * - Metrics calculation with explicit denominators
 */

class SignalDeskStore {
  constructor() {
    this.STORAGE_KEY = 'signal_desk_app_state_v1';
    this.records = new Map(); // Key: `${source_type}:${source_id}` -> Record Object
    this.manualOverrides = new Map(); // Key: `${source_type}:${source_id}` -> { route, secondaryRoute, notes, updatedAt }
    this.importHistory = []; // Audit log of imports
    this.currentBatchId = null;
    this.currentRevision = 1;
    this.analyses = window.SIGNAL_DESK_ANALYSES || {};
    this.listeners = new Set();
  }

  // Subscribe to state updates
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(cb => {
      try { cb(this); } catch (e) { console.error('Listener error', e); }
    });
  }

  // Generate composite record key
  getRecordKey(sourceType, sourceId) {
    return `${sourceType}:${sourceId}`;
  }

  // Check if record has usable transcript
  hasUsableTranscript(record) {
    if (!record) return false;
    if (record.source_type === 'call') {
      const t = record.payload?.transcript;
      return Boolean(t && t.trim().length > 0);
    } else if (record.source_type === 'meeting') {
      const turns = record.transcript_payload?.turns;
      return Boolean(turns && Array.isArray(turns) && turns.some(turn => turn.text && turn.text.trim().length > 0));
    }
    return false;
  }

  // Get effective route for a record
  getEffectiveRoute(record) {
    const key = this.getRecordKey(record.source_type, record.source_id);
    const override = this.manualOverrides.get(key);
    if (override && override.route) {
      return {
        route: override.route,
        secondaryRoute: override.secondaryRoute || null,
        isOverride: true,
        updatedAt: override.updatedAt,
        notes: override.notes || ''
      };
    }

    const ref = record.record_ref;
    const analysis = this.analyses[ref];
    if (analysis) {
      return {
        route: analysis.primaryRoute,
        secondaryRoute: analysis.secondaryRoute || null,
        isOverride: false,
        updatedAt: null,
        notes: analysis.routeRationale || ''
      };
    }

    return {
      route: 'metadata-only',
      secondaryRoute: null,
      isOverride: false,
      updatedAt: null,
      notes: 'Default metadata route'
    };
  }

  // Get analysis object for record
  getAnalysis(record) {
    const ref = record.record_ref;
    const base = this.analyses[ref] || {
      primaryRoute: 'metadata-only',
      secondaryRoute: null,
      reviewState: 'Intake Verified',
      owner: 'Unassigned',
      whatHappened: 'Metadata record ingested.',
      whyItMatters: 'Preserved as intake evidence.',
      sourcePassage: 'No transcript text supplied.',
      limitations: 'No transcript supplied in this extract.',
      nextStep: 'Retain for intake reconciliation.',
      routeRationale: 'Default route.'
    };

    const effective = this.getEffectiveRoute(record);
    const freshness = record.applied_revision === 2 ? 'Current (Rev 2 Updated)' : 'Current (Rev 1 Baseline)';

    return {
      ...base,
      effectiveRoute: effective.route,
      effectiveSecondaryRoute: effective.secondaryRoute,
      isManualOverride: effective.isOverride,
      overrideDetails: effective.isOverride ? effective : null,
      freshness
    };
  }

  // Import batch following DATA_CONTRACT.md
  importBatch(batchData, batchLabel = null) {
    if (!batchData || !Array.isArray(batchData.records)) {
      throw new Error('Invalid batch envelope: missing records array');
    }

    const batchId = batchData.batch_id || 'unknown-batch';
    const batchRevision = typeof batchData.revision === 'number' ? batchData.revision : 1;
    const exportedAt = batchData.exported_at || new Date().toISOString();

    let insertedCount = 0;
    let updatedCount = 0;
    let ignoredCount = 0;

    batchData.records.forEach(newRec => {
      if (!newRec.source_type || !newRec.source_id) {
        console.warn('Skipping record without source_type or source_id', newRec);
        return;
      }

      const key = this.getRecordKey(newRec.source_type, newRec.source_id);
      const existing = this.records.get(key);

      if (!existing) {
        // New record insertion
        const storedRec = {
          record_ref: newRec.record_ref || 'UNKNOWN',
          source_type: newRec.source_type,
          source_id: newRec.source_id,
          payload: JSON.parse(JSON.stringify(newRec.payload || {})),
          transcript_payload: newRec.transcript_payload ? JSON.parse(JSON.stringify(newRec.transcript_payload)) : null,
          applied_revision: batchRevision,
          applied_batch_id: batchId,
          last_updated_at: new Date().toISOString()
        };
        this.records.set(key, storedRec);
        insertedCount++;
      } else {
        // Existing record: check revision
        if (batchRevision > existing.applied_revision) {
          // Replace entire payload and transcript_payload
          existing.payload = JSON.parse(JSON.stringify(newRec.payload || {}));
          existing.transcript_payload = newRec.transcript_payload ? JSON.parse(JSON.stringify(newRec.transcript_payload)) : null;
          existing.applied_revision = batchRevision;
          existing.applied_batch_id = batchId;
          existing.last_updated_at = new Date().toISOString();
          if (newRec.record_ref) existing.record_ref = newRec.record_ref;
          updatedCount++;
        } else {
          // Same or older revision ignored
          ignoredCount++;
        }
      }
    });

    this.currentBatchId = batchId;
    if (batchRevision > this.currentRevision) {
      this.currentRevision = batchRevision;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      label: batchLabel || batchId,
      batch_id: batchId,
      revision: batchRevision,
      received_records: batchData.records.length,
      inserted_count: insertedCount,
      updated_count: updatedCount,
      ignored_count: ignoredCount,
      total_logical_count: this.records.size
    };

    this.importHistory.push(logEntry);
    this.saveToStorage();
    this.notify();
    return logEntry;
  }

  // Set manual route override
  setManualOverride(sourceType, sourceId, route, secondaryRoute = null, notes = '') {
    const key = this.getRecordKey(sourceType, sourceId);
    if (!this.records.has(key)) {
      throw new Error(`Record ${key} does not exist in store`);
    }

    this.manualOverrides.set(key, {
      route,
      secondaryRoute,
      notes,
      updatedAt: new Date().toISOString()
    });

    this.saveToStorage();
    this.notify();
  }

  // Reset manual route override
  clearManualOverride(sourceType, sourceId) {
    const key = this.getRecordKey(sourceType, sourceId);
    if (this.manualOverrides.has(key)) {
      this.manualOverrides.delete(key);
      this.saveToStorage();
      this.notify();
    }
  }

  // Reset store to clean empty state
  resetClean() {
    this.records.clear();
    this.manualOverrides.clear();
    this.importHistory = [];
    this.currentBatchId = null;
    this.currentRevision = 1;
    this.saveToStorage();
    this.notify();
  }

  // Save current state to browser localStorage
  saveToStorage() {
    try {
      const recordsArray = Array.from(this.records.values());
      const overridesObject = Object.fromEntries(this.manualOverrides);
      const state = {
        records: recordsArray,
        manualOverrides: overridesObject,
        importHistory: this.importHistory,
        currentBatchId: this.currentBatchId,
        currentRevision: this.currentRevision
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Unable to persist to localStorage:', e);
    }
  }

  // Load state from browser localStorage
  loadFromStorage() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return false;
      const state = JSON.parse(raw);
      this.records.clear();
      (state.records || []).forEach(r => {
        const key = this.getRecordKey(r.source_type, r.source_id);
        this.records.set(key, r);
      });
      this.manualOverrides = new Map(Object.entries(state.manualOverrides || {}));
      this.importHistory = state.importHistory || [];
      this.currentBatchId = state.currentBatchId || null;
      this.currentRevision = state.currentRevision || 1;
      this.notify();
      return true;
    } catch (e) {
      console.warn('Failed to parse state from localStorage:', e);
      return false;
    }
  }

  // Load both initial and update batches into default initial/post-update state
  loadFinalState() {
    this.resetClean();
    if (window.SIGNAL_DESK_INITIAL_DATA) {
      this.importBatch(window.SIGNAL_DESK_INITIAL_DATA, 'Initial Batch (01_initial.json)');
    }
    if (window.SIGNAL_DESK_UPDATE_DATA) {
      this.importBatch(window.SIGNAL_DESK_UPDATE_DATA, 'Update Batch (02_update.json)');
    }
  }

  // Load only initial batch
  loadInitialState() {
    this.resetClean();
    if (window.SIGNAL_DESK_INITIAL_DATA) {
      this.importBatch(window.SIGNAL_DESK_INITIAL_DATA, 'Initial Batch (01_initial.json)');
    }
  }

  // Compute Dashboard Metrics dynamically from loaded records
  getMetrics(filterPredicate = null) {
    let list = Array.from(this.records.values());
    if (typeof filterPredicate === 'function') {
      list = list.filter(filterPredicate);
    }

    const totalRecords = list.length;
    let callsCount = 0;
    let meetingsCount = 0;
    let usableTranscriptsCount = 0;
    let missingTranscriptsCount = 0;
    let manualOverridesCount = 0;

    const repCounts = {};
    const orgCounts = {};
    const routeCounts = {
      'sales-coaching': 0,
      'deal-next-steps': 0,
      'customer-follow-up': 0,
      'product-support': 0,
      'internal-operations': 0,
      'partner-vendor': 0,
      'human-review': 0,
      'metadata-only': 0
    };
    const reviewStateCounts = {
      'Action Required': 0,
      'Intake Verified': 0,
      'Review Pending': 0
    };

    list.forEach(rec => {
      const isCall = rec.source_type === 'call';
      const hasText = this.hasUsableTranscript(rec);
      const effective = this.getEffectiveRoute(rec);
      const analysis = this.getAnalysis(rec);

      if (isCall) {
        callsCount++;
        const rep = rec.payload?.rep_name || 'Unknown Rep';
        repCounts[rep] = (repCounts[rep] || 0) + 1;
      } else {
        meetingsCount++;
        const org = rec.payload?.organizer_email || 'Unknown Organizer';
        orgCounts[org] = (orgCounts[org] || 0) + 1;
      }

      if (hasText) {
        usableTranscriptsCount++;
      } else {
        missingTranscriptsCount++;
      }

      if (effective.isOverride) {
        manualOverridesCount++;
      }

      if (routeCounts[effective.route] !== undefined) {
        routeCounts[effective.route]++;
      } else {
        routeCounts[effective.route] = 1;
      }

      const st = analysis.reviewState || 'Intake Verified';
      if (reviewStateCounts[st] !== undefined) {
        reviewStateCounts[st]++;
      } else {
        reviewStateCounts[st] = 1;
      }
    });

    const transcriptCoveragePct = totalRecords > 0 
      ? ((usableTranscriptsCount / totalRecords) * 100).toFixed(1) 
      : '0.0';

    return {
      totalRecords,
      callsCount,
      meetingsCount,
      usableTranscriptsCount,
      missingTranscriptsCount,
      transcriptCoveragePct,
      manualOverridesCount,
      routeCounts,
      reviewStateCounts,
      repCounts,
      orgCounts,
      currentBatchId: this.currentBatchId,
      currentRevision: this.currentRevision
    };
  }
}

window.SignalDeskStore = SignalDeskStore;
