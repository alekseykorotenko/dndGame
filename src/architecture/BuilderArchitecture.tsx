/**
 * React Architect: JSON-Driven Character Builder Architecture
 * 
 * 1. STATE FLOW DIAGRAM (Text-based)
 * ---------------------------------------------------------
 * [ JSON Data Files ] ---> [ dndData.ts (Normalization) ]
 *                                   |
 *                                   v
 *                  [ CharacterContext (Central State) ]
 *                                   |
 *         +-------------------------+-------------------------+
 *         |                         |                         |
 * [ ClassSelector ]      [ BackgroundSelector ]       [ FeatSelector ]
 * (Dynamic Mapping)       (Dynamic Mapping)          (Dynamic Mapping)
 *         |                         |                         |
 *         +--------> [ CharacterState Update ] <--------------+
 *                                   |
 *                                   v
 *                       [ CharacterResult/Sheet ]
 * ---------------------------------------------------------
 */

import React from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { classesData, backgroundsData, featsData } from '../lib/dndData';

/**
 * Generic Selector Component
 * 
 * This architect pattern replaces hardcoded lists with dynamic injectors.
 */
interface SelectorProps<T> {
  title: string;
  data: T[];
  selectedId: string | null;
  onSelect: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
}

function GenericSelector<T extends { id: string }>({ 
  title, data, selectedId, onSelect, renderItem 
}: SelectorProps<T>) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelect(item)}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
              selectedId === item.id 
                ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                : 'border-slate-200 hover:border-indigo-200 bg-white'
            }`}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * ARCHITECTURAL IMPLEMENTATIONS
 */

export const DynamicClassSelector = () => {
  const { char, setChar } = useCharacterContext();
  return (
    <GenericSelector
      title="Оберіть Клас"
      data={classesData}
      selectedId={char.classId}
      onSelect={(cls) => setChar(p => ({ ...p, classId: cls.id }))}
      renderItem={(cls) => (
        <div>
          <h4 className="font-bold">{cls.name}</h4>
          <p className="text-sm text-slate-500 line-clamp-2">{cls.description}</p>
        </div>
      )}
    />
  );
};

export const DynamicBackgroundSelector = () => {
  const { char, setChar } = useCharacterContext();
  return (
    <GenericSelector
      title="Оберіть Передісторію"
      data={backgroundsData}
      selectedId={char.backgroundId}
      onSelect={(bg) => setChar(p => ({ ...p, backgroundId: bg.id }))}
      renderItem={(bg) => (
        <div>
          <h4 className="font-bold">{bg.name}</h4>
          <span className="text-[10px] uppercase font-bold text-emerald-600">Риса: {bg.originFeatName}</span>
        </div>
      )}
    />
  );
};

export const DynamicFeatSelector = () => {
  const { char, setChar } = useCharacterContext();
  // Example of JSON-driven filtering
  const originFeats = featsData.filter(f => f.category === 'Origin');

  return (
    <GenericSelector
      title="Оберіть Рису Походження"
      data={originFeats}
      selectedId={char.extraFeatId}
      onSelect={(feat) => setChar(p => ({ ...p, extraFeatId: feat.id }))}
      renderItem={(feat) => (
        <div>
          <h4 className="font-bold">{feat.name}</h4>
          <p className="text-xs text-slate-500">{feat.description}</p>
        </div>
      )}
    />
  );
};
