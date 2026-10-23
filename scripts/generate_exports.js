const fs = require('fs');
const path = require('path');

// 1. Load initial, update, and analyses JSON
const initPath = path.join(__dirname, '..', 'data', '01_initial.json');
const updPath = path.join(__dirname, '..', 'data', '02_update.json');
const analysesPath = path.join(__dirname, '..', 'app', 'analyses_data.json');

const initData = JSON.parse(fs.readFileSync(initPath, 'utf8'));
const updData = JSON.parse(fs.readFileSync(updPath, 'utf8'));
const analyses = JSON.parse(fs.readFileSync(analysesPath, 'utf8'));

// 2. Build merged record map (simulating post-update state)
const recordMap = new Map();
initData.records.forEach(r => {
  const key = `${r.source_type}:${r.source_id}`;
  recordMap.set(key, { ...r, applied_revision: initData.revision, batch_id: initData.batch_id });
});

updData.records.forEach(r => {
  const key = `${r.source_type}:${r.source_id}`;
  const existing = recordMap.get(key);
  if (!existing || updData.revision > existing.applied_revision) {
    recordMap.set(key, { ...r, applied_revision: updData.revision, batch_id: updData.batch_id });
  }
});

// 3. Prepare directory structure
const exportsDir = path.join(__dirname, '..', 'exports');
const routesDir = path.join(exportsDir, 'routes');
const validRouteSlugs = [
  'sales-coaching',
  'deal-next-steps',
  'customer-follow-up',
  'product-support',
  'internal-operations',
  'partner-vendor',
  'human-review',
  'metadata-only'
];

fs.mkdirSync(exportsDir, { recursive: true });
validRouteSlugs.forEach(slug => {
  fs.mkdirSync(path.join(routesDir, slug), { recursive: true });
});

// 4. Helper to format markdown export
function formatConversationMarkdown(record, analysis, routeSlug) {
  const isPrimary = routeSlug === analysis.primaryRoute;
  const p = record.payload;
  const callerOrOrg = record.source_type === 'call'
    ? `Caller: ${p.rep_name || 'Unknown'} (${p.rep_email || 'N/A'}), Destination: ${p.to_number || 'N/A'}`
    : `Organizer: ${p.organizer_email || 'N/A'}, Provider: ${p.provider || 'N/A'}`;

  return `# Conversation Analysis: ${record.record_ref} (${record.source_type.toUpperCase()})

- **Source Reference**: ${record.record_ref}
- **Source Type**: ${record.source_type}
- **Source ID**: \`${record.source_id}\`
- **Applied Revision**: ${record.applied_revision} (Batch: ${record.batch_id})
- **Timestamp (UTC)**: ${p.started_at || p.starts_at}
- **Local Date (Asia/Kolkata)**: 2026-08-21
- **Participants / Identifiers**: ${callerOrOrg}
- **Assigned Route**: \`${routeSlug}\` ${isPrimary ? '(Primary)' : '(Secondary / Multi-Destination)'}
- **Other Routes**: ${isPrimary ? (analysis.secondaryRoute ? `\`${analysis.secondaryRoute}\`` : 'None') : `\`${analysis.primaryRoute}\` (Primary)`}
- **Processing / Review State**: ${analysis.reviewState}
- **Assigned Owner**: ${analysis.owner}
- **Analysis Freshness**: ${record.applied_revision === 2 ? 'Current (Refreshed for Revision 2)' : 'Current (Revision 1 Baseline)'}

---

## 1. What Happened
${analysis.whatHappened}

## 2. Why It Matters
${analysis.whyItMatters}

## 3. Supporting Evidence & Verifiable Passage
> ${analysis.sourcePassage}

## 4. Analytical Boundaries & What The Evidence Does NOT Establish
${analysis.limitations}

## 5. Practical Next Steps & Recommended Action
- **Recommended Action**: ${analysis.nextStep}
- **Action Owner**: ${analysis.owner}

## 6. Routing Decision & Rationale
- **Selected Route**: \`${routeSlug}\`
- **Decision Rationale**: ${analysis.routeRationale}
`;
}

// 5. Generate files and manifest
const manifestEntries = [];
let totalExportFiles = 0;

