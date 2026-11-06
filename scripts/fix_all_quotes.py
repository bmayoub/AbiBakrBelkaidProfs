with open('src/data/syllabusData.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "title: '" in line:
        idx_start = line.find("title: '") + len("title: '")
        idx_end = line.rfind("', type:")
        if idx_end > idx_start:
            content = line[idx_start:idx_end]
            # escape any unescaped single quote
            # first unescape to prevent double escaping
            content = content.replace("\\'", "'")
            content = content.replace("'", "\\'")
            line = line[:idx_start] + content + line[idx_end:]
    new_lines.append(line)

with open('src/data/syllabusData.js', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Safely escaped all single quotes in syllabusData.js!")

