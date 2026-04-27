const fs = require('fs');
const path = require('path');

function walk(d, cb) {
  fs.readdirSync(d).forEach(f => {
    let p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p, cb);
    else cb(p);
  });
}

walk('.', f => {
  if(!f.endsWith('.jsx')) return;
  let c = fs.readFileSync(f, 'utf8');
  let original = c;
  
  // Split by <Avatar
  let parts = c.split(/<Avatar/);
  for (let i = 1; i < parts.length; i++) {
    // Find the end of the Avatar opening tag
    let endOfTag = parts[i].indexOf('>');
    if (endOfTag !== -1) {
      let insideTag = parts[i].substring(0, endOfTag);
      // Replace bgcolor
      insideTag = insideTag.replace(/\(\w+\)\s*=>\s*\w+\.palette\.primary\.light\s*\+\s*"(?:33|1a|1f|26|14|0d)"/g, '"var(--color-primary-border)"');
      insideTag = insideTag.replace(/bgcolor:\s*(?:t\s*=>\s*)?t\.palette\.primary\.light\s*\+\s*"(?:33|1a|1f|26|14|0d)"/g, 'bgcolor: "var(--color-primary-border)"');
      // If there's an action.hover used as bgcolor
      insideTag = insideTag.replace(/bgcolor:\s*"action\.hover"/g, 'bgcolor: "var(--color-primary-border)"');
      insideTag = insideTag.replace(/bgcolor:\s*isActive\s*\?\s*"primary\.main"\s*:\s*"action\.hover"/g, 'bgcolor: isActive ? "primary.main" : "var(--color-primary-border)"');
      insideTag = insideTag.replace(/bgcolor:\s*isActive\s*\?\s*"primary\.main"\s*:\s*"action\.selected"/g, 'bgcolor: isActive ? "primary.main" : "var(--color-primary-border)"');
      
      parts[i] = insideTag + parts[i].substring(endOfTag);
    }
  }
  
  let newContent = parts.join('<Avatar');
  
  if (newContent !== original) {
    fs.writeFileSync(f, newContent);
    console.log(`Updated ${f}`);
  }
});
