# Signal Desk — Revenue Intelligence Inbox
### Part 1 Submission: Volopay Advanced Engineering & Product Assessment

Signal Desk is an enterprise revenue intelligence inbox designed for sales and customer success managers. It ingests multi-channel telemetry (telephony calls, calendar meetings, transcripts, and upstream automated classifications), resolves revision conflicts, enforces verifiable evidence tracing, supports multi-destination routing, and preserves human managerial judgment across data updates.

---

## 1. Executive Summary & Core Results

| Baseline Metric | Initial Batch (`01_initial.json`) | Post-Update (`02_update.json`) | Mathematical Denominator & Notes |
|---|---|---|---|
| **Total Logical Records** | **44** | **44** | Distinct `(source_type, source_id)` pairs. Idempotent across repeat deliveries. |
| **Source Type: Calls** | **30** | **30** | Outbound telephony records (B01–B20 background; C01–C10 with text). |
| **Source Type: Meetings** | **14** | **14** | Calendar records (M01–M14). Organisers are calendar coordinators, not sales reps. |
| **Usable Transcripts** | **17** | **18** | Calls with nonblank text + meetings with nonblank turns. **M07 text arrives in update.** |
| **Transcript Coverage** | **38.6%** (17 / 44) | **40.9%** (18 / 44) | `Usable Transcripts / Total Logical Records`. Remaining 26 records preserved as intake. |
| **Manual Overrides** | **0** | **Preserved** | Overrides stored in local storage; survive newer revision imports. |

---

## 2. Technology Choices & Design Philosophy

- **Elite Light Glassmorphism Design System**: Built with modern frozen-glass materials, translucent frosted-glass cards (`rgba(255, 255, 255, 0.60)` with `backdrop-filter: blur(24px) saturate(155%)`), thin translucent borders (`rgba(255, 255, 255, 0.85)`), delicate inset highlights, and soft layered radial CSS background gradients (`#EDF4F8`, `#F5F8FB`, `#E4EFF8`, `#E2F3EE`). Zero photographs or distracting graphics.
- **Precision Typography**: Paired editorial display typography (`Instrument Serif` / Georgia) for greetings and headlines with clean sans-serif typography (`Inter` / system-ui) for interface controls, figures, and aligned tables.
- **Zero-Dependency Architecture**: Built using pure modern HTML5, Vanilla CSS3 tokens, and modular ES6 JavaScript with zero external frameworks or build-step hurdles.
- **100% Offline & Online Compatibility**: Works completely offline by opening `index.html` via `file:///` protocol or local HTTP server.
- **Embedded Bundling**: Includes bundled data modules (`source_data.js`, `analyses_data.js`) and a local vendor copy of `jszip.min.js` (97 KB) so client-side ZIP downloads function without internet access.
- **Data Integrity & Verification**: Real-time calculated SVG donut chart, SVG transcript coverage gauge, dynamic person/type activity bar chart, split-pane conversation inspector with styled speech bubbles, clickable Manager Brief references, and an automated Replay Lab with live terminal console.

---

## 3. Quickstart & How to Run

### Method A: Instant Double-Click (Zero Setup)
1. Navigate to the project root directory in Windows Explorer:
   `c:\Users\shyam\Downloads\candidate-v1.0 (3)_layout_fixed (1)(2) (3)\01_Revenue_Intelligence_Inbox\`
2. Double-click `index.html` (or `app/index.html`).
3. The application will open immediately in your default browser (Chrome, Edge, Firefox).

### Method B: Local Static HTTP Server
```bash
# Option 1: Python built-in server (recommended)
python -m http.server 8000

# Option 2: Node.js npx serve
npx -y serve .

