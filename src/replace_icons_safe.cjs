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
  const c = fs.readFileSync(f, 'utf8');
  
  // We want to replace `(t) => t.palette.primary.light + "XX"` with `"var(--color-primary-border)"`
  // ONLY when it's near an Avatar tag.
  // Let's just do a manual string replace where we check if the replaced line is within an Avatar component.
  
  const lines = c.split('\n');
  let insideAvatar = false;
  let modified = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<Avatar')) {
      insideAvatar = true;
    }
    
    if (insideAvatar) {
      const rx = /\(\w+\)\s*=>\s*\w+\.palette\.primary\.light\s*\+\s*"(?:33|1a|1f|26|14|0d)"/g;
      if (rx.test(lines[i])) {
        lines[i] = lines[i].replace(rx, '"var(--color-primary-border)"');
        modified = true;
      }
      
      const rx2 = /"action\.hover"/g;
      // if the Avatar has action.hover as bgcolor
      if (lines[i].includes('bgcolor:') && rx2.test(lines[i])) {
         lines[i] = lines[i].replace(rx2, '"var(--color-primary-border)"');
         modified = true;
      }
    }
    
    // Crude check for end of Avatar tag or end of its sx block.
    // Actually, Avatar is often closed with </Avatar> or />
    if (lines[i].includes('</Avatar>') || lines[i].match(/\/>\s*$/)) {
      insideAvatar = false;
    }
  }
  
  if (modified) {
    fs.writeFileSync(f, lines.join('\n'));
    console.log(`Updated ${f}`);
  }
});
