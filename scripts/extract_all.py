import os
import re
import json
import pypdf

PDF_CONFIGS = [
    {
        'file': '3-01-A - آلية تنفيد التدرجات السنوية.PDF',
        'streams': ['3as_se'],
        'level': '3as'
    },
    {
        'file': '3-02-A - آلية تنفيد التدرجات السنوية.PDF',
        'streams': ['3as_m', '3as_tm'],
        'level': '3as'
    },
    {
        'file': '2-01-A - آلية تنفيد التدرجات السنوية.PDF',
        'streams': ['2as_se'],
        'level': '2as'
    },
    {
        'file': '2-02-A - آلية تنفيد التدرجات السنوية.PDF',
        'streams': ['2as_m', '2as_tm'],
        'level': '2as'
    },
    {
        'file': '2-03-A - آلية تنفيد التدرجات السنوية.PDF',
        'streams': ['2as_lph'],
        'level': '2as'
    },
    {
        'file': '1-01-A - آلية تنفيد التدرجات السنوية.PDF',
        'streams': ['1as_tc_st'],
        'level': '1as'
    },
    {
        'file': '1-02-A - آلية تنفيد التدرجات السنوية.PDF',
        'streams': ['1as_tc_l'],
        'level': '1as'
    }
]

def clean_arabic(text):
    text = re.sub(r'[\u200e\u200f\u202a-\u202e]', '', text)
    # Fix letter breaking if any
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def get_vlines(page):
    stream = page.get_contents()
    if isinstance(stream, list):
        data = ''.join(s.get_data().decode('latin1', errors='ignore') for s in stream)
    else:
        data = stream.get_data().decode('latin1', errors='ignore')
    tokens = data.split()
    v_lines = []
    for i in range(len(tokens)):
        if tokens[i] == 're' and i >= 4:
            try:
                x = float(tokens[i-4])
                w = float(tokens[i-2])
                h = float(tokens[i-1])
                if w < 2.5 and h > 35:
                    v_lines.append(x)
            except: pass
        elif tokens[i] == 'l' and i >= 3 and tokens[i-3] == 'm':
            try:
                x1 = float(tokens[i-5])
                x2 = float(tokens[i-2])
                y1 = float(tokens[i-4])
                y2 = float(tokens[i-1])
                if abs(x1 - x2) < 2.5 and abs(y1 - y2) > 35:
                    v_lines.append(x1)
            except: pass
    return sorted(set(round(x, 1) for x in v_lines))

def get_page_chunks(page):
    chunks = []
    def visitor(text, cm, tm, font_dict, font_size):
        t = text.strip()
        if t:
            chunks.append({'text': t, 'x': tm[4], 'y': tm[5], 'fs': font_size})
    page.extract_text(visitor_text=visitor)
    return chunks

def classify_type(text):
    t_lower = text.lower()
    if any(k in t_lower for k in ['عمل مخبري', 'مخبر', 'تجربة', 'محاكاة', 'ع م', 'ع.م', 'معايرة لونية', 'الناقلية', 'شحن وتفريغ', 'قياس ph', 'قياس الناقلية']):
        return 'عمل مخبري'
    elif any(k in t_lower for k in ['أعمال موجهة', 'تمارين', 'تمرين', 'حل مسائل', 'مسائل', 'أ.م', 'أ م']):
        return 'أعمال موجهة'
    else:
        return 'درس نظري'

