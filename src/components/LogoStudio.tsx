import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Loader2, Wand2, Download, RefreshCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const animations = [
  { id: 'none', label: 'Static' },
  { id: 'bounce', label: 'Bounce' },
  { id: 'spin', label: 'Spin' },
  { id: 'pulse', label: 'Pulse' },
  { id: 'float', label: 'Float' },
  { id: 'flip', label: 'Flip' },
];

export default function LogoStudio() {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [logoData, setLogoData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeAnimation, setActiveAnimation] = useState('float');

  const generateLogo = async () => {
    if (!description.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      // Create a solid prompt to encourage a good logo style
      const prompt = `A clean, professional minimalist company logo based on this description: ${description}. Flat design, vector style, white background, high quality, centered.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        }
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${base64EncodeString}`;
          setLogoData(imageUrl);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        throw new Error('No image returned from the AI model.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate logo. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getAnimationProps = () => {
    switch (activeAnimation) {
      case 'bounce':
        return {
          animate: { y: [0, -20, 0] },
          transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'spin':
        return {
          animate: { rotate: 360 },
          transition: { duration: 8, repeat: Infinity, ease: 'linear' }
        };
      case 'pulse':
        return {
          animate: { scale: [1, 1.05, 1] },
          transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'float':
        return {
          animate: { y: [-10, 10, -10] },
          transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'flip':
        return {
          animate: { rotateY: 360 },
          transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        };
      default:
        return { animate: {} };
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-3">
          AI Logo Studio
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Describe your company's vibe, and we'll generate a custom logo and animate it for you.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8 items-start">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Company Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. A futuristic coffee shop with neon elements and a robotic barista theme..."
              className="w-full min-h-[140px] bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none mb-4"
              disabled={isGenerating}
            />
            <button
              onClick={generateLogo}
              disabled={isGenerating || !description.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3.5 px-4 font-medium transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Logo...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Design Logo
                </>
              )}
            </button>
            {error && (
              <p className="text-sm text-rose-600 mt-3 font-medium bg-rose-50 p-3 rounded-lg">
                {error}
              </p>
            )}
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-slate-900 font-medium">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Animation Effects
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {animations.map((anim) => (
                <button
                  key={anim.id}
                  onClick={() => setActiveAnimation(anim.id)}
                  className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                    activeAnimation === anim.id
                      ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-transparent border'
                  }`}
                >
                  {anim.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white border border-slate-200 rounded-3xl aspect-square flex items-center justify-center p-8 relative overflow-hidden shadow-sm">
            
            <AnimatePresence mode="popLayout">
              {logoData ? (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full h-full flex flex-col items-center justify-center relative z-10"
                >
                  <motion.img 
                    src={logoData} 
                    alt="Generated Logo" 
                    className="w-full max-w-[320px] h-auto object-contain rounded-xl drop-shadow-xl"
                    {...getAnimationProps()}
                  />
                  
                  <div className="absolute top-4 right-4 flex gap-2">
                    <a
                      href={logoData}
                      download="logo.png"
                      className="bg-white/80 backdrop-blur-md hover:bg-white text-slate-700 p-2.5 rounded-xl shadow-sm transition-all"
                      title="Download Logo"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-slate-400 max-w-sm absolute inset-0 m-auto h-fit flex flex-col items-center"
                >
                  <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                    <Wand2 className="w-8 h-8 text-slate-300" />
                  </div>
                  <p>Your generated logo will appear here.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pattern background */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
                 style={{ 
                   backgroundImage: `radial-gradient(#0f172a 2px, transparent 2px)`, 
                   backgroundSize: '24px 24px' 
                 }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
