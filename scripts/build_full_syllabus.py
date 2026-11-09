import os
import re
import json
import pypdf

PDF_CONFIGS = [
    {
        'file': '3-01-A - آلية تنفيد التدرجات السنوية.PDF',
        'streams': ['3as_se'],
        'level': '3as',
        'desc': '3 علوم تجريبية'
    },
    {
        'file': '3-02-A - آلية تنفيد التدرجات السنوية.PDF',
        'streams': ['3as_m', '3as_tm'],
        'level': '3as',
        'desc': '3 رياضيات وتقني رياضي'
    },
    {
        'file': '2-01-A - آلية تنفيد التدرجات السنوية.PDF',
        'streams': ['2as_se'],
        'level': '2as',
        'desc': '2 علوم تجريبية'
    },
    {
        'file': '2-02-A - آلية تنفيد التدرجات السنوية.PDF',
        'streams': ['2as_m', '2as_tm'],
        'level': '2as',
        'desc': '2 رياضيات وتقني رياضي'
    },
    {
        'file': '2-03-A - آلية تنفيد التدرجات السنوية.PDF',
        'streams': ['2as_lph'],
        'level': '2as',
        'desc': '2 آداب وفلسفة'
    },
    {
        'file': '1-01-A - آلية تنفيد التدرجات السنوية.PDF',
        'streams': ['1as_tc_st'],
        'level': '1as',
        'desc': '1 ج م علوم وتكنولوجيا'
    },
    {
        'file': '1-02-A - آلية تنفيد التدرجات السنوية.PDF',
        'streams': ['1as_tc_l'],
        'level': '1as',
        'desc': '1 ج م آداب'
    }
]

STREAM_METADATA = {
    '3as_se': {'name': '3 علوم تجريبية', 'code': '3 ع ت'},
    '3as_m': {'name': '3 رياضيات', 'code': '3 ر'},
    '3as_tm': {'name': '3 تقني رياضي', 'code': '3 ت ر'},
    '2as_se': {'name': '2 علوم تجريبية', 'code': '2 ع ت'},
    '2as_m': {'name': '2 رياضيات', 'code': '2 ر'},
    '2as_tm': {'name': '2 تقني رياضي', 'code': '2 ت ر'},
    '2as_lph': {'name': '2 آداب وفلسفة', 'code': '2 آف'},
    '1as_tc_st': {'name': '1 ج م علوم وتكنولوجيا', 'code': '1 ج م ع ت'},
    '1as_tc_l': {'name': '1 ج م آداب', 'code': '1 ج م آ'}
}

def clean_arabic(text):
    text = re.sub(r'[\u200e\u200f\u202a-\u202e]', '', text)
    # Fix broken arabic glyphs or extra spaces
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

def classify_type(title):
    t = title.lower()
    if any(k in t for k in ['عمل مخبري', 'مخبر', 'تجربة', 'محاكاة', 'ع م', 'ع.م', 'قياس', 'معايرة', 'راسم الاهتزاز', 'تحقيق تجارب', 'شحن وتفريغ']):
        return 'عمل مخبري'
    elif any(k in t for k in ['أعمال موجهة', 'تمارين', 'تمرين', 'حل مسائل', 'مسائل', 'تطبيقات', 'أ.م', 'أ م']):
        return 'أعمال موجهة'
    else:
        return 'درس نظري'

def is_continuation_line(line, prev_line):
    if not prev_line:
        return False
    # If starts with bullet or number, not a continuation
    if re.match(r'^[\-•\*—–\+\d\.]', line):
        return False
    # Specific continuation starters (conjunctions, single nouns, prepositions)
    first_word = line.split()[0] if line.split() else ''
    if first_word in ['و', 'في', 'من', 'إلى', 'على', 'عن', 'مع', 'أو', 'أن', 'أنها', 'بواسطة', 'حيث', 'عند', 'بين', 'التي', 'الذي', 'التي', 'مختلفة', 'وشيعة', 'الكهربائي', 'والتفريغ', 'للتحويل', 'للمتابعة', 'لنيوتن', 'للكفاءة']:
        return True
    if len(line.split()) <= 2 and not any(k in line for k in ['مفهوم', 'التعرف', 'دراسة', 'الطاقة']):
        return True
    return False