# Open browser to:
http://localhost:8000/app/index.html
```

---

## 4. Workspace & Directory Structure

```text
01_Revenue_Intelligence_Inbox/
├── index.html                   # Root entry launcher (redirects to app/index.html)
├── app/                         # Editable application source code
│   ├── index.html               # Main application single-page interface
│   ├── style.css                # Enterprise design system stylesheet
│   ├── app.js                   # Application controller & view router
│   ├── data_store.js            # Contract replay engine & state management
│   ├── analyses_data.js         # Pre-generated evidence analyses (window object)
│   ├── analyses_data.json       # Pure JSON analyses data
│   ├── source_data.js           # Embedded initial & update deliveries (file:// support)
│   └── vendor/
│       └── jszip.min.js         # Local JSZip library for offline export archiving
├── data/                        # Original supplied JSON data (unchanged)
│   ├── 01_initial.json          # Revision 1 delivery envelope (44 records, 17 texts)
│   └── 02_update.json           # Revision 2 delivery envelope (M07 late transcript)
├── exports/                     # Generated export files & deliverables
│   ├── manifest.json            # Machine-readable delivery manifest (JSON)
│   ├── manager-brief-2026-08-21.md # Concise manager brief for 21 Aug 2026
│   └── routes/                  # 66 markdown conversation briefs across 8 routes
│       ├── sales-coaching/      # Coaching briefs (C01, C06, C09, etc.)
│       ├── deal-next-steps/     # Commercial pipeline briefs (M03, M06, C08, etc.)
│       ├── customer-follow-up/  # Follow-up briefs (C03, C05, C10, M04, etc.)
│       ├── product-support/     # Escalation briefs (M07, M09, M04, etc.)
│       ├── partner-vendor/      # Integration briefs (M01, M02, C07)
│       ├── internal-operations/ # Training & design briefs (M10, M11)
│       ├── human-review/        # Unrecorded sessions (M08, M12, M14)
│       └── metadata-only/       # Intake records without text (B01–B20, C02, M05)
├── slides/                      # Five-Slide Presentation
│   ├── Signal_Desk_Revenue_Intelligence.pptx # Editable 16:9 PowerPoint Presentation
│   └── presentation_transcript.md # Markdown slide transcript & speaker notes
├── scripts/                     # Scripts & Audio Narration
│   ├── narration_script_3min.md # Spoken script for 3-minute continuous screen recording
│   ├── generate_exports.js      # Generator script for exports/ and manifest.json
│   ├── generate_presentation.js # Generator script for PowerPoint presentation
│   └── run_automated_tests.js   # Automated test suite (26 assertions)
├── DEPLOYMENT.md                # Deployment instructions for reviewer access
├── TEST_REPORT.md               # Detailed test execution report
└── README.md                    # Product documentation & decisions
```

---

## 5. Metric Definitions & Exact Denominators

1. **Total Unique Records (44)**:
   - *Definition*: Distinct logical records keyed strictly by `(source_type, source_id)`.
   - *Denominator*: 44 records total across telephony calls and calendar meetings. Array position, record references (e.g. M07), or company names are never used as keys.
2. **Calls vs Meetings (30 vs 14)**:
   - *Calls*: 30 records where `source_type == 'call'`. Telephony started at `started_at`.
   - *Meetings*: 14 records where `source_type == 'meeting'`. Calendar scheduled start at `starts_at`.
3. **Usable Transcripts (17 Initial → 18 Post-Update)**:
   - *Definition*: A call with non-blank `payload.transcript`, or a meeting with non-empty `transcript_payload.turns` containing non-blank turn text.
   - *Count*: Initially 10 calls + 7 meetings = 17. After applying `02_update.json`, meeting **M07** receives its 27-turn transcript, increasing count to 18.
4. **Transcript Coverage (40.9%)**:
   - *Formula*: `Usable Transcripts (18) / Total Logical Records (44) = 40.909%`.
   - *Caveat*: The remaining 26 records lack usable text (20 background calls B01–B20; 6 meetings M05, M08, M11–M14). These are preserved as intake records because missing text is an assessment extract condition, not proof that the conversation did not occur.
5. **Call Representatives vs Calendar Organisers**:
   - Telephony calls have `rep_name` (Arun: 15, Leela: 8, Meera: 5, Kiran: 1, Dev: 1).
   - Meetings have `organizer_email` (`team08@example.com`, `team09@example.com`, etc.).
   - *Important Distinction*: An organiser is an administrative calendar creator, not automatically an attendee, salesperson, or meeting owner.

---

## 6. How to Reproduce the Data Contract Replay Tests

The application includes an interactive **Import & Replay Lab** tab (`#view-replay`) that automates and validates all 6 tests from `DATA_CONTRACT.md`. You can run them with a single click or test each step individually:

