import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AbilityType } from '../lib/dndData';

// Головний інтерфейс стану нашого персонажа
export interface CharacterState {
  classId: string | null;
  speciesId: string | null;
  backgroundId: string | null;
  backgroundAsi: {
    plusTwo: AbilityType | null;
    plusOne: AbilityType | null;
  };
  baseAbilities: Record<AbilityType, number | null>;
  extraFeatId: string | null;
  equipmentPackId: string | null;
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
    classId: null,
    speciesId: null,
    backgroundId: null,
    backgroundAsi: { plusTwo: null, plusOne: null },
    baseAbilities: { ...INITIAL_BASE },
    extraFeatId: null,
    equipmentPackId: null,
  });

  // Логіка динамічного обчислення фінальних характеристик
  const getFinalAbility = (ab: AbilityType) => {
    let score = char.baseAbilities[ab] || 10;
    if (char.backgroundAsi.plusTwo === ab) score += 2;
    if (char.backgroundAsi.plusOne === ab) score += 1;
    return score;
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
