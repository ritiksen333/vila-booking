import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' }
];

const LanguageSwitcher = ({ className }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('app-language', code);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative z-50", className)}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl transition-all border border-white/20"
      >
        <Globe className="w-4 h-4 text-text-primary" />
        <span className="text-xs font-bold text-text-primary uppercase tracking-widest hidden sm:block">
          {currentLang.code}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2 mb-1">
                Select Language
              </p>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={cn(
                    "w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors",
                    i18n.language === lang.code 
                      ? "bg-primary/5 text-primary font-bold" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                  )}
                >
                  <span className="text-sm flex items-center gap-2">
                    <span className="text-lg">{lang.flag}</span>
                    {lang.name}
                  </span>
                  {i18n.language === lang.code && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