def clean_item_title(text):
    text = clean_arabic(text)
    # Remove leading bullets or dashes
    text = re.sub(r'^[\s\-•\*—–\+\:\.\d\(\)]+', '', text).strip()
    # Remove trailing dashes or colons if dangling
    text = re.sub(r'[\s\-•\*—–\+]+$', '', text).strip()
    return text

def parse_pdf_to_units(pdf_path):
    reader = pypdf.PdfReader(pdf_path)
    total_pages = len(reader.pages)
    
    # 1. Detect unit headers
    unit_headers = []
    for p_idx in range(2, total_pages):
        page = reader.pages[p_idx]
        chunks = get_page_chunks(page)
        u_chunks = [c for c in chunks if 'الوحدة' in c['text']]
        for uc in u_chunks:
            y = uc['y']
            row = [c for c in chunks if abs(c['y'] - y) < 8]
            row.sort(key=lambda c: -c['x'])
            line = ' '.join(c['text'] for c in row)
            line_cl = clean_arabic(line)
            if any(k in line_cl for k in ['الوحدة رقم', 'الوحدة 1', 'الوحدة 2', 'الوحدة 3', 'الوحدة 4', 'الوحدة 5', 'الوحدة 6', 'الوحدة 7', 'الوحدة 8', 'الوحدة 9', 'الوحدة 10', 'الوحدة الأولى', 'الوحدة الثانية', 'الوحدة الثالثة']) or (line_cl.startswith('الوحدة') and ('سا' in line_cl or 'أ م' in line_cl or 'أ. م' in line_cl)):
                if not any(bad in line_cl for bad in ['تقويم الوحدة', 'في الوحدة', 'تناول جزء', 'أضعاف']):
                    if not any(uh['p_idx'] == p_idx and abs(uh['y'] - y) < 15 for uh in unit_headers):
                        unit_headers.append({
                            'p_idx': p_idx,
                            'y': y,
                            'title': line_cl
                        })

    unit_headers.sort(key=lambda u: (u['p_idx'], -u['y']))
    
    # 2. Extract column items for each unit
    units = []
    for idx, uh in enumerate(unit_headers):
        start_p = uh['p_idx']
        start_y = uh['y']
        if idx + 1 < len(unit_headers):
            end_p = unit_headers[idx + 1]['p_idx']
            end_y = unit_headers[idx + 1]['y']
        else:
            end_p = total_pages - 1
            end_y = 50.0
            
        unit_num = idx + 1
        
        # Find column boundaries
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
        if not curr_bounds:
            curr_bounds = (250.0, 480.0)
            
        raw_lines = []
        for p in range(start_p, end_p + 1):
            page = reader.pages[p]
            chunks = get_page_chunks(page)
            v_lines = get_vlines(page)
            s_hdr = [c for c in chunks if 'السير المنهجي' in c['text']]
            if s_hdr and len(v_lines) >= 6:
                x_h = s_hdr[0]['x']
                lefts = [v for v in v_lines if v < x_h - 10]
                rights = [v for v in v_lines if v > x_h + 10]
                if lefts and rights:
                    curr_bounds = (max(lefts), min(rights))
                    
            y_top = 560.0
            y_bot = 60.0
            if p == start_p:
                if s_hdr and s_hdr[0]['y'] < start_y:
                    y_top = s_hdr[0]['y'] - 5
                else:
                    y_top = start_y - 25
            elif s_hdr:
                y_top = s_hdr[0]['y'] - 5
            if p == end_p:
                y_bot = end_y + 10
                
            col_chunks = [c for c in chunks if curr_bounds[0] + 2 <= c['x'] <= curr_bounds[1] - 2 and y_bot <= c['y'] <= y_top]
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

        # Join wrapped lines, keep distinct lines as separate items
        unit_items = []
        prev_line = ""
        for line in raw_lines:
            line_cl = clean_arabic(line)
            if not line_cl or any(h in line_cl for h in ['السير المنهجي لتدرج التعلمات', 'وزارة التربية الوطنية', 'التدرجات السنوية']):
                continue
            if line_cl.startswith('الوحدة رقم'):
                continue
            if line_cl in ['تقويم', 'تقويم مرحلي', 'تقويم الوحدة', 'التعلمات']:
                continue
                
            # If continuation of previous line
            if is_continuation_line(line_cl, prev_line):
                if unit_items:
                    unit_items[-1] = clean_item_title(unit_items[-1] + ' ' + line_cl)
                else:
                    unit_items.append(clean_item_title(line_cl))
            else:
                cleaned = clean_item_title(line_cl)
                if cleaned and len(cleaned) > 2:
                    unit_items.append(cleaned)
            prev_line = line_cl

        # Format clean unit title
        raw_u_title = uh['title']
        raw_u_title = re.sub(r'^.*?الوحدة\s*(رقم)?\s*\d*\s*[\:\(]?', '', raw_u_title)
        raw_u_title = re.sub(r'\(\s*\d+.*?\)', '', raw_u_title)
        raw_u_title = re.sub(r'\d+\s*\+\s*سا.*$', '', raw_u_title)
        raw_u_title = re.sub(r'[\(\)\:\.\+]', '', raw_u_title).strip()
        raw_u_title = re.sub(r'^\d+\s*', '', raw_u_title).strip()
        if not raw_u_title:
            raw_u_title = f"الوحدة {unit_num}"
        formatted_title = f"{unit_num:02d}: {raw_u_title}"
        
        units.append({
            'id': f"u{unit_num}",
            'number': unit_num,
            'title': formatted_title,
            'raw_items': unit_items
        })
        
    return units

