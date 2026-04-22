import React from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { classesData, speciesData, backgroundsData } from '../lib/dndData';
import { calculateLevelStats } from '../lib/classProgression';
import { Shield, Heart, Zap, Dna, BookOpen, Star } from 'lucide-react';

export default function ActiveCharacterCard() {
  const { char, setChar, getFinalAbility } = useCharacterContext();
  
  // Здобуваємо необхідні дані з довідників
  const currentClass = classesData.find(c => c.id === char.classId);
  const currentSpecies = speciesData.find(s => s.id === char.speciesId);
  const currentBackground = backgroundsData.find(b => b.id === char.backgroundId);
  
  // Знаходимо фінальну Витривалість та розраховуємо класову статистику
  const conScore = getFinalAbility('con');
  const levelStats = currentClass && char.level 
    ? calculateLevelStats(currentClass.id, char.level, currentClass.hitDie, conScore) 
    : null;

  if (!currentClass || !currentSpecies || !currentBackground) {
    return (
      <div className="bg-slate-50 border border-slate-200 text-slate-500 p-6 rounded-xl text-center italic">
        Заповніть попередні кроки (Клас, Вид, Передісторія), щоб побачити картку персонажа.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white border-2 border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Шапка Картки */}
      <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-serif font-bold text-amber-400 mb-1">Ваш Герой</h2>
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <Shield className="w-4 h-4" /> 
              <span className="font-medium text-white">{currentClass.name}</span>
            </div>
          </div>

          {/* Вибір Рівня (Dropdown) */}
          <div className="flex flex-col items-end">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Рівень Персонажа</label>
            <select
              value={char.level}
              onChange={(e) => setChar(prev => ({ ...prev, level: parseInt(e.target.value) }))}
              className="bg-slate-800 border box-border border-slate-600 text-amber-400 font-black text-xl rounded-lg px-3 py-1 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all cursor-pointer"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map(l => (
                <option key={l} value={l}>Рівень {l}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Декоративний елемент фону */}
        <Shield className="absolute -right-4 -bottom-10 w-48 h-48 text-slate-800 opacity-50 z-0 pointer-events-none" />
      </div>

      {/* Тіло Картки */}
      <div className="p-6 space-y-6">
        
        {/* Блок: Вид та Передісторія */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start gap-3">
            <Dna className="w-6 h-6 text-indigo-500 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Вид (Species)</div>
              <div className="text-lg font-bold text-slate-800">{currentSpecies.name}</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start gap-3">
            <BookOpen className="w-6 h-6 text-emerald-500 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Передісторія</div>
              <div className="text-lg font-bold text-slate-800 mb-1">{currentBackground.name}</div>
              {/* Відображення Риси Згідно з Правилами 2024 */}
              {currentBackground.originFeatName && (
                <div className="text-xs flex items-center gap-1 font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md w-fit">
                  <Star className="w-3 h-3" />
                  Риса: {currentBackground.originFeatName}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Динамічні Статки (залежать від рівня) */}
        {levelStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="border border-slate-200 bg-white p-3 flex flex-col items-center justify-center rounded-xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 mb-1 text-center">Макс. Здоров'я</span>
              <div className="flex items-center gap-1.5 text-2xl font-black text-rose-600">
                <Heart className="w-5 h-5 fill-rose-600" />
                {levelStats.hitPoints}
              </div>
            </div>

            <div className="border border-slate-200 bg-white p-3 flex flex-col items-center justify-center rounded-xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 mb-1 text-center">Бонус Майстерності</span>
              <div className="flex items-center gap-1 text-2xl font-black text-indigo-600">
                <Zap className="w-5 h-5 fill-indigo-600" />
                +{levelStats.proficiencyBonus}
              </div>
            </div>

            <div className="border border-slate-200 bg-white p-3 flex flex-col items-center justify-center rounded-xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 mb-1 text-center">Кістка Здоров'я</span>
              <div className="text-xl font-bold text-slate-800 mt-1">{levelStats.level}d{currentClass.hitDie}</div>
            </div>

            <div className="border border-slate-200 bg-white p-3 flex flex-col items-center justify-center rounded-xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 mb-1 text-center">Заклинання</span>
              <div className="text-xl font-bold text-slate-800 mt-1">
                {levelStats.spellSlots ? 'Доступні' : 'Немає'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