def extract_units_and_items(pdf_path):
    reader = pypdf.PdfReader(pdf_path)
    total_pages = len(reader.pages)
    
    # 1. First pass: find all unit header locations
    # (page_idx, y, title, unit_number)
    unit_headers = []
    
    for p_idx in range(2, total_pages):
        page = reader.pages[p_idx]
        chunks = get_page_chunks(page)
        
        # Check for unit header
        u_chunks = [c for c in chunks if 'الوحدة' in c['text']]
        for uc in u_chunks:
            y = uc['y']
            row = [c for c in chunks if abs(c['y'] - y) < 8]
            row.sort(key=lambda c: -c['x'])
            line = ' '.join(c['text'] for c in row)
            line_cl = clean_arabic(line)
            
            # Must contain a unit number or identifier and not be a passing reference
            if any(k in line_cl for k in ['الوحدة رقم', 'الوحدة 1', 'الوحدة 2', 'الوحدة 3', 'الوحدة 4', 'الوحدة 5', 'الوحدة 6', 'الوحدة 7', 'الوحدة 8', 'الوحدة 9', 'الوحدة 10', 'الوحدة الأولى', 'الوحدة الثانية', 'الوحدة الثالثة']):
                if not any(bad in line_cl for k in ['تقويم الوحدة', 'في الوحدة', 'تناول جزء'] for bad in [k]):
                    # Check if already added
                    if not any(uh['p_idx'] == p_idx and abs(uh['y'] - y) < 15 for uh in unit_headers):
                        unit_headers.append({
                            'p_idx': p_idx,
                            'y': y,
                            'title': line_cl
                        })

    # Sort headers chronologically
    unit_headers.sort(key=lambda u: (u['p_idx'], -u['y']))
    
    print(f"\n=======================================================")
    print(f"FILE: {pdf_path}")
    print(f"Detected {len(unit_headers)} unit headers:")
    for idx, uh in enumerate(unit_headers):
        print(f"  Unit {idx+1}: P{uh['p_idx']} y={uh['y']:.1f} -> {uh['title']}")
        
    # 2. Extract column items for each unit
    # Default column boundaries across Algerian ministerial documents
    units_result = []
    
    for idx, uh in enumerate(unit_headers):
        start_p = uh['p_idx']
        start_y = uh['y']
        
        # End is the start of next unit, or end of PDF
        if idx + 1 < len(unit_headers):
            end_p = unit_headers[idx + 1]['p_idx']
            end_y = unit_headers[idx + 1]['y']
        else:
            end_p = total_pages - 1
            end_y = 40.0
            
        unit_num = idx + 1
        
        # Collect lines across pages from start_p to end_p
        raw_lines = []
        
        # Determine column boundaries for this unit
        # Find page where table header exists
        curr_bounds = None
        for p in range(start_p, min(start_p + 2, total_pages)):
            page = reader.pages[p]
            chunks = get_page_chunks(page)
            s_hdr = [c for c in chunks if 'السير المنهجي' in c['text']]
            v_lines = get_vlines(page)
            if s_hdr and len(v_lines) >= 6:
                x_h = s_hdr[0]['x']
                lefts = [v for v in v_lines if v < x_h - 10]
                rights = [v for v in v_lines if v > x_h + 10]
                if lefts and rights:
                    curr_bounds = (max(lefts), min(rights))
                    break
        
        # Fallback bounds if not found dynamically
        if not curr_bounds:
            curr_bounds = (250.0, 480.0)
            
        # Now extract text in column for all pages of this unit
        for p in range(start_p, end_p + 1):
            page = reader.pages[p]
            chunks = get_page_chunks(page)
            v_lines = get_vlines(page)
            
            # Check if new table header on this page
            s_hdr = [c for c in chunks if 'السير المنهجي' in c['text']]
            if s_hdr and len(v_lines) >= 6:
                x_h = s_hdr[0]['x']
                lefts = [v for v in v_lines if v < x_h - 10]
                rights = [v for v in v_lines if v > x_h + 10]
                if lefts and rights:
                    curr_bounds = (max(lefts), min(rights))
                    
            # Determine y limits for this page
            y_top = 560.0
            y_bot = 60.0
            
            if p == start_p:
                # If header exists below unit title, start below table header
                if s_hdr and s_hdr[0]['y'] < start_y:
                    y_top = s_hdr[0]['y'] - 5
                else:
                    y_top = start_y - 25
            elif s_hdr:
                y_top = s_hdr[0]['y'] - 5
                
            if p == end_p:
                y_bot = end_y + 10
                
            # Filter chunks in column
            col_chunks = [c for c in chunks if curr_bounds[0] + 2 <= c['x'] <= curr_bounds[1] - 2 and y_bot <= c['y'] <= y_top]
            
            # Group by line
            col_chunks.sort(key=lambda c: -c['y'])
            cur_y = None
            cur_p = []
            for c in col_chunks:
                if cur_y is None or abs(c['y'] - cur_y) < 4:
                    cur_p.append(c)
                    cur_y = c['y']
                else:
                    cur_p.sort(key=lambda x: -x['x'])
                    raw_lines.append(' '.join(p['text'] for p in cur_p))
                    cur_p = [c]
                    cur_y = c['y']
            if cur_p:
                cur_p.sort(key=lambda x: -x['x'])
                raw_lines.append(' '.join(p['text'] for p in cur_p))

        # 3. Process raw lines into discrete bullet items
        items = []
        current_item = []
        
        bullet_symbols = ['-', '', '•', '*', '', '—', '–', '+']
        
        for line in raw_lines:
            line_cl = clean_arabic(line)
            if not line_cl:
                continue
            # Filter out table header or ministry header repetitions
            if any(hdr in line_cl for hdr in ['السير المنهجي لتدرج التعلمات', 'وزارة التربية الوطنية', 'التدرجات السنوية']):
                continue
            if line_cl.startswith('الوحدة رقم'):
                continue
                
            # Check if line starts with a bullet or strong action phrase
            is_new_bullet = False
            first_word = line_cl.split()[0] if line_cl.split() else ''
            
            if any(line_cl.startswith(b) for b in bullet_symbols):
                is_new_bullet = True
            elif first_word in ['نشاط', 'عمل', 'أعمال', 'دراسة', 'التعرف', 'المعادلة', 'السقوط', 'حركة', 'تفسير', 'مفهوم', 'تطبيق', 'استغلال', 'متابعة', 'تحديد', 'إبراز', 'استنتاج', 'حساب', 'مقاربة', 'تقويم']:
                # If there's an existing item, start a new one
                is_new_bullet = True
                
            if is_new_bullet:
                if current_item:
                    full_text = clean_arabic(' '.join(current_item))
                    # Strip leading bullet chars
                    full_text = re.sub(r'^[\s\-•\*—–\+]+', '', full_text).strip()
                    if full_text and len(full_text) > 3 and full_text not in ['تقويم', 'تقويم مرحلي']:
                        items.append(full_text)
                    current_item = []
                current_item.append(line_cl)
            else:
                if current_item:
                    current_item.append(line_cl)
                else:
                    current_item.append(line_cl)
                    
        if current_item:
            full_text = clean_arabic(' '.join(current_item))
            full_text = re.sub(r'^[\s\-•\*—–\+]+', '', full_text).strip()
            if full_text and len(full_text) > 3 and full_text not in ['تقويم', 'تقويم مرحلي']:
                items.append(full_text)
                
        # Clean unit title
        raw_u_title = uh['title']
        raw_u_title = re.sub(r'^.*?الوحدة\s*(رقم)?\s*\d*\s*[\:\(]?', '', raw_u_title)
        raw_u_title = re.sub(r'\(\s*\d+.*?\)', '', raw_u_title)
        raw_u_title = re.sub(r'\d+\s*\+\s*سا.*$', '', raw_u_title)
        raw_u_title = re.sub(r'[\(\)\:\.\+]', '', raw_u_title).strip()
        if not raw_u_title:
            raw_u_title = f"الوحدة {unit_num}"
        formatted_title = f"{unit_num:02d}: {raw_u_title}"
        
        units_result.append({
            'num': unit_num,
            'title': formatted_title,
            'items': items
        })
        
        print(f"  -> Extracted {len(items)} items for Unit {unit_num} ({formatted_title})")
        for it in items[:3]:
            print(f"       * {it[:70]}")
            
    return units_result

if __name__ == '__main__':
    all_data = {}
    for cfg in PDF_CONFIGS:
        u_res = extract_units_and_items(cfg['file'])
        all_data[cfg['file']] = u_res
        
    with open('extracted_syllabus_preview.json', 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    print("\nSaved extracted preview to extracted_syllabus_preview.json")

