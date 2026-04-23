import fs from 'fs';
const c = JSON.parse(fs.readFileSync('./data/classes.json', 'utf8'));
let nonArraySub = [];
c.forEach(cls => {
  cls.subclasses.forEach(sub => {
    for (const lvl in sub.features_by_level) {
      if (!Array.isArray(sub.features_by_level[lvl])) {
         nonArraySub.push(`${cls.name_ua} -> ${sub.name_ua} -> level ${lvl}: ${typeof sub.features_by_level[lvl]}`);
      }
    }
  });
});
console.log('Non-array features:', nonArraySub);
