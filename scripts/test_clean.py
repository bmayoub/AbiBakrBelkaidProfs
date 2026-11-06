import json, re

# Load raw PDF data
with open('scripts/raw_pdf_text.json', 'r', encoding='utf-8') as f:
    pdf_data = json.load(f)

def clean_arabic(txt):
    if not txt:
        return ""
    txt = txt.replace('الماةة', 'المادة').replace('ةراسة', 'دراسة').replace('ةفع', 'دفع')
    txt = txt.replace('المتباةلة', 'المتبادلة').replace('ةورانية', 'دورانية').replace('أفراة', 'أفراد')
    txt = txt.replace('الحقلالمغناطيس', 'الحقل المغناطيس')
    txt = txt.replace('الطاقةالداخلية', 'الطاقة الداخلية').replace('نضف', 'نصف')
    txt = txt.replace('تطور جملةميكانيكية', 'تطور جملة ميكانيكية')
    txt = re.sub(r'\s+', ' ', txt)
    return txt.strip()

print("Loaded PDF data successfully.")

