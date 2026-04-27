const fs = require('fs');
const path = require('path');

function walk(d, cb) {
  fs.readdirSync(d).forEach(f => {
    let p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p, cb);
    else cb(p);
  });
}

let total = 0;
walk('.', f => {
  if(!f.endsWith('.jsx')) return;
  const c = fs.readFileSync(f, 'utf8');
  const rx = /\(\w+\)\s*=>\s*\w+\.palette\.primary\.light\s*\+\s*"(?:33|1a|1f|26|14|0d)"/g;
  const m = c.match(rx);
  if(m) {
    total += m.length;
    console.log(`${f}: ${m.length}`);
  }
});
console.log('Total matches: ' + total);
