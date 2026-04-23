import fs from 'fs';
const c = JSON.parse(fs.readFileSync('./data/classes.json', 'utf8'));
let em = 0;
c.forEach(cls => {
  for (const lvl in cls.features_by_level) {
    if (cls.features_by_level[lvl].length === 0) em++;
    cls.features_by_level[lvl].forEach(feat => {
       if (feat.trim() === '') em++;
    });
  }
  cls.subclasses.forEach(sub => {
    for (const lvl in sub.features_by_level) {
      if (sub.features_by_level[lvl].length === 0) em++;
      sub.features_by_level[lvl].forEach(feat => {
         if (feat.trim() === '') em++;
      });
    }
  });
});
console.log('Empty class features issues:', em);
