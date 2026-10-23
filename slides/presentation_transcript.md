# Signal Desk — Revenue Intelligence Inbox
## Five-Slide Presentation Transcript & Slide Notes
**File**: `slides/Signal_Desk_Revenue_Intelligence.pptx` (Editable 16:9 PowerPoint Presentation)  
**Author**: Revenue Intelligence Desk (Antigravity Senior Analyst)  
**Date**: 23 October 2026  

---

### Slide 1: Manager Problem & Core Findings
- **Header**: Phase 1 & Phase 5 | Executive Overview
- **Title**: Revenue Intelligence Inbox: Manager Problem & Core Findings
- **Visual Structure**: 2-column card layout with Slate 900 background, Sky Blue card accents, and high-contrast typography.
- **Content**:
  - **The Manager Problem**:
    - Disconnected customer telemetry across telephony, calendar bots, and CRMs.
    - Asymmetric ingestion: 44 records arrived on 21 Aug 2026 (30 calls, 14 meetings). Initially only 17 had transcripts; an update supplied the 18th (M07). Managers cannot afford manual triage or ungrounded AI hallucinations.
    - Verified baseline counts: 44 unique records, 18 usable transcripts (40.9% coverage), 26 records preserved as intake/review.
  - **Three Verifiable Findings from Source Data**:
    1. **UI/Modal Data Corruption Risk (M07 — Willowfield Trust)**:
       - *Evidence (Turn 22)*: "The amount from the previous item appears in the next one. Each time I have to cancel, leave it and open Mark as paid again before it shows the right information."
       - *Impact*: Sticky modal caching in the payments flow leaks previous monetary amounts into subsequent payments, risking live financial errors.
       - *Product Choice*: Routed to `Product / Support` with high-urgency escalation banner.
    2. **Contact Boundaries & Rep Identity Mismatch (C09 & C06)**:
       - *Evidence*: In C09, prospect Vedant forbids using his name ("No, please don't use my name"). In C06, the telephony account is logged under Meera, but the spoken caller announces "Ravi here."
       - *Impact*: Sales reps must respect strict opt-out boundaries; managers cannot trust login IDs blindly.
       - *Product Choice*: Added "Boundary Alert" badge; routed C09 to `Sales Coaching`.
    3. **Commercial Prepaid vs Credit Misalignment (M03 & M04)**:
       - *Evidence*: In M03 (Turn 6), Asterloom is surprised domestic cards are prepaid ("Wait, these are prepaid? I had thought about a corporate credit card") and questions unexpected setup fees (INR 26k vs 39k). In M04 (Turn 11), Cedarwave resists prepaid because they hold an INR 1.3 crore bank credit line.
       - *Impact*: Prepaid limits cause enterprise sales friction.
       - *Product Choice*: Flagged transparent fee breakdown requirement in `Deal Next Steps`.

---

### Slide 2: Interface Architecture: Evidence First & Deliberate Omissions
- **Header**: Phase 2 | Product Design & Philosophy
- **Title**: Interface Architecture: Evidence First & Deliberate Omissions
- **Visual Structure**: 3 vertical cards (Dashboard, Inbox, Inspector) + Bottom Deliberate Omissions Banner.
- **Content**:
  - **1. Overview Dashboard**:
    - 8 dynamic KPI cards computed from imported data (44 unique records, 30 calls, 14 meetings, 18 usable transcripts, 40.9% coverage, review states, manual overrides).
    - Transparent denominators for every single metric.
    - Independent filters for Call Representatives vs Meeting Organisers.
  - **2. Filterable Inbox**:
    - Complete intake visibility: all 44 records listed. Missing text records are marked "Metadata Only" rather than discarded.
    - Real-time search and multi-filters by source type, person, route, review status, and revision.
    - Clear visual badges for Automated Suggestion vs Manual Override.
  - **3. Conversation Inspector**:
    - Dual-pane layout: full readable transcript with turn bubbles on left; structured evidence brief on right.
    - Direct quotation links to verifiable passages.
    - Instant manual route correction with persistent local storage.
  - **Deliberate Omissions (What We Left Out & Why)**:
    - *No Fabricated Pipeline Totals*: No CRM deal table exists; inventing pipeline currency is mathematically fraudulent.
    - *No Rep Win-Rate Leaderboards*: Unequal sampling (Arun 15 calls vs Kiran 1) makes ranking statistically invalid.
    - *Zero Ghost Summaries*: Records with no transcripts show raw intake metadata without fabricated conversation summaries.

---