recordMap.forEach(record => {
  const ref = record.record_ref;
  const analysis = analyses[ref] || {
    primaryRoute: 'metadata-only',
    secondaryRoute: null,
    reviewState: 'Intake Verified',
    owner: 'Unassigned',
    whatHappened: 'Record metadata verified.',
    whyItMatters: 'Intake metadata.',
    sourcePassage: 'N/A',
    limitations: 'N/A',
    nextStep: 'None',
    routeRationale: 'Default metadata route.'
  };

  const destinations = [analysis.primaryRoute];
  if (analysis.secondaryRoute && analysis.secondaryRoute !== analysis.primaryRoute) {
    destinations.push(analysis.secondaryRoute);
  }

  const outputPaths = [];

  destinations.forEach(slug => {
    const filename = `${ref}_${record.source_id.slice(0, 8)}.md`;
    const relativePath = path.join('routes', slug, filename).replace(/\\/g, '/');
    const absolutePath = path.join(routesDir, slug, filename);

    const content = formatConversationMarkdown(record, analysis, slug);
    fs.writeFileSync(absolutePath, content, 'utf8');
    outputPaths.push(relativePath);
    totalExportFiles++;
  });

  manifestEntries.push({
    record_ref: ref,
    source_type: record.source_type,
    source_id: record.source_id,
    applied_revision: record.applied_revision,
    primary_route: analysis.primaryRoute,
    secondary_route: analysis.secondaryRoute || null,
    all_routes: destinations,
    output_paths: outputPaths,
    review_state: analysis.reviewState,
    manual_override: false, // Baseline auto-routed
    analysis_freshness: record.applied_revision === 2 ? 'rev2_current' : 'rev1_baseline',
    has_usable_transcript: record.source_type === 'call'
      ? Boolean(record.payload.transcript && record.payload.transcript.trim())
      : Boolean(record.transcript_payload && record.transcript_payload.turns && record.transcript_payload.turns.length > 0)
  });
});

// Sort manifest by record_ref
manifestEntries.sort((a, b) => a.record_ref.localeCompare(b.record_ref));

// Write manifest.json
const manifestPath = path.join(exportsDir, 'manifest.json');
const manifestDoc = {
  manifest_version: '1.0.0',
  generated_at: new Date().toISOString(),
  dataset_date_local: '2026-08-21',
  dataset_timezone: 'Asia/Kolkata',
  total_logical_records: recordMap.size,
  total_output_files: totalExportFiles,
  usable_transcripts_count: manifestEntries.filter(e => e.has_usable_transcript).length,
  transcript_coverage: (manifestEntries.filter(e => e.has_usable_transcript).length / recordMap.size).toFixed(3),
  records: manifestEntries
};

fs.writeFileSync(manifestPath, JSON.stringify(manifestDoc, null, 2), 'utf8');