| Test | Action | Expected Behaviour | Verification Status |
|---|---|---|---|
| **Test 1: Initial Import** | Click "Step 1: Clean Initial Import" | Loads `01_initial.json`. 44 logical records, 17 usable transcripts. | **PASS** |
| **Test 2: Repeat Import** | Click "Step 2: Duplicate Import" | Re-imports the initial batch. Record count remains exactly 44; 0 duplicates created. | **PASS** |
| **Test 3: Manual Override** | Click "Step 3: Apply Manual Override" | Reassigns M07 to `Product / Support`. Displays distinct yellow "MANUAL OVERRIDE" badge. | **PASS** |
| **Test 4: Update Batch** | Click "Step 4: Import Update Delivery" | Applies `02_update.json` (Revision 2). M07 late transcript arrives. Usable texts reach 18; coverage = 40.9%. | **PASS** |
| **Test 5: Preserve Judgment** | Click "Step 5: Verify Preserved Judgment" | Inspects M07: Manual route remains `Product / Support` (not overwritten by update). 27 new turns visible. | **PASS** |
| **Test 6: Persistence** | Click "Step 6: Persistence Check" | State serializes to `localStorage` and survives browser reloads. | **PASS** |

To run the automated verification script in terminal:
```bash
node scripts/run_automated_tests.js
```

---

## 7. Storage of Manual Corrections & Reset Behaviour

- **Storage Method**: Manual routing overrides are stored in `localStorage` under key `signal_desk_app_state_v1` as a separate table keyed by `(source_type, source_id)`.
- **Contract Isolation**: Overrides are strictly decoupled from raw source payloads. When a newer revision arrives (e.g. Revision 2 for M07), the source payload is updated, but the manual route remains active.
- **Audit Logging**: Each manual override stores `route`, `secondaryRoute`, `notes`, and `updatedAt`.
- **Reset Actions**:
  - *Reset Clean* (`#btn-reset-clean`): Clears local storage and loads the clean initial batch (Revision 1).
  - *Demo State* (`#btn-load-final`): Restores the final post-update state (Revision 2 with 18 transcripts).
  - *Revert Override*: In the Conversation Inspector, clicking "Reset to Default" clears the override for that individual record.

---

## 8. AI Usage & Runtime Mechanics Disclosure

- **Pre-Generated Evidence Analyses**: Detailed turn-by-turn evidence extractions for all 18 usable conversations were pre-generated into `app/analyses_data.json`. This guarantees 100% deterministic factual accuracy, eliminates paid API dependencies/latency, and prevents key exposure.
- **Dynamic Runtime Engine**: The web application dynamically computes:
  - All 8 dashboard KPI metrics and denominator calculations.
  - Multi-criteria filtering (Type, Rep/Organiser, Route, Review State, Full-Text Search).
  - Duplicate detection and revision merges (`revision 2 > revision 1`).
  - Manual route overrides and persistence in `localStorage`.
  - Dynamic client-side ZIP packaging using JSZip.
- **No Hallucinated Summaries**: For the 26 records with missing transcripts, the application deliberately displays raw telemetry metadata without fabricating fake conversation summaries.

---

## 9. Three Most Important Findings from Source Data

### Finding 1: Critical UI/State Bugs in Core Customer Flow (M07 — Willowfield Trust)
- **Source Reference**: Meeting M07, Turn 21–25 and Turn 2.
- **Verbatim Quote**:
  > Turn 22: *"The amount from the previous item appears in the next one. Each time I have to cancel, leave it and open Mark as paid again before it shows the right information."*  
  > Turn 2: *"I am changing this event-payment description to a short reference and clicking Save changes... The field still shows the earlier wording."*
- **Why It Matters**: Live accounting corruption risk. Sticky modal caching in the "Mark as Paid" flow causes previous payment amounts to leak into subsequent payment items. In addition, description edits fail to save on display.
- **Product Influence**: Routed M07 to `Product / Support` with High Urgency flag; created prominent escalation banners on Dashboard and Manager Brief; generated immediate engineering action items with reproduction steps.

### Finding 2: Strict Contact Boundaries & Telephony Identity Mismatch (C09 & C06)
- **Source Reference**: Call C09 (Turn / Verbatim audio quote) and Call C06.
- **Verbatim Quote**:
  > C09: *"Would it be all right if I mentioned your name when contacting him? No, please don't use my name."*  
  > C06: Account metadata is `rep_name: Meera`, but spoken agent introduces: *"Hello? Good evening, Mr Nikhil... Ravi here. I'll say at the start that this is a cold call."*
- **Why It Matters**: Compliance and relationship governance. In C09, prospect Vedant forbids using his name when approaching business head Rishabh. Violating this boundary destroys trust. In C06, the logged account name differs from the spoken caller, revealing account sharing or telephony misattribution.
- **Product Influence**: Added "Boundary Alert / Consent Warning" badge in Inspector; routed C09 to `Sales Coaching` with strict instruction not to mention Vedant; flagged C06 in Manager Brief for call logging audit.

