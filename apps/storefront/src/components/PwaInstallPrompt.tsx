import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, X, Smartphone, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const { i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone PWA mode
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandaloneMode) {
      setIsStandalone(true);
      return;
    }

    // Check if user dismissed recently (within 5 days)
    const dismissedAt = localStorage.getItem('kylin_pwa_dismissed');
    if (dismissedAt) {
      const days = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (days < 5) return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Reveal prompt after 3s of interaction
      setTimeout(() => setIsVisible(true), 3000);
    };

    const handleAppInstalled = () => {
      setInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem('kylin_pwa_dismissed', Date.now().toString());
    } catch {
      // ignore
    }
  };

  if (isStandalone || !isVisible || !deferredPrompt) {
    return null;
  }

  return (
    <aside
      aria-label="Install Kylin Tattoo Web App"
      className="fixed bottom-5 right-5 z-40 max-w-sm w-[calc(100vw-2.5rem)] glass-panel-elevated p-4 rounded-3xl border border-black/[0.08] dark:border-white/[0.12] shadow-[0_16px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-apple-modal"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-black dark:bg-[#1a1a1c] border border-[#c5a059]/40 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
          <img src="/pwa-icon.svg" alt="Kylin Tattoo Icon" className="w-9 h-9" />
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight truncate">
              {isZh ? '安装 Kylin 桌面/移动应用' : 'Install Kylin Studio App'}
            </h4>
            <span className="px-1.5 py-0.5 rounded-full bg-[#c5a059]/15 text-[#c5a059] text-[9px] font-mono font-bold shrink-0">
              PWA
            </span>
          </div>
          <p className="text-[11px] text-[#6e6e73] dark:text-[#86868b] mt-0.5 leading-snug line-clamp-2">
            {isZh
              ? '支持离线查看参数矩阵，独立无缝窗口全屏运行。'
              : 'Standalone window, 60fps specs browsing, and offline catalog access.'}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="apple-btn px-3.5 py-1.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:opacity-95 transition-all"
            >
              {installed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
              <span>{installed ? (isZh ? '已安装' : 'Installed') : (isZh ? '立即添加' : 'Install')}</span>
            </button>

            <button
              onClick={handleDismiss}
              className="apple-btn px-3 py-1.5 rounded-full text-xs text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"
            >
              {isZh ? '稍后' : 'Not Now'}
            </button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] p-1 -mr-1 -mt-1 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
