import fs from 'fs';
const classes = JSON.parse(fs.readFileSync('./data/classes.json', 'utf8'));
classes.forEach(c => {
  console.log(`${c.name_ua} has ${c.subclasses.length} subclasses`);
});
