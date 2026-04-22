import React from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { 
  classesData, speciesData, backgroundsData, featsData, 
  abilityNames, AbilityType, standardArray, calculateModifier 
} from '../lib/dndData';
import { calculateLevelStats } from '../lib/classProgression';
import { CheckCircle2, Star, Backpack, User, Zap } from 'lucide-react';
import ActiveCharacterCard from './ActiveCharacterCard';

export function StepClass() {
  const { char, setChar } = useCharacterContext();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-200 text-sm">
        <strong className="font-bold">Правила 2024:</strong> Клас обирається першим. Це задає вектор розвитку та вказує, які характеристики є "Головними".
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {classesData.map(cls => (
          <button
            key={cls.id}
            onClick={() => setChar({ ...char, classId: cls.id, equipmentPackId: null })}
            className={`text-left p-6 rounded-2xl border-2 transition-all ${
              char.classId === cls.id 
                ? 'border-indigo-600 bg-indigo-50/50 shadow-md transform scale-[1.02]' 
                : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-slate-900">{cls.name}</h3>
              {char.classId === cls.id && <CheckCircle2 className="text-indigo-600 w-6 h-6" />}
            </div>
            <p className="text-sm text-slate-600 mb-4">{cls.description}</p>
            <div className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded font-medium">
              Головна Характеристика: {abilityNames[cls.primaryAbility]}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function StepLevel() {
  const { char, setChar, getFinalAbility } = useCharacterContext();
  const currentClass = classesData.find(c => c.id === char.classId);
  const conScore = getFinalAbility('con');

  const stats = currentClass ? calculateLevelStats(currentClass.id, char.level, currentClass.hitDie, conScore) : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl border border-yellow-200 text-sm">
        <strong className="font-bold">Рівень Персонажа:</strong> Виберіть рівень (від 1 до 20). Характеристики автоматично підлаштуються під ваш вибір.
      </div>
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <label className="block text-sm font-bold text-slate-700 mb-3">Оберіть рівень:</label>
        <div className="flex items-center gap-4">
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={char.level}
            onChange={(e) => setChar({ ...char, level: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="text-2xl font-black text-indigo-600 w-12 text-center">{char.level}</div>
        </div>
      </div>

      {stats && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Статистика на {char.level} рівні
            </h4>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex justify-between border-b border-slate-200 pb-1">
                <span className="font-medium">Бонус Майстерності:</span> 
                <span className="font-bold text-indigo-600">+{stats.proficiencyBonus}</span>
              </li>
              <li className="flex justify-between border-b border-slate-200 pb-1">
                <span className="font-medium">Очки Здоров'я (HP):</span> 
                <span className="font-bold text-emerald-600">{stats.hitPoints}</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-indigo-500" /> Особливості {char.level} рівня
            </h4>
            {stats.features.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                {stats.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 italic">На цьому рівні немає нових класових здібностей.</p>
            )}
          </div>

          {stats.spellSlots && (
            <div className="md:col-span-2 bg-indigo-50 p-5 rounded-xl border border-indigo-100">
              <h4 className="font-bold text-indigo-900 mb-3">Комірки Заклинань (Spell Slots)</h4>
              <div className="flex flex-wrap gap-2 text-sm">
                {stats.spellSlots.standard && stats.spellSlots.standard.map((slots, i) => (
                  <div key={i} className="bg-white border border-indigo-200 px-3 py-1.5 rounded-lg flex flex-col items-center">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase">Рівень {i + 1}</span>
                    <span className="font-black text-indigo-700">{slots}</span>
                  </div>
                ))}
                {stats.spellSlots.warlockPact && stats.spellSlots.warlockPact.slotsCount > 0 && (
                  <div className="bg-purple-100 border border-purple-300 px-4 py-2 rounded-lg flex flex-col items-center">
                    <span className="text-[10px] text-purple-600 font-bold uppercase">Магія Договору (Рвн. {stats.spellSlots.warlockPact.slotLevel})</span>
                    <span className="font-black text-purple-900">{stats.spellSlots.warlockPact.slotsCount} комірок</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function StepOrigin() {
  const { char, setChar } = useCharacterContext();
  const currentBackground = backgroundsData.find(b => b.id === char.backgroundId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-2">1. Оберіть Вид (Species)</h3>
        <p className="text-sm text-slate-600 mb-2">Нові правила: Вид впливає на риси, але <strong>не підвищує характеристики</strong>.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {speciesData.map(sp => (
            <button
              key={sp.id}
              onClick={() => {
                setChar(prev => ({ ...prev, speciesId: sp.id, extraFeatId: sp.id === 'human' ? prev.extraFeatId : null }));
              }}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                char.speciesId === sp.id ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-amber-200'
              }`}
            >
              <div className="font-bold text-slate-900">{sp.name}</div>
              <div className="text-xs text-slate-600 mt-1">{sp.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-2">2. Оберіть Передісторію (Background)</h3>
        <p className="text-sm text-slate-600 mb-2">Передісторія дозволяє підвищити характеристики та дає <strong>Рису Походження</strong>.</p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {backgroundsData.map(bg => (
            <button
              key={bg.id}
              onClick={() => setChar({ ...char, backgroundId: bg.id, backgroundAsi: { plusTwo: null, plusOne: null } })}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                char.backgroundId === bg.id ? 'border-emerald-500 bg-white shadow-sm' : 'border-slate-200 bg-white hover:border-emerald-300'
              }`}
            >
              <div className="font-bold text-slate-900">{bg.name}</div>
              <div className="text-[10px] uppercase text-emerald-600 font-bold mt-2">Дає рису:</div>
              <div className="text-xs text-slate-700">{bg.originFeatName}</div>
            </button>
          ))}
        </div>

        {currentBackground && (
          <div className="bg-white p-5 rounded-xl border-2 border-emerald-500 shadow-sm animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <Star className="w-5 h-5 text-emerald-500" /> Розподіл Бонусів Характеристик
              </h4>
              <button
                onClick={() => {
                  const defaultDist = currentBackground.defaultDistribution;
                  const keys = Object.keys(defaultDist) as AbilityType[];
                  const plusTwo = keys.find(k => defaultDist[k] === 2) as AbilityType | null;
                  const plusOne = keys.find(k => defaultDist[k] === 1) as AbilityType | null;
                  setChar(prev => ({
                    ...prev,
                    backgroundAsi: { plusTwo, plusOne }
                  }));
                }}
                className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition-colors font-medium border border-emerald-200"
              >
                Використати шаблон ({Object.entries(currentBackground.defaultDistribution).map(([k, v]) => `+${v} ${abilityNames[k as AbilityType]}`).join(', ')})
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Бонус +2 до:</label>
                <select 
                  value={char.backgroundAsi.plusTwo || ''}
                  onChange={(e) => setChar(prev => ({...prev, backgroundAsi: { ...prev.backgroundAsi, plusTwo: e.target.value as AbilityType }}))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="" disabled>Оберіть характеристику...</option>
                  {currentBackground.asiOptions.map(opt => (
                    <option key={opt} value={opt} disabled={char.backgroundAsi.plusOne === opt}>{abilityNames[opt]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Бонус +1 до:</label>
                <select 
                  value={char.backgroundAsi.plusOne || ''}
                  onChange={(e) => setChar(prev => ({...prev, backgroundAsi: { ...prev.backgroundAsi, plusOne: e.target.value as AbilityType }}))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="" disabled>Оберіть характеристику...</option>
                  {currentBackground.asiOptions.map(opt => (
                    <option key={opt} value={opt} disabled={char.backgroundAsi.plusTwo === opt}>{abilityNames[opt]}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function StepAbilities() {
  const { char, setChar, getFinalAbility } = useCharacterContext();
  const currentClass = classesData.find(c => c.id === char.classId);
  const usedValues = Object.values(char.baseAbilities).filter(v => v !== null) as number[];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
        <p className="text-sm text-purple-800">Розподіліть <strong>Стандартний набір</strong> (15, 14, 13, 12, 10, 8).</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center p-6">
        <div className="w-full max-w-2xl space-y-3">
          {Object.entries(abilityNames).map(([abKey, abName]) => {
            const ab = abKey as AbilityType;
            const isPrimary = currentClass?.primaryAbility === ab;
            const bonusTotal = (char.backgroundAsi.plusTwo === ab ? 2 : 0) + (char.backgroundAsi.plusOne === ab ? 1 : 0);
            const finalScore = getFinalAbility(ab);
            const mod = calculateModifier(finalScore);
            
            return (
              <div key={ab} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${isPrimary ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-100 bg-slate-50'}`}>
                <div className="w-32 flex flex-col">
                  <span className="font-bold text-slate-800 uppercase text-xs tracking-wider">{abName}</span>
                  {isPrimary && <span className="text-[10px] text-indigo-600 font-bold">ГОЛОВНА</span>}
                </div>
                
                <div className="flex-1">
                  <select
                    value={char.baseAbilities[ab] || ''}
                    onChange={(e) => setChar(prev => ({
                      ...prev,
                      baseAbilities: { ...prev.baseAbilities, [ab]: e.target.value === '' ? null : Number(e.target.value) }
                    }))}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none"
                  >
                    <option value="">- оберіть -</option>
                    {standardArray.map(val => (
                      <option key={val} value={val} disabled={usedValues.includes(val) && char.baseAbilities[ab] !== val}>{val}</option>
                    ))}
                  </select>
                </div>
                
                <div className="w-24 text-center text-xs text-slate-500 font-medium">
                  {bonusTotal > 0 ? <span className="text-emerald-600">+{bonusTotal} Походж.</span> : '--'}
                </div>

                <div className="w-16 h-12 bg-slate-800 text-white rounded-lg flex items-center justify-center text-xl font-serif">
                  {char.baseAbilities[ab] ? finalScore : '-'}
                </div>
                
                <div className="w-12 h-12 bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center font-bold">
                  {char.baseAbilities[ab] ? (mod >= 0 ? `+${mod}` : mod) : '-'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function StepFeats() {
  const { char, setChar } = useCharacterContext();
  const currentBackground = backgroundsData.find(b => b.id === char.backgroundId);
  const primaryFeat = featsData.find(f => f.id === currentBackground?.featId);
  const currentSpecies = speciesData.find(s => s.id === char.speciesId);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-sm text-amber-900">
        У редагуванні 2024 року ви гарантовано отримуєте одну <strong>Рису Походження (Origin Feat)</strong> від вашої Передісторії.
      </div>
      
      {currentBackground && primaryFeat ? (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{primaryFeat.name}</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Отримано від Передісторії: {currentBackground.name}</p>
            </div>
          </div>
          <p className="text-slate-700 leading-relaxed">{primaryFeat.description}</p>
        </div>
      ) : (
        <p className="text-rose-500 text-center py-10 font-medium bg-rose-50 rounded-xl">Будь ласка, оберіть Передісторію на 2 кроці.</p>
      )}

      {currentSpecies?.id === 'human' && (
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-200 shadow-sm mt-6">
          <h3 className="text-lg font-bold text-indigo-900 mb-2">Гнучкість Людини (Додаткова Риса)</h3>
          <p className="text-sm text-indigo-700 mb-4">Представники виду "Людина" отримують ще одну Рису Походження на додаток.</p>
          <select 
            value={char.extraFeatId || ''}
            onChange={(e) => setChar(prev => ({...prev, extraFeatId: e.target.value}))}
            className="w-full bg-white border border-indigo-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>— Оберіть додаткову рису —</option>
            {featsData.filter(f => f.isOrigin && f.id !== primaryFeat?.id).map(feat => (
              <option key={feat.id} value={feat.id}>{feat.name}</option>
            ))}
          </select>
          {char.extraFeatId && (
            <p className="mt-3 text-sm text-slate-700 p-3 bg-white rounded-lg">{featsData.find(f => f.id === char.extraFeatId)?.description}</p>
          )}
        </div>
      )}
    </div>
  );
}

export function StepEquipment() {
  const { char, setChar } = useCharacterContext();
  const currentClass = classesData.find(c => c.id === char.classId);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700">
        У 2024 році класи пропонують "Пакети Спорядження", щоб прискорити процес.
      </div>
      {currentClass ? (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Оберіть стартовий набір для класу: {currentClass.name}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {currentClass.equipmentPacks.map(pack => (
              <button
                key={pack.id}
                onClick={() => setChar(prev => ({...prev, equipmentPackId: pack.id}))}
                className={`text-left p-6 rounded-2xl border-2 transition-all ${
                  char.equipmentPackId === pack.id ? 'border-amber-500 bg-white shadow-md transform scale-[1.02]' : 'border-slate-200 bg-white hover:border-amber-300'
                }`}
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
                  <h4 className="font-bold text-slate-800 text-lg">{pack.name}</h4>
                  {char.equipmentPackId === pack.id && <CheckCircle2 className="text-amber-500 w-6 h-6" />}
                </div>
                <ul className="space-y-2 text-sm text-slate-600">
                  {pack.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> {item}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-rose-500 text-center py-10 font-medium bg-rose-50 rounded-xl">Будь ласка, оберіть Клас на 1 кроці.</p>
      )}
    </div>
  );
}

export function StepSummary() {
  const { char, getFinalAbility } = useCharacterContext();
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState<{type: 'success' | 'error', text: string} | null>(null);

  const isComplete = char.classId && char.speciesId && char.backgroundId && char.equipmentPackId && !Object.values(char.baseAbilities).includes(null);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Невідомий Герой', // В ідеалі тут має бути поле для вводу імені
          classId: char.classId,
          speciesId: char.speciesId,
          backgroundId: char.backgroundId,
          baseAbilities: char.baseAbilities,
          equipmentPackId: char.equipmentPackId
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Сталася невідома помилка');
      }
      setSaveMessage({ type: 'success', text: 'Персонажа успішно збережено в базі даних!' });
    } catch (error: any) {
      setSaveMessage({ type: 'error', text: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {!isComplete && (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-xl border border-rose-200 text-sm font-medium">
          Ви заповнили не всі обов'язкові поля. Будь ласка, перевірте попередні кроки.
        </div>
      )}

      {saveMessage && (
        <div className={`p-4 rounded-xl font-medium text-sm border flex items-center gap-2 ${saveMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
          {saveMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5"/> : <div className="w-5 h-5 text-center font-bold">!</div>}
          {saveMessage.text}
        </div>
      )}

      {/* Жива картка персонажа замість старого текстового блоку */}
      {isComplete ? (
        <>
          <ActiveCharacterCard />
          <div className="mt-8 pt-6 border-t border-slate-200">
             <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-emerald-900/50 transition-all flex justify-center items-center gap-2"
             >
                {isSaving ? 'Збереження...' : <><CheckCircle2 className="w-6 h-6" /> Зберегти Персонажа до Бази Даних</>}
             </button>
          </div>
        </>
      ) : (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-10 text-center text-slate-500">
          Картка персонажа з'явиться тут, щойно ви заповните всі дані.
        </div>
      )}

    </div>
  );
}
