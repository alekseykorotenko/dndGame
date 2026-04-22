import rawClasses from '../data/classes.json';
import rawSpecies from '../data/species.json';
import rawBackgrounds from '../data/backgrounds.json';
import rawFeats from '../data/feats.json';
import rawSubclasses from '../data/subclasses.json';
import rawSpells from '../data/spells.json';

export type AbilityType = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

// Українські назви характеристик
export const abilityNames: Record<AbilityType, string> = {
  str: 'Сила',
  dex: 'Спритність',
  con: 'Витривалість',
  int: 'Інтелект',
  wis: 'Мудрість',
  cha: 'Харизма'
};

export const standardArray = [15, 14, 13, 12, 10, 8];

// Map abilities
const mapAbilities = (abilities: string[]): AbilityType[] => {
  return abilities.map(a => a.substring(0, 3) as AbilityType);
};

export interface ClassDef {
  id: string;
  name: string;
  description: string;
  primaryAbility: AbilityType;
  hitDie: number;
  equipmentPacks: { id: string; name: string; items: string[] }[];
}

// Fallback equipment packs
const defaultEquipment: Record<string, { id: string; name: string; items: string[] }[]> = {
  barbarian: [{ id: 'explorer', name: 'Набір дослідника', items: ['Рюкзак', 'Спальник'] }],
  bard: [{ id: 'entertainer', name: 'Набір артиста', items: ['Рюкзак', 'Спальник', 'Музичний інструмент'] }],
  cleric: [{ id: 'priest', name: 'Набір священика', items: ['Булава', 'Кільцева броня', 'Священний символ'] }],
  druid: [{ id: 'explorer', name: 'Набір дослідника', items: ['Щит деревяний', 'Шкіряна броня'] }],
  fighter: [{ id: 'defense', name: 'Набір Захисника', items: ['Кольчуга', 'Довгий меч', 'Щит'] }, { id: 'attack', name: 'Набір Атакуючого', items: ['Шкіряна броня', 'Великий меч'] }],
  monk: [{ id: 'dungeoneer', name: 'Набір підземелля', items: ['Рюкзак', 'Кинджали'] }],
  paladin: [{ id: 'priest', name: 'Набір священика', items: ['Кольчуга', 'Довгий меч', 'Щит', 'Священний символ'] }],
  ranger: [{ id: 'explorer', name: 'Набір дослідника', items: ['Коротка лук', 'Шкіряна броня'] }],
  rogue: [{ id: 'burglar', name: 'Набір зломщика', items: ['Рапіра', 'Короткий лук', 'Інструменти злодія'] }],
  sorcerer: [{ id: 'explorer', name: 'Набір дослідника', items: ['Кинджали'] }],
  warlock: [{ id: 'scholar', name: 'Набір вченого', items: ['Магічна книга', 'Паличка'] }],
  wizard: [{ id: 'scholar', name: 'Набір вченого', items: ['Книга заклинань', 'Кристал (фокус)'] }]
};

export const classesData: ClassDef[] = rawClasses.map(c => ({
  id: c.id,
  name: c.name_ua,
  description: c.description,
  primaryAbility: mapAbilities(c.primary_abilities)[0],
  hitDie: parseInt(c.hit_die.replace('1d', '')),
  equipmentPacks: defaultEquipment[c.id] || [{ id: 'standard', name: 'Стандартний набір', items: ['Рюкзак'] }]
}));

export interface SpeciesDef {
  id: string;
  name: string;
  description: string;
  traits: string[];
}

export const speciesData: SpeciesDef[] = rawSpecies.map(s => ({
  id: s.id,
  name: s.name_ua,
  description: s.features.join('. '),
  traits: s.traits
}));

export interface FeatDef {
  id: string;
  name: string;
  description: string;
  isOrigin: boolean;
}

export const featsData: FeatDef[] = rawFeats.map(f => ({
  id: f.id,
  name: f.name_ua,
  description: f.description,
  isOrigin: f.requirements === 'Рівень: 1' || f.requirements.includes('1')
}));

export interface BackgroundDef {
  id: string;
  name: string;
  description: string;
  featId: string;
  asiOptions: AbilityType[];
}

export const backgroundsData: BackgroundDef[] = rawBackgrounds.map(b => ({
  id: b.id,
  name: b.name_ua,
  description: 'Спорядження: ' + b.equipment.join(', '),
  featId: b.feat_id,
  asiOptions: mapAbilities(b.ability_bonuses)
}));

export function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}
