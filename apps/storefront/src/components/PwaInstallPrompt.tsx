import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, X, Smartphone, Check, Share, PlusSquare, Monitor, Laptop } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

// Global hook to share PWA installation state across Navbar and floating card
type PwaPlatform = 'ios' | 'mac-safari' | 'android' | 'desktop-chrome' | 'other';

export const usePwaState = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [platform, setPlatform] = useState<PwaPlatform>('other');

  useEffect(() => {
    // Detect Standalone Mode
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandaloneMode) {
      setIsStandalone(true);
    }

    // Detect Platform
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua) || (ua.includes('mac') && navigator.maxTouchPoints > 1);
    const isMac = ua.includes('mac') && !isIOS;
    const isSafari = ua.includes('safari') && !ua.includes('chrome') && !ua.includes('chromium');
    const isAndroid = ua.includes('android');

    if (isIOS) {
      setPlatform('ios');
    } else if (isMac && isSafari) {
      setPlatform('mac-safari');
    } else if (isAndroid) {
      setPlatform('android');
    } else {
      setPlatform('desktop-chrome');
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const triggerInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      // If no native direct prompt (e.g. Safari or Chrome without heuristic yet), open step-by-step modal
      setIsModalOpen(true);
    }
  };

  return {
    deferredPrompt,
    isStandalone,
    isModalOpen,
    setIsModalOpen,
    platform,
    triggerInstall,
  };
};

// Global event bus for opening PWA modal from any component (like Navbar)
export const openPwaInstallGuide = () => {
  window.dispatchEvent(new CustomEvent('kylin:open-pwa-guide'));
};

export const PwaInstallPrompt: React.FC = () => {
  const { i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');
  const { deferredPrompt, isModalOpen, setIsModalOpen, platform, triggerInstall } = usePwaState();

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Listen to custom event to open guide from Navbar or Footer
    const handleOpenEvent = () => setModalVisible(true);
    window.addEventListener('kylin:open-pwa-guide', handleOpenEvent);
    return () => window.removeEventListener('kylin:open-pwa-guide', handleOpenEvent);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      setModalVisible(true);
    }
  }, [isModalOpen]);

  return (
    <>
      {/* Apple Bespoke PWA Installation Guide Modal (Triggered ONLY on user action: clicking 'App' in Navbar/menu) */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-apple-modal">
          <div
            className="w-full max-w-md glass-panel-elevated rounded-3xl border border-black/[0.08] dark:border-white/[0.12] p-6 shadow-2xl relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setModalVisible(false);
                setIsModalOpen(false);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-all"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header with App Icon */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-13 h-13 rounded-2xl bg-black dark:bg-[#1a1a1c] border border-[#c5a059]/40 flex items-center justify-center shrink-0 shadow-md">
                <img src="/pwa-icon.svg" alt="Kylin Tattoo" className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                  {isZh ? '添加 Kylin Tattoo 到桌面' : 'Install Kylin Tattoo App'}
                </h3>
                <p className="text-xs text-[#86868b] mt-0.5">
                  {isZh ? '无缝全屏体验 · 极速离线载入 · 原生级动效' : 'Native feel · Offline access · Standalone window'}
                </p>
              </div>
            </div>

            {/* Platform-Specific Step Guide */}
            <div className="bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-4 text-xs space-y-3 mb-6">
              {platform === 'ios' ? (
                <>
                  <div className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#c5a059]" />
                    <span>{isZh ? 'iPhone / iPad (iOS Safari) 安装步骤：' : 'iOS Safari Installation:'}</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed">
                    <li>
                      {isZh ? (
                        <>点击底部工具栏的 <strong>“分享”</strong> 图标 <Share className="w-3.5 h-3.5 inline mx-1 text-[#c5a059]" /></>
                      ) : (
                        <>Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline mx-1 text-[#c5a059]" /> at the bottom toolbar</>
                      )}
                    </li>
                    <li>
                      {isZh ? (
                        <>向下滑动并选择 <strong>“添加到主屏幕”</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-[#c5a059]" /></>
                      ) : (
                        <>Scroll down and select <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-[#c5a059]" /></>
                      )}
                    </li>
                    <li>
                      {isZh ? '点击右上角的 “添加” 即可完成' : 'Tap "Add" in the top right corner'}
                    </li>
                  </ol>
                </>
              ) : platform === 'mac-safari' ? (
                <>
                  <div className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-[#c5a059]" />
                    <span>{isZh ? 'Mac Safari 安装为独立应用：' : 'macOS Safari App Installation:'}</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed">
                    <li>
                      {isZh ? '在 Mac 顶部菜单栏中点击 “文件” (File)' : 'Click "File" in your macOS top menu bar'}
                    </li>
                    <li>
                      {isZh ? '选择 “添加到程序坞...” (Add to Dock...)' : 'Select "Add to Dock..."'}
                    </li>
                    <li>
                      {isZh ? '确认添加后即可在程序坞像独立 App 一样打开' : 'Click "Add" to launch Kylin as a native Mac app'}
                    </li>
                  </ol>
                </>
              ) : (
                <>
                  <div className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-[#c5a059]" />
                    <span>{isZh ? 'Chrome / Edge / 桌面浏览器：' : 'Chrome / Edge / Android:'}</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed">
                    <li>
                      {isZh ? (
                        <>查看浏览器地址栏右侧的 <strong>“安装应用”</strong> 图标 (⊕ 或显示器标志)</>
                      ) : (
                        <>Click the <strong>Install</strong> icon in the address bar (⊕ or monitor symbol)</>
                      )}
                    </li>
                    <li>
                      {isZh ? '点击弹出框中的 “安装”，即可以独立窗口运行' : 'Click "Install" in the prompt to run in standalone mode'}
                    </li>
                  </ol>
                </>
              )}
            </div>

            {/* Direct Trigger button if supported */}
            {deferredPrompt && (
              <button
                onClick={() => {
                  triggerInstall();
                  setModalVisible(false);
                }}
                className="w-full apple-btn py-3 rounded-2xl bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-semibold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-all mb-2"
              >
                <Download className="w-4 h-4" />
                <span>{isZh ? '一键安装到本机' : 'Install to this Device'}</span>
              </button>
            )}

            <button
              onClick={() => {
                setModalVisible(false);
                setIsModalOpen(false);
              }}
              className="w-full apple-btn py-2.5 rounded-2xl text-xs text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"
            >
              {isZh ? '我知道了' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
