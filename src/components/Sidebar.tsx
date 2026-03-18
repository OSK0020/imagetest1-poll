'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User as UserIcon, 
  History, 
  Settings, 
  LogOut, 
  ShieldCheck,
  Zap,
  BarChart3,
  Maximize2,
  Globe,
  Eye,
  EyeOff,
  Edit3,
  Check,
  Lock,
  Loader2,
  Trash2,
  UserX
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import { KeyAnalysis, ImageItem } from '@/hooks/usePollinations';
import { translations, Language } from '@/lib/translations';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string | null;
  keyAnalysis: KeyAnalysis | null;
  usageCount: number;
  history: ImageItem[];
  onViewArchive: () => void;
  language: Language;
  onApiKeyChange: (key: string) => Promise<boolean>;
  onClearHistory?: () => Promise<void>;
  onDeleteAccount?: () => Promise<void>;
  side?: 'left' | 'right';
}

export default function Sidebar({ 
  isOpen, 
  onClose, 
  apiKey, 
  keyAnalysis, 
  usageCount, 
  history, 
  onViewArchive,
  language,
  onApiKeyChange,
  onClearHistory,
  onDeleteAccount,
  side = 'right'
}: SidebarProps) {
  const { user, logout, signIn } = useAuth();
  const t = translations[language];
  const isRTL = language === 'he';
  
  const [isEditingKey, setIsEditingKey] = React.useState(false);
  const [newKey, setNewKey] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleClearHistory = async () => {
    if (window.confirm(language === 'he' ? 'האם אתה בטוח שברצונך למחוק את כל ההיסטוריה?' : 'Are you sure you want to clear all history?')) {
      await onClearHistory?.();
    }
  };

  const handleDeleteAccount = async () => {
     if (window.confirm(language === 'he' ? 'אזהרה חמורה: מחיקת החשבון תסיר את כל המידע שלך לצמיתות. האם להמשיך?' : 'CRITICAL WARNING: Deleting your account will remove all your data permanently. Continue?')) {
       await onDeleteAccount?.();
     }
  };

  const handleSaveKey = async () => {
    if (!showConfirm && apiKey) {
      setShowConfirm(true);
      return;
    }
    setIsSaving(true);
    const success = await onApiKeyChange(newKey);
    if (success) {
      setIsEditingKey(false);
      setNewKey('');
      setShowConfirm(false);
    }
    setIsSaving(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.aside
              initial={{ x: side === 'right' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: side === 'right' ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                "fixed top-0 bottom-0 w-80 max-w-[90vw] bg-white dark:bg-[#0D0D0D] z-[101] shadow-2xl flex flex-col text-slate-900 dark:text-white",
                side === 'right' ? "right-0 border-l border-slate-200 dark:border-white/10" : "left-0 border-r border-slate-200 dark:border-white/10"
              )}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold">{t.profileAndLabs}</h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors">
                  <X className={cn("w-5 h-5 text-slate-400", isRTL && "rotate-180")} />
                </button>
              </div>

              {/* Profile */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                <div className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 dark:from-purple-600/10 dark:to-blue-600/10 border border-slate-200 dark:border-white/5 rounded-3xl p-6 relative overflow-hidden">
                  <div className="relative z-10 flex items-center gap-4 mb-4">
                    {user ? (
                      <img src={user.photoURL || ''} alt="" className="w-12 h-12 rounded-full border-2 border-purple-500 shadow-xl" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{user?.displayName || t.guestBuilder}</h3>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-black uppercase tracking-widest px-2 py-1 bg-purple-500/10 rounded-full border border-purple-500/10">
                        {keyAnalysis?.isPremium ? t.proMember : t.standard}
                      </span>
                    </div>
                  </div>

                  {!user && (
                    <button 
                      onClick={signIn}
                      className="w-full py-3 bg-slate-900 dark:bg-white/10 hover:opacity-90 text-white rounded-2xl font-bold transition-all text-sm mb-2"
                    >
                      {language === 'he' ? 'התחבר עם גוגל' : 'Sign in with Google'}
                    </button>
                  )}
                </div>

                {/* Secrets Management */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Lock className="w-3 h-3 text-purple-500" />
                    {language === 'he' ? 'ניהול סודות' : 'Secrets Management'}
                  </h4>
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{language === 'he' ? 'מפתח API' : 'API Key'}</span>
                        <span className="text-xs font-mono text-slate-300">
                          ••••••••••••••••
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => setIsEditingKey(!isEditingKey)}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isEditingKey && (
                         <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: 'auto', opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           className="overflow-hidden"
                         >
                           <div className="pt-2 space-y-4">
                             {showConfirm ? (
                               <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 space-y-3">
                                 <p className="text-[10px] text-red-500 font-bold leading-tight">
                                   {language === 'he' 
                                     ? 'אזהרה: שינוי מפתח ה-API עלול להוביל לניתוק מהחשבון ואובדן גישה ליכולות פרימיום. האם ברצונך לשנות?' 
                                     : 'Warning: Changing the API key may lead to logout and loss of premium features. Do you want to change it?'}
                                 </p>
                                 <div className="flex gap-2">
                                   <button 
                                     onClick={handleSaveKey}
                                     className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-bold transition-all"
                                   >
                                     {language === 'he' ? 'כן, שנה מפתח' : 'Yes, change key'}
                                   </button>
                                   <button 
                                     onClick={() => setShowConfirm(false)}
                                     className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-bold transition-all"
                                   >
                                     {t.cancel}
                                   </button>
                                 </div>
                               </div>
                             ) : (
                               <>
                                 <input 
                                   type="password"
                                   value={newKey}
                                   onChange={(e) => setNewKey(e.target.value)}
                                   placeholder={language === 'he' ? 'הכנס מפתח חדש...' : 'Enter new key...'}
                                   className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500/50"
                                 />
                                 <div className="flex gap-2">
                                   <button 
                                     onClick={handleSaveKey}
                                     disabled={!newKey || isSaving}
                                     className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-2"
                                   >
                                     {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                     {t.saveKey}
                                   </button>
                                   <button 
                                     onClick={() => setIsEditingKey(false)}
                                     className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-bold transition-all"
                                   >
                                     {t.cancel}
                                   </button>
                                 </div>
                               </>
                             )}
                           </div>
                         </motion.div>
                       )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Key Analysis / Deep Scan */}
                {apiKey && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3 text-purple-500" />
                      {t.deepScan}
                    </h4>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
                      {/* Budget Spent vs Remaining Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-400">{t.pollenSpent}: {keyAnalysis?.spent || 0}</span>
                          <span className="text-slate-400">{t.limit}: {keyAnalysis?.limit || 100}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${keyAnalysis?.percentage || 0}%` }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                          <div className="text-[9px] uppercase font-bold text-slate-500 mb-1">{t.rateLimit}</div>
                          <div className="text-xs font-bold">{keyAnalysis?.rateLimit || 'N/A'}</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                          <div className="text-[9px] uppercase font-bold text-slate-500 mb-1">{t.status}</div>
                          <div className="text-xs font-bold text-green-500">{t.active}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* History Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <History className="w-3 h-3" />
                    {t.cloudHistory}
                  </h4>
                  {user ? (
                    <div className="space-y-4">
                       <button 
                         onClick={() => {
                           onViewArchive();
                           onClose();
                         }}
                         className="w-full py-4 bg-purple-600/5 dark:bg-purple-600/10 hover:bg-purple-600/10 dark:hover:bg-purple-600/20 text-purple-600 dark:text-purple-500 rounded-2xl font-bold transition-all text-sm border border-purple-500/10 flex items-center justify-center gap-2 shadow-sm shadow-purple-500/10"
                       >
                         <Maximize2 className="w-4 h-4" />
                         {t.openArchive}
                       </button>

                       <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                         {history.slice(0, 10).map((item) => (
                           <div 
                             key={item.id}
                             className="group flex gap-3 p-2 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer overflow-hidden"
                           >
                              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={item.url} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold text-slate-300 truncate tracking-tight">"{item.prompt}"</p>
                                <p className="text-[9px] text-slate-500 font-medium">{item.model}</p>
                              </div>
                           </div>
                         ))}
                         {history.length === 0 && (
                            <div className="text-center py-6 text-[11px] text-slate-500 border border-white/5 border-dashed rounded-xl">
                              {t.noHistory}
                            </div>
                         )}
                       </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-xs text-slate-500 border border-white/5 border-dashed rounded-2xl px-4">
                       {t.signInToSave}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-transparent space-y-3">
                {user && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                       <button 
                         onClick={handleClearHistory}
                         className="flex items-center justify-center gap-2 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 rounded-xl font-bold transition-all text-[10px] border border-slate-200 dark:border-white/5"
                       >
                         <Trash2 className="w-3.5 h-3.5" />
                         {language === 'he' ? 'נקה היסטוריה' : 'Clear History'}
                       </button>
                       <button 
                         onClick={handleDeleteAccount}
                         className="flex items-center justify-center gap-2 py-2.5 bg-red-500/5 hover:bg-red-500/10 text-red-500 rounded-xl font-bold transition-all text-[10px] border border-red-500/10"
                       >
                         <UserX className="w-3.5 h-3.5" />
                         {language === 'he' ? 'מחק חשבון' : 'Delete Account'}
                       </button>
                    </div>
                    
                    <button 
                      onClick={logout}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/5 hover:bg-red-500/10 text-red-500 rounded-2xl font-bold transition-all text-sm mb-1 border border-red-500/10"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.signOut}
                    </button>
                  </>
                )}
                <div className="text-center text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black">
                  {t.version}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
