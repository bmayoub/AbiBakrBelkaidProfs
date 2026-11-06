import json, re

with open('scripts/raw_pdf_text.json', 'r', encoding='utf-8') as f:
    pdf_data = json.load(f)

def clean(t):
    if not t: return ""
    t = t.replace('الماةة', 'المادة').replace('ةراسة', 'دراسة')
    t = t.replace('ةفع', 'دفع').replace('المتباةلة', 'المتبادلة')
    t = t.replace('ةورانية', 'دورانية').replace('أفراة', 'أفراد')
    t = t.replace('نضف', 'نصف').replace('الحقلالمغناطيس', 'الحقل المغناطيسي')
    t = t.replace('الطاقةالداخلية', 'الطاقة الداخلية')
    t = t.replace('تطور جملةميكانيكية', 'تطور جملة ميكانيكية')
    return t

# Let's inspect extracted items for each unit of 3as_se to make sure they are high quality
def extract_learning_items(text):
    lines = text.split('\n')
    items = []
    
    current_item = []
    for line in lines:
        line_clean = clean(line).strip()
        if not line_clean:
            continue
            
        # Ignore table header titles
        if any(h in line_clean for h in ['التقويم المرحلي', 'مؤشرات الكفاءة', 'أهداف التعلم', 'الوحدات التعلمية', 'الموارد المستهدفة', 'السير المنهجي', 'السندات', 'المدة الزمنية', 'وزارة التربية', 'التدرجات السنوية']):
            continue

        # Check if line starts with bullet
        if re.match(r'^[-•*+\s]+', line_clean):
            if current_item:
                items.append(' '.join(current_item))
                current_item = []
            item_text = re.sub(r'^[-•*+\s]+', '', line_clean).strip()
            if len(item_text) > 4:
                current_item.append(item_text)
        elif current_item:
            # continuation line if short or reasonable
            if len(line_clean) < 80 and not line_clean.startswith('الوحدة'):
                current_item.append(line_clean)
            else:
                items.append(' '.join(current_item))
                current_item = []
                
    if current_item:
        items.append(' '.join(current_item))
        
    # Filter items
    cleaned_items = []
    seen = set()
    for it in items:
        it = re.sub(r'\s+', ' ', it).strip()
        # remove single numbers or very short artifacts
        if len(it) < 5 or it in seen:
            continue
        if any(bad in it for bad in ['أسبوع مغلق', 'عطلة', 'اختبار الفصل', 'البكالوريا التجريبي']):
            continue
        seen.add(it)
        cleaned_items.append(it)
        
    return cleaned_items

# Let's test on 3as_se
pages = pdf_data['3as_se']
print(f"Total pages in 3as_se: {len(pages)}")
items_p3 = extract_learning_items(pages[2]['text'])
print("Page 3 items:")
for i, item in enumerate(items_p3):
    print(f"  {i+1}. {item}")

