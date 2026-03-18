'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeBackground from '@/components/ThreeBackground';
import SplashScreen from '@/components/SplashScreen';
import BentoGallery from '@/components/BentoGallery';
import GenerationBar from '@/components/GenerationBar';
import Sidebar from '@/components/Sidebar';
import { usePollinations } from '@/hooks/usePollinations';
import { useAuth } from '@/components/AuthProvider';
import { useTheme } from '@/components/ThemeProvider';
import { LogOut, Maximize2, X, Aperture, Sun, Moon, Menu, User as UserIcon, Loader2, Globe, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { translations, Language } from '@/lib/translations';
import { MODELS } from '@/lib/models';

const Hero = ({ language, selectedModelId, onSelectModel }: { language: Language, selectedModelId: string, onSelectModel: (id: string) => void }) => {
  const t = translations[language];
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-20 px-6 mt-12 mb-8">
       <motion.h1 
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-none"
       >
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            {language === 'en' ? 'AI Models Laboratory' : 'מעבדת מודלי בינה מלאכותית'}
          </span>
       </motion.h1>
       
       <motion.p
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.2 }}
         className="text-slate-500 dark:text-gray-400 max-w-2xl text-lg font-medium"
       >
         {language === 'en' 
           ? "Enter a description below and see in real-time how the world's leading AI models interpret it."
           : "הכניסו תיאור למטה וראו בזמן אמת כיצד מודלי הבינה המלאכותית המובילים בעולם מפרשים אותו."}
       </motion.p>
       
       <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl pt-4">
         {MODELS.filter(m => m.id !== 'all').map((model, idx) => (
            <motion.button
              key={model.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + (idx * 0.05) }}
              onClick={() => onSelectModel(model.id)}
              className={cn(
                "px-5 py-2.5 rounded-full border transition-all text-[13px] font-bold",
                selectedModelId === model.id 
                  ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25" 
                  : "border-slate-200 dark:border-white/10 bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 text-slate-600 dark:text-gray-400"
              )}
            >
              {model.name}
            </motion.button>
         ))}
       </div>
    </div>
  );
};

