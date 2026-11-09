import os
import re
import json
import glob
import pypdf

PDF_MAP = {
    '1-01-A - آلية تنفيد التدرجات السنوية.PDF': ['1as_tc_st'],
    '1-02-A - آلية تنفيد التدرجات السنوية.PDF': ['1as_tc_l'],
    '2-01-A - آلية تنفيد التدرجات السنوية.PDF': ['2as_se'],
    '2-02-A - آلية تنفيد التدرجات السنوية.PDF': ['2as_m', '2as_tm'],
    '2-03-A - آلية تنفيد التدرجات السنوية.PDF': ['2as_lph'],
    '3-01-A - آلية تنفيد التدرجات السنوية.PDF': ['3as_se'],
    '3-02-A - آلية تنفيد التدرجات السنوية.PDF': ['3as_m', '3as_tm'],
}

STREAM_NAMES = {
    '3as_se': ('3 علوم تجريبية', '3 ع ت'),
    '3as_m': ('3 رياضيات', '3 ر'),
    '3as_tm': ('3 تقني رياضي', '3 ت ر'),
    '2as_se': ('2 علوم تجريبية', '2 ع ت'),
    '2as_m': ('2 رياضيات', '2 ر'),
    '2as_tm': ('2 تقني رياضي', '2 ت ر'),
    '2as_lph': ('2 آداب وفلسفة', '2 آف'),
    '1as_tc_st': ('1 ج م علوم وتكنولوجيا', '1 ج م ع ت'),
    '1as_tc_l': ('1 ج م آداب', '1 ج م آ'),
}

def clean_arabic(text):
    text = re.sub(r'[\u200e\u200f\u202a-\u202e]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def get_vertical_lines(page):
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

def extract_pdf_data(pdf_path):
    reader = pypdf.PdfReader(pdf_path)
    pages_data = []
    for p_idx, page in enumerate(reader.pages):
        chunks = []
        def visitor(text, cm, tm, font_dict, font_size):
            t = text.strip()
            if t:
                chunks.append({'text': t, 'x': tm[4], 'y': tm[5], 'fs': font_size})
        page.extract_text(visitor_text=visitor)
        v_lines = get_vertical_lines(page)
        pages_data.append({
            'page_idx': p_idx,
            'chunks': chunks,
            'v_lines': v_lines
        })
    return pages_data

def process_pdf(pdf_path):
    pages = extract_pdf_data(pdf_path)
    
    # 1. Identify units
    units = []
    for p_data in pages:
        p_idx = p_data['page_idx']
        chunks = p_data['chunks']
        # Find unit titles
        unit_candidates = [c for c in chunks if 'الوحدة' in c['text']]
        for uc in unit_candidates:
            y = uc['y']
            row = [c for c in chunks if abs(c['y'] - y) < 8]
            row.sort(key=lambda c: -c['x'])
            line = ' '.join(c['text'] for c in row)
            line_cleaned = clean_arabic(line)
            # Filter out non-header mentions like 'تقويم الوحدة' or 'في الوحدة'
            if ('الوحدة رقم' in line_cleaned or 'الوحدة 1' in line_cleaned or 'الوحدة الأولى' in line_cleaned or 'الوحدة' in line_cleaned) and not 'تقويم الوحدة' in line_cleaned and not 'في الوحدة' in line_cleaned:
                # Avoid duplicate line detections on same y
                if not any(u['p_idx'] == p_idx and abs(u['y'] - y) < 10 for u in units):
                    units.append({
                        'p_idx': p_idx,
                        'y': y,
                        'raw_title': line_cleaned
                    })
                    
    # Refine unit numbers and titles
    refined_units = []
    unit_num = 1
    for u in units:
        t = u['raw_title']
        # clean t
        # remove 'مجال ... ' prefix if present
        t = re.sub(r'^.*?مجال[^\:]*?\s+', '', t)
        # extract unit title
        refined_units.append({
            'p_idx': u['p_idx'],
            'y': u['y'],
            'num': unit_num,
            'title': t,
            'items': []
        })
        unit_num += 1

    print(f"{pdf_path}: Found {len(refined_units)} units")
    for ru in refined_units:
        print(f"   U{ru['num']}: P{ru['p_idx']} - {ru['title']}")
        
    return refined_units

if __name__ == '__main__':
    for pdf in sorted(PDF_MAP.keys()):
        process_pdf(pdf)
