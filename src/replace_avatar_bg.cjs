const fs = require('fs');
const path = require('path');

function walk(d, cb) {
  fs.readdirSync(d).forEach(f => {
    let p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) {
      if (!p.includes('node_modules') && !p.includes('.git')) {
        walk(p, cb);
      }
    } else {
      cb(p);
    }
  });
}

walk('.', f => {
  if(!f.endsWith('.jsx')) return;
  let c = fs.readFileSync(f, 'utf8');
  let original = c;
  
  let result = "";
  let i = 0;
  
  while (i < c.length) {
    let avatarIdx = c.indexOf('<Avatar', i);
    if (avatarIdx === -1) {
      result += c.substring(i);
      break;
    }
    
    // Find the end of the Avatar opening tag (either > or />)
    // We must handle nested tags if any, but <Avatar doesn't have nested JSX in its attributes usually.
    let endIdx = avatarIdx;
    let inQuotes = false;
    let quoteChar = '';
    while (endIdx < c.length) {
      let char = c[endIdx];
      if ((char === '"' || char === "'" || char === "`") && c[endIdx-1] !== '\\') {
        if (!inQuotes) { inQuotes = true; quoteChar = char; }
        else if (quoteChar === char) { inQuotes = false; }
      }
      if (!inQuotes && char === '>') {
        break;
      }
      endIdx++;
    }
    
    // We have the opening tag string
    let tagStr = c.substring(avatarIdx, endIdx + 1);
    
    // Replace inside the tagStr
    tagStr = tagStr.replace(/\(\w+\)\s*=>\s*\w+\.palette\.primary\.light\s*\+\s*"(?:33|1a|1f|26|14|0d)"/g, '"var(--color-primary-border)"');
    tagStr = tagStr.replace(/isActive\s*\?\s*"primary\.main"\s*:\s*"action\.hover"/g, 'isActive ? "primary.main" : "var(--color-primary-border)"');
    tagStr = tagStr.replace(/isActive\s*\?\s*"primary\.main"\s*:\s*"action\.selected"/g, 'isActive ? "primary.main" : "var(--color-primary-border)"');
    tagStr = tagStr.replace(/bgcolor:\s*"action\.hover"/g, 'bgcolor: "var(--color-primary-border)"');
    
    result += c.substring(i, avatarIdx) + tagStr;
    i = endIdx + 1;
  }
  
  if (result !== original) {
    fs.writeFileSync(f, result);
    console.log(`Updated Avatar bgcolor in ${f}`);
  }
});