### Finding 3: Commercial Misalignment Between Marketing & Product (M03 & M04)
- **Source Reference**: Meeting M03, Turn 6 & Turn 23; Meeting M04, Turn 11 & Turn 22.
- **Verbatim Quote**:
  > M03 Turn 6: *"Wait, these are prepaid? I had thought about a corporate credit card. So we put money in before anyone spends, and there is no credit facility on these domestic cards?"*  
  > M03 Turn 23: *"But you previously told me INR 26,000. Why has that become INR 39,000?"* (Rep clarifies INR 13k setup).  
  > M04 Turn 11: *"moving from prepaid to credit is the main issue for us... We already have a corporate credit line of about INR 1.3 crore."*
- **Why It Matters**: Product-market friction. Mid-market companies expect corporate credit facilities; SpendNest's domestic offering is strictly prepaid wallet debit. Furthermore, reps quoting subscription numbers without explicitly separating one-time onboarding fees creates distrust.
- **Product Influence**: Routed M03 to `Deal Next Steps` with mandatory fee breakdown requirements; prioritized the bank credit transaction feed in product roadmap signals; highlighted transparent pricing coaching.

---

## 10. Deliberately Rejected Decision

### Rejected Alternative: Sales Representative Performance Leaderboard / Win-Rate Ranking
- **The Alternative Considered**: Building a gamified sales representative leaderboard on the dashboard ranking reps by calls placed, connected call rate, or pipeline velocity.
- **Why Rejected**:
  1. *Statistically Invalid Sample Bias*: The supplied dataset represents an asymmetric 44-record sample on a single date (2026-08-21). Arun has 15 calls logged, Leela has 8, Meera has 5, Kiran has 1, and Dev has 1. Ranking reps across 44 interactions produces statistically invalid and unfair conclusions.
  2. *Conflation of Roles*: Calendar organisers (e.g. `team08@example.com`) are administrative creators, not verified attendees or closers. Conflating them with sales reps creates misleading attribution.
  3. *Zero CRM Opportunity Table*: No authoritative deal value or win/loss CRM table was supplied. Inventing pipeline currency or win rates is mathematically fraudulent.
- **Accepted Trade-off**: Forwent a flashy, superficial leaderboard chart to protect managerial integrity and data honesty.
- **Resulting Choice**: Replaced with an objective **Activity & Coverage Breakdown by Representative / Organiser** with explicit tooltips explaining sample boundaries.

---

## 11. Known Limitations & Unfinished Work

1. **Single Calendar Date**: All 44 interactions occurred on 21 August 2026 (Asia/Kolkata). Longitudinal time-series trends (week-over-week or month-over-month) cannot be derived from this extract.
2. **Missing CRM Pipeline Metadata**: Currency amounts mentioned in conversations (e.g. INR 10–13 lakh in M03, EUR 2,600 in M02) represent conversational statements, not authoritative CRM opportunity values.
3. **Attendee Directory Absence**: In calendar meetings, speaker labels are localized (e.g., "Team member A", "Customer A"). Cross-meeting speaker continuity cannot be verified without a company staff directory.
4. **Telephony Timing**: Phone call texts lack turn timecodes. Passages are cited verbatim rather than by time offset.

---

## 12. Approximate Time Spent

- **Total Time**: Approximately **7 hours** (well within the 6–8 hour assignment expectation).
  - *Data Contract & Schema Analysis*: 1.0 hour
  - *Differentiated Analytical Extraction & Evidence Sourcing*: 2.0 hours
  - *Application Architecture & UI Development (Vanilla CSS/JS)*: 2.0 hours
  - *Replay Engine, Export Generator & PPTX Generation*: 1.0 hour
  - *Testing, Verification & Quality Control*: 1.0 hour

---

## 13. Deliverables Checklist & Locations

- [x] **Working Application**: `app/index.html` (and root `index.html`).
- [x] **Editable Source Code**: `app/app.js`, `app/data_store.js`, `app/style.css`, `app/analyses_data.js`.
- [x] **Generated Export Files**: `exports/routes/` (66 markdown files) and `exports/manifest.json`.
- [x] **Manager Brief**: `exports/manager-brief-2026-08-21.md` (and in UI tab).
- [x] **Five-Slide Presentation**: `slides/Signal_Desk_Revenue_Intelligence.pptx` (and `slides/presentation_transcript.md`).
- [x] **3-Minute Narration Script**: `scripts/narration_script_3min.md`.
- [x] **Automated Test Suite**: `scripts/run_automated_tests.js` (26 automated assertions passing).
- [x] **Submission Package Archive**: `Signal_Desk_Submission.zip`.
