import { AbilityType, calculateModifier } from './dndData';

export type CharacterClassId =
  | "barbarian"
  | "bard"
  | "cleric"
  | "druid"
  | "fighter"
  | "monk"
  | "paladin"
  | "ranger"
  | "rogue"
  | "sorcerer"
  | "warlock"
  | "wizard";

export interface SpellSlots {
  standard?: number[]; 
  warlockPact?: { slotsCount: number; slotLevel: number }; 
}

export interface LevelStats {
  level: number;
  proficiencyBonus: number;
  hitPoints: number;
  spellSlots: SpellSlots | null;
  features: string[];
}

// Таблиці магії (D&D 2024)
const fullCasterSlots = [
  [], [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1], [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1]
];

// Напівчаклуни 2024 року починають з магією з 1-го рівня
const halfCasterSlots2024 = [
  [], [2], [2], [3], [3], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3, 2],
  [4, 3, 2], [4, 3, 3], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 1],
  [4, 3, 3, 2], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2]
];

const warlockPactSlots = [
  { slotsCount: 0, slotLevel: 0 },
  { slotsCount: 1, slotLevel: 1 }, { slotsCount: 2, slotLevel: 1 }, { slotsCount: 2, slotLevel: 2 },
  { slotsCount: 2, slotLevel: 2 }, { slotsCount: 2, slotLevel: 3 }, { slotsCount: 2, slotLevel: 3 },
  { slotsCount: 2, slotLevel: 4 }, { slotsCount: 2, slotLevel: 4 }, { slotsCount: 2, slotLevel: 5 },
  { slotsCount: 2, slotLevel: 5 }, { slotsCount: 3, slotLevel: 5 }, { slotsCount: 3, slotLevel: 5 },
  { slotsCount: 3, slotLevel: 5 }, { slotsCount: 3, slotLevel: 5 }, { slotsCount: 3, slotLevel: 5 },
  { slotsCount: 3, slotLevel: 5 }, { slotsCount: 4, slotLevel: 5 }, { slotsCount: 4, slotLevel: 5 },
  { slotsCount: 4, slotLevel: 5 }, { slotsCount: 4, slotLevel: 5 }
];

// Базові здібності класів D&D 2024
const classFeaturesMap: Record<string, Record<number, string[]>> = {
  barbarian: {
    1: ['Лють (Rage)', 'Захист без броні (Unarmored Defense)', 'Майстерність зброї (Weapon Mastery)'],
    2: ['Безвідповідальна атака (Reckless Attack)', 'Відчуття небезпеки (Danger Sense)'],
    3: ['Особливість підкласу', 'Первісне знання (Primal Knowledge)'],
    4: ['Покращення характеристик / Риса'],
    5: ['Додаткова атака', 'Швидкий рух (Fast Movement)'],
    7: ['Дикий інстинкт (Feral Instinct) / Ривок'],
    9: ['Брутальний критичний удар (Brutal Critical)'],
    11: ['Нестримна лють (Relentless Rage)'],
    20: ['Первісний чемпіон (Primal Champion)']
  },
  fighter: {
    1: ['Бойовий стиль (Fighting Style)', 'Друге дихання (Second Wind)', 'Майстерність зброї'],
    2: ['Сплеск дій (Action Surge)'],
    3: ['Особливість підкласу'],
    4: ['Покращення характеристик / Риса'],
    5: ['Додаткова атака'],
    6: ['Покращення характеристик / Риса'],
    9: ['Незламний (Indomitable)'],
    11: ['Додаткова атака (3 атаки)'],
    20: ['Додаткова атака (4 атаки)']
  },
  rogue: {
    1: ['Прихована атака (Sneak Attack)', 'Компетентність (Expertise)', 'Майстерність зброї'],
    2: ['Хитра дія (Cunning Action)'],
    3: ['Особливість підкласу'],
    4: ['Покращення характеристик / Риса'],
    5: ['Неймовірне ухилення (Uncanny Dodge)', 'Коварний удар (Cunning Strike)'],
    7: ['Ухилення (Evasion)'],
    11: ['Надійне вміння (Reliable Talent)'],
    20: ['Удар смерті (Stroke of Luck)']
  },
  cleric: {
    1: ['Божественний домен (Domain)', 'Магія жерця'],
    2: ['Божественний канал (Channel Divinity)'],
    3: ['Особливість підкласу'], // 2024 changes domains a bit but level 3 is subclass features traditionally or new uniformity
    4: ['Покращення характеристик / Риса'],
    5: ['Знищення нежиті (Destroy Undead)'],
    8: ['Божественний удар / Могутнє чаклунство'],
    10: ['Божественне втручання (Divine Intervention)']
  },
  wizard: {
    1: ['Магія Чарівника', 'Містичне Відновлення (Arcane Recovery)'],
    2: ['Вчений (Scholar)'],
    3: ['Особливість підкласу'],
    4: ['Покращення характеристик / Риса'],
    18: ['Майстерність У Заклинаннях (Spell Mastery)'],
    20: ['Характерні Заклинання (Signature Spells)']
  }
};

export function calculateLevelStats(
  classId: string,
  level: number,
  hitDie: number,
  conScore: number
): LevelStats {
  // Бонус майстерності
  const proficiencyBonus = Math.ceil(level / 4) + 1;

  // Окуляри здоров'я (HP)
  const conMod = calculateModifier(conScore);
  const hpAtFirstLevel = hitDie + conMod;
  const hpGainPerLevel = Math.floor(hitDie / 2) + 1 + conMod;
  const hitPoints = hpAtFirstLevel + hpGainPerLevel * (level - 1);

  // Комірки заклинань
  let spellSlots: SpellSlots | null = null;
  switch (classId) {
    case 'bard':
    case 'cleric':
    case 'druid':
    case 'sorcerer':
    case 'wizard':
      spellSlots = { standard: fullCasterSlots[level] };
      break;
    case 'paladin':
    case 'ranger':
      spellSlots = { standard: halfCasterSlots2024[level] };
      break;
    case 'warlock':
      spellSlots = { warlockPact: warlockPactSlots[level] };
      break;
    default:
      spellSlots = null;
  }

  // Особливості класу
  const featuresMap = classFeaturesMap[classId] || {};
  let features: string[] = [];
  
  // Якщо хочемо повертати ТІЛЬКИ ті, що відкрилися на поточному рівні:
  if (featuresMap[level]) {
    features = featuresMap[level];
  } else {
    // Дефолт (якщо не прописано)
    if (level === 3) features = ['Особливість підкласу'];
    if (level === 4 || level === 8 || level === 12 || level === 16 || level === 19) features = ['Покращення характеристик / Риса'];
  }

  return {
    level,
    proficiencyBonus,
    hitPoints,
    spellSlots,
    features
  };
}
