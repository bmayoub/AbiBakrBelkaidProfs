import json, re

with open('scripts/raw_pdf_text.json', 'r', encoding='utf-8') as f:
    pdf_data = json.load(f)

for p in pdf_data['3as_tm_m'][2:]:
    txt = p['text']
    u_match = re.search(r'الوحدة\s*(رقم)?\s*\d+\s*:[^\n]+', txt)
    u_str = u_match.group(0) if u_match else 'continuation'
    print(f"Page {p['page']}: {u_str[:50]}")

