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
  
  let lines = c.split('\n');
  let lastAvatarLine = -100;
  
  for(let i=0; i<lines.length; i++) {
    if(lines[i].includes('<Avatar')) {
      lastAvatarLine = i;
    }
    
    // If we are within 20 lines of an <Avatar tag
    if (i - lastAvatarLine <= 20) {
      const rx1 = /\(\w+\)\s*=>\s*\w+\.palette\.primary\.light\s*\+\s*"(?:33|1a|1f|26|14|0d)"/g;
      const rx2 = /isActive\s*\?\s*"primary\.main"\s*:\s*"action\.hover"/g;
      const rx3 = /isActive\s*\?\s*"primary\.main"\s*:\s*"action\.selected"/g;
      const rx4 = /bgcolor:\s*"action\.hover"/g;
      const rx5 = /bgcolor:\s*"grey\.200"/g;
      const rx6 = /bgcolor:\s*"grey\.300"/g;
      const rx7 = /bgcolor:\s*"#bdbdbd"/g;
      
      let modifiedLine = lines[i]
        .replace(rx1, '"var(--color-primary-border)"')
        .replace(rx2, 'isActive ? "primary.main" : "var(--color-primary-border)"')
        .replace(rx3, 'isActive ? "primary.main" : "var(--color-primary-border)"')
        .replace(rx4, 'bgcolor: "var(--color-primary-border)"')
        .replace(rx5, 'bgcolor: "var(--color-primary-border)"')
        .replace(rx6, 'bgcolor: "var(--color-primary-border)"')
        .replace(rx7, 'bgcolor: "var(--color-primary-border)"');
        
      // Special case: if the line has `t => t.palette.primary.light + "33"` (without parens)
      const rx8 = /t\s*=>\s*t\.palette\.primary\.light\s*\+\s*"(?:33|1a|1f|26|14|0d)"/g;
      modifiedLine = modifiedLine.replace(rx8, '"var(--color-primary-border)"');
        
      if (modifiedLine !== lines[i]) {
        // Also check if this line is part of a TableRow sx={{ bgcolor: ... }}. If so, we SHOULD NOT replace it!
        // But table row is `<TableRow sx={{ bgcolor: ... }}>`
        if (!lines[i].includes('<TableRow')) {
          lines[i] = modifiedLine;
        }
      }
    }
  }
  
  let newContent = lines.join('\n');
  if (newContent !== original) {
    fs.writeFileSync(f, newContent);
    console.log(`Updated Avatar bgcolor in ${f}`);
  }
});
