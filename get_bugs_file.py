import json
import re

with open('changes.txt', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'\{\"comments\":\[.*?\]\}', text, re.DOTALL)

bugs = []
for m in matches:
    try:
        data = json.loads(m)
        for c in data.get('comments', []):
            if c.get('category') in ['bug', 'security']:
                bugs.append(c)
    except Exception as e:
        pass

with open('bugs.txt', 'w', encoding='utf-8') as out:
    for i, b in enumerate(bugs):
        out.write(f'BUG {i+1}:\n')
        out.write('CONTENT: ' + b.get('content', '') + '\n')
        out.write('EXISTING:\n' + b.get('existing_code', '') + '\n')
        out.write('SUGGESTION:\n' + b.get('suggestion_code', '') + '\n')
        out.write('-'*40 + '\n')

