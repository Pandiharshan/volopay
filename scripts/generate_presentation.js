const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'Antigravity Revenue Intelligence Desk';
pres.company = 'SpendNest / Signal Desk';
pres.title = 'Signal Desk: Revenue Intelligence Inbox';

// Color Palette
const C_DARK_BG = '0F172A';    // Slate 900
const C_CARD_BG = '1E293B';    // Slate 800
const C_CARD_BORDER = '334155';// Slate 700
const C_TEAL = '0EA5E9';       // Sky 500
const C_EMERALD = '10B981';    // Emerald 500
const C_AMBER = 'F59E0B';      // Amber 500
const C_TEXT_MAIN = 'F8FAFC';  // Slate 50
const C_TEXT_MUTED = '94A3B8'; // Slate 400
const C_ACCENT_BLUE = '38BDF8';

// Helper to add slide header
function addHeader(slide, title, category) {
  // Category tag
  slide.addText(category.toUpperCase(), {
    x: 0.8, y: 0.5, w: 10, h: 0.3,
    fontSize: 10, color: C_TEAL, bold: true, fontFace: 'Calibri'
  });
  // Title
  slide.addText(title, {
    x: 0.8, y: 0.8, w: 11.5, h: 0.6,
    fontSize: 22, color: C_TEXT_MAIN, bold: true, fontFace: 'Calibri'
  });
  // Subtle divider
  slide.addShape(pres.ShapeType.rect, {
    x: 0.8, y: 1.45, w: 11.7, h: 0.02,
    fill: { color: C_CARD_BORDER }
  });
}

// ==========================================
// SLIDE 1: Manager Problem and Key Findings
// ==========================================
const s1 = pres.addSlide();
s1.background = { color: C_DARK_BG };
addHeader(s1, 'Revenue Intelligence Inbox: Manager Problem & Core Findings', 'Phase 1 & Phase 5 | Executive Overview');

