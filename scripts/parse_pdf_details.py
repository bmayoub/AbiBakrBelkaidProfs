import json, re

with open('scripts/raw_pdf_text.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Normalize common ligature/ocr issues
def normalize_text(text):
    text = text.replace('الماةة', 'المادة').replace('ةراسة', 'دراسة').replace('ةفع', 'دفع')
    text = text.replace('المتباةلة', 'المتبادلة').replace('ةورانية', 'دورانية').replace('أفراة', 'أفراد')
    text = text.replace('مقربة', 'مقربة').replace('الحقلالمغناطيس', 'الحقل المغناطيس')
    text = text.replace('الطاقةالداخلية', 'الطاقة الداخلية').replace('نضف', 'نصف')
    text = text.replace('تطور جملةميكانيكية', 'تطور جملة ميكانيكية')
    return text

for stream_id in ['3as_se', '3as_tm_m', '2as_se', '2as_tm_m', '2as_lph', '1as_tc_st', '1as_tc_l']:
    print(f"\n==================== {stream_id} ====================")
    pages = data.get(stream_id, [])
    full_text = "\n".join([normalize_text(p['text']) for p in pages])
    
    # Let's find each unit and what follows it until next unit
    # Look for patterns like "الوحدة رقم X" or "الوحدة X"
    unit_matches = list(re.finditer(r'(الوحدة\s*(رقم)?\s*\d+\s*[:\-ـ][^\n]+)', full_text))
    print(f"Found {len(unit_matches)} units in {stream_id}:")
    for i, m in enumerate(unit_matches):
        uname = m.group(1).strip()
        start = m.end()
        end = unit_matches[i+1].start() if i + 1 < len(unit_matches) else len(full_text)
        block = full_text[start:end]
        
        # Sample items: lines starting with '-' or '' or bullet points
        items = []
        for line in block.split('\n'):
            line = line.strip()
            if any(line.startswith(b) for b in ['-', '', '•', '*', '+', '']):
                cleaned = re.sub(r'^[-•*+\s]+', '', line).strip()
                if len(cleaned) > 5 and not any(h in cleaned for h in ['التقويم', 'مؤشرات', 'أهداف', 'السندات', 'المدة']):
                    items.append(cleaned)
        print(f"  {uname} -> {len(items)} bullet points found")
        if items:
            print(f"     Example: {items[:3]}")

