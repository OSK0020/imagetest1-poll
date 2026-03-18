'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Zap, SlidersHorizontal, Settings2, Square, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { translations, Language } from '@/lib/translations';
import { MODELS, getIcon } from '@/lib/models';

interface GenerationBarProps {
  onGenerate: (prompt: string, model: string) => void;
  onStop?: () => void;
  isGenerating: boolean;
  language: Language;
  selectedModelId: string;
  onModelChange: (id: string) => void;
}

export default function GenerationBar({ onGenerate, onStop, isGenerating, language, selectedModelId, onModelChange }: GenerationBarProps) {
  const t = translations[language];
  const [prompt, setPrompt] = useState('');
  const [showModels, setShowModels] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const selectedModel = MODELS.find(m => m.id === selectedModelId) || MODELS[0];

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-50">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          scale: isFocused ? 1.02 : 1
        }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className={cn(
          "relative flex items-center gap-3 p-3 bg-white/90 dark:bg-[#1A1A1A]/80 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500",
          !prompt.trim() && !isGenerating && "animate-glow border-purple-500/30",
          isFocused && "border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
        )}
        dir={language === 'he' ? 'rtl' : 'ltr'}
      >
        {/* Model Selector */}
        <div className="relative">
          <button
            onClick={() => setShowModels(!showModels)}
            className="flex items-center gap-3 px-6 py-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-slate-900 dark:text-white text-[13px] font-bold transition-all border border-slate-200 dark:border-white/10 min-h-[48px]"
          >
            {React.createElement(getIcon(selectedModel.iconName), { className: "w-3 h-3" })}
            <span className="hidden md:inline">{selectedModel.id === 'all' ? (language === 'he' ? 'כל המודלים' : 'All Models') : selectedModel.name}</span>
            <span className="md:hidden">Model</span>
            <SlidersHorizontal className={cn("w-4 h-4 opacity-50", language === 'he' ? "mr-1" : "ml-1")} />
          </button>
<AnimatePresence>
            {showModels && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: -10, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="absolute bottom-full left-0 mb-4 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-white/10 p-2 rounded-3xl shadow-2xl min-w-[240px] max-h-[400px] overflow-y-auto custom-scrollbar"
              >
                {MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onModelChange(model.id);
                      setShowModels(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 w-full px-5 py-4 rounded-2xl text-[13px] font-bold transition-all text-slate-900 dark:text-white",
                      selectedModel.id === model.id ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "hover:bg-slate-100 dark:hover:bg-white/5"
                    )}
                  >
                    {React.createElement(getIcon(model.iconName), { className: "w-3 h-3" })}
                    {model.id === 'all' ? (language === 'he' ? 'כל המודלים' : 'All Models') : model.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="flex-1">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => e.key === 'Enter' && !isGenerating && onGenerate(prompt, selectedModel.id)}
            placeholder={t.placeholder}
            className={cn(
              "w-full bg-transparent border-none outline-none text-slate-900 dark:text-white px-4 text-xl placeholder:text-slate-400 dark:placeholder:text-gray-500 font-medium tracking-tight",
              language === 'he' && "text-right"
            )}
            dir={language === 'he' ? 'rtl' : 'ltr'}
          />
        </div>

        {/* Stop / Generate Button */}
        <div className="flex items-center gap-2">
          {isGenerating && (
            <button
              onClick={onStop}
              className="flex items-center justify-center p-5 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 text-white transition-all transform hover:scale-105"
              title={t.stop}
            >
              <Square className="w-6 h-6 fill-current" />
            </button>
          )}
          
          <button
            disabled={!prompt.trim() || isGenerating}
            onClick={() => onGenerate(prompt, selectedModel.id)}
            className={cn(
              "group flex items-center justify-center p-5 rounded-full transition-all duration-500",
              prompt.trim() && !isGenerating ? "bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/20" : "bg-white/5 text-gray-500 cursor-not-allowed"
            )}
          >
            {isGenerating ? (
              <div className="flex items-center gap-3 px-2">
                 <Loader2 className="w-5 h-5 text-white animate-spin" />
                 <span className="text-xs font-bold text-white hidden md:inline">{t.generating}</span>
              </div>
            ) : (
                <Send className={cn(
                "w-6 h-6 transition-transform duration-500", 
                prompt.trim() && !isGenerating && (language === 'he' ? "group-hover:-translate-x-1 group-hover:-translate-y-1" : "group-hover:translate-x-1 group-hover:-translate-y-1")
              )} />
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
