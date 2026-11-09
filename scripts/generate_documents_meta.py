import os
import json

STREAM_MAP = {
    '1-01': {'level': '1as', 'levelName': 'السنة الأولى ثانوي', 'stream': '1as_tc_st', 'streamName': 'جذع مشترك علوم وتكنولوجيا', 'code': '1 ج م ع ت'},
    '1-02': {'level': '1as', 'levelName': 'السنة الأولى ثانوي', 'stream': '1as_tc_l', 'streamName': 'جذع مشترك آداب', 'code': '1 ج م آ'},
    '2-01': {'level': '2as', 'levelName': 'السنة الثانية ثانوي', 'stream': '2as_se', 'streamName': 'علوم تجريبية', 'code': '2 ع ت'},
    '2-02': {'level': '2as', 'levelName': 'السنة الثانية ثانوي', 'stream': '2as_m_tm', 'streamName': 'رياضيات وتقني رياضي', 'code': '2 ر / ت ر'},
    '2-03': {'level': '2as', 'levelName': 'السنة الثانية ثانوي', 'stream': '2as_lph', 'streamName': 'آداب وفلسفة', 'code': '2 آف'},
    '3-01': {'level': '3as', 'levelName': 'السنة الثالثة ثانوي', 'stream': '3as_se', 'streamName': 'علوم تجريبية', 'code': '3 ع ت'},
    '3-02': {'level': '3as', 'levelName': 'السنة الثالثة ثانوي', 'stream': '3as_m_tm', 'streamName': 'رياضيات وتقني رياضي', 'code': '3 ر / ت ر'},
}

CAT_MAP = {
    'A': {'cat': 'progression', 'catName': 'آلية تنفيذ التدرجات السنوية', 'icon': 'Calendar', 'badge': 'تدرج سنوي'},
    'B': {'cat': 'curriculum', 'catName': 'المنهاج التعليمي الرسمي', 'icon': 'BookOpen', 'badge': 'منهاج رسمي'},
    'C': {'cat': 'accompanying', 'catName': 'الوثيقة المرافقة للمنهاج', 'icon': 'FileText', 'badge': 'وثيقة مرافقة'},
    'E': {'cat': 'guide', 'catName': 'دليل الأستاذ للكتاب المدرسي', 'icon': 'GraduationCap', 'badge': 'دليل الأستاذ'},
}

docs = []
doc_dir = 'documents'
for fname in sorted(os.listdir(doc_dir)):
    parts = fname.split(' - ')
    code_part = parts[0]
    c_split = code_part.split('-')
    if len(c_split) >= 3:
        st_key = f"{c_split[0]}-{c_split[1]}"
        cat_letter = c_split[2]
        st_info = STREAM_MAP.get(st_key, {})
        cat_info = CAT_MAP.get(cat_letter, {'cat': 'other', 'catName': 'وثيقة تربوية', 'badge': 'وثيقة'})
        
        fpath = os.path.join(doc_dir, fname)
        size_bytes = os.path.getsize(fpath)
        ext = os.path.splitext(fname)[1].replace('.', '').upper()
        
        if size_bytes >= 1024 * 1024:
            size_str = f"{size_bytes / (1024 * 1024):.1f} ميغابايت"
        else:
            size_str = f"{size_bytes / 1024:.0f} كيلوبايت"
            
        stream_name = st_info.get('streamName', '')
        level_name = st_info.get('levelName', '')
        cat_name = cat_info.get('catName', '')
        
        docs.append({
            'id': code_part,
            'fileName': fname,
            'title': f"{cat_name} - {stream_name}",
            'subtitle': level_name,
            'level': st_info.get('level', ''),
            'levelName': level_name,
            'stream': st_info.get('stream', ''),
            'streamName': stream_name,
            'code': st_info.get('code', ''),
            'category': cat_info['cat'],
            'categoryName': cat_name,
            'badge': cat_info['badge'],
            'ext': ext,
            'sizeBytes': size_bytes,
            'sizeStr': size_str,
            'downloadUrl': f"/api/documents/download/{fname}",
            'previewUrl': f"/api/documents/file/{fname}" if ext == 'PDF' else None
        })

print(f"Total registry items: {len(docs)}")
with open('data/documents.json', 'w', encoding='utf-8') as f:
    json.dump(docs, f, ensure_ascii=False, indent=2)
print("Saved data/documents.json successfully!")

# Also write to src/data/documentsData.js for immediate frontend usage
js_content = "// فهرس الوثائق الرسمية والمناهج وأدلة الأستاذ للتحميل المباشر\n"
js_content += "export const DOCUMENTS_DATA = " + json.dumps(docs, ensure_ascii=False, indent=2) + ";\n"
with open('src/data/documentsData.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
print("Saved src/data/documentsData.js successfully!")
