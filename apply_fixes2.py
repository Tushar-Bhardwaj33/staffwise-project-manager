import json
import re
import glob
import os
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

def normalize_ws(s):
    return re.sub(r'\s+', '', s)

files = glob.glob('server/src/**/*.ts', recursive=True)

success = 0
failed = []

for b in bugs:
    existing = b.get('existing_code', '').strip()
    suggestion = b.get('suggestion_code', '').strip()
    if not existing or not suggestion:
        continue
    
    norm_existing = normalize_ws(existing)
    
    matches_found = []
    for file in files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        escaped = re.escape(existing)
        regex_pattern = r'\s*'.join(re.escape(char) for char in norm_existing)
        
        file_matches = list(re.finditer(regex_pattern, content))
        for m in file_matches:
            matches_found.append((file, m))
    
    if len(matches_found) == 1:
        file, match = matches_found[0]
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content = content[:match.start()] + suggestion + content[match.end():]
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        success += 1
    else:
        failed.append(b.get('content')[:100])

print(f'Successfully applied {success} fixes.')
print(f'Failed to apply {len(failed)} fixes.')
for f in failed:
    print('Failed:', f.encode('utf-8', 'ignore').decode('utf-8'))

