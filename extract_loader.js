const fs = require('fs');
const lines = fs.readFileSync('temp.jsonl', 'utf8').split('\n').filter(Boolean);

for (const line of lines) {
  try {
    const data = JSON.parse(line);
    const content = data.content || '';
    if (content.includes('pegtopone')) {
      const match = content.match(/import React from 'react';[\s\S]*?export default Loader;/);
      if (match) {
        let code = match[0];
        // We export as AILoader instead of default Loader to match our app structure
        code = code.replace('const Loader = () => {', 'export const AILoader = () => {');
        code = code.replace('export default Loader;', '');
        fs.writeFileSync('client/src/components/ui/AILoader.tsx', code);
        console.log('Successfully extracted and wrote AILoader.tsx');
        process.exit(0);
      }
    }
  } catch (e) {
    // Ignore parse errors
  }
}
console.log('Could not find the loader code.');
