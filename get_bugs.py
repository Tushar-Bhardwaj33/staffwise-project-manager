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

for i, b in enumerate(bugs):
    print(f'BUG {i+1}:')
    print('CONTENT:', b.get('content'))
    print('EXISTING:', b.get('existing_code'))
    print('SUGGESTION:', b.get('suggestion_code'))
    print('-'*40)

