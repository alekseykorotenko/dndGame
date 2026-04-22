import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Loader2, User, Sword, Brain, ScrollText } from 'lucide-react';
import Markdown from 'react-markdown';

// Ініціалізація Gemini SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function AIAssistant() {
  const [classPref, setClassPref] = useState('');
  const [playstyle, setPlaystyle] = useState('');
  const [personality, setPersonality] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!classPref || !playstyle || !personality) {
      setError('Будь ласка, заповніть усі поля для кращого результату.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedContent(null);

    const prompt = `
      Ви є експертним D&D 2024 AI Помічником (Dungeon Master).
      Користувач хоче створити персонажа за новими правилами D&D 2024 (Player's Handbook 2024).

      Дані користувача:
      - Бажаний клас: ${classPref}
      - Стиль гри: ${playstyle}
      - Особистість: ${personality}

      ВИМОГИ ДО ВІДПОВІДІ:
      1. Строго українською мовою. Термінологія D&D повинна бути українською (Клас, Передісторія, Риса, Спорядження, Сила, Спритність, тощо).
      2. Використовуй формат Markdown.
      3. Відповідь повинна містити наступні 4 розділи з чіткими заголовками другого рівня (##):
         - ## Лист Персонажа 2024 (включаючи Вид, Передісторію, розподіл характеристик з бонусами від Передісторії, Майстерність).
         - ## Передісторія (коротка, цікава історія на 2-3 абзаци, що пояснює особистість та стиль гри).
         - ## Рекомендовані Риси (обов'язково вкажи "Рису Походження" (Origin Feat), яку дає обрана Передісторія на 1 рівні).
         - ## Спорядження (відповідно до стартового набору класу).

      Напиши креативно, але тримайся правил системи 2024 року.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      setGeneratedContent(response.text || 'Не вдалося згенерувати контент.');
    } catch (err: any) {
      console.error(err);
      setError('Сталася помилка під час звернення до ШІ: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-indigo-100">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
            <Sparkles className="w-64 h-64" />
          </div>
          <h2 className="text-3xl font-serif italic font-bold mb-2 relative z-10 flex items-center gap-3">
            <Brain className="w-8 h-8" /> ШІ-Помічник D&D 2024
          </h2>
          <p className="text-indigo-100 relative z-10 max-w-2xl">
            Опишіть героя вашої мрії простими словами, і я автоматично зберу для нього ідеальний аркуш персонажа, передісторію та підберу оптимальні правила.
          </p>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Sword className="w-4 h-4 text-indigo-500" /> Бажаний Клас або Роль
              </label>
              <input 
                type="text" 
                placeholder="Напр. Паладин, танк, який лікує" 
                value={classPref}
                onChange={e => setClassPref(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Sparkles className="w-4 h-4 text-purple-500" /> Стиль Гри
              </label>
              <input 
                type="text" 
                placeholder="Напр. Стелс, магія здалеку, дипломатія" 
                value={playstyle}
                onChange={e => setPlaystyle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <User className="w-4 h-4 text-emerald-500" /> Особистість
              </label>
              <input 
                type="text" 
                placeholder="Напр. Буркотливий, але добрий в душі" 
                value={personality}
                onChange={e => setPersonality(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex justify-center border-b border-slate-100 pb-8 mb-8">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !classPref || !playstyle || !personality}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-3"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> Аналіз Космосу...
                </>
              ) : (
                <>
                   Згенерувати Героя
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-700 p-4 rounded-xl font-medium mb-8 text-center border border-rose-200">
              {error}
            </div>
          )}

          {generatedContent && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                  <ScrollText className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-900">Ваш Новий Персонаж</h3>
              </div>
              
              <div className="prose prose-slate prose-headings:font-serif prose-headings:text-indigo-900 prose-a:text-indigo-600 prose-strong:text-indigo-800 max-w-none bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-inner">
                <Markdown>{generatedContent}</Markdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
