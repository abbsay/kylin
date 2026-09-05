import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Cpu, Compass, ShieldCheck, Gauge, Activity, Zap, Check } from 'lucide-react';

export const Hero: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');
  const [activeCam, setActiveCam] = useState<'3.5' | '4.2' | '5.0'>('3.5');

  const strokeProfiles = {
    '3.5': {
      titleEn: '3.5mm Dynamic Liner',
      titleZh: '3.5mm 精密割线行程',
      descEn: 'Ultra-crisp needle return for single-needle to 9RL tight lining. Zero skin drag.',
      descZh: '极致清脆的回弹响应，专为单针至 9RL 细密割线与高精度微雕研发。',
      speed: '10,800 RPM',
      voltage: '6.5V - 8.2V',
      vibration: '0.08 mm p-p',
    },
    '4.2': {
      titleEn: '4.2mm Studio Workhorse',
      titleZh: '4.2mm 全能打雾与铺色',
      descEn: 'High-torque kinetic punch. Flawless color saturation and soft black-and-grey shading.',
      descZh: '大扭矩动能爆发，实现丝滑如烟雾的灰阶过渡与致密饱和的饱和铺色。',
      speed: '9,800 RPM',
      voltage: '7.5V - 9.5V',
      vibration: '0.11 mm p-p',
    },
    '5.0': {
      titleEn: '5.0mm Heavy Solid Blast',
      titleZh: '5.0mm 传统大排针爆发',
      descEn: 'Uncompromising direct-drive impact for 25M+ magnum needles in traditional tattooing.',
      descZh: '极具压迫感的直驱动能，针对传统大排针与重磅黑色块提供恒定穿刺力。',
      speed: '8,900 RPM',
      voltage: '8.0V - 10.5V',
      vibration: '0.14 mm p-p',
    },
  };

  const currentProfile = strokeProfiles[activeCam];

  return (
    <section id="hero" className="relative pt-14 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Subtle background ambient gradients - Apple Pro Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-gradient-to-tr from-[#c5a059]/10 via-amber-200/5 to-transparent dark:from-[#c5a059]/10 dark:via-transparent dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[11px] font-semibold tracking-wider text-[#6e6e73] dark:text-[#a1a1a6] uppercase mb-6 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse" />
          <span className="tracking-tight">{t('hero.badge')}</span>
        </div>

        {/* Brand Editorial Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] max-w-4xl mx-auto leading-[1.05]">
          <span>{t('hero.title1')}</span>{' '}
          <span className="bg-gradient-to-r from-[#c5a059] via-[#e5c388] to-[#99732b] bg-clip-text text-transparent font-brand font-bold">
            {t('hero.title2')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-[#6e6e73] dark:text-[#86868b] max-w-2xl mx-auto font-normal leading-relaxed tracking-tight">
          {t('hero.desc')}
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <a
            href="#catalog"
            className="apple-btn px-7 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-[13px] font-semibold hover:opacity-95 transition-all shadow-md flex items-center gap-2 tracking-tight"
          >
            <span>{t('hero.exploreBtn')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="#compare"
            className="apple-btn px-7 py-3 rounded-full glass-panel text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/5 dark:hover:bg-white/10 transition-all tracking-tight"
          >
            {t('hero.specsBtn')}
          </a>
        </div>

        {/* SIGNATURE ELEMENT: Precision Hardware Telemetry & Stroke Simulator */}
        <div className="mt-14 max-w-4xl mx-auto glass-panel-elevated rounded-3xl p-6 sm:p-8 text-left transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-black/[0.06] dark:border-white/[0.08] gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-[#c5a059] uppercase tracking-wider">
                <Gauge className="w-3.5 h-3.5" />
                <span>{isZh ? 'KYLIN 模块化行程拟真调校控制台' : 'Kylin Dynamic Stroke & Kinetic Telemetry'}</span>
              </div>
              <h3 className="text-lg font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mt-1 tracking-tight">
                {isZh ? currentProfile.titleZh : currentProfile.titleEn}
              </h3>
            </div>

            {/* Stroke Cam Switcher - Apple Segmented Control */}
            <div className="flex rounded-full bg-black/[0.05] dark:bg-white/[0.08] p-1 self-start sm:self-auto">
              {(['3.5', '4.2', '5.0'] as const).map(cam => (
                <button
                  key={cam}
                  onClick={() => setActiveCam(cam)}
                  className={`apple-btn px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                    activeCam === cam
                      ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs'
                      : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                >
                  {cam}mm
                </button>
              ))}
            </div>
          </div>

          <p className="py-4 text-xs sm:text-sm text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed">
            {isZh ? currentProfile.descZh : currentProfile.descEn}
          </p>

          {/* Telemetry Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] text-xs">
            <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.03] dark:border-white/[0.04]">
              <span className="text-[10px] uppercase font-semibold text-[#86868b] block">{isZh ? '马达输出转速' : 'Core Speed'}</span>
              <span className="font-mono font-bold text-sm text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5 block">{currentProfile.speed}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.03] dark:border-white/[0.04]">
              <span className="text-[10px] uppercase font-semibold text-[#86868b] block">{isZh ? '建议工作电压' : 'Optimum Voltage'}</span>
              <span className="font-mono font-bold text-sm text-[#c5a059] mt-0.5 block">{currentProfile.voltage}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.03] dark:border-white/[0.04]">
              <span className="text-[10px] uppercase font-semibold text-[#86868b] block">{isZh ? '机身微振幅值' : 'Chassis Vibration'}</span>
              <span className="font-mono font-bold text-sm text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5 block">{currentProfile.vibration}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.03] dark:border-white/[0.04]">
              <span className="text-[10px] uppercase font-semibold text-[#86868b] block">{isZh ? '穿刺深度公差' : 'Stroke Accuracy'}</span>
              <span className="font-mono font-bold text-sm text-emerald-500 mt-0.5 block">±0.002 mm</span>
            </div>
          </div>
        </div>

        {/* Key Innovation Pillars */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="glass-panel p-6 rounded-3xl text-left flex items-start gap-4 hover:shadow-lg transition-all duration-300">
            <div className="p-2.5 rounded-2xl bg-[#c5a059]/15 text-[#c5a059] shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#1d1d1f] dark:text-[#f5f5f7]">
                Swiss & German Cores
              </h4>
              <p className="text-xs text-[#86868b] mt-1.5 leading-relaxed">
                Maxon Brushless & Faulhaber 2610 micromotors engineered for high-torque longevity.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl text-left flex items-start gap-4 hover:shadow-lg transition-all duration-300">
            <div className="p-2.5 rounded-2xl bg-[#c5a059]/15 text-[#c5a059] shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#1d1d1f] dark:text-[#f5f5f7]">
                Lost-Wax Cast Brass
              </h4>
              <p className="text-xs text-[#86868b] mt-1.5 leading-relaxed">
                Solid 65-brass casting with antique chemical patina and hand-wound OFC coils.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl text-left flex items-start gap-4 hover:shadow-lg transition-all duration-300">
            <div className="p-2.5 rounded-2xl bg-[#c5a059]/15 text-[#c5a059] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#1d1d1f] dark:text-[#f5f5f7]">
                Universal Cartridges
              </h4>
              <p className="text-xs text-[#86868b] mt-1.5 leading-relaxed">
                100% precision fit with Kwadron, Cheyenne, Bishop, and standard membrane cartridges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

