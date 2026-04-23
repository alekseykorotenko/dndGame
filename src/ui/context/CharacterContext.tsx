import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AbilityType } from '../../engine/adapters/dndData';

// Головний інтерфейс стану нашого персонажа
export interface CharacterState {
  level: number;
  classId: string | null;
  subclassId: string | null;
  speciesId: string | null;
  subtypeId: string | null;
  backgroundId: string | null;
  backgroundAsi: Partial<Record<AbilityType, number>>;
  baseAbilities: Record<AbilityType, number | null>;
  extraFeatId: string | null;
  equipmentPackId: string | null;
  chosenMasteries?: string[];
}

interface CharacterContextProps {
  char: CharacterState;
  setChar: React.Dispatch<React.SetStateAction<CharacterState>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  getFinalAbility: (ab: AbilityType) => number;
}

const INITIAL_BASE: Record<AbilityType, number | null> = {
  str: null, dex: null, con: null, int: null, wis: null, cha: null
};

// Створюємо контекст з типом або undefined
const CharacterContext = createContext<CharacterContextProps | undefined>(undefined);

// Провайдер стану, який огортатиме наш Wizard
export function CharacterProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [char, setChar] = useState<CharacterState>({
    level: 1,
    classId: null,
    subclassId: null,
    speciesId: null,
    subtypeId: null,
    backgroundId: null,
    backgroundAsi: {},
    baseAbilities: { ...INITIAL_BASE },
    extraFeatId: null,
    equipmentPackId: null,
    chosenMasteries: [],
  });

  // Логіка динамічного обчислення фінальних характеристик
  const getFinalAbility = (ab: AbilityType) => {
    let score = char.baseAbilities[ab] || 10;
    const bonus = char.backgroundAsi[ab] || 0;
    return score + bonus;
  };

  return (
    <CharacterContext.Provider value={{ char, setChar, currentStep, setCurrentStep, getFinalAbility }}>
      {children}
    </CharacterContext.Provider>
  );
}

// Користувацький хук для зручного доступу до контексту
export function useCharacterContext() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacterContext повинен використовуватись виключно всередині CharacterProvider');
  }
  return context;
}
