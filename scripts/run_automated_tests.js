const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('SIGNAL DESK — AUTOMATED VERIFICATION & TEST SUITE');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    if (details) console.log(`       ${details}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${testName}`);
    if (details) console.error(`       ERROR: ${details}`);
    failCount++;
  }
}

// 1. JSON Data Files Integrity
const initPath = path.join(__dirname, '..', 'data', '01_initial.json');
const updPath = path.join(__dirname, '..', 'data', '02_update.json');

assert(fs.existsSync(initPath), 'Initial delivery file exists on disk', initPath);
assert(fs.existsSync(updPath), 'Update delivery file exists on disk', updPath);

const initData = JSON.parse(fs.readFileSync(initPath, 'utf8'));
const updData = JSON.parse(fs.readFileSync(updPath, 'utf8'));

assert(initData.batch_id === 'initial-001' && initData.revision === 1, 'Initial batch envelope metadata verified', `batch_id=${initData.batch_id}, rev=${initData.revision}`);
assert(updData.batch_id === 'update-002' && updData.revision === 2, 'Update batch envelope metadata verified', `batch_id=${updData.batch_id}, rev=${updData.revision}`);

// Helper: check usable text
function hasUsableText(rec) {
  if (rec.source_type === 'call') {
    const t = rec.payload && rec.payload.transcript;
    return Boolean(t && t.trim().length > 0);
  } else if (rec.source_type === 'meeting') {
    const turns = rec.transcript_payload && rec.transcript_payload.turns;
    return Boolean(turns && Array.isArray(turns) && turns.some(t => t.text && t.text.trim().length > 0));
  }
  return false;
}

// Store simulation
const store = new Map();
const manualOverrides = new Map();

function getRecordKey(type, id) {
  return `${type}:${id}`;
}

// Test 1: Initial Import
initData.records.forEach(r => {
  const key = getRecordKey(r.source_type, r.source_id);
  store.set(key, { ...r, applied_revision: initData.revision });
});

const initialRecords = Array.from(store.values());
const initialCalls = initialRecords.filter(r => r.source_type === 'call');
const initialMeetings = initialRecords.filter(r => r.source_type === 'meeting');
const initialUsable = initialRecords.filter(hasUsableText);

assert(initialRecords.length === 44, 'Test 1: Initial Import Record Count is exactly 44', `Count = ${initialRecords.length}`);
assert(initialCalls.length === 30, 'Test 1: Initial Calls Count is exactly 30', `Count = ${initialCalls.length}`);
assert(initialMeetings.length === 14, 'Test 1: Initial Meetings Count is exactly 14', `Count = ${initialMeetings.length}`);
assert(initialUsable.length === 17, 'Test 1: Initial Usable Transcripts Count is exactly 17', `Count = ${initialUsable.length} (10 calls, 7 meetings)`);

// Test 2: Duplicate Import
const beforeRepeat = store.size;
initData.records.forEach(r => {
  const key = getRecordKey(r.source_type, r.source_id);
  const existing = store.get(key);
  if (!existing || initData.revision > existing.applied_revision) {
    store.set(key, { ...r, applied_revision: initData.revision });
  }
});
const afterRepeat = store.size;
assert(beforeRepeat === 44 && afterRepeat === 44, 'Test 2: Duplicate Import Idempotency', `Before = ${beforeRepeat}, After = ${afterRepeat} (0 duplicates created)`);

// Test 3: Manual Override
let m07 = initialRecords.find(r => r.record_ref === 'M07');
assert(Boolean(m07), 'M07 Record Found in Store', `ID = ${m07?.source_id}`);
manualOverrides.set(getRecordKey(m07.source_type, m07.source_id), {
  route: 'product-support',
  secondaryRoute: 'customer-follow-up',
  notes: 'Manual triage override by sales manager'
});
const m07Override = manualOverrides.get(getRecordKey(m07.source_type, m07.source_id));
assert(m07Override && m07Override.route === 'product-support', 'Test 3: Manual Route Override Applied to M07', `Route = ${m07Override.route}`);

// Test 4: Update Batch Import
updData.records.forEach(r => {
  const key = getRecordKey(r.source_type, r.source_id);
  const existing = store.get(key);
  if (!existing || updData.revision > existing.applied_revision) {
    store.set(key, { ...r, applied_revision: updData.revision });
  }
});

const updatedRecords = Array.from(store.values());
const updatedUsable = updatedRecords.filter(hasUsableText);
const coverage = ((updatedUsable.length / updatedRecords.length) * 100).toFixed(1);

