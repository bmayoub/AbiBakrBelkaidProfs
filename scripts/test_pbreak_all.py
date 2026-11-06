import json, re

with open('scripts/raw_pdf_text.json', 'r', encoding='utf-8') as f:
    pdf_data = json.load(f)

for st in ['2as_se', '2as_lph', '1as_tc_st', '1as_tc_l']:
    print(f"=== {st} ===")
    for p in pdf_data[st][2:]:
        txt = p['text']
        u_match = re.search(r'الوحدة\s*(رقم)?\s*\d+\s*:[^\n]+', txt)
        u_str = u_match.group(0) if u_match else 'continuation'
        print(f"  P{p['page']}: {u_str[:50]}")

