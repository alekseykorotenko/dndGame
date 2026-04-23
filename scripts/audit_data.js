import fs from 'fs';

const classes = JSON.parse(fs.readFileSync('./data/classes.json', 'utf8'));
const species = JSON.parse(fs.readFileSync('./data/species.json', 'utf8'));
const spells = JSON.parse(fs.readFileSync('./data/spells.json', 'utf8'));

let errors = [];

// Check classes
if (classes.length !== 12) {
  errors.push(`Expected 12 classes, found ${classes.length}`);
}

classes.forEach(c => {
  if (!c.subclasses || c.subclasses.length === 0) {
    errors.push(`Class ${c.name_ua} is missing subclasses`);
  } else {
    c.subclasses.forEach(sub => {
      if (!sub.features_by_level || Object.keys(sub.features_by_level).length === 0) {
        errors.push(`Subclass ${sub.name_ua} in ${c.name_ua} has no features_by_level`);
      }
    });
  }
  
  if (c.features_by_level) {
    // Check if total features exist
    let hasFeatures = false;
    Object.keys(c.features_by_level).forEach(level => {
      if (c.features_by_level[level] && c.features_by_level[level].length > 0) {
         hasFeatures = true;
      }
    });
    if (!hasFeatures) errors.push(`Class ${c.name_ua} has features object but no actual features`);
  } else {
    errors.push(`Class ${c.name_ua} missing features_by_level`);
  }
});

// Check species
species.forEach(s => {
  if (!s.traits || s.traits.length === 0) {
    errors.push(`Species ${s.name_ua} has no traits`);
  }
  
  if (s.subtypes) {
    s.subtypes.forEach(sub => {
      if (!sub.traits || sub.traits.length === 0) {
        errors.push(`Subtype ${sub.name_ua} in ${s.name_ua} has no traits`);
      }
    });
  }
});

// Check spells
if (!spells || spells.length === 0) {
    errors.push(`Spells array is empty`);
}
spells.forEach(s => {
    if(!s.classes || s.classes.length === 0) {
        errors.push(`Spell ${s.name} is missing classes`);
    }
});

console.log('Errors:', JSON.stringify(errors, null, 2));