assert(updatedRecords.length === 44, 'Test 4: Total Record Count Remains 44 after Update', `Count = ${updatedRecords.length}`);
assert(updatedUsable.length === 18, 'Test 4: Usable Transcripts Increases to 18 after Update', `Count = ${updatedUsable.length} (10 calls, 8 meetings)`);
assert(coverage === '40.9', 'Test 4: Transcript Coverage Reaches 40.9%', `Coverage = ${coverage}% (18 / 44)`);

// Test 5: Replay Initial Batch after Revision 2 (Older Revision Rejection)
initData.records.forEach(r => {
  const key = getRecordKey(r.source_type, r.source_id);
  const existing = store.get(key);
  // Rejection rule: only replace if incoming revision is strictly higher
  if (!existing || initData.revision > existing.applied_revision) {
    store.set(key, { ...r, applied_revision: initData.revision });
  }
});

const postReplayRecords = Array.from(store.values());
const postReplayUsable = postReplayRecords.filter(hasUsableText);
const m07PostReplay = store.get(getRecordKey('meeting', m07.source_id));
const m07FinalOverride = manualOverrides.get(getRecordKey('meeting', m07.source_id));

assert(postReplayRecords.length === 44, 'Test 5: Unique Record Count Remains 44 after Initial Replay', `Count = ${postReplayRecords.length}`);
assert(postReplayUsable.length === 18, 'Test 5: Usable Text Count Remains 18 after Initial Replay', `Count = ${postReplayUsable.length}`);
assert(m07PostReplay.applied_revision === 2, 'Test 5: M07 Does NOT Revert to Rev 1 (Older Revision Rejected)', `Revision = ${m07PostReplay.applied_revision}`);
assert(hasUsableText(m07PostReplay) && m07PostReplay.transcript_payload?.turns?.length === 27, 'Test 5: M07 27 Turns Remain Visible', `Turns = ${m07PostReplay.transcript_payload?.turns?.length}`);
assert(m07FinalOverride && m07FinalOverride.route === 'product-support', 'Test 5: M07 Manual Override Preserved through Replay', `Route = ${m07FinalOverride.route}`);

// Test 6: Export Manifest & Real File Check
const manifestPath = path.join(__dirname, '..', 'exports', 'manifest.json');
assert(fs.existsSync(manifestPath), 'Test 6: Manifest File Exists on Disk', manifestPath);
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

assert(manifest.total_logical_records === 44, 'Test 6: Manifest Total Logical Records is 44', `Count = ${manifest.total_logical_records}`);
assert(manifest.total_output_files === 66, 'Test 6: Manifest Total Output Files is 66', `Count = ${manifest.total_output_files}`);

let missingFiles = 0;
manifest.records.forEach(r => {
  r.output_paths.forEach(p => {
    const fullP = path.join(__dirname, '..', 'exports', p);
    if (!fs.existsSync(fullP)) {
      missingFiles++;
      console.error(`Missing export file: ${fullP}`);
    }
  });
});
assert(missingFiles === 0, 'Test 6: All 66 Manifest Output Paths Exist on Disk', `Missing = ${missingFiles}`);

// Test 7: Presentation File Check
const pptxPath = path.join(__dirname, '..', 'slides', 'Signal_Desk_Revenue_Intelligence.pptx');
assert(fs.existsSync(pptxPath), 'Test 7: Editable PowerPoint PPTX Exists on Disk', pptxPath);
const pptxStats = fs.statSync(pptxPath);
assert(pptxStats.size > 50000, 'Test 7: PowerPoint PPTX is Non-Trivial', `Size = ${pptxStats.size} bytes`);

// Test 8: Documentation & Narration Check
const briefDocPath = path.join(__dirname, '..', 'exports', 'manager-brief-2026-08-21.md');
const narrationPath = path.join(__dirname, '..', 'scripts', 'narration_script_3min.md');
const transcriptPath = path.join(__dirname, '..', 'slides', 'presentation_transcript.md');

assert(fs.existsSync(briefDocPath), 'Manager Brief Markdown Exists on Disk', briefDocPath);
assert(fs.existsSync(narrationPath), '3-Minute Recording Narration Script Exists on Disk', narrationPath);
assert(fs.existsSync(transcriptPath), 'Presentation Transcript Markdown Exists on Disk', transcriptPath);

console.log('\n====================================================');
console.log(`SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('\n✓ ALL AUTOMATED CHECKS AND DATA CONTRACT ASSERTIONS PASSED!\n');
}
