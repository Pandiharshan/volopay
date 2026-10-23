# Signal Desk — Revenue Intelligence Inbox
## 3-Minute Continuous Screen Recording: Spoken Narration Script
**Recording Target Duration**: Exactly 3 minutes (180 seconds)  
**Spoken Word Count**: 415 words (paced at ~138 words per minute)  
**Required Demo Flow**: Manager Workflow -> Metric Explanation -> Difficult Routing Decision -> Duplicate/Update Replay -> Preserved Override  

---

### [0:00 – 0:45] Section 1: Manager Workflow & Metric Explanation
**On-Screen Action**:
- Open Signal Desk application in browser (`index.html`).
- Show the Overview Dashboard. Point cursor to the KPI cards: Total Records (44), Calls (30), Meetings (14), Usable Transcripts (17/18), and Transcript Coverage (40.9%).
- Click the "Calls vs Meetings" filter toggle, then filter by rep "Meera". Watch metrics update in real-time.

**Spoken Narration**:
> *"Welcome to Signal Desk, the Revenue Intelligence Inbox built for sales managers. 
> 
> Right on our Overview Dashboard, we immediately see forty-four unique logical interactions from August twenty-first, comprising thirty calls and fourteen meetings. 
> 
> Let's look closely at our core coverage metric: Transcript Coverage is currently eighteen out of forty-four, or forty point nine percent. The denominator here is critical: it includes all forty-four logical records, because twenty-six interactions arrived without text—such as unrecorded voicemails or calendar entries. We deliberately keep these visible in the inbox as intake records rather than discarding them, because a missing transcript is never evidence that a conversation didn't happen. 
> 
> When I filter by representative, like Meera here, the entire dashboard updates dynamically, showing her calls, routing distribution, and review actions."*

---

### [0:45 – 1:30] Section 2: Difficult Routing Decision (M04 Cedarwave Distribution)
**On-Screen Action**:
- Navigate to the **Conversation Inbox** tab.
- Search for "M04" or "Cedarwave". Click on M04 to open the **Conversation Inspector**.
- Scroll through the transcript on the left pane, pointing to Turn 11 (prepaid vs credit) and Turn 30 (department bug).
- Point to the right-hand analytical brief showing the Primary Route (`Customer Follow-Up`) and Secondary Route (`Product / Support`).

**Spoken Narration**:
> *"Now let's examine a difficult routing decision: Cedarwave Distribution, record M-zero-four.
> 
> Real business conversations rarely fit into a single neat bucket. In this call, Cedarwave is pushing back on our forced card migration because they already have a one point three crore rupee bank credit line and don't want prepaid cards. That requires commercial customer retention follow-up. 
> 
> But in that exact same conversation at Turn thirty, they report an active software bug preventing them from moving users between departments. 
> 
> Rather than forcing a compromise that loses context, Signal Desk supports multi-destination routing. We assign primary routing to Customer Follow-Up for commercial retention, and secondary routing to Product Support for engineering triage. When we export, both teams receive tailored outputs linked back to the exact transcript turns."*

---

### [1:30 – 2:30] Section 3: The Duplicate & Update Replay Test
**On-Screen Action**:
- Navigate to the **Import & Replay Lab** tab.
- Click **"Step 1: Clean Initial Import"** (shows 44 records, 17 usable texts).
- Click **"Step 2: Repeat Import"** (live console shows 44 records maintained, 0 duplicates created).
- Click **"Step 3: Apply Manual Route Override"** on M07 (sets route to `Product / Support` with a distinct yellow "MANUAL OVERRIDE" badge).
- Click **"Step 4: Import Update Batch"** (shows revision 2 applied, usable transcripts increase from 17 to 18, coverage rises to 40.9%).
- Click **"Step 5: Verify Preserved Judgment"** on M07 (shows M07's manual route remains `Product / Support`, new 27-turn transcript is loaded, and status updates to Revision 2).

**Spoken Narration**:
> *"Now let's demonstrate the data contract replay. 
> 
> First, we start from a clean state and import the initial batch: exactly forty-four unique records and seventeen usable transcripts are loaded. 
> 
> Next, I'll repeat that same import in shuffled order. Notice our record count remains exactly forty-four. Telemetry numbers do not inflate because identity is strictly keyed on the pair source-type and source-id. 
> 
> Now, I'll apply a manual routing correction to M-zero-seven, changing it to Product Support. The manual badge is saved immediately. 
> 
> Next, we import the Revision Two update batch. M-zero-seven's late transcript arrives, bringing our usable transcripts from seventeen to eighteen, and coverage reaches forty point nine percent. 
> 
> Crucially, when we inspect M-zero-seven, our manual route override remains completely intact—it was not wiped out by the update—and the fresh twenty-seven turns are now visible."*

---

### [2:30 – 3:00] Section 4: Export Generation & Summary
**On-Screen Action**:
- Navigate to the **Exports & Audit** tab.
- Show the 66 exported markdown files organized across the 8 routing folders.
- Click **"Download Manifest (.json)"** and **"Download All Exports (.zip)"**.
- Show the Manager Brief tab briefly.

**Spoken Narration**:
> *"Finally, we head to the Exports area. 
> 
> Signal Desk generates sixty-six real markdown files across our eight route directories, reflecting all primary and secondary destinations, along with a machine-readable manifest and our August twenty-first Manager Brief. 
> 
> Everything can be downloaded as a verified ZIP or inspected directly. 
> 
> That is Signal Desk: grounded in evidence, contract-compliant, and built for real revenue leaders. Thank you."*
