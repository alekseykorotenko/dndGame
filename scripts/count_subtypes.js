import fs from 'fs';
const species = JSON.parse(fs.readFileSync('./data/species.json', 'utf8'));
species.forEach(s => {
  console.log(`${s.name_ua} has ${s.subtypes ? s.subtypes.length : 0} subtypes`);
});