export default function Home() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState<'generator' | 'archive'>('generator');
  const [language, setLanguage] = useState<Language>('en');
  const [showHebrewWarning, setShowHebrewWarning] = useState(false);
  
  const t = translations[language];
  
  const { user, signIn, logout: firebaseLogout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [recentModel, setRecentModel] = useState<string>('all');
  const [selectedModelId, setSelectedModelId] = useState(MODELS[0].id);

  const { 
    images, 
    history,
    isGenerating, 
    isTranslating, 
    keyAnalysis, 
    generateImage, 
    verifyKey, 
    fetchHistory,
    stopGeneration,
    clearHistory
  } = usePollinations(apiKey, user?.uid || null);

  const onGenerate = (p: string, m: string) => {
    setRecentModel(m);
    generateImage(p, m);
  };

  // Load API key
  useEffect(() => {
    const savedKey = localStorage.getItem('pollinations_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  // Fetch history when user signs in
  useEffect(() => {
    if (user && apiKey) {
      fetchHistory();
    }
  }, [user, apiKey, fetchHistory]);

  const handleConnect = async (key: string): Promise<boolean> => {
    setIsVerifying(true);
    const isValid = await verifyKey(key);
    
    if (isValid) {
      setApiKey(key);
      localStorage.setItem('pollinations_api_key', key);
    }
    
    setIsVerifying(false);
    return !!isValid;
  };

  const handleLogout = () => {
    setApiKey(null);
    localStorage.removeItem('pollinations_api_key');
    firebaseLogout();
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      await clearHistory();
      await user.delete();
      handleLogout();
    } catch (err) {
      console.error("Delete account error:", err);
      // Fallback: just logout if delete fails due to re-auth requirement
      handleLogout();
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'he' : 'en';
    setLanguage(newLang);
    if (newLang === 'he') {
      setShowHebrewWarning(true);
      setTimeout(() => setShowHebrewWarning(false), 6000);
    }
  };

  return (
    <main className="min-h-screen text-slate-950 dark:text-white overflow-x-hidden selection:bg-purple-500/30">
      <ThreeBackground />
      
      <AnimatePresence mode="wait">
        {!apiKey ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
          >
            <SplashScreen onConnect={handleConnect} isVerifying={isVerifying} />
          </motion.div>
        ) : (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-10 pt-24 pb-40"
          >
            {/* Header */}
            <div className={cn(
               "fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center transition-all duration-500",
               "bg-white/80 dark:bg-black/20 backdrop-blur-xl border-b border-white/5",
               language === 'he' && "flex-row-reverse"
            )} dir={language === 'he' ? 'rtl' : 'ltr'}>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-2xl transition-all border border-slate-200 dark:border-white/5"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/10 p-0.5">
                    <div className="w-full h-full rounded-xl border border-white/20 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                      <Aperture className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h1 className="text-xl font-black tracking-tighter uppercase hidden sm:block">
                    {language === 'en' ? (
                      <>AI Models <span className="text-purple-500">Laboratory</span></>
                    ) : (
                      <><span className="text-purple-500">בינה מלאכותית</span> מעבדת מודלי</>
                    )}
                    {view === 'archive' && <span className={cn(
                      "text-xs opacity-50 font-medium bg-white/10 px-2 py-1 rounded-lg",
                      language === 'he' ? "mr-3" : "ml-3"
                    )}>{t.archive.toUpperCase()}</span>}
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {view === 'archive' && (
                  <button
                    onClick={() => setView('generator')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
                  >
                    {t.backToGen}
                  </button>
                )}
                
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl transition-all"
                  title={t.language}
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-xs font-bold hidden md:inline">{language.toUpperCase()}</span>
                </button>

                <button
                  onClick={toggleTheme}
                  className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl transition-all"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {user ? (
                   <button 
                     onClick={() => setIsSidebarOpen(true)}
                     className="flex items-center gap-2 p-1 pr-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-all font-bold text-sm"
                   >
                     <img src={user.photoURL || ''} className="w-8 h-8 rounded-full border border-purple-500" alt="" />
                     <span className="hidden md:inline">{user.displayName?.split(' ')[0]}</span>
                   </button>
                ) : (
                  <button
                    onClick={signIn}
                    className="flex items-center gap-2 px-6 py-3 google-btn-live rounded-2xl transition-all text-sm font-black text-white shadow-xl shadow-blue-500/20"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {t.signIn}
                  </button>
                )}
              </div>
            </div>

            {/* Hebrew Warning Toast */}
            <AnimatePresence>
              {showHebrewWarning && (
                <motion.div
                  initial={{ opacity: 0, y: -20, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: -20, x: '-50%' }}
                  className="fixed top-28 left-1/2 z-[100] bg-orange-500/90 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-md w-[90vw]"
                  dir={language === 'he' ? 'rtl' : 'ltr'}
                >
                  <AlertCircle className="w-6 h-6 text-white shrink-0" />
                  <p className="text-sm font-bold text-white leading-tight">
                    {t.hebrewWarning}
                  </p>
                  <button onClick={() => setShowHebrewWarning(false)} className={cn("text-white/60 hover:text-white", language === 'he' ? "mr-auto" : "ml-auto")}>
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Translation Progress Toast */}
            <AnimatePresence>
              {isTranslating && (
                <motion.div
                  initial={{ opacity: 0, y: -20, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: -20, x: '-50%' }}
                  className="fixed top-28 left-1/2 z-[100] bg-blue-600/90 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3"
                  dir={language === 'he' ? 'rtl' : 'ltr'}
                >
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span className="text-sm font-bold text-white tracking-wide">{t.translateToast}</span>
                </motion.div>
              )}
            </AnimatePresence>

             {/* Main Content */}
             {view === 'generator' && images.length === 0 && (
               <Hero 
                 language={language} 
                 selectedModelId={selectedModelId} 
                 onSelectModel={setSelectedModelId} 
               />
             )}
             
             <BentoGallery 
               images={view === 'generator' ? images : history} 
               onOpenImage={setSelectedImage} 
               isUniform={recentModel === 'all' && view === 'generator'}
             />
             
             {/* Bottom Input Area */}
             {view === 'generator' && (
               <GenerationBar 
                 onGenerate={onGenerate} 
                 onStop={stopGeneration}
                 isGenerating={isGenerating} 
                 language={language} 
                 selectedModelId={selectedModelId}
                 onModelChange={setSelectedModelId}
               />
             )}
          </motion.div>
        )}
      </AnimatePresence>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        apiKey={apiKey}
        keyAnalysis={keyAnalysis}
        usageCount={images.length}
        history={history}
        onViewArchive={() => setView('archive')}
        language={language}
        onApiKeyChange={handleConnect}
        onClearHistory={clearHistory}
        onDeleteAccount={handleDeleteAccount}
        side={language === 'he' ? 'right' : 'left'}
      />

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-10 right-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>
            <motion.img
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              src={selectedImage}
              className="max-w-full max-h-[85vh] rounded-[2rem] shadow-2xl overflow-hidden border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
