import re

with open('src/data/curricula.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's extract CURRICULA objects
streams = ['3as_se', '3as_tm', '3as_m', '2as_se', '2as_tm', '2as_m', '2as_lph', '1as_tc_st', '1as_tc_l']

for st in streams:
    # Find weeks for st
    m = re.search(r"'" + st + r"':\s*\{([\s\S]*?weeks:\s*(WEEKS_[A-Z0-9_]+|\[[\s\S]*?\]))", code)
    if not m:
        continue
    weeks_part = m.group(2)
    if weeks_part.startswith('WEEKS_'):
        # find that variable
        var_name = weeks_part
        m_var = re.search(r"const\s+" + var_name + r"\s*=\s*(\[[\s\S]*?\]);", code)
        weeks_text = m_var.group(1) if m_var else ""
    else:
        weeks_text = weeks_part

    units = []
    for line in weeks_text.split('\n'):
        mu = re.search(r"unit:\s*'([^']+)'", line)
        if mu:
            u = mu.group(1).strip()
            # Clean up hours info e.g. (16 سا + 05 أ م)
            clean_u = re.sub(r'\s*\(\d+.*?\)', '', u).strip()
            if not any(x in clean_u for x in ['الدخول', 'عطلة', 'تقويم', 'أسبوع']):
                if clean_u not in units:
                    units.append(clean_u)
    print(f"=== {st} ({len(units)} units):")
    for u in units:
        print(f"  {u}")