def build_full_syllabus():
    full_data = {}
    
    for cfg in PDF_CONFIGS:
        print(f"\nProcessing {cfg['file']} -> {cfg['streams']}...")
        units = parse_pdf_to_units(cfg['file'])
        
        for stream_id in cfg['streams']:
            meta = STREAM_METADATA.get(stream_id, {'name': stream_id, 'code': stream_id})
            stream_units = []
            
            for u in units:
                u_id = f"{stream_id}_{u['id']}"
                items = []
                for idx, raw_it in enumerate(u['raw_items']):
                    it_id = f"{u_id}_{idx+1}"
                    it_type = classify_type(raw_it)
                    items.append({
                        'id': it_id,
                        'title': raw_it,
                        'type': it_type
                    })
                stream_units.append({
                    'id': u_id,
                    'number': u['number'],
                    'title': u['title'],
                    'items': items
                })
                
            full_data[stream_id] = {
                'streamId': stream_id,
                'streamName': meta['name'],
                'code': meta['code'],
                'units': stream_units
            }
            total_it = sum(len(u['items']) for u in stream_units)
            print(f"  -> Generated {stream_id}: {len(stream_units)} units, {total_it} total items")

    # Also generate aliases for combinations if needed (e.g. 3as_tm_m, 2as_tm_m)
    if '3as_tm' in full_data and '3as_tm_m' not in full_data:
        full_data['3as_tm_m'] = full_data['3as_tm']
    if '2as_tm' in full_data and '2as_tm_m' not in full_data:
        full_data['2as_tm_m'] = full_data['2as_tm']

    return full_data

if __name__ == '__main__':
    syllabus = build_full_syllabus()
    
    # Save as JSON for backend and frontend
    out_json = 'data/syllabus_default.json'
    with open(out_json, 'w', encoding='utf-8') as f:
        json.dump(syllabus, f, ensure_ascii=False, indent=2)
    print(f"\nWrote full syllabus to {out_json}")
    
    # Also write to src/data/syllabusData.js
    out_js = 'src/data/syllabusData.js'
    js_content = "// الدليل المنهجي للتعلمات ومحتويات دفتر النصوص الرسمية لمادة العلوم الفيزيائية\n"
    js_content += "// مستخرجة سطراً بسطر من عمود 'السير المنهجي لتدرج التعلمات' لآليات تنفيذ التدرجات السنوية الرسمية\n\n"
    js_content += "export const SYLLABUS_DATA = " + json.dumps(syllabus, ensure_ascii=False, indent=2) + ";\n"
    with open(out_js, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"Wrote full syllabus to {out_js}")
