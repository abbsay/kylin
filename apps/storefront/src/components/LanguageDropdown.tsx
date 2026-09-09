import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

interface LanguageDropdownProps {
  size?: 'sm' | 'md';
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ size = 'md' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = i18n.language.startsWith('zh') ? 'zh' : 'en';

  const selectLanguage = (lang: 'en' | 'zh') => {
    i18n.changeLanguage(lang);
    try {
      localStorage.setItem('kylin_user_lang_pref', lang);
      localStorage.setItem('i18nextLng', lang);
    } catch {
      // ignore
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const buttonPadding = size === 'sm' ? 'p-1.5' : 'p-2';
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Icon-only Apple Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`apple-btn ${buttonPadding} rounded-full transition-all flex items-center justify-center ${
          isOpen
            ? 'bg-black/10 dark:bg-white/15 text-[#c5a059]'
            : 'text-[#515154] dark:text-[#a1a1a6] hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
        }`}
        aria-label="Select Language"
        title="Language / 语言"
        aria-expanded={isOpen}
      >
        <Globe className={`${iconSize} transition-transform ${isOpen ? 'rotate-12' : ''}`} />
      </button>

      {/* Floating Apple-Style Dropdown Menu (Emil Kowalski Origin & Physics Standard) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 glass-panel-elevated py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.55)] border border-black/[0.08] dark:border-white/[0.12] rounded-2xl z-50 origin-top-right animate-apple-menu">
          <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#86868b] border-b border-black/[0.04] dark:border-white/[0.06] mb-1">
            Language / 语言
          </div>

          <div className="p-1 space-y-0.5">
            {/* English */}
            <button
              onClick={() => selectLanguage('en')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all ${
                currentLang === 'en'
                  ? 'bg-[#c5a059]/10 text-[#c5a059] font-medium'
                  : 'text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/5 dark:hover:bg-white/8'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs">English</span>
                <span className="text-[10px] text-[#86868b]">(US)</span>
              </div>
              {currentLang === 'en' && <Check className="w-3.5 h-3.5 text-[#c5a059]" />}
            </button>

            {/* 简体中文 */}
            <button
              onClick={() => selectLanguage('zh')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all ${
                currentLang === 'zh'
                  ? 'bg-[#c5a059]/10 text-[#c5a059] font-medium'
                  : 'text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/5 dark:hover:bg-white/8'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs">简体中文</span>
                <span className="text-[10px] text-[#86868b]">(ZH)</span>
              </div>
              {currentLang === 'zh' && <Check className="w-3.5 h-3.5 text-[#c5a059]" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
