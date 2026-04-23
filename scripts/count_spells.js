import fs from 'fs';
const spells = JSON.parse(fs.readFileSync('./data/spells.json', 'utf8'));
console.log('Spells count:', spells.length);
