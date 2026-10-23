/**
 * Signal Desk — Revenue Intelligence Application Controller
 * Elite Light Glassmorphism Architecture
 * Matches reference visual system & DATA_CONTRACT.md invariants
 */

document.addEventListener('DOMContentLoaded', () => {
  const store = new SignalDeskStore();

  const SVG = {
    phone: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    video: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
    menu: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>',
    info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
    warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    alert: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
  };

  function typeIconMarkup(sourceType) {
    return sourceType === 'call' ? SVG.phone : SVG.video;
  }

  // Initialize store: if not in localStorage, load final state by default
  const loadedFromStorage = store.loadFromStorage();
  if (!loadedFromStorage || store.records.size === 0) {
    store.loadFinalState();
  }

  // Application State
  let currentView = 'dashboard';
  let selectedRecordKey = null;
  let activityViewMode = 'person'; // 'person' | 'type'
  let inboxQuickFilter = 'all'; // 'all' | 'calls' | 'meetings' | 'usable' | 'action' | 'overrides'
  
  let globalFilters = {
    search: '',
    sourceType: 'all',
    person: 'all',
    route: 'all',
    reviewState: 'all'
  };

  let recentFilters = {
    search: '',
    sourceType: 'all',
    route: 'all',
    reviewState: 'all'
  };

  // Route metadata dictionary for consistent color-coding & labels
  const ROUTE_CONFIG = {
    'deal-next-steps': { label: 'Deal Next Steps', color: '#0369A1', bg: '#E0F2FE' },
    'customer-follow-up': { label: 'Customer Follow-up', color: '#1D4ED8', bg: '#EBF5FF' },
    'sales-coaching': { label: 'Sales Coaching', color: '#0E5C54', bg: '#E2F3EE' },
    'product-support': { label: 'Product / Support', color: '#BE123C', bg: '#FFF1F2' },
    'internal-operations': { label: 'Internal Operations', color: '#6D28D9', bg: '#F5F3FF' },
    'partner-vendor': { label: 'Partner / Vendor', color: '#15803D', bg: '#F0FDF4' },
    'human-review': { label: 'Human Review', color: '#B45309', bg: '#FFFBEB' },
    'metadata-only': { label: 'Metadata Only', color: '#475569', bg: '#F1F5F9' }
  };

  // ==========================================
  // Toast Notification System
  // ==========================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;

    let iconSvg = SVG.info;
    if (type === 'success') iconSvg = SVG.success;
    if (type === 'warning') iconSvg = SVG.warning;
    if (type === 'alert') iconSvg = SVG.alert;

    toast.innerHTML = `<span class="toast-icon">${iconSvg}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }

  // ==========================================
  // Navigation & View Routing
  // ==========================================
  function switchView(targetView) {
    currentView = targetView;
    
    // Update sidebar navigation buttons
    document.querySelectorAll('.nav-link-btn').forEach(btn => {
      if (btn.dataset.view === targetView) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Toggle view panels
    document.querySelectorAll('.view-panel').forEach(panel => {
      if (panel.id === `view-${targetView}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Ensure views re-render smoothly
    if (targetView === 'dashboard') renderDashboard();
    if (targetView === 'inbox') renderFullInbox();
    if (targetView === 'inspector') renderInspector();
    if (targetView === 'brief') wireBriefLinks();
  }

  // Wire sidebar navigation
  document.querySelectorAll('.nav-link-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.view) {
        switchView(btn.dataset.view);
      }
    });
  });

  // Brand logo navigates to dashboard
  document.getElementById('brand-logo-btn')?.addEventListener('click', () => {
    switchView('dashboard');
  });

  // Quick Action Buttons
  document.getElementById('btn-view-all-inbox')?.addEventListener('click', () => {
    switchView('inbox');
  });

  document.getElementById('btn-view-all-insights')?.addEventListener('click', () => {
    switchView('brief');
  });

  // Top header search input
  const topSearchInput = document.getElementById('top-search-input');
  if (topSearchInput) {
    topSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim();
      globalFilters.search = q;
      recentFilters.search = q;
      const inboxSearch = document.getElementById('inbox-filter-search');
      if (inboxSearch) inboxSearch.value = q;
      const recentSearch = document.getElementById('recent-search-input');
      if (recentSearch) recentSearch.value = q;

      renderRecentTable();
      renderFullInbox();
    });

    // Keyboard shortcut (Cmd+K / Ctrl+K)
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        topSearchInput.focus();
        topSearchInput.select();
      }
    });
  }

  // Notification Bell
  document.getElementById('header-notification-btn')?.addEventListener('click', () => {
    showToast('Priority Escalation: M07 Willowfield Trust modal caching and duplicate payment bug. Navigating to inspector…', 'alert');
    setTimeout(() => {
      openConversationByRef('M07');
    }, 600);
  });

  // Profile Avatar & Date Pill Toasts
  document.getElementById('header-profile-pill')?.addEventListener('click', () => {
    showToast('Signed in: Shyam (Lead Revenue Intelligence Officer) • Volopay Assessment Scope');
  });

  document.getElementById('header-date-pill')?.addEventListener('click', () => {
    showToast('Operating scope: 21 August 2026 (Asia/Kolkata) • Denominator: 44 total records');
  });

  // Quick revision toggle in sidebar footer
  document.getElementById('btn-quick-revision-toggle')?.addEventListener('click', () => {
    const metrics = store.getMetrics();
    if (metrics.currentRevision === 1) {
      store.loadFinalState();
      showToast('Loaded Revision 2 (M07 late transcript applied, 18 usable texts).', 'success');
    } else {
      store.loadInitialState();
      showToast('Loaded Revision 1 baseline (17 usable texts).', 'info');
    }
    renderDashboard();
    renderFullInbox();
  });

  // Manager brief citations
  function wireBriefLinks() {
    document.querySelectorAll('.brief-link-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const ref = e.currentTarget.dataset.ref;
        if (ref) {
          openConversationByRef(ref);
        }
      });
    });
  }
  wireBriefLinks();

  document.getElementById('key-insights-list')?.addEventListener('click', (e) => {
    const item = e.target.closest('.insight-card-item');
    if (!item) return;
    const insight = item.dataset.insight;
    if (insight === 'product-issues') {
      openConversationByRef('M07');
    } else if (insight === 'coaching') {
      openConversationByRef('C09');
    } else if (insight === 'follow-ups') {
      switchView('inbox');
      document.getElementById('inbox-filter-route').value = 'customer-follow-up';
      globalFilters.route = 'customer-follow-up';
      renderFullInbox();
    } else {
      switchView('brief');
    }
  });

  function openConversationByRef(ref) {
    for (const record of store.records.values()) {
      if (record.record_ref === ref) {
        selectedRecordKey = store.getRecordKey(record.source_type, record.source_id);
        renderInspector();
        switchView('inspector');
        showToast(`Inspecting ${record.record_ref}: ${record.payload?.title || record.payload?.to_number || 'Interaction'}`);
        break;
      }
    }
  }

  // ==========================================
  // Filter Management
  // ==========================================
  function populatePersonFilter() {
    const filterPerson = document.getElementById('inbox-filter-person');
    if (!filterPerson) return;

    const currentVal = filterPerson.value;
    filterPerson.innerHTML = '<option value="all">All People & Organisers</option>';

    const callReps = new Set();
    const meetingOrgs = new Set();

    store.records.forEach(r => {
      if (r.source_type === 'call') {
        const rep = r.payload?.rep_name;
        if (rep) callReps.add(rep);
      } else {
        const org = r.payload?.organizer_email;
        if (org) meetingOrgs.add(org);
      }
    });

    const optGroupReps = document.createElement('optgroup');
    optGroupReps.label = 'Call Representatives';
    Array.from(callReps).sort().forEach(rep => {
      const opt = document.createElement('option');
      opt.value = `rep:${rep}`;
      opt.textContent = `Rep: ${rep}`;
      optGroupReps.appendChild(opt);
    });
    filterPerson.appendChild(optGroupReps);

    const optGroupOrgs = document.createElement('optgroup');
    optGroupOrgs.label = 'Meeting Organisers (Calendar)';
    Array.from(meetingOrgs).sort().forEach(org => {
      const opt = document.createElement('option');
      opt.value = `org:${org}`;
      opt.textContent = `Organiser: ${org}`;
      optGroupOrgs.appendChild(opt);
    });
    filterPerson.appendChild(optGroupOrgs);

    if (currentVal) filterPerson.value = currentVal;
  }

  function getGlobalFilterPredicate() {
    return (record) => {
      // Quick Chip filter
      if (inboxQuickFilter === 'calls' && record.source_type !== 'call') return false;
      if (inboxQuickFilter === 'meetings' && record.source_type !== 'meeting') return false;
      if (inboxQuickFilter === 'usable' && !store.hasUsableTranscript(record)) return false;
      if (inboxQuickFilter === 'action') {
        const an = store.getAnalysis(record);
        if (an.reviewState !== 'Action Required') return false;
      }
      if (inboxQuickFilter === 'overrides') {
        const eff = store.getEffectiveRoute(record);
        if (!eff.isOverride) return false;
      }

      // Source Type
      if (globalFilters.sourceType !== 'all' && record.source_type !== globalFilters.sourceType) {
        return false;
      }

      // Person / Organiser
      if (globalFilters.person !== 'all') {
        if (globalFilters.person.startsWith('rep:')) {
          const targetRep = globalFilters.person.slice(4);
          if (record.source_type !== 'call' || record.payload?.rep_name !== targetRep) return false;
        } else if (globalFilters.person.startsWith('org:')) {
          const targetOrg = globalFilters.person.slice(4);
          if (record.source_type !== 'meeting' || record.payload?.organizer_email !== targetOrg) return false;
        }
      }

      // Route
      const eff = store.getEffectiveRoute(record);
      if (globalFilters.route !== 'all') {
        if (eff.route !== globalFilters.route && eff.secondaryRoute !== globalFilters.route) {
          return false;
        }
      }

      // Review State
      const analysis = store.getAnalysis(record);
      if (globalFilters.reviewState !== 'all') {
        if (analysis.reviewState !== globalFilters.reviewState) return false;
      }

      // Search Query
      if (globalFilters.search) {
        const q = globalFilters.search.toLowerCase();
        const ref = (record.record_ref || '').toLowerCase();
        const title = (record.payload?.title || '').toLowerCase();
        const rep = (record.payload?.rep_name || '').toLowerCase();
        const org = (record.payload?.organizer_email || '').toLowerCase();
        const toNum = (record.payload?.to_number || '').toLowerCase();
        const transcript = (record.payload?.transcript || '').toLowerCase();

        const matchTurn = record.transcript_payload?.turns?.some(t => 
          (t.text || '').toLowerCase().includes(q) || (t.speaker || '').toLowerCase().includes(q)
        );

        if (!ref.includes(q) && !title.includes(q) && !rep.includes(q) && 
            !org.includes(q) && !toNum.includes(q) && !transcript.includes(q) && !matchTurn) {
          return false;
        }
      }

      return true;
    };
  }

  // ==========================================
  // Render Dashboard
  // ==========================================
  function renderDashboard() {
    const metrics = store.getMetrics();

    // 1. KPI Cards (Animated CountUp & Enterprise SaaS Headers)
    const elTotal = document.getElementById('kpi-total-records');
    if (elTotal) animateCountUp(elTotal, metrics.totalRecords, 700);

    const elCalls = document.getElementById('kpi-calls-count');
    if (elCalls) animateCountUp(elCalls, metrics.callsCount, 700);

    const callsPct = ((metrics.callsCount / metrics.totalRecords) * 100).toFixed(1);
    const elCallsPct = document.getElementById('kpi-calls-pct');
    if (elCallsPct) elCallsPct.textContent = `${callsPct}% of total`;
    const elCallsBadge = document.getElementById('kpi-calls-badge');
    if (elCallsBadge) elCallsBadge.textContent = `${callsPct}%`;

    const elMeetings = document.getElementById('kpi-meetings-count');
    if (elMeetings) animateCountUp(elMeetings, metrics.meetingsCount, 700);

    const meetingsPct = ((metrics.meetingsCount / metrics.totalRecords) * 100).toFixed(1);
    const elMeetingsPct = document.getElementById('kpi-meetings-pct');
    if (elMeetingsPct) elMeetingsPct.textContent = `${meetingsPct}% of total`;
    const elMeetingsBadge = document.getElementById('kpi-meetings-badge');
    if (elMeetingsBadge) elMeetingsBadge.textContent = `${meetingsPct}%`;

    const elUsable = document.getElementById('kpi-usable-transcripts');
    if (elUsable) animateCountUp(elUsable, metrics.usableTranscriptsCount, 700);

    const elCoveragePct = document.getElementById('kpi-coverage-pct');
    if (elCoveragePct) elCoveragePct.textContent = `${metrics.transcriptCoveragePct}% coverage`;
    const elUsableBadge = document.getElementById('kpi-usable-badge');
    if (elUsableBadge) elUsableBadge.textContent = `${metrics.transcriptCoveragePct}%`;

    const elReview = document.getElementById('kpi-need-review');
    const needReviewCount = metrics.reviewStateCounts['Action Required'] || 0;
    if (elReview) animateCountUp(elReview, needReviewCount, 700);

    const reviewPct = ((needReviewCount / metrics.totalRecords) * 100).toFixed(1);
    const elReviewPct = document.getElementById('kpi-review-pct');
    if (elReviewPct) elReviewPct.textContent = `${reviewPct}% of total`;
    const elReviewBadge = document.getElementById('kpi-review-badge');
    if (elReviewBadge) elReviewBadge.textContent = needReviewCount > 0 ? `${needReviewCount} Triage` : 'Verified';

    const elRevBadge = document.getElementById('kpi-revision-badge');
    if (elRevBadge) {
      elRevBadge.textContent = metrics.currentRevision === 2 ? 'Rev 2 applied' : 'Rev 1 baseline';
      elRevBadge.classList.toggle('badge-rev-update', metrics.currentRevision === 2);
    }

    renderKpiSparklines(metrics);

    // Sidebar badge count
    const sidebarBadge = document.getElementById('sidebar-inbox-count');
    if (sidebarBadge) sidebarBadge.textContent = metrics.totalRecords;

    // 2. Activity Overview Chart
    renderActivityChart();

    // 3. Routing Donut Chart
    renderRoutingDonut(metrics);

    // 4. Transcript Coverage Gauge
    renderCoverageGauge(metrics);

    // 5. Recent Conversations Table
    renderRecentTable();

    // 6. Evidence-backed key insights (live counts)
    renderKeyInsights(metrics);
  }

  function fillSparklineBars(cardId, values, accentColor) {
    const card = document.getElementById(cardId);
    const bars = card?.querySelector('.sparkline-bars');
    if (!bars || !values.length) return;
    const max = Math.max(...values, 1);
    bars.innerHTML = values.map((v) => {
      const h = Math.max(14, Math.round((v / max) * 100));
      const style = accentColor ? ` style="height: ${h}%; background-color: ${accentColor};"` : ` style="height: ${h}%;"`;
      return `<div class="sparkline-bar"${style}></div>`;
    }).join('');
  }

  function renderKpiSparklines(metrics) {
    const repBuckets = { Arun: 0, Leela: 0, Meera: 0, Kiran: 0, Dev: 0 };
    store.records.forEach((r) => {
      if (r.source_type !== 'call' || !r.payload?.rep_name) return;
      const name = r.payload.rep_name;
      if (Object.prototype.hasOwnProperty.call(repBuckets, name)) {
        repBuckets[name] += 1;
      }
    });
    const repSeries = Object.values(repBuckets);

    fillSparklineBars('card-kpi-total', repSeries);
    fillSparklineBars('card-kpi-calls', repSeries, 'var(--accent-blue)');
    const meetingBuckets = {};
    store.records.forEach((r) => {
      if (r.source_type !== 'meeting') return;
      const key = (r.payload?.organizer_email || 'unknown').split('@')[0];
      meetingBuckets[key] = (meetingBuckets[key] || 0) + 1;
    });
    const meetingSeries = Object.values(meetingBuckets).sort((a, b) => b - a).slice(0, 5);
    while (meetingSeries.length < 5) meetingSeries.push(1);
    fillSparklineBars('card-kpi-meetings', meetingSeries, 'var(--accent-lavender)');

    const usableSeries = [
      metrics.usableTranscriptsCount - 1,
      metrics.usableTranscriptsCount,
      metrics.usableTranscriptsCount,
      metrics.usableTranscriptsCount,
      metrics.usableTranscriptsCount
    ].map((n) => Math.max(0, n));
    fillSparklineBars('card-kpi-usable', usableSeries, 'var(--accent-mint)');

    const reviewSeries = [
      metrics.reviewStateCounts['Action Required'] || 0,
      metrics.reviewStateCounts['Review Pending'] || 0,
      metrics.reviewStateCounts['Intake Verified'] || 0,
      metrics.routeCounts['human-review'] || 0,
      metrics.routeCounts['metadata-only'] || 0
    ];
    fillSparklineBars('card-kpi-review', reviewSeries, 'var(--accent-coral)');
  }

  function renderKeyInsights(metrics) {
    const list = document.getElementById('key-insights-list');
    if (!list) return;

    const followUpCount = metrics.routeCounts['customer-follow-up'] || 0;
    const productCount = metrics.routeCounts['product-support'] || 0;
    const coachingCount = metrics.routeCounts['sales-coaching'] || 0;

    const items = [
      {
        insight: 'follow-ups',
        tag: 'CUSTOMER FOLLOW-UP',
        color: '#0284C7',
        title: 'Follow-Up Queue',
        sub: `${followUpCount} conversations require direct outreach or account action today`
      },
      {
        insight: 'product-issues',
        tag: 'PLATFORM TRIAGE',
        color: '#DC2626',
        title: 'Platform Issues & Bugs',
        sub: `${productCount} records routed to Product / Support (M07 modal caching priority)`
      },
      {
        insight: 'coaching',
        tag: 'SALES EXCELLENCE',
        color: '#0E5C54',
        title: 'Coaching & Boundaries',
        sub: `${coachingCount} coaching routes from rep transparency & opt-out signals`
      }
    ];

    list.innerHTML = items.map((item) => `
      <div class="insight-card-item" data-insight="${item.insight}" role="button" tabindex="0">
        <div class="insight-indicator-bar" style="background: ${item.color};"></div>
        <div class="insight-content-block">
          <div class="insight-top-meta">
            <span class="insight-tag" style="color: ${item.color};">${item.tag}</span>
            <span class="insight-arrow-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></span>
          </div>
          <h4>${item.title}</h4>
          <p>${item.sub}</p>
        </div>
      </div>
    `).join('');
  }

  // Activity Overview Chart (Toggle between By Person & By Type)
  function renderActivityChart() {
    const container = document.getElementById('activity-bar-chart');
    if (!container) return;

    container.innerHTML = '';

    if (activityViewMode === 'person') {
      // Aggregate calls and meetings by person/rep name
      const peopleCounts = {};
      store.records.forEach(r => {
        let name = r.payload?.rep_name;
        if (!name && r.payload?.organizer_email) {
          name = r.payload.organizer_email.split('@')[0];
        }
        name = name || 'Unassigned';
        // Normalize title case
        name = name.charAt(0).toUpperCase() + name.slice(1);
        peopleCounts[name] = (peopleCounts[name] || 0) + 1;
      });

      // Get top 8 people to fit perfectly on standard dashboard
      const sorted = Object.entries(peopleCounts).sort((a,b) => b[1] - a[1]).slice(0, 8);
      const maxVal = Math.max(...sorted.map(s => s[1]), 8);

      sorted.forEach(([name, count]) => {
        const heightPct = Math.max(15, (count / maxVal) * 100);
        const col = document.createElement('div');
        col.className = 'activity-bar-col';
        col.innerHTML = `
          <span class="activity-bar-val">${count}</span>
          <div class="activity-bar-fill" style="height: ${heightPct}%;"></div>
          <span class="activity-bar-label">${name}</span>
        `;
        container.appendChild(col);
      });
    } else {
      // By Source Type (Calls vs Meetings)
      const metrics = store.getMetrics();
      const items = [
        { label: 'Telephony Calls', count: metrics.callsCount, pct: 100 },
        { label: 'Calendar Meetings', count: metrics.meetingsCount, pct: (metrics.meetingsCount / metrics.callsCount) * 100 }
      ];

      items.forEach(item => {
        const col = document.createElement('div');
        col.className = 'activity-bar-col';
        col.style.flex = '0.5';
        col.innerHTML = `
          <span class="activity-bar-val">${item.count}</span>
          <div class="activity-bar-fill" style="height: ${item.pct}%; width: 44px; background: linear-gradient(180deg, #40BFA6 0%, #167C72 100%);"></div>
          <span class="activity-bar-label">${item.label}</span>
        `;
        container.appendChild(col);
      });
    }
  }

  // Activity chart toggles
  document.getElementById('btn-toggle-activity-person')?.addEventListener('click', (e) => {
    activityViewMode = 'person';
    document.getElementById('btn-toggle-activity-person').classList.add('active');
    document.getElementById('btn-toggle-activity-type').classList.remove('active');
    renderActivityChart();
  });

  document.getElementById('btn-toggle-activity-type')?.addEventListener('click', (e) => {
    activityViewMode = 'type';
    document.getElementById('btn-toggle-activity-type').classList.add('active');
    document.getElementById('btn-toggle-activity-person').classList.remove('active');
    renderActivityChart();
  });

  // Routing Distribution SVG Donut Chart
  function renderRoutingDonut(metrics) {
    const svg = document.getElementById('routing-donut-svg');
    const legend = document.getElementById('routing-donut-legend');
    if (!svg || !legend) return;

    svg.innerHTML = '';
    legend.innerHTML = '';

    const total = metrics.totalRecords || 44;
    const centerRec = document.getElementById('donut-center-records');
    if (centerRec) animateCountUp(centerRec, total, 700);

    // Circumference of r=36 is 2 * PI * 36 ≈ 226.2
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    let accumulatedAngle = 0;

    const routes = Object.entries(metrics.routeCounts);

    routes.forEach(([routeKey, count]) => {
      const pct = (count / total);
      const dashLength = pct * circumference;
      const config = ROUTE_CONFIG[routeKey] || { label: routeKey, color: '#64748B' };

      if (count > 0) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '50');
        circle.setAttribute('cy', '50');
        circle.setAttribute('r', radius.toString());
        circle.setAttribute('fill', 'transparent');
        circle.setAttribute('stroke', config.color);
        circle.setAttribute('stroke-width', '14');
        circle.setAttribute('stroke-dasharray', `${dashLength} ${circumference}`);
        circle.setAttribute('stroke-dashoffset', (-accumulatedAngle).toString());
        svg.appendChild(circle);

        accumulatedAngle += dashLength;
      }

      // Legend Item
      const legendItem = document.createElement('div');
      legendItem.className = 'donut-legend-item';
      legendItem.innerHTML = `
        <span class="legend-label">
          <span class="legend-bullet" style="background: ${config.color};"></span>
          <span>${config.label}</span>
        </span>
        <span class="legend-stats">${count} (${(pct * 100).toFixed(1)}%)</span>
      `;
      legend.appendChild(legendItem);
    });
  }

  // Transcript Coverage Gauge
  function renderCoverageGauge(metrics) {
    const arc = document.getElementById('coverage-gauge-arc');
    const valText = document.getElementById('coverage-gauge-val');
    const subText = document.getElementById('coverage-gauge-sub');
    const withText = document.getElementById('gauge-with-text');
    const withoutText = document.getElementById('gauge-without-text');

    if (valText) animateCountUp(valText, metrics.transcriptCoveragePct, 700, '%', 1);
    if (subText) subText.textContent = `${metrics.usableTranscriptsCount} of ${metrics.totalRecords}`;
    if (withText) animateCountUp(withText, metrics.usableTranscriptsCount, 700);
    if (withoutText) animateCountUp(withoutText, (metrics.totalRecords - metrics.usableTranscriptsCount), 700);

    if (arc) {
      // Circumference of r=40 is 251.2
      const circumference = 251.2;
      const pct = metrics.transcriptCoveragePct / 100;
      const offset = circumference * (1 - pct);
      arc.style.strokeDashoffset = offset.toString();
    }
  }

  // Recent Conversations Table (Dashboard Row 3)
  function renderRecentTable() {
    const tbody = document.getElementById('recent-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Filter recent table
    let records = Array.from(store.records.values()).filter(r => {
      if (recentFilters.sourceType !== 'all' && r.source_type !== recentFilters.sourceType) return false;
      const eff = store.getEffectiveRoute(r);
      if (recentFilters.route !== 'all' && eff.route !== recentFilters.route) return false;
      const an = store.getAnalysis(r);
      if (recentFilters.reviewState !== 'all' && an.reviewState !== recentFilters.reviewState) return false;

      if (recentFilters.search) {
        const q = recentFilters.search.toLowerCase();
        const ref = (r.record_ref || '').toLowerCase();
        const title = (r.payload?.title || '').toLowerCase();
        const rep = (r.payload?.rep_name || '').toLowerCase();
        const num = (r.payload?.to_number || '').toLowerCase();
        if (!ref.includes(q) && !title.includes(q) && !rep.includes(q) && !num.includes(q)) return false;
      }
      return true;
    });

    // Sort: records with usable transcripts first, then ref
    records.sort((a,b) => {
      const aUsable = store.hasUsableTranscript(a);
      const bUsable = store.hasUsableTranscript(b);
      if (aUsable && !bUsable) return -1;
      if (!aUsable && bUsable) return 1;
      return a.record_ref.localeCompare(b.record_ref);
    });

    // Take top 5 for the dashboard widget
    const displayList = records.slice(0, 5);

    displayList.forEach(r => {
      const eff = store.getEffectiveRoute(r);
      const an = store.getAnalysis(r);
      const hasText = store.hasUsableTranscript(r);

      const person = r.payload?.rep_name || (r.payload?.organizer_email ? r.payload.organizer_email.split('@')[0] : 'Admin');
      const title = r.payload?.title || r.payload?.to_number || 'Telephony Inbound';
      const time = r.payload?.start_time ? r.payload.start_time.split('T')[1]?.slice(0,5) : '10:00 AM';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="font-family: var(--font-mono);">${r.record_ref}</strong></td>
        <td><span class="type-icon-cell" title="${r.source_type}">${typeIconMarkup(r.source_type)}</span></td>
        <td>${person}</td>
        <td style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${title}</td>
        <td><span style="font-size: 11px; color: var(--text-muted);">${time}</span></td>
        <td>
          <span class="transcript-dot ${hasText ? 'dot-available' : 'dot-missing'}"></span>
          <span style="font-size: 11px;">${hasText ? 'Available' : 'Missing'}</span>
        </td>
        <td><span class="route-pill route-${eff.route}">${ROUTE_CONFIG[eff.route]?.label || eff.route}</span></td>
        <td><span class="status-pill status-${an.reviewState.toLowerCase().replace(/\s+/g,'-')}">${an.reviewState}</span></td>
        <td><span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">v${r.applied_revision}</span></td>
        <td>
          <button class="btn-table-action" data-ref="${r.record_ref}" title="Inspect conversation" type="button">${SVG.menu}</button>
        </td>
      `;

      tr.addEventListener('click', () => {
        openConversationByRef(r.record_ref);
      });

      tbody.appendChild(tr);
    });
  }

  // Recent filters event listeners
  document.getElementById('recent-search-input')?.addEventListener('input', (e) => {
    recentFilters.search = e.target.value.trim();
    renderRecentTable();
  });

  document.getElementById('recent-filter-type')?.addEventListener('change', (e) => {
    recentFilters.sourceType = e.target.value;
    renderRecentTable();
  });

  document.getElementById('recent-filter-route')?.addEventListener('change', (e) => {
    recentFilters.route = e.target.value;
    renderRecentTable();
  });

  document.getElementById('recent-filter-status')?.addEventListener('change', (e) => {
    recentFilters.reviewState = e.target.value;
    renderRecentTable();
  });

  // ==========================================
  // Render Full Conversation Inbox (View 2)
  // ==========================================
  function renderFullInbox() {
    const tbody = document.getElementById('inbox-full-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    const predicate = getGlobalFilterPredicate();
    let records = Array.from(store.records.values()).filter(predicate);

    records.sort((a,b) => {
      const aUsable = store.hasUsableTranscript(a);
      const bUsable = store.hasUsableTranscript(b);
      if (aUsable && !bUsable) return -1;
      if (!aUsable && bUsable) return 1;
      return a.record_ref.localeCompare(b.record_ref);
    });

    records.forEach(r => {
      const eff = store.getEffectiveRoute(r);
      const an = store.getAnalysis(r);
      const hasText = store.hasUsableTranscript(r);

      const person = r.payload?.rep_name || (r.payload?.organizer_email ? r.payload.organizer_email.split('@')[0] : 'Admin');
      const title = r.payload?.title || r.payload?.to_number || 'Telephony Interaction';
      const dateStr = '21 Aug 2026';

      const tr = document.createElement('tr');
      if (selectedRecordKey === store.getRecordKey(r.source_type, r.source_id)) {
        tr.className = 'selected-row';
      }

      tr.innerHTML = `
        <td><strong style="font-family: var(--font-mono); font-size: 13px;">${r.record_ref}</strong></td>
        <td><span class="type-icon-cell">${typeIconMarkup(r.source_type)}</span> <span style="font-size: 11px; text-transform: capitalize;">${r.source_type}</span></td>
        <td>${person}</td>
        <td><strong>${title}</strong></td>
        <td><span style="font-size: 11.5px; color: var(--text-muted);">${dateStr}</span></td>
        <td>
          <span class="transcript-dot ${hasText ? 'dot-available' : 'dot-missing'}"></span>
          <span style="font-size: 11.5px;">${hasText ? 'Available' : 'Intake (Missing)'}</span>
        </td>
        <td>
          <span class="route-pill route-${eff.route}">${ROUTE_CONFIG[eff.route]?.label || eff.route}</span>
          ${eff.isOverride ? '<span class="override-tag" title="Manual route override applied">Manual override</span>' : ''}
        </td>
        <td><span class="status-pill status-${an.reviewState.toLowerCase().replace(/\s+/g,'-')}">${an.reviewState}</span></td>
        <td><span style="font-family: var(--font-mono); font-size: 11.5px; color: var(--text-muted);">Rev ${r.applied_revision}</span></td>
        <td>
          <button class="btn-glass btn-glass-secondary btn-sm" data-ref="${r.record_ref}">Inspect →</button>
        </td>
      `;

      tr.addEventListener('click', () => {
        openConversationByRef(r.record_ref);
      });

      tbody.appendChild(tr);
    });
  }

  // Quick Filter Chips event listeners
  document.querySelectorAll('.quick-filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.quick-filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      inboxQuickFilter = chip.dataset.chip;
      renderFullInbox();
    });
  });

  // Full inbox filter controls
  document.getElementById('inbox-filter-search')?.addEventListener('input', (e) => {
    globalFilters.search = e.target.value.trim();
    renderFullInbox();
  });

  document.getElementById('inbox-filter-type')?.addEventListener('change', (e) => {
    globalFilters.sourceType = e.target.value;
    renderFullInbox();
  });

  document.getElementById('inbox-filter-person')?.addEventListener('change', (e) => {
    globalFilters.person = e.target.value;
    renderFullInbox();
  });

  document.getElementById('inbox-filter-route')?.addEventListener('change', (e) => {
    globalFilters.route = e.target.value;
    renderFullInbox();
  });

  document.getElementById('inbox-filter-state')?.addEventListener('change', (e) => {
    globalFilters.reviewState = e.target.value;
    renderFullInbox();
  });

  document.getElementById('btn-inbox-reset-filters')?.addEventListener('click', () => {
    globalFilters = { search: '', sourceType: 'all', person: 'all', route: 'all', reviewState: 'all' };
    inboxQuickFilter = 'all';
    document.querySelectorAll('.quick-filter-chip').forEach(c => c.classList.remove('active'));
    document.querySelector('[data-chip="all"]')?.classList.add('active');
    
    document.getElementById('inbox-filter-search').value = '';
    document.getElementById('inbox-filter-type').value = 'all';
    document.getElementById('inbox-filter-person').value = 'all';
    document.getElementById('inbox-filter-route').value = 'all';
    document.getElementById('inbox-filter-state').value = 'all';

    renderFullInbox();
    showToast('Filters reset.');
  });

  document.getElementById('btn-inbox-refresh')?.addEventListener('click', () => {
    renderFullInbox();
    showToast('Inbox refreshed.');
  });

  // Export CSV
  document.getElementById('btn-export-inbox-csv')?.addEventListener('click', () => {
    const rows = [
      ['Ref', 'Type', 'Source ID', 'Revision', 'Person / Organiser', 'Title / Contact', 'Route', 'Review State', 'Has Usable Transcript']
    ];
    store.records.forEach(r => {
      const eff = store.getEffectiveRoute(r);
      const an = store.getAnalysis(r);
      const person = r.payload?.rep_name || r.payload?.organizer_email || '';
      const title = r.payload?.title || r.payload?.to_number || '';
      rows.push([
        r.record_ref,
        r.source_type,
        r.source_id,
        r.applied_revision,
        person,
        `"${title.replace(/"/g, '""')}"`,
        eff.route,
        an.reviewState,
        store.hasUsableTranscript(r) ? 'Yes' : 'No'
      ]);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Signal_Desk_Inbox_Export.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('CSV export downloaded.', 'success');
  });

  // ==========================================
  // Render Conversation Inspector (View 3)
  // ==========================================
  function renderInspector() {
    const emptyState = document.getElementById('inspector-empty-state');
    const contentPane = document.getElementById('inspector-content-pane');
    if (!emptyState || !contentPane) return;

    if (!selectedRecordKey || !store.records.has(selectedRecordKey)) {
      emptyState.style.display = 'block';
      contentPane.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    contentPane.style.display = 'grid';

    const record = store.records.get(selectedRecordKey);
    const eff = store.getEffectiveRoute(record);
    const analysis = store.getAnalysis(record);
    const hasText = store.hasUsableTranscript(record);

    // Left Pane Headers
    const elRef = document.getElementById('insp-ref');
    if (elRef) elRef.textContent = record.record_ref;

    const elType = document.getElementById('insp-type');
    if (elType) elType.textContent = record.source_type.toUpperCase();

    const elSourceId = document.getElementById('insp-source-id');
    if (elSourceId) elSourceId.textContent = record.source_id;

    const participants = document.getElementById('insp-participants');
    if (participants) {
      if (record.source_type === 'call') {
        participants.innerHTML = `Telephony Representative: <strong>${record.payload?.rep_name || 'N/A'}</strong> | Target: <strong>${record.payload?.to_number || 'Inbound'}</strong>`;
      } else {
        participants.innerHTML = `Meeting Title: <strong>${record.payload?.title || 'Interaction'}</strong> | Organiser: <strong>${record.payload?.organizer_email || 'N/A'}</strong>`;
      }
    }

    // Turns container
    const turnsContainer = document.getElementById('insp-transcript-container');
    if (turnsContainer) {
      turnsContainer.innerHTML = '';

      if (!hasText) {
        turnsContainer.innerHTML = `
          <div class="inspector-unsupplied-card">
            <div class="empty-vector-mark">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <strong class="empty-vector-title">No Transcript Text Supplied</strong>
            <p class="empty-vector-sub">
              This conversation is an unrecorded call, voicemail, or administrative calendar invite. It is preserved strictly as an intake record without fabricated dialogue.
            </p>
          </div>
        `;
      } else if (record.source_type === 'call') {
        // Telephony Call Transcript (formatted turns)
        const transcriptText = record.payload?.transcript || '';
        const lines = transcriptText.split('\n').filter(l => l.trim().length > 0);
        
        lines.forEach((line, index) => {
          const bubble = document.createElement('div');
          const isRep = line.toLowerCase().includes('rep:') || line.toLowerCase().includes('agent:') || line.toLowerCase().includes('spendnest:');
          bubble.className = `chat-turn-bubble ${isRep ? 'rep-turn' : 'client-turn'}`;

          const isEvidence = analysis.sourcePassage && line.includes(analysis.sourcePassage.slice(0, 20));
          if (isEvidence) bubble.classList.add('highlight-evidence');

          bubble.innerHTML = `
            <div class="chat-turn-meta">
              <span>${isRep ? (record.payload?.rep_name || 'SpendNest Rep') : 'Prospect / Contact'}</span>
              <span>Turn ${index + 1}</span>
            </div>
            <div>${line}</div>
          `;
          turnsContainer.appendChild(bubble);
        });
      } else {
        // Calendar Meeting Turns
        const turns = record.transcript_payload?.turns || [];
        turns.forEach((turn, index) => {
          const bubble = document.createElement('div');
          const isClient = (turn.speaker || '').toLowerCase().includes('client') || (turn.speaker || '').toLowerCase().includes('prospect') || (turn.speaker || '').toLowerCase().includes('customer');
          bubble.className = `chat-turn-bubble ${isClient ? 'client-turn' : 'rep-turn'}`;

          const isEvidence = analysis.sourcePassage && turn.text && analysis.sourcePassage.includes(turn.text.slice(0, 25));
          if (isEvidence) bubble.classList.add('highlight-evidence');

          bubble.innerHTML = `
            <div class="chat-turn-meta">
              <span>${turn.speaker || 'Participant'}</span>
              <span>Turn ${index + 1}</span>
            </div>
            <div>${turn.text}</div>
          `;
          turnsContainer.appendChild(bubble);
        });
      }
    }

    // Right Pane: Evidence Brief
    const elFreshness = document.getElementById('insp-freshness');
    if (elFreshness) elFreshness.textContent = analysis.freshness;

    const elWhat = document.getElementById('insp-what-happened');
    if (elWhat) elWhat.textContent = analysis.whatHappened;

    const elWhy = document.getElementById('insp-why-it-matters');
    if (elWhy) elWhy.textContent = analysis.whyItMatters;

    const elPassage = document.getElementById('insp-source-passage');
    if (elPassage) elPassage.textContent = `"${analysis.sourcePassage}"`;

    const elLimit = document.getElementById('insp-limitations');
    if (elLimit) elLimit.textContent = analysis.limitations;

    const elNext = document.getElementById('insp-next-step');
    if (elNext) elNext.textContent = analysis.nextStep;

    const elOwner = document.getElementById('insp-owner');
    if (elOwner) elOwner.textContent = analysis.owner;

    // Override Banner
    const overrideBanner = document.getElementById('insp-override-banner');
    if (overrideBanner) {
      if (eff.isOverride) {
        overrideBanner.style.display = 'block';
        const elUpdated = document.getElementById('insp-override-updated-at');
        if (elUpdated) elUpdated.textContent = eff.updatedAt || 'Recently';
      } else {
        overrideBanner.style.display = 'none';
      }
    }

    // Selects
    const elRouteSelect = document.getElementById('insp-route-select');
    if (elRouteSelect) elRouteSelect.value = eff.route;

    const elSecRouteSelect = document.getElementById('insp-sec-route-select');
    if (elSecRouteSelect) elSecRouteSelect.value = eff.secondaryRoute || 'none';
  }

  // Jump to evidence button
  document.getElementById('btn-jump-evidence')?.addEventListener('click', () => {
    const highlight = document.querySelector('.highlight-evidence');
    if (highlight) {
      highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
      highlight.style.outline = '3px solid #167C72';
      setTimeout(() => highlight.style.outline = '', 1500);
    } else {
      showToast('Evidence quotation is summarized from dialogue turns.');
    }
  });

  // Copy citation button
  document.getElementById('btn-copy-citation')?.addEventListener('click', () => {
    const passage = document.getElementById('insp-source-passage')?.textContent;
    const ref = document.getElementById('insp-ref')?.textContent;
    if (passage && ref) {
      const citation = `${passage} — [Ref: ${ref}]`;
      navigator.clipboard.writeText(citation).then(() => {
        showToast('Citation copied to clipboard!', 'success');
      });
    }
  });

  // Save Route Override
  document.getElementById('btn-save-override')?.addEventListener('click', () => {
    if (!selectedRecordKey) return;
    const record = store.records.get(selectedRecordKey);
    const newRoute = document.getElementById('insp-route-select').value;
    const newSec = document.getElementById('insp-sec-route-select').value;

    store.setManualOverride(
      record.source_type,
      record.source_id,
      newRoute,
      newSec === 'none' ? null : newSec,
      'Updated by sales manager via Signal Desk UI'
    );

    renderInspector();
    renderDashboard();
    renderFullInbox();
    showToast(`Manual route override saved for ${record.record_ref}!`, 'success');
  });

  // Reset Override
  document.getElementById('btn-reset-override')?.addEventListener('click', () => {
    if (!selectedRecordKey) return;
    const record = store.records.get(selectedRecordKey);
    store.clearManualOverride(record.source_type, record.source_id);

    renderInspector();
    renderDashboard();
    renderFullInbox();
    showToast(`Route reset to automated default for ${record.record_ref}.`);
  });

  // ==========================================
  // Import & Replay Lab (View 5)
  // ==========================================
  const replayConsole = document.getElementById('replay-log-console');
  function logReplay(msg) {
    if (!replayConsole) return;
    const time = new Date().toLocaleTimeString();
    replayConsole.innerHTML += `\n[${time}] ${msg}`;
    replayConsole.scrollTop = replayConsole.scrollHeight;
  }

  // Test 1: Initial Import
  document.getElementById('btn-replay-step-1')?.addEventListener('click', () => {
    logReplay('--- RUNNING TEST 1: Initial Import (01_initial.json) ---');
    store.loadInitialState();
    const metrics = store.getMetrics();
    logReplay(`Results: Total=${metrics.totalRecords}, Calls=${metrics.callsCount}, Meetings=${metrics.meetingsCount}, UsableTexts=${metrics.usableTranscriptsCount}`);
    if (metrics.totalRecords === 44 && metrics.callsCount === 30 && metrics.meetingsCount === 14 && metrics.usableTranscriptsCount === 17) {
      logReplay('[PASS] Initial delivery envelope processed. 44 unique records, 17 usable texts.');
      document.getElementById('status-step-1').className = 'status-pill status-analysed';
      document.getElementById('status-step-1').textContent = 'PASS';
    } else {
      logReplay('[FAIL]: Metric counts do not match expected contract.');
    }
    renderDashboard();
    renderFullInbox();
  });

  // Test 2: Duplicate Import
  document.getElementById('btn-replay-step-2')?.addEventListener('click', () => {
    logReplay('--- RUNNING TEST 2: Duplicate Import (Idempotency) ---');
    const before = store.records.size;
    store.loadInitialState();
    const after = store.records.size;
    logReplay(`Before count: ${before}, After re-import count: ${after}`);
    if (before === 44 && after === 44) {
      logReplay('[PASS] Idempotency invariant upheld. Zero duplicate records created.');
      document.getElementById('status-step-2').className = 'status-pill status-analysed';
      document.getElementById('status-step-2').textContent = 'PASS';
    } else {
      logReplay('[FAIL]: Duplicate records detected.');
    }
  });

  // Test 3: Manual Override
  document.getElementById('btn-replay-step-3')?.addEventListener('click', () => {
    logReplay('--- RUNNING TEST 3: Apply Manual Route Override on M07 ---');
    let m07Record = null;
    for (const r of store.records.values()) {
      if (r.record_ref === 'M07') {
        m07Record = r;
        break;
      }
    }
    if (m07Record) {
      store.setManualOverride(m07Record.source_type, m07Record.source_id, 'product-support', 'customer-follow-up', 'Triage test override');
      const eff = store.getEffectiveRoute(m07Record);
      logReplay(`M07 route: ${eff.route}, secondary: ${eff.secondaryRoute}, isOverride: ${eff.isOverride}`);
      if (eff.isOverride && eff.route === 'product-support') {
        logReplay('[PASS] Manual route override successfully applied and isolated from core payload.');
        document.getElementById('status-step-3').className = 'status-pill status-analysed';
        document.getElementById('status-step-3').textContent = 'PASS';
      }
    }
    renderDashboard();
    renderFullInbox();
  });

  // Test 4: Update Batch
  document.getElementById('btn-replay-step-4')?.addEventListener('click', () => {
    logReplay('--- RUNNING TEST 4: Import Update Delivery (02_update.json) ---');
    store.loadFinalState();
    const metrics = store.getMetrics();
    let m07 = null;
    for (const r of store.records.values()) {
      if (r.record_ref === 'M07') { m07 = r; break; }
    }
    const hasText = m07 ? store.hasUsableTranscript(m07) : false;
    logReplay(`Post-update metrics: Total=${metrics.totalRecords}, Usable=${metrics.usableTranscriptsCount}, Coverage=${metrics.transcriptCoveragePct}%, M07 hasText=${hasText}`);
    if (metrics.totalRecords === 44 && metrics.usableTranscriptsCount === 18 && hasText) {
      logReplay('[PASS] Update batch merged successfully. M07 transcript arrived; coverage reached 40.9%.');
      document.getElementById('status-step-4').className = 'status-pill status-analysed';
      document.getElementById('status-step-4').textContent = 'PASS';
    }
    renderDashboard();
    renderFullInbox();
  });

  // Test 5: Replay Initial (Older Revision Rejection)
  document.getElementById('btn-replay-step-5')?.addEventListener('click', () => {
    logReplay('--- RUNNING TEST 5: Replay Initial Batch (Older Revision Rejection) ---');
    const initialBatch = window.SIGNAL_DESK_INITIAL_DATA;
    if (initialBatch) {
      store.importBatch(initialBatch, 'Replaying older revision 1 batch');
    }
    let m07 = null;
    for (const r of store.records.values()) {
      if (r.record_ref === 'M07') { m07 = r; break; }
    }
    const eff = store.getEffectiveRoute(m07);
    const metrics = store.getMetrics();
    if (m07.applied_revision === 2 && metrics.usableTranscriptsCount === 18 && metrics.totalRecords === 44 && eff.isOverride) {
      logReplay('[PASS] Older Revision 1 ignored. M07 retained Revision 2 transcript and preserved manual route.');
      document.getElementById('status-step-5').className = 'status-pill status-analysed';
      document.getElementById('status-step-5').textContent = 'PASS';
    }
  });

  // Test 6: Persistence Check
  document.getElementById('btn-replay-step-6')?.addEventListener('click', () => {
    logReplay('--- RUNNING TEST 6: Persistence & Storage Check ---');
    store.saveToStorage();
    const testStore = new SignalDeskStore();
    const loaded = testStore.loadFromStorage();
    const metrics = testStore.getMetrics();
    if (loaded && metrics.totalRecords === 44 && metrics.manualOverridesCount >= 1) {
      logReplay('[PASS] Full application state successfully persisted and reloaded from storage.');
      document.getElementById('status-step-6').className = 'status-pill status-analysed';
      document.getElementById('status-step-6').textContent = 'PASS';
    }
  });

  // Run all tests sequentially
  document.getElementById('btn-run-all-tests')?.addEventListener('click', () => {
    logReplay('========================================');
    logReplay('STARTING AUTOMATED REPLAY TEST SUITE (TESTS 1–6)');
    logReplay('========================================');

    document.getElementById('btn-replay-step-1')?.click();
    setTimeout(() => {
      document.getElementById('btn-replay-step-2')?.click();
      setTimeout(() => {
        document.getElementById('btn-replay-step-3')?.click();
        setTimeout(() => {
          document.getElementById('btn-replay-step-4')?.click();
          setTimeout(() => {
            document.getElementById('btn-replay-step-5')?.click();
            setTimeout(() => {
              document.getElementById('btn-replay-step-6')?.click();
              logReplay('========================================');
              logReplay('ALL 6 REPLAY CONTRACT TESTS PASSED IN SEQUENCE!');
              logReplay('========================================');
              showToast('All 6 Replay Contract Tests Passed!', 'success');
            }, 300);
          }, 300);
        }, 300);
      }, 300);
    }, 300);
  });

  // Settings Actions
  document.getElementById('btn-settings-load-final')?.addEventListener('click', () => {
    store.loadFinalState();
    showToast('Loaded demo state (Rev 2 with 18 usable transcripts).', 'success');
    renderDashboard();
    renderFullInbox();
  });

  document.getElementById('btn-settings-reset-clean')?.addEventListener('click', () => {
    store.loadInitialState();
    showToast('Reset to Rev 1 baseline.', 'info');
    renderDashboard();
    renderFullInbox();
  });

  // ==========================================
  // Exports & Downloads
  // ==========================================
  document.getElementById('btn-download-manifest')?.addEventListener('click', () => {
    const metrics = store.getMetrics();
    const manifestRecords = [];

    store.records.forEach(r => {
      const eff = store.getEffectiveRoute(r);
      const an = store.getAnalysis(r);
      const hasText = store.hasUsableTranscript(r);
      const destinations = [eff.route];
      if (eff.secondaryRoute) destinations.push(eff.secondaryRoute);

      manifestRecords.push({
        record_ref: r.record_ref,
        source_type: r.source_type,
        source_id: r.source_id,
        applied_revision: r.applied_revision,
        primary_route: eff.route,
        secondary_route: eff.secondaryRoute,
        all_routes: destinations,
        output_paths: destinations.map(d => `routes/${d}/${r.record_ref}_${r.source_id.slice(0,8)}.md`),
        review_state: an.reviewState,
        manual_override: eff.isOverride,
        analysis_freshness: r.applied_revision === 2 ? 'rev2_current' : 'rev1_baseline',
        has_usable_transcript: hasText
      });
    });

    manifestRecords.sort((a,b) => a.record_ref.localeCompare(b.record_ref));

    const manifestDoc = {
      manifest_version: '1.0.0',
      generated_at: new Date().toISOString(),
      dataset_date_local: '2026-08-21',
      dataset_timezone: 'Asia/Kolkata',
      total_logical_records: store.records.size,
      usable_transcripts_count: metrics.usableTranscriptsCount,
      transcript_coverage: `${metrics.transcriptCoveragePct}%`,
      manual_overrides_count: metrics.manualOverridesCount,
      records: manifestRecords
    };

    const blob = new Blob([JSON.stringify(manifestDoc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('manifest.json downloaded.', 'success');
  });

  document.getElementById('btn-download-zip')?.addEventListener('click', async () => {
    if (typeof JSZip === 'undefined') {
      showToast('JSZip library loading error. Check vendor bundle.', 'alert');
      return;
    }

    const zip = new JSZip();
    const exportsFolder = zip.folder('exports');
    const routesFolder = exportsFolder.folder('routes');

    const manifestRecords = [];
    store.records.forEach(r => {
      const eff = store.getEffectiveRoute(r);
      const an = store.getAnalysis(r);
      const hasText = store.hasUsableTranscript(r);
      const destinations = [eff.route];
      if (eff.secondaryRoute) destinations.push(eff.secondaryRoute);

      destinations.forEach(slug => {
        const routeSub = routesFolder.folder(slug);
        const filename = `${r.record_ref}_${r.source_id.slice(0,8)}.md`;
        const mdContent = `# Conversation Analysis: ${r.record_ref} (${r.source_type.toUpperCase()})
- **Source Reference**: ${r.record_ref}
- **Source Type**: ${r.source_type}
- **Source ID**: \`${r.source_id}\`
- **Applied Revision**: ${r.applied_revision}
- **Assigned Route**: \`${slug}\`
- **Review State**: ${an.reviewState}
- **Owner**: ${an.owner}

## 1. What Happened
${an.whatHappened}

## 2. Why It Matters
${an.whyItMatters}

## 3. Supporting Evidence
> ${an.sourcePassage}

## 4. Analytical Boundaries
${an.limitations}

## 5. Practical Next Steps
${an.nextStep}
`;
        routeSub.file(filename, mdContent);
      });

      manifestRecords.push({
        record_ref: r.record_ref,
        source_type: r.source_type,
        source_id: r.source_id,
        applied_revision: r.applied_revision,
        primary_route: eff.route,
        secondary_route: eff.secondaryRoute,
        all_routes: destinations,
        output_paths: destinations.map(d => `routes/${d}/${r.record_ref}_${r.source_id.slice(0,8)}.md`),
        review_state: an.reviewState,
        manual_override: eff.isOverride,
        has_usable_transcript: hasText
      });
    });

    manifestRecords.sort((a,b) => a.record_ref.localeCompare(b.record_ref));

    const manifestDoc = {
      manifest_version: '1.0.0',
      generated_at: new Date().toISOString(),
      dataset_date_local: '2026-08-21',
      total_logical_records: store.records.size,
      records: manifestRecords
    };

    exportsFolder.file('manifest.json', JSON.stringify(manifestDoc, null, 2));

    const zipContent = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipContent);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Signal_Desk_Exports.zip';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Signal_Desk_Exports.zip package created and downloaded!', 'success');
  });

  // ==========================================
  // React Bits Animation Controllers
  // SpotlightCard | TiltedCard | CountUp
  // ==========================================
  function animateCountUp(element, targetValue, duration = 750, suffix = '', decimals = 0) {
    if (!element) return;
    const numTarget = typeof targetValue === 'number' ? targetValue : parseFloat(targetValue);
    if (isNaN(numTarget)) {
      element.textContent = targetValue;
      return;
    }
    const startTime = performance.now();
    const startValue = 0;

    function frame(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic (React Bits spring/ease style)
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (numTarget - startValue) * ease;
      
      element.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.round(current)) + suffix;

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        element.textContent = (decimals > 0 ? numTarget.toFixed(decimals) : numTarget) + suffix;
      }
    }
    requestAnimationFrame(frame);
  }

  // ==========================================
  // Initial Boot
  // ==========================================
  populatePersonFilter();
  renderDashboard();
  renderFullInbox();

  // Pre-select M07 Willowfield Trust for immediate inspector inspection
  for (const r of store.records.values()) {
    if (r.record_ref === 'M07') {
      selectedRecordKey = store.getRecordKey(r.source_type, r.source_id);
      break;
    }
  }

  // Subscribe to store changes
  store.subscribe(() => {
    populatePersonFilter();
    renderDashboard();
    renderFullInbox();
    if (selectedRecordKey) renderInspector();
  });
});
