import json

with open('data/01_initial.json', 'r', encoding='utf-8') as f:
    init = json.load(f)

with open('data/02_update.json', 'r', encoding='utf-8') as f:
    upd = json.load(f)

all_recs = {r['source_id']: r for r in init['records']}
for r in upd['records']:
    all_recs[r['source_id']] = r

usable_refs = ['C01','C02','C03','C04','C05','C06','C07','C08','C09','C10','M01','M02','M03','M04','M06','M07','M09','M10']
print(f"Total records in all_recs: {len(all_recs)}")

for ref in usable_refs:
    r = next(rec for rec in all_recs.values() if rec.get('record_ref') == ref)
    st = r['source_type']
    p = r['payload']
    sid = r['source_id']
    if st == 'call':
        txt = p.get('transcript', '')
        rep = p.get('rep_name')
        to_num = p.get('to_number')
        dur = p.get('duration_seconds')
        print(f"{ref} | Call | Rep: {rep:8} | To: {to_num:10} | Dur: {dur}s | Chars: {len(txt)} | ID: {sid}")
    else:
        tp = r.get('transcript_payload') or {}
        turns = tp.get('turns', [])
        title = p.get('title', '')
        org = p.get('organizer_email', '')
        dur = p.get('duration_seconds')
        print(f"{ref} | Mtg  | Org: {org:20} | Title: {title[:28]:28} | Turns: {len(turns):2} | ID: {sid}")
