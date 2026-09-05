import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layers, ShieldAlert, Hammer, Disc, Sparkles, Activity } from 'lucide-react';

export const CraftSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

  return (
    <section id="craft" className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-black/[0.06] dark:border-white/[0.08] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-[#c5a059]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[11px] font-bold uppercase tracking-wider text-[#86868b] mb-3 border border-black/[0.06] dark:border-white/[0.08]">
          <Sparkles className="w-3 h-3 text-[#c5a059]" />
          <span>{isZh ? '制造哲学与材料工程' : 'Material Engineering & Craft'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
          {isZh ? '严苛工艺与机械美学' : 'Mastery in Mechanical Craftsmanship'}
        </h2>
        <p className="mt-3 text-sm text-[#6e6e73] dark:text-[#86868b] leading-relaxed tracking-tight max-w-2xl mx-auto">
          {isZh
            ? '从瑞士微型无刷电机到传承千年的失蜡法纯铜重铸，Kylin 坚持以手术刀般的公差制造每一支纹身笔。'
            : 'From Swiss-engineered micromotors to centuries-old lost-wax brass smelting, Kylin crafts every instrument with surgical tolerances.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1: Titanium */}
        <div className="glass-panel-elevated rounded-3xl p-8 flex flex-col justify-between hover:border-sky-500/40 transition-all duration-300 group hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.6)]">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-sky-500 uppercase px-2.5 py-1 rounded-full bg-sky-500/10">
                AERO TC4
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              {isZh ? 'Grade 5 航天钛合金 CNC' : 'Aerospace Grade 5 Titanium'}
            </h3>
            <p className="mt-3 text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
              {isZh
                ? '采用五轴联动 CNC 精雕加工中心雕琢成型，拥有无与伦比的高抗拉强度与防腐蚀性能，手感重心恰好落在虎口正中。'
                : 'Sculpted on 5-axis CNC machining centers. Delivers extreme tensile strength, zero corrosion, and perfect center-of-gravity ergonomics.'}
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#86868b]">CNC TOLERANCE</span>
            <span className="text-sky-500 font-bold">±0.002 mm</span>
          </div>
        </div>

        {/* Card 2: Lost-Wax Brass */}
        <div className="glass-panel-elevated rounded-3xl p-8 flex flex-col justify-between hover:border-[#c5a059]/50 transition-all duration-300 group hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.6)]">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#c5a059]/15 text-[#c5a059] flex items-center justify-center">
                <Hammer className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#c5a059] uppercase px-2.5 py-1 rounded-full bg-[#c5a059]/10">
                HERITAGE 65#
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              {isZh ? '古法失蜡法 65 纯黄铜铸造' : 'Heritage Lost-Wax Cast Brass'}
            </h3>
            <p className="mt-3 text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
              {isZh
                ? '每一具黑鬼与经典线圈机机身，均通过传统失蜡法熔铸，经数小时手工打磨与草本药水做旧，赋予以不可复制的温度与灵魂。'
                : 'Every Black Ghost chassis is poured using traditional lost-wax methods, aged with organic blue chemical wash for distinct individual character.'}
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#86868b]">INGOT COMPOSITION</span>
            <span className="text-[#c5a059] font-bold">65 SOLID BRASS</span>
          </div>
        </div>

        {/* Card 3: DSP Telemetry */}
        <div className="glass-panel-elevated rounded-3xl p-8 flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300 group hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.6)]">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-500 uppercase px-2.5 py-1 rounded-full bg-emerald-500/10">
                DYNAMIC DSP
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              {isZh ? '双电智能数字调频' : 'Dual-Battery Telemetry'}
            </h3>
            <p className="mt-3 text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
              {isZh
                ? '微电脑实时监测阻抗与马达扭矩，智能补偿由于刺穿致密皮肤带来的压降，确保每一针都具有精准恒定的入色深度。'
                : 'Microcontroller monitors real-time skin resistance and compensates torque instantly, ensuring unwavering needle penetration.'}
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#86868b]">FEEDBACK LOOP</span>
            <span className="text-emerald-500 font-bold">1,000 Hz PID</span>
          </div>
        </div>
      </div>
    </section>
  );
};