### Slide 3: Routing Taxonomy, Real Exports & Multi-Destination Handling
- **Header**: Phase 3 & Phase 4 | Information Architecture
- **Title**: Routing Taxonomy, Real Exports & Multi-Destination Handling
- **Visual Structure**: 2-column layout (Taxonomy breakdown on left; Difficult Case on right).
- **Content**:
  - **Routing Taxonomy & Real Exports**:
    - `sales-coaching` (C01, C06, C09): Cold call compliance, boundary respect, pricing transparency.
    - `deal-next-steps` (C08, M03, M06): Commercial proposals, partner follow-ups, internal referrals.
    - `customer-follow-up` (C03, C05, C10, M04): Agreed callbacks, nurture sequences.
    - `product-support` (M07, M09, M04): Customer bug triages, auth token failures, migration issues.
    - `partner-vendor` (C07, M01, M02): Bank/e-invoicing integrations, affiliate partnerships.
    - `internal-operations` (M10, M11): Billing walkthroughs, team dunning rules.
    - `human-review` (M08, M12, M14): Unrecorded demos requiring organizer check.
    - `metadata-only` (B01-B20, C02, M05): Telephony intake, voicemails.
  - **Difficult Routing Case: M04 (Cedarwave Distribution)**:
    - *The Challenge*: M04 serves two distinct, non-overlapping business functions that cannot fit into a single bucket.
    - *Commercial Retention*: Cedarwave is pushing back on forced prepaid card migration because they hold an INR 1.3 crore bank credit facility.
    - *Product Bug*: In the same meeting (Turn 30-31), Customer A reports an unresolved UI bug preventing moving users between departments.
    - *The Solution*: Multi-destination export! Primary route is `Customer Follow-Up` (retention); secondary route is `Product / Support` (bug ticket).
    - *Manifest Integrity*: Manifest exports two distinct files, generating 66 total export files across 44 records without data loss.

---

### Slide 4: Validation: Numerical Grounding, Passage Tracing & Replay Proof
- **Header**: Phase 8 | Verification & Testing
- **Title**: Validation: Numerical Grounding, Passage Tracing & Replay Proof
- **Visual Structure**: Left column (Numerical & passage validation); Right column (Automated replay test results table).
- **Content**:
  - **Rigorous Numerical & Analytical Tracing**:
    - *Transcript Coverage Calculation*: 10 calls have text; 7 meetings in initial have text (Total = 17). Update delivery adds M07 with 27 turns (Total = 18). Denominator = 44 logical records. Coverage = 18 / 44 = 40.909%.
    - *Passage Tracing*: Every analytical conclusion links to exact source turns (e.g. M03 Turn 23 for pricing confusion, M07 Turn 22 for modal bug, C09 for name boundary).
  - **Automated Replay & Contract Test Suite**:
    | Test Step | Action & Input | Observed Result | Status |
    |---|---|---|---|
    | 1. Initial Import | Load `01_initial.json` | 44 records, 17 usable texts, 27 missing | **PASS** |
    | 2. Repeat Import | Re-import same batch | 44 records (0 duplicates created) | **PASS** |
    | 3. Manual Route | Override M07 to Support | Manual tag saved in state | **PASS** |
    | 4. Update Import | Load `02_update.json` (Rev 2) | 44 records, 18 texts, 40.9% coverage | **PASS** |
    | 5. Preserve Route | Inspect M07 post-update | Manual route remains intact; text updated | **PASS** |
    | 6. Persistence | Browser refresh / restart | Overrides & updated state persist | **PASS** |

---

### Slide 5: Trade-offs, AI Governance, Limitations & Roadmap
- **Header**: Phase 5 & Submission | Engineering Integrity
- **Title**: Trade-offs, AI Governance, Limitations & Roadmap
- **Visual Structure**: 2-column layout (Rejected decision on left; AI governance & roadmap on right).
- **Content**:
  - **Rejected Decision: Sales Representative Performance Leaderboard**:
    - *The Alternative*: Building a gamified rep leaderboard ranking staff by calls placed or connect rates.
    - *Why Rejected*: The dataset is an asymmetric 44-record sample (Arun 15 calls, Kiran 1). Ranking reps across 44 selected interactions produces statistically invalid conclusions. Calendar organisers are administrative creators, not verified attendees.
    - *Accepted Trade-off*: Forwent a flashy chart to protect managerial integrity. Built an objective Activity & Coverage Breakdown with explicit sampling caveats.
  - **AI Governance, Known Limitations & Roadmap**:
    - *Pre-Generated vs Dynamic Logic*: Evidence extraction of 18 conversations was pre-generated to guarantee 100% deterministic accuracy without paid API latency or key leakage. The application dynamically computes all dashboard KPIs, filters, deduplication, revision merges, manual route overrides, and export manifests in the browser.
    - *Known Limitations*: Single local date (2026-08-21); no longitudinal trend analysis possible.
    - *Future Roadmap*: Webhook ingestion for live telephony connectors; local ONNX/WebLLM inference for zero-network live transcripts; bi-directional CRM sync.