// Left Column: The Problem & Metrics
s1.addShape(pres.ShapeType.roundRect, {
  x: 0.8, y: 1.65, w: 4.8, h: 5.1,
  fill: { color: C_CARD_BG }, line: { color: C_CARD_BORDER, width: 1 }
});
s1.addText('The Manager Problem Solved', {
  x: 1.1, y: 1.85, w: 4.2, h: 0.4,
  fontSize: 14, color: C_ACCENT_BLUE, bold: true
});
s1.addText([
  { text: 'Unstructured Ingestion Chaos: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'A sales manager receives disconnected telemetry across telephony, video bots, and calendar systems with delayed transcripts, mixed purposes, and unreliable upstream labels.\n\n', options: { color: C_TEXT_MUTED } },
  { text: 'Asymmetric Information: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: '44 records arrived on 21 Aug 2026 across 30 calls and 14 meetings. Initially only 17 had text; an update supplied the 18th (M07). Managers cannot afford manual triage.\n\n', options: { color: C_TEXT_MUTED } },
  { text: 'Baseline Scope & Verification:\n', options: { bold: true, color: C_TEXT_MAIN } },
  { text: '• 44 logical records (30 calls, 14 meetings)\n• 18 usable transcripts (40.9% coverage)\n• 26 records preserved as intake/review\n• Zero fabricated pipeline or conversion rates', options: { color: C_TEXT_MUTED } }
], { x: 1.1, y: 2.3, w: 4.2, h: 4.2, fontSize: 11, lineSpacingMultiple: 1.15 });

// Right Column: Three Critical Findings
s1.addShape(pres.ShapeType.roundRect, {
  x: 5.8, y: 1.65, w: 6.7, h: 5.1,
  fill: { color: C_CARD_BG }, line: { color: C_CARD_BORDER, width: 1 }
});
s1.addText('Three Verifiable Findings from Source Data', {
  x: 6.1, y: 1.85, w: 6.1, h: 0.4,
  fontSize: 14, color: C_ACCENT_BLUE, bold: true
});

s1.addText([
  { text: '1. UI/Modal Data Corruption Risk (M07 — Willowfield Trust):\n', options: { bold: true, color: C_AMBER } },
  { text: '• Passage: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Turn 22: "The amount from previous item appears in next one... each time I have to cancel, leave it and open Mark as paid again."\n', options: { italic: true, color: C_TEXT_MUTED } },
  { text: '• Impact: Stale payment amounts leak into subsequent payment items, risking live accounting errors.\n• Product Choice: Routed to Product/Support with high-urgency escalation banner.\n\n', options: { color: C_TEXT_MUTED } },

  { text: '2. Contact Boundaries & Metadata Mismatch (C09 & C06):\n', options: { bold: true, color: C_EMERALD } },
  { text: '• Passage: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'C09: "Would it be alright if I mentioned your name...? No, please don\'t use my name." | C06: Account is Meera, but caller identifies "Ravi here."\n', options: { italic: true, color: C_TEXT_MUTED } },
  { text: '• Impact: Sales reps must respect opt-out boundaries; managers cannot trust login IDs blindly.\n• Product Choice: Added "Boundary Alert" badge; routed C09 to Sales Coaching.\n\n', options: { color: C_TEXT_MUTED } },

  { text: '3. Commercial Prepaid vs Credit Misalignment (M03 & M04):\n', options: { bold: true, color: C_TEAL } },
  { text: '• Passage: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'M03 (Turn 6): "Wait, these are prepaid? I thought corporate credit card." | Turn 23: INR 26k vs 39k.\n', options: { italic: true, color: C_TEXT_MUTED } },
  { text: '• Impact: Enterprises expecting corporate credit resist prepaid wallet models. Fee ambiguity stalls deals.\n• Product Choice: Flagged transparent fee breakdown requirement in Deal Next Steps.', options: { color: C_TEXT_MUTED } }
], { x: 6.1, y: 2.25, w: 6.1, h: 4.3, fontSize: 10.5, lineSpacingMultiple: 1.1 });


// ==========================================
// SLIDE 2: Interface Choices & Deliberate Omissions
// ==========================================
const s2 = pres.addSlide();
s2.background = { color: C_DARK_BG };
addHeader(s2, 'Interface Architecture: Evidence First & Deliberate Omissions', 'Phase 2 | Product Design & Philosophy');

// 3 Cards Layout: Dashboard, Inbox, Inspector
const cardWidth = 3.65;
const cardHeight = 4.0;
const cardY = 1.65;

// Card 1: Dashboard
s2.addShape(pres.ShapeType.roundRect, {
  x: 0.8, y: cardY, w: cardWidth, h: cardHeight,
  fill: { color: C_CARD_BG }, line: { color: C_CARD_BORDER, width: 1 }
});
s2.addText('1. Overview Dashboard', {
  x: 1.0, y: cardY + 0.2, w: cardWidth - 0.4, h: 0.35,
  fontSize: 13, color: C_ACCENT_BLUE, bold: true
});
s2.addText([
  { text: 'Dynamic KPI Cards: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Total unique records (44), Calls (30), Meetings (14), Usable texts (17 -> 18), Coverage (40.9%), and Manual Overrides.\n\n', options: { color: C_TEXT_MUTED } },
  { text: 'Exact Denominators: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Every metric explicitly defines what was counted and over what scope. No hidden aggregations.\n\n', options: { color: C_TEXT_MUTED } },
  { text: 'Independent Person/Type Filters: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Call reps separated from calendar meeting organisers. Filters update all metrics dynamically.', options: { color: C_TEXT_MUTED } }
], { x: 1.0, y: cardY + 0.6, w: cardWidth - 0.4, h: 3.2, fontSize: 10.5, lineSpacingMultiple: 1.15 });

// Card 2: Inbox
s2.addShape(pres.ShapeType.roundRect, {
  x: 4.8, y: cardY, w: cardWidth, h: cardHeight,
  fill: { color: C_CARD_BG }, line: { color: C_CARD_BORDER, width: 1 }
});
s2.addText('2. Filterable Inbox', {
  x: 5.0, y: cardY + 0.2, w: cardWidth - 0.4, h: 0.35,
  fontSize: 13, color: C_ACCENT_BLUE, bold: true
});
s2.addText([
  { text: 'Complete Intake Visibility: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'All 44 records listed. Missing text records are marked "Metadata Only" rather than discarded.\n\n', options: { color: C_TEXT_MUTED } },
  { text: 'Instant Search & Multi-Filters: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Filter by source type, rep/organiser, route category, review status, and revision.\n\n', options: { color: C_TEXT_MUTED } },
  { text: 'Transparent Status Badges: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Clear visual badges for Automated Suggestion vs Manual Override, and Analysis Freshness.', options: { color: C_TEXT_MUTED } }
], { x: 5.0, y: cardY + 0.6, w: cardWidth - 0.4, h: 3.2, fontSize: 10.5, lineSpacingMultiple: 1.15 });

// Card 3: Inspector
s2.addShape(pres.ShapeType.roundRect, {
  x: 8.8, y: cardY, w: cardWidth, h: cardHeight,
  fill: { color: C_CARD_BG }, line: { color: C_CARD_BORDER, width: 1 }
});
s2.addText('3. Conversation Inspector', {
  x: 9.0, y: cardY + 0.2, w: cardWidth - 0.4, h: 0.35,
  fontSize: 13, color: C_ACCENT_BLUE, bold: true
});
s2.addText([
  { text: 'Dual-Pane Evidence Layout: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Left pane displays full readable transcript turns; right pane shows structured analytical brief.\n\n', options: { color: C_TEXT_MUTED } },
  { text: 'Verifiable Passage Quotes: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Every claim links to an exact turn or verbatim text quote.\n\n', options: { color: C_TEXT_MUTED } },
  { text: 'One-Click Route Overrides: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Managers can correct routes instantly with persisted local state and audit logging.', options: { color: C_TEXT_MUTED } }
], { x: 9.0, y: cardY + 0.6, w: cardWidth - 0.4, h: 3.2, fontSize: 10.5, lineSpacingMultiple: 1.15 });

// Bottom Banner: What Was Deliberately Left Out
s2.addShape(pres.ShapeType.roundRect, {
  x: 0.8, y: 5.85, w: 11.65, h: 0.9,
  fill: { color: '2A1B18' }, line: { color: C_AMBER, width: 1 }
});
s2.addText('DELIBERATE OMISSIONS (WHAT WE EXCLUDED & WHY):', {
  x: 1.0, y: 5.95, w: 11.2, h: 0.25,
  fontSize: 10.5, color: C_AMBER, bold: true
});
s2.addText('1. No Fabricated Pipeline Totals: No CRM deal table exists; inventing pipeline currency is mathematically fraudulent. 2. No Rep Win-Rate Leaderboards: Unequal sampling (Arun 15 calls vs Kiran 1) makes ranking statistically invalid. 3. Zero Ghost Summaries: Records with no transcripts show raw intake metadata without fabricated conversation summaries.', {
  x: 1.0, y: 6.22, w: 11.2, h: 0.45,
  fontSize: 9.5, color: C_TEXT_MAIN
});


// ==========================================
// SLIDE 3: Routing Taxonomy, Exports & Difficult Case
// ==========================================
const s3 = pres.addSlide();
s3.background = { color: C_DARK_BG };
addHeader(s3, 'Routing Taxonomy, Real Exports & Multi-Destination Handling', 'Phase 3 & Phase 4 | Information Architecture');

// Left: Routing Taxonomy
s3.addShape(pres.ShapeType.roundRect, {
  x: 0.8, y: 1.65, w: 5.6, h: 5.1,
  fill: { color: C_CARD_BG }, line: { color: C_CARD_BORDER, width: 1 }
});
s3.addText('Eight Routing Categories & Exports Structure', {
  x: 1.0, y: 1.85, w: 5.2, h: 0.35,
  fontSize: 13, color: C_ACCENT_BLUE, bold: true
});
s3.addText([
  { text: '1. Sales Coaching: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Cold call etiquette, boundary compliance, pricing transparency (C01, C06, C09).\n', options: { color: C_TEXT_MUTED } },
  { text: '2. Deal Next Steps: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Commercial proposals, partner follow-ups, internal referrals (C08, M03, M06).\n', options: { color: C_TEXT_MUTED } },
  { text: '3. Customer Follow-Up: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Agreed callbacks, email collateral, nurture sequences (C03, C05, C10, M04).\n', options: { color: C_TEXT_MUTED } },
  { text: '4. Product / Support: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Customer bug triages, auth failures, migration issues (M07, M09, M04).\n', options: { color: C_TEXT_MUTED } },
  { text: '5. Partner / Vendor: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Bank/e-invoicing integrations, affiliate partnerships (C07, M01, M02).\n', options: { color: C_TEXT_MUTED } },
  { text: '6. Internal Operations: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Billing walkthroughs, design meetings, team dunning rules (M10, M11).\n', options: { color: C_TEXT_MUTED } },
  { text: '7. Human Review: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Unrecorded demos, missing transcripts requiring organizer check (M08, M12, M14).\n', options: { color: C_TEXT_MUTED } },
  { text: '8. Metadata Only: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Telephony intake, voicemails, unrecorded background attempts (B01-B20, C02, M05).', options: { color: C_TEXT_MUTED } }
], { x: 1.0, y: 2.25, w: 5.2, h: 4.3, fontSize: 9.8, lineSpacingMultiple: 1.1 });

// Right: Difficult Routing Case (M04 Cedarwave)
s3.addShape(pres.ShapeType.roundRect, {
  x: 6.6, y: 1.65, w: 5.85, h: 5.1,
  fill: { color: C_CARD_BG }, line: { color: C_CARD_BORDER, width: 1 }
});
s3.addText('Difficult Routing Case: M04 (Cedarwave Distribution)', {
  x: 6.8, y: 1.85, w: 5.4, h: 0.35,
  fontSize: 13, color: C_AMBER, bold: true
});
s3.addText([
  { text: 'The Complexity of Real Conversations:\n', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'M04 serves two distinct, non-overlapping business functions that cannot fit into a single bucket:\n\n', options: { color: C_TEXT_MUTED } },
  { text: '1. Commercial Account Management: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Cedarwave is pushing back on a forced prepaid card migration because they already have an INR 1.3 crore bank credit facility. They require commercial exploration of a bank credit feed to avoid churn.\n\n', options: { color: C_TEXT_MUTED } },
  { text: '2. Critical Product / Support Bug: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'In the same call (Turn 30-31), Customer A reports an unresolved UI bug where users cannot be moved between departments in the SpendNest hierarchy.\n\n', options: { color: C_TEXT_MUTED } },
  { text: 'The Multi-Destination Solution:\n', options: { bold: true, color: C_EMERALD } },
  { text: '• Primary Destination: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Customer Follow-Up (Retention & commercial bank-feed exploration).\n', options: { color: C_TEXT_MUTED } },
  { text: '• Secondary Destination: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Product / Support (Screenshare session & bug ticket for department hierarchy).\n', options: { color: C_TEXT_MUTED } },
  { text: '• Manifest Traceability: ', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Manifest exports two separate files (66 files total generated across 44 records) preserving context for both teams without data loss.', options: { color: C_TEXT_MUTED } }
], { x: 6.8, y: 2.25, w: 5.4, h: 4.3, fontSize: 10, lineSpacingMultiple: 1.12 });


// ==========================================
// SLIDE 4: Validation & Replay Test Results
// ==========================================
const s4 = pres.addSlide();
s4.background = { color: C_DARK_BG };
addHeader(s4, 'Validation: Numerical Grounding, Passage Tracing & Replay Proof', 'Phase 8 | Verification & Testing');

// Left Column: Key Number Checking & Passage Tracing
s4.addShape(pres.ShapeType.roundRect, {
  x: 0.8, y: 1.65, w: 5.6, h: 5.1,
  fill: { color: C_CARD_BG }, line: { color: C_CARD_BORDER, width: 1 }
});
s4.addText('Rigorous Numerical & Analytical Tracing', {
  x: 1.0, y: 1.85, w: 5.2, h: 0.35,
  fontSize: 13, color: C_ACCENT_BLUE, bold: true
});
s4.addText([
  { text: '1. Checking Transcript Coverage (18 / 44 = 40.9%):\n', options: { bold: true, color: C_TEXT_MAIN } },
  { text: '• Verified by iterating every record in both deliveries.\n• In Initial Delivery: 10 calls have nonblank transcript text; 7 meetings have nonblank turns. Total = 17.\n• In Update Delivery: Meeting M07 (4f304fff...) arrives with 27 turns. Usable transcripts = 18.\n• Denominator = 44 logical records. Coverage = 18 / 44 = 40.909%.\n\n', options: { color: C_TEXT_MUTED } },

  { text: '2. Tracing Analytical Findings to Verifiable Passages:\n', options: { bold: true, color: C_TEXT_MAIN } },
  { text: '• Finding on Pricing Discrepancy: Traced to M03 Turn 23 ("previously told me INR 26,000. Why has that become INR 39,000?").\n• Finding on Bug Escalation: Traced to M07 Turn 22 ("amount from previous item appears in next one").\n• Finding on Name Boundary: Traced to C09 verbatim audio ("No, please don\'t use my name").', options: { color: C_TEXT_MUTED } }
], { x: 1.0, y: 2.25, w: 5.2, h: 4.3, fontSize: 10.2, lineSpacingMultiple: 1.15 });

// Right Column: Replay Test Table
s4.addShape(pres.ShapeType.roundRect, {
  x: 6.6, y: 1.65, w: 5.85, h: 5.1,
  fill: { color: C_CARD_BG }, line: { color: C_CARD_BORDER, width: 1 }
});
s4.addText('Automated Replay & Contract Test Suite', {
  x: 6.8, y: 1.85, w: 5.4, h: 0.35,
  fontSize: 13, color: C_EMERALD, bold: true
});

const testTableData = [
  [
    { text: 'Test Step', options: { bold: true, color: C_TEXT_MAIN, fill: '1E3A5F' } },
    { text: 'Action & Input', options: { bold: true, color: C_TEXT_MAIN, fill: '1E3A5F' } },
    { text: 'Observed Result', options: { bold: true, color: C_TEXT_MAIN, fill: '1E3A5F' } },
    { text: 'Status', options: { bold: true, color: C_TEXT_MAIN, fill: '1E3A5F' } }
  ],
  [
    { text: '1. Initial Import', options: { color: C_TEXT_MAIN } },
    { text: 'Load 01_initial.json', options: { color: C_TEXT_MUTED } },
    { text: '44 records, 17 usable texts, 27 missing', options: { color: C_TEXT_MUTED } },
    { text: 'PASS', options: { bold: true, color: C_EMERALD } }
  ],
  [
    { text: '2. Repeat Import', options: { color: C_TEXT_MAIN } },
    { text: 'Re-import same batch', options: { color: C_TEXT_MUTED } },
    { text: '44 records (0 duplicates created)', options: { color: C_TEXT_MUTED } },
    { text: 'PASS', options: { bold: true, color: C_EMERALD } }
  ],
  [
    { text: '3. Manual Route', options: { color: C_TEXT_MAIN } },
    { text: 'Override M07 to Support', options: { color: C_TEXT_MUTED } },
    { text: 'Manual tag saved in state', options: { color: C_TEXT_MUTED } },
    { text: 'PASS', options: { bold: true, color: C_EMERALD } }
  ],
  [
    { text: '4. Update Import', options: { color: C_TEXT_MAIN } },
    { text: 'Load 02_update.json (Rev 2)', options: { color: C_TEXT_MUTED } },
    { text: '44 records, 18 texts, 40.9% coverage', options: { color: C_TEXT_MUTED } },
    { text: 'PASS', options: { bold: true, color: C_EMERALD } }
  ],
  [
    { text: '5. Preserve Route', options: { color: C_TEXT_MAIN } },
    { text: 'Inspect M07 post-update', options: { color: C_TEXT_MUTED } },
    { text: 'Manual route remains intact; text updated', options: { color: C_TEXT_MUTED } },
    { text: 'PASS', options: { bold: true, color: C_EMERALD } }
  ],
  [
    { text: '6. Persistence', options: { color: C_TEXT_MAIN } },
    { text: 'Browser refresh / restart', options: { color: C_TEXT_MUTED } },
    { text: 'Overrides & updated state persist', options: { color: C_TEXT_MUTED } },
    { text: 'PASS', options: { bold: true, color: C_EMERALD } }
  ]
];

s4.addTable(testTableData, {
  x: 6.8, y: 2.3, w: 5.4, h: 3.5,
  fontSize: 9, rowH: 0.45,
  border: { color: C_CARD_BORDER, width: 0.5 },
  align: 'left', valign: 'middle'
});


// ==========================================
// SLIDE 5: Trade-offs, AI Usage & Product Roadmap
// ==========================================
const s5 = pres.addSlide();
s5.background = { color: C_DARK_BG };
addHeader(s5, 'Trade-offs, AI Governance, Limitations & Roadmap', 'Phase 5 & Submission | Engineering Integrity');

// Left Column: Rejected Decision & Trade-offs
s5.addShape(pres.ShapeType.roundRect, {
  x: 0.8, y: 1.65, w: 5.6, h: 5.1,
  fill: { color: C_CARD_BG }, line: { color: C_CARD_BORDER, width: 1 }
});
s5.addText('Rejected Decision: Sales Rep Leaderboard', {
  x: 1.0, y: 1.85, w: 5.2, h: 0.35,
  fontSize: 13, color: C_AMBER, bold: true
});
s5.addText([
  { text: 'The Alternative Considered:\n', options: { bold: true, color: C_TEXT_MAIN } },
  { text: 'Building a gamified sales representative leaderboard ranking staff by calls placed, connected call rates, or conversion velocity.\n\n', options: { color: C_TEXT_MUTED } },
  { text: 'Why It Was Deliberately Rejected:\n', options: { bold: true, color: C_TEXT_MAIN } },
  { text: '1. Highly Asymmetric Sample: Arun has 15 calls logged, Leela 8, Meera 5, Kiran 1, Dev 1. Ranking reps across 44 selected interactions produces statistically fraudulent conclusions.\n', options: { color: C_TEXT_MUTED } },
  { text: '2. Role Conflation: Meeting organisers (e.g. team08@example.com) are administrative calendar creators, not verified attendees or sales reps.\n\n', options: { color: C_TEXT_MUTED } },
  { text: 'Accepted Trade-off & Resulting Choice:\n', options: { bold: true, color: C_EMERALD } },
  { text: 'We sacrificed a flashy superficial chart to protect managerial integrity. The product shows an Activity & Coverage Breakdown with explicit caveats that numbers represent selected sample records, not overall team performance.', options: { color: C_TEXT_MUTED } }
], { x: 1.0, y: 2.25, w: 5.2, h: 4.3, fontSize: 9.8, lineSpacingMultiple: 1.12 });

// Right Column: AI Usage, Limitations, Next Steps
s5.addShape(pres.ShapeType.roundRect, {
  x: 6.6, y: 1.65, w: 5.85, h: 5.1,
  fill: { color: C_CARD_BG }, line: { color: C_CARD_BORDER, width: 1 }
});
s5.addText('AI Governance, Known Limits & Next Steps', {
  x: 6.8, y: 1.85, w: 5.4, h: 0.35,
  fontSize: 13, color: C_ACCENT_BLUE, bold: true
});
s5.addText([
  { text: 'AI Architecture & Runtime Mechanics:\n', options: { bold: true, color: C_TEXT_MAIN } },
  { text: '• Pre-Generated Evidence Analyses: Detailed extraction of 18 conversations was pre-generated to guarantee 100% deterministic accuracy without paid API latency or key exposure.\n', options: { color: C_TEXT_MUTED } },
  { text: '• Dynamic Runtime Engine: The application dynamically computes all dashboard KPIs, filters, deduplication, revision merges, manual route overrides, and export generation in the browser.\n\n', options: { color: C_TEXT_MUTED } },

  { text: 'Known Limitations in Supplied Data:\n', options: { bold: true, color: C_TEXT_MAIN } },
  { text: '• Single local date (2026-08-21); no longitudinal trend analysis possible.\n• Lack of verified CRM opportunity tables or cross-meeting attendee directories.\n\n', options: { color: C_TEXT_MUTED } },

  { text: 'Planned Engineering Enhancements:\n', options: { bold: true, color: C_EMERALD } },
  { text: '1. Webhook ingestion for live telecommunications connectors.\n2. Local LLM (WebLLM/ONNX) for zero-network live inference on ad-hoc transcripts.\n3. Bi-directional sync back into CRM systems with conflict resolution.', options: { color: C_TEXT_MUTED } }
], { x: 6.8, y: 2.25, w: 5.4, h: 4.3, fontSize: 9.8, lineSpacingMultiple: 1.12 });

// Output Presentation
const slidesDir = path.join(__dirname, '..', 'slides');
fs.mkdirSync(slidesDir, { recursive: true });
const pptxPath = path.join(slidesDir, 'Signal_Desk_Revenue_Intelligence.pptx');

pres.writeFile({ fileName: pptxPath }).then(() => {
  console.log(`Successfully generated presentation at ${pptxPath}`);
}).catch(err => {
  console.error('Failed to generate presentation:', err);
  process.exit(1);
});
