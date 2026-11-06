with open('src/data/syllabusData.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace specific unescaped f'
text = text.replace("والبعد المحرقي f' وتقارب العدسة C = 1/f' بالديوبتري", "والبعد المحرقي f\\' وتقارب العدسة C = 1/f\\' بالديوبتري")

with open('src/data/syllabusData.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed specific quotes.")

