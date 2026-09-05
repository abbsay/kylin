import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from '@tanstack/react-router';
import { useStore } from '../lib/StoreContext';
import { AuthView } from '../components/AuthView';
import {
  ArrowLeft,
  Sun,
  Moon,
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';
import { LanguageDropdown } from '../components/LanguageDropdown';

interface AuthPageProps {
  defaultMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ defaultMode = 'login' }) => {
  const { i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');
  const navigate = useNavigate();
  const { currentUser, theme, toggleTheme, cart, setIsCartOpen } = useStore();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // If already logged in, redirect to account page
  useEffect(() => {
    if (currentUser) {
      navigate({ to: '/account' });
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    document.title = isZh
      ? defaultMode === 'login'
        ? '艺术家登录 | 麒麟官方旗舰店'
        : '创建账户 | 麒麟官方旗舰店'
      : defaultMode === 'login'
      ? 'Sign In | Kylin Tattoo Official'
      : 'Register | Kylin Tattoo Official';
  }, [isZh, defaultMode]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfd] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-200 selection:bg-[#c5a059]/20">
      {/* 1. Sleek Apple Minimal Top Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#fbfbfd]/80 dark:bg-[#000000]/80 border-b border-black/[0.06] dark:border-white/[0.08] transition-all">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="apple-btn flex items-center gap-1.5 text-xs text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="font-medium">{isZh ? '返回商店' : 'Store'}</span>
            </Link>

            <span className="text-black/20 dark:text-white/20">/</span>

            <span className="font-brand text-xs font-semibold tracking-wider text-[#1d1d1f] dark:text-[#f5f5f7]">
              KYLIN ID
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <LanguageDropdown size="sm" />

            <button
              onClick={toggleTheme}
              className="apple-btn p-1.5 rounded-full text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="apple-btn relative p-1.5 text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#c5a059] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Centered Apple Pro Auth View */}
      <main className="flex-1 flex items-center justify-center py-12 sm:py-16">
        <AuthView initialMode={defaultMode} />
      </main>

      {/* 3. Understated Footer */}
      <footer className="border-t border-black/[0.06] dark:border-white/[0.08] py-8 text-xs text-[#86868b]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-brand font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">KYLIN TATTOO</span>
            <span>•</span>
            <span>© 2026 Kylin Precision Hardware. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>256-bit Encrypted Session</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
