import json, re

with open('scripts/raw_pdf_text.json', 'r', encoding='utf-8') as f:
    pdf_data = json.load(f)

def clean(t):
    return (t.replace('الماةة', 'المادة').replace('ةراسة', 'دراسة')
            .replace('ةفع', 'دفع').replace('المتباةلة', 'المتبادلة')
            .replace('ةورانية', 'دورانية').replace('أفراة', 'أفراد')
            .replace('نضف', 'نصف').replace('الحقلالمغناطيس', 'الحقل المغناطيس')
            .replace('الطاقةالداخلية', 'الطاقة الداخلية').strip())

# For 3as_se, let's see how each page breaks down
for p in pdf_data['3as_se'][2:]:
    txt = clean(p['text'])
    first_line = txt.split('\n')[0] if txt else ''
    u_match = re.search(r'الوحدة\s*(رقم)?\s*\d+\s*:[^\n]+', txt)
    u_str = u_match.group(0) if u_match else 'continuation'
    print(f"Page {p['page']}: {u_str[:50]}")

