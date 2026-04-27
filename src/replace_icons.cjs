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
  const rx = /\(\w+\)\s*=>\s*\w+\.palette\.primary\.light\s*\+\s*"(?:33|1a|1f|26|14|0d)"/g;
  if(rx.test(c)) {
    const newC = c.replace(rx, '"var(--color-primary-border)"');
    fs.writeFileSync(f, newC);
    console.log(`Updated ${f}`);
  }
});
