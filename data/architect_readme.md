# D&D 2024 Normalized Character Builder Architecture

## 1. Directory Structure

```text
/data/
├── dnd_schema.json           # Master JSON Schema definitions
├── features.json             # Global feature dictionary (atomic descriptions)
├── feats.json                # Origin, General, and Epic Feats
├── species.json              # Species definitions (references features)
├── backgrounds.json          # Background definitions (ASI + referenced Origin Feats)
├── classes.json              # Class definitions (level progression referencing features)
├── weapon_masteries.json     # Weapon Mastery properties
└── spells.json               # Spell database (metadata + level)
```

## 2. Core Schema Concept (Normalization)

To avoid duplication, all text-heavy "features" (e.g., *Second Wind*, *Darkvision*) are defined once in `features.json`. Other entities like Species or Classes reference these features by their unique IDs.

### 2.1 Example: Feature Definition (`features.json`)
```json
{
  "darkvision": {
    "name": "Darkvision",
    "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light."
  }
}
```

### 2.2 Example: Species (`species.json`)
```json
{
  "id": "elf",
  "name": "Elf",
  "traits": ["darkvision", "fey_ancestry"],
  "subtypes": [
    {
      "id": "high_elf",
      "name": "High Elf",
      "traits": ["extra_cantrip"]
    }
  ]
}
```

### 2.3 Example: Background (`backgrounds.json`)
```json
{
  "id": "farmer",
  "name": "Farmer",
  "asi_options": ["str", "con", "wis"],
  "origin_feat_id": "tough",
  "skill_ids": ["animal_handling", "nature"]
}
```

### 2.4 Example: Class Progression (`classes.json`)
```json
{
  "id": "fighter",
  "name": "Fighter",
  "hit_die": 10,
  "progression": {
    "1": ["second_wind", "fighting_style"],
    "2": ["action_surge"],
    "3": ["subclass_choice"]
  }
}
```
