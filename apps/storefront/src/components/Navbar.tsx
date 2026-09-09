import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { useStore } from '../lib/StoreContext';
import { ShoppingBag, Sun, Moon, User, Menu, X, ChevronRight, Download } from 'lucide-react';
import { LanguageDropdown } from './LanguageDropdown';
import { MiniCartBadge } from './MiniCartBadge';
import { openPwaInstallGuide } from './PwaInstallPrompt';


export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, cart, setIsCartOpen, currentUser } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isZh = i18n.language.startsWith('zh');

  const navLinks = [
    { href: '/#catalog', label: isZh ? '精选机型' : 'Hardware' },
    { href: '/#compare', label: isZh ? '规格矩阵' : 'Specs Matrix' },
    { href: '/#parts', label: isZh ? '偏心轮配件' : 'Parts & Tuning' },
    { href: '/#craft', label: isZh ? '材料工艺' : 'Craftsmanship' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-200">
      {/* 1. Apple Global Announcement Ribbon (32px) */}
      <div className="w-full bg-[#161617] text-white/90 dark:bg-[#101012] h-8 px-4 text-center text-[11px] font-medium border-b border-black/10 dark:border-white/[0.08] flex items-center justify-center gap-2 backdrop-blur-xl select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block shrink-0" />
        <span className="tracking-tight truncate">
          {isZh
            ? 'Free Shipping. 全球2-4周到货，中国直发。'
            : 'Free Shipping. Worldwide delivery in 2-4 weeks, direct from China.'}
        </span>
      </div>

      {/* 2. Apple Global 44px Translucent Edge-to-Edge Navigation Bar */}
      <nav
        aria-label="Global"
        className="w-full h-11 bg-white/80 dark:bg-[#161617]/80 backdrop-blur-2xl backdrop-saturate-180 border-b border-black/[0.08] dark:border-white/[0.08] transition-colors duration-200"
      >
        <div className="max-w-[1024px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
          {/* Brand Logo / Kylin Monogram */}
          <Link
            to="/"
            className="flex items-center gap-2 group cursor-pointer shrink-0"
            aria-label="Kylin Tattoo Home"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#1d1d1f] via-[#c5a059] to-[#fbfbfd] dark:from-[#c5a059] dark:via-[#99732b] dark:to-[#161617] p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-[#000000] rounded-full flex items-center justify-center text-[10px] font-bold text-[#c5a059] group-hover:scale-105 transition-transform">
                K
              </div>
            </div>
            <span className="font-brand font-bold tracking-[0.14em] text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:text-[#c5a059] transition-colors">
              KYLIN
            </span>
          </Link>

          {/* Desktop Navigation Links - Apple 12px Exact Global Nav Typography */}
          <div className="hidden md:flex items-center gap-8 text-[12px] font-normal tracking-[-0.01em]">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#1d1d1f]/75 dark:text-[#f5f5f7]/75 hover:text-[#000000] dark:hover:text-[#ffffff] transition-opacity duration-150"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Controls: Language, Theme, Account, Cart, Mobile Toggle */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* Language Selector (Apple Globe Popover) */}
            <LanguageDropdown size="sm" />

            {/* PWA App Installation Trigger */}
            <button
              onClick={openPwaInstallGuide}
              className="apple-btn px-2 py-1 rounded-full text-[#1d1d1f]/70 dark:text-[#f5f5f7]/70 hover:text-[#c5a059] dark:hover:text-[#c5a059] hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-1 transition-all text-xs"
              title={isZh ? '安装桌面/移动 App' : 'Install PWA App'}
              aria-label="Install App"
            >
              <Download className="w-3.5 h-3.5 text-[#c5a059]" />
              <span className="hidden sm:inline text-[11px] font-semibold">{isZh ? '应用' : 'App'}</span>
            </button>

            {/* Account Icon -> Dedicated /account */}
            <Link
              to="/account"
              className="apple-btn w-8 h-8 rounded-full text-[#1d1d1f]/70 dark:text-[#f5f5f7]/70 hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-all relative"
              title={isZh ? '我的艺术家账户' : 'My Artist Account'}
              aria-label="My Account"
            >
              <User className="w-4 h-4" />
              {currentUser && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#161617]" />
              )}
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="apple-btn w-8 h-8 rounded-full text-[#1d1d1f]/70 dark:text-[#f5f5f7]/70 hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-all"
              aria-label="Toggle Theme"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#515154]" />
              )}
            </button>

            {/* Shopping Bag Button (Apple HIG Bag Icon) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="apple-btn w-8 h-8 rounded-full text-[#1d1d1f]/70 dark:text-[#f5f5f7]/70 hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-all relative"
              aria-label="Shopping Bag"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <MiniCartBadge count={totalItems} />
            </button>


            {/* Mobile Menu Hamburger (Visible on small screens) */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="apple-btn md:hidden w-8 h-8 rounded-full text-[#1d1d1f]/70 dark:text-[#f5f5f7]/70 hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-all ml-1"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 3. Apple Style Mobile Dropdown Sheet */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[76px] bottom-0 bg-white/95 dark:bg-[#161617]/95 backdrop-blur-3xl z-40 border-b border-black/[0.08] dark:border-white/[0.08] animate-apple-modal overflow-y-auto px-6 py-8">
            <div className="space-y-4">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 text-lg font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] border-b border-black/[0.05] dark:border-white/[0.05] active:text-[#c5a059]"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#86868b]" />
                </a>
              ))}
              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3 text-lg font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] border-b border-black/[0.05] dark:border-white/[0.05]"
              >
                <span>{isZh ? '艺术家账户' : 'Artist Account'}</span>
                <ChevronRight className="w-4 h-4 text-[#86868b]" />
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openPwaInstallGuide();
                }}
                className="w-full flex items-center justify-between py-3 text-lg font-semibold tracking-tight text-[#c5a059] border-b border-black/[0.05] dark:border-white/[0.05]"
              >
                <div className="flex items-center gap-2.5">
                  <Download className="w-5 h-5 text-[#c5a059]" />
                  <span>{isZh ? '安装桌面/移动应用' : 'Install Studio App'}</span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#c5a059]/15 text-[#c5a059] font-mono font-bold">
                  PWA
                </span>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-black/[0.06] dark:border-white/[0.08] text-xs text-[#86868b] space-y-2">
              <p className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                Kylin Tattoo Studio Equipment
              </p>
              <p>
                {isZh
                  ? 'Free Shipping. 全球2-4周到货，中国直发。'
                  : 'Free Shipping. Worldwide delivery in 2-4 weeks, direct from China.'}
              </p>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