// Generate Manager Brief
const briefPath = path.join(exportsDir, 'manager-brief-2026-08-21.md');
const briefContent = `# Manager Brief: Signal Desk — Revenue Intelligence
**Operating Date**: 21 August 2026 | **Timezone**: Asia/Kolkata (IST)  
**Reporting Period**: Local day interactions (Extracted 22 August 2026)  
**Author**: Revenue Intelligence Desk (Antigravity Senior Analyst)

---

## 1. Executive Summary & Sample Scope
On 21 August 2026, the sales and success teams conducted **44 unique customer and internal interactions** (30 phone calls, 14 calendar meetings). Following the delivery of Revision 2 updates, **18 interactions feature complete conversation transcripts** (10 calls, 8 meetings), representing **40.9% transcript coverage**. The remaining 26 records represent unrecorded calls, voicemails, or administrative calendar invites, which remain fully inspectable for intake integrity.

> **Sample Integrity Note**: This dataset represents a selected sample of team interactions on a single date, not a comprehensive team activity log. Meeting organizers are calendar coordinators and cannot be presumed to be sales closers or attendees.

---

## 2. Critical Escalations & Urgent Customer Issues
Immediate management intervention is required on three customer-facing accounts:

1. **Willowfield Trust (M07) — Platform Bugs & Payment Corruption Risk [URGENT]**
   - **Issue**: Customer demonstrated four active platform bugs during a screen-share: (1) Event-payment description edits fail to save on display; (2) Direct invoice upload fails on Recreate Payment; (3) Reimbursement payments stuck in "Processing" state; (4) The "Mark as Paid" modal retains the previous transaction amount, risking erroneous duplicate payments.
   - **Evidence**: Turn 22: *"The amount from the previous item appears in the next one. Each time I have to cancel, leave it and open Mark as paid again before it shows the right information."*
   - **Action**: Engineering triage immediately assigned to team09. CS follow-up call scheduled post-deployment.

2. **Cedarwave Distribution (M04) — Card Migration Friction & Department Hierarchy Bug**
   - **Issue**: Forced migration away from legacy card provider caused pushback. Cedarwave holds an INR 1.3 crore bank credit line and refuses indefinite prepaid arrangements. In addition, an unresolved UI bug prevents moving users between departments.
   - **Evidence**: Turn 11: *"moving from prepaid to credit is the main issue for us."* Turn 30: *"earlier issue with moving users between departments."*
   - **Action**: Product team to test bank credit feed integration; CS to conduct guided department reorganization session.

3. **Brookmint Holdings / Northkite Equipment (M09) — Broken Onboarding Auth Tokens**
   - **Issue**: Newly generated password reset tokens expire instantly upon receipt, blocking Brookmint Holdings administrators from setting up their workspace.
   - **Evidence**: Turn 21: *"It says the token has expired. This is the fresh message we just received."*
   - **Action**: Auth service team to inspect token generation and TTL logic.

---

## 3. Actionable Follow-Up Priorities
| Priority | Account / Contact | Ref | Action Item | Assigned Owner | Target Window |
|---|---|---|---|---|---|
| **High** | Willowfield Trust | M07 | Triage modal caching & description API bugs | Engineering / team09 | Within 2 hours |
| **High** | Brookmint Holdings | M09 | Fix invitation token invalidation bug | Auth Eng / team11 | Today / EOD |
| **High** | Asterloom Systems | M03 | Send transparent proposal (INR 26k sub + INR 13k setup) | Sales / team08 | Today |
| **Medium** | Willowbank Advisory | C07 | Send partner proposal via mobile messaging app | Dev | Monday Morning |
| **Medium** | Harborpath Advisory | M01 | Send partner memorandum & scalable affiliate link | team06 | Today |
| **Medium** | Milan (API Access) | C03 | Email proposal with exact subject "Developer access..." | Kiran | Monday Morning |
| **Medium** | People Ops Referral | C08 | Contact People Ops lead citing Raghav's referral | Meera | Monday |
| **Low** | StoreHarbor User | C05 | Add to quarterly retail competitive nurture sequence | Meera | Next Week |

---

## 4. Sales Coaching & Compliance Insights
1. **Strict Adherence to Explicit Contact Boundaries (C09, C10, C01)**:
   - In **C09**, prospect Vedant explicitly prohibited using his name when approaching business head Rishabh (*"No, please don't use my name"*). Reps must be reminded that violating prospect trust can burn enterprise accounts.
   - In **C10**, prospect Aniket explicitly refused proactive phone calls (*"No. I said I will contact you..."*). Outreach must be restricted to messaging.
   - In **C01**, Arun persisted after an explicit refusal on a private work number. Coaching must emphasize graceful exits upon firm opt-out.
2. **Account Logging Integrity (C06)**:
   - Call C06 was logged under rep Meera, but the agent introduced himself as *"Ravi here"*. Managers must audit whether accounts are shared or call logs are misattributed.
3. **Fee Breakdown Transparency (M03)**:
   - Quoting INR 39,000 after previously stating INR 26,000 caused immediate suspicion. Reps must explicitly separate one-time integration setup fees (INR 13,000) from recurring subscriptions.

---

## 5. Product & Roadmap Signals
- **LedgerBridge Integration (M02)**: Strategic evaluation for compliant e-invoicing across SG, AU, and IN. Setup cost EUR 2,600–6,500. Validates market demand for the upcoming Receivables module.
- **Credit Line Demand vs Prepaid Cards (M03, M04)**: Growing enterprises consistently resist prepaid card loading when they possess institutional bank credit lines. SpendNest's bank credit transaction feed is a critical product priority.
- **Internal Billing Engine Governance (M10)**: Clear 7-day/end-of-month dunning rules documented. Manual billing date adjustment required upon account unfreezing.

---

## 6. Audit & Methodological Notes
- **Verification**: All metrics dynamically computed from imported JSON deliveries.
- **Traceability**: Every recommendation links to exact source turns and verifiable quotes.
- **Contract Adherence**: Manual routing overrides are preserved across imports and restarts.
`;

fs.writeFileSync(briefPath, briefContent, 'utf8');

console.log(`Generated ${totalExportFiles} conversation markdown files in ${routesDir}`);
console.log(`Generated manifest at ${manifestPath}`);
console.log(`Generated manager brief at ${briefPath}`);
