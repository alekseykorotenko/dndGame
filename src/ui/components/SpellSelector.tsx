import React, { useState, useMemo } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { spellsData } from '../../engine/adapters/dndData';
import { 
  getAvailableSpells, 
  getSpellLimits, 
  toggleSpell, 
  validateSpellSelection 
} from '../../engine/core/spellSystem';
import { Search, Sparkles, Wand2, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SpellSelector() {
  const { char, setChar } = useCharacterContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');
  const [filterSchool, setFilterSchool] = useState<string>('all');

  // Logic: Get eligible spells from the engine
  const available = useMemo(() => {
    return getAvailableSpells({
      classId: char.classId || '',
      level: char.level
    }, spellsData);
  }, [char.classId, char.level]);

  // Logic: Calculate limits
  const { leveledLimit, cantripLimit } = useMemo(() => {
    return getSpellLimits({
      classId: char.classId || '',
      level: char.level
    });
  }, [char.classId, char.level]);

  // Logic: Filtering the visible list
  const filteredList = useMemo(() => {
    return available.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchLevel = filterLevel === 'all' || s.level === filterLevel;
      const matchSchool = filterSchool === 'all' || s.school.toLowerCase() === filterSchool.toLowerCase();
      return matchSearch && matchLevel && matchSchool;
    });
  }, [available, searchTerm, filterLevel, filterSchool]);

  const uniqueSchools = useMemo(() => {
    const schools = new Set(available.map(s => s.school));
    return Array.from(schools).sort();
  }, [available]);

  const selectionValidation = validateSpellSelection({
    classId: char.classId || '',
    level: char.level,
    selectedCantrips: char.selectedCantrips,
    selectedSpells: char.selectedSpells
  }, spellsData);

  const handleToggle = (spellId: string, isCantrip: boolean) => {
    const updated = toggleSpell(char, spellId, isCantrip);
    setChar(updated);
  };

  if (!char.classId) {
    return (
      <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-3xl">
        <p className="text-slate-500 italic">Спершу оберіть клас персонажа, щоб налаштувати магію.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Status */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-indigo-600">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-xl font-bold text-slate-900">Фокуси (Cantrips)</h2>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-3xl font-black text-slate-900">{char.selectedCantrips?.length || 0}</span>
              <span className="text-slate-400 font-bold mx-2">/</span>
              <span className="text-xl text-slate-500 font-medium">{cantripLimit}</span>
            </div>
            {char.selectedCantrips?.length === cantripLimit && (
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            )}
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${Math.min(100, ((char.selectedCantrips?.length || 0) / cantripLimit) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-purple-600">
            <Wand2 className="w-6 h-6" />
            <h2 className="text-xl font-bold text-slate-900">Заклинання (Spells)</h2>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-3xl font-black text-slate-900">{char.selectedSpells?.length || 0}</span>
              <span className="text-slate-400 font-bold mx-2">/</span>
              <span className="text-xl text-slate-500 font-medium">{leveledLimit}</span>
            </div>
            {char.selectedSpells?.length === leveledLimit && (
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            )}
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${Math.min(100, ((char.selectedSpells?.length || 0) / leveledLimit) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Validation Errors Overlay */}
      {!selectionValidation.isValid && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <ul className="text-sm text-rose-700 space-y-1">
            {selectionValidation.errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </motion.div>
      )}

      {/* Filters Area */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Пошук магії..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
          >
            <option value="all">Рівень</option>
            <option value={0}>Фокуси</option>
            {[1,2,3,4,5].map(l => <option key={l} value={l}>Рівень {l}</option>)}
          </select>

          <select 
            value={filterSchool}
            onChange={(e) => setFilterSchool(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm capitalize"
          >
            <option value="all">Школа</option>
            {uniqueSchools.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Spell Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode='popLayout'>
          {filteredList.map((spell) => {
            const isCantrip = spell.level === 0;
            const isSelected = isCantrip 
              ? char.selectedCantrips?.includes(spell.id)
              : char.selectedSpells?.includes(spell.id);

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={spell.id}
                onClick={() => handleToggle(spell.id, isCantrip)}
                className={`group cursor-pointer p-5 rounded-3xl border-2 transition-all relative ${
                  isSelected 
                    ? 'border-indigo-600 bg-indigo-50 shadow-md translate-y-[-2px]' 
                    : 'border-slate-100 hover:border-indigo-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${
                    isCantrip ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {isCantrip ? 'Фокус' : `Рівень ${spell.level}`}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase">{spell.school}</span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                  {spell.name}
                </h3>
                
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 italic mb-4">
                  {spell.description}
                </p>

                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mt-2 pt-2 border-t border-slate-50 gap-2">
                  <div className="flex items-center gap-1">
                    <Wand2 className="w-3 h-3" />
                    {spell.castingTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {spell.range}
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-[-8px] right-[-8px] bg-indigo-600 text-white p-1 rounded-full shadow-lg">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredList.length === 0 && (
        <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
          <p className="text-slate-400">Нічого не знайдено за заданими фільтрами.</p>
        </div>
      )}
    </div>
  );
}
