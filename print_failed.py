import json
import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

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

failed = ['Unsafe s string cast on state.projectId', 'No null/empty check on the fetched project', '\esult.content as string\ is returned with no null/empty guard', '\esult.content as string\ assumes LangChain', '\currentUser.name\, \currentUser.role\, \projectContext.title\', 'Hard\u2011coded 500 status', 'Memory-storage DoS surface']

for b in bugs:
    for fail in failed:
        if b.get('content', '').startswith(fail):
            print('---FAILED BUG---')
            print('EXISTING:\n' + b.get('existing_code', ''))
            print('SUGGESTION:\n' + b.get('suggestion_code', ''))
            print()

