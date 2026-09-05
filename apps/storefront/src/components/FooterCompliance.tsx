import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { ShieldCheck, Truck, Award, X, Globe, ExternalLink, ShoppingBag } from 'lucide-react';

export const FooterCompliance: React.FC = () => {
  const { i18n } = useTranslation();
  const [activeModal, setActiveModal] = useState<'warranty' | 'shipping' | 'compliance' | null>(null);
  const isZh = i18n.language.startsWith('zh');

  return (
    <footer className="w-full bg-[#f5f5f7] dark:bg-[#111113] text-[#86868b] text-[11px] leading-normal border-t border-black/[0.08] dark:border-white/[0.08] transition-colors duration-200">
      <div className="max-w-[1024px] mx-auto px-4 sm:px-8 py-8 sm:py-10">
        {/* 1. Apple-Grade Disclosures & Footnotes */}
        <section className="border-b border-black/[0.08] dark:border-white/[0.08] pb-6 mb-8 text-[11px] text-[#86868b] space-y-2 leading-relaxed tracking-tight">
          <p>
            {isZh
              ? '1. 全球免邮（Free Shipping）：所有直发订单均由中国高精度装配与无尘检测中心直邮出库，采用国际航空减震特快专线，正常清关周期为 2 至 4 周送达全球各大刺青工作室。'
              : '1. Free Worldwide Shipping: All orders are dispatched direct from our precision cleanroom center in China via air express with shockproof packaging. Typical transit ranges from 14 to 28 business days worldwide.'}
          </p>
          <p>
            {isZh
              ? '2. 官方 2 年机芯质保：正品 Kylin 纹身机所搭载的原装瑞士 Maxon 与德国 Faulhaber 无刷微电机均享有自签收之日起 2 年官方机芯无忧质保。对于非正常浸液或人为跌落损坏，官方提供成本价寄修零配件支持。'
              : '2. 2-Year Official Warranty: Genuine Swiss Maxon and German Faulhaber core units are protected by a 2-year warranty covering electrical and mechanical drive linkages under normal professional studio operation.'}
          </p>
          <p>
            {isZh
              ? '3. 医疗与电气合规：机身外壳经 7075 航空铝或 TC4 钛合金多轴 CNC 精雕与医用阳极氧化钝化，符合欧盟 CE、RoHS 及美国 FCC 电气与卫生规范。'
              : '3. Compliance: Machined from medical-grade TC4 titanium and 7075 aerospace aluminum with biocompatible anodization, conforming to international CE, FCC, and RoHS standards.'}
          </p>
        </section>

        {/* 2. Apple Directory Multi-Column Navigation Grid */}
        <nav
          aria-label="Directory Navigation"
          className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-8 mb-10 text-[11px]"
        >
          {/* Column 1: Hardware & Models */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              {isZh ? '精选机型' : 'Hardware & Models'}
            </h4>
            <ul className="space-y-2 text-[#6e6e73] dark:text-[#86868b]">
              <li>
                <Link to="/products/$slug" params={{ slug: 'e30-titanium-pen' }} className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors">
                  {isZh ? 'E30 钛合金笔' : 'E30 Titanium Rotary'}
                </Link>
              </li>
              <li>
                <Link to="/products/$slug" params={{ slug: 'faulhaber-2610' }} className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors">
                  {isZh ? 'Faulhaber 2610 笔' : 'Faulhaber 2610 Core'}
                </Link>
              </li>
              <li>
                <Link to="/products/$slug" params={{ slug: 't7max-wireless' }} className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors">
                  {isZh ? 'T7max 调频无线笔' : 'T7max Wireless Pen'}
                </Link>
              </li>
              <li>
                <Link to="/products/$slug" params={{ slug: 'billow-rca' }} className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors">
                  {isZh ? 'Billow RCA 笔' : 'Billow RCA Standard'}
                </Link>
              </li>
              <li>
                <Link to="/products/$slug" params={{ slug: 'handmade-brass-coils' }} className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors">
                  {isZh ? '手工失蜡纯铜机' : 'Handmade Cast Brass'}
                </Link>
              </li>
              <li>
                <a href="/#parts" className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors">
                  {isZh ? '偏心轮与原厂配件' : 'Eccentric Cams & Parts'}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Engineering & Craft */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              {isZh ? '精密制造' : 'Precision Engineering'}
            </h4>
            <ul className="space-y-2 text-[#6e6e73] dark:text-[#86868b]">
              <li>
                <a href="/#craft" className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors">
                  {isZh ? '瑞士 Maxon 微电机' : 'Swiss Maxon Core'}
                </a>
              </li>
              <li>
                <a href="/#craft" className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors">
                  {isZh ? '7075 航天铝合金' : '7075 Aerospace Alloy'}
                </a>
              </li>
              <li>
                <a href="/#craft" className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors">
                  {isZh ? 'Grade 5 钛合金五轴雕刻' : 'Grade 5 TC4 Titanium CNC'}
                </a>
              </li>
              <li>
                <a href="/#craft" className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors">
                  {isZh ? '传统古法失蜡重铸' : 'Lost-Wax Brass Smelting'}
                </a>
              </li>
              <li>
                <a href="/#compare" className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors">
                  {isZh ? '动平衡微米校准' : 'Dynamic Balancing Matrix'}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Studio Account */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              {isZh ? '艺术家专区' : 'Studio Portal'}
            </h4>
            <ul className="space-y-2 text-[#6e6e73] dark:text-[#86868b]">
              <li>
                <Link to="/account" className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors">
                  {isZh ? '我的账户' : 'My Artist Account'}
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors">
                  {isZh ? '订单状态与运单追踪' : 'Orders & Tracking'}
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors">
                  {isZh ? '特快收货地址管理' : 'Studio Address Book'}
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors">
                  {isZh ? '认证刺青艺术家' : 'Pro Verified Artist'}
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors">
                  {isZh ? '原厂调校配件库' : 'Original Hardware Tuning'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Service & Support */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              {isZh ? '服务与保障' : 'Service & Support'}
            </h4>
            <ul className="space-y-2 text-[#6e6e73] dark:text-[#86868b]">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('warranty')}
                  className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors text-left"
                >
                  {isZh ? '官方 2 年机芯质保' : '2-Year Motor Warranty'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('warranty')}
                  className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors text-left"
                >
                  {isZh ? '原厂配件与寄修服务' : 'OEM Parts & Repair'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('shipping')}
                  className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors text-left"
                >
                  {isZh ? '全球免邮与清关指南' : 'Free Shipping & Customs'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('compliance')}
                  className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors text-left"
                >
                  {isZh ? '卡针通用兼容说明' : 'Cartridge Compatibility'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('compliance')}
                  className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors text-left"
                >
                  {isZh ? '医疗级 CE / RoHS 认证' : 'CE & RoHS Certifications'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: About Kylin Tattoo */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              {isZh ? '关于麒麟' : 'About Kylin'}
            </h4>
            <ul className="space-y-2 text-[#6e6e73] dark:text-[#86868b]">
              <li>
                <span className="text-[#1d1d1f] dark:text-[#f5f5f7]">KYLIN TATTOO INC.</span>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/kylintattoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5 text-[#c5a059] fill-none stroke-current stroke-2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span>Instagram @kylintattoo</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ebay.com/str/kylintattoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>{isZh ? 'eBay 官方直营店' : 'Official eBay Store'}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                </a>
              </li>
              <li>
                <span>{isZh ? '深港与洛杉矶研发' : 'Designed in LA & Shenzhen'}</span>
              </li>
              <li>
                <span>{isZh ? '无尘室级精密装配' : 'ISO-Certified Cleanroom'}</span>
              </li>
              <li>
                <span className="text-[10px] text-[#c5a059] font-medium block pt-1">
                  Saleor Core 3.22 Powered
                </span>
              </li>
            </ul>
          </div>
        </nav>

        {/* 3. Apple Sub-Footer (Copyright & Country/Region Selector) */}
        <section className="pt-6 border-t border-black/[0.08] dark:border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4 text-[11px] text-[#86868b]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span>
              Copyright © 2026 Kylin Tattoo Equipment Inc.{' '}
              {isZh ? '保留所有权利。' : 'All rights reserved.'}
            </span>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setActiveModal('warranty')}
                className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors"
              >
                {isZh ? '隐私政策' : 'Privacy Policy'}
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => setActiveModal('warranty')}
                className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors"
              >
                {isZh ? '销售条款' : 'Terms of Sale'}
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => setActiveModal('compliance')}
                className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors"
              >
                {isZh ? '法律声明' : 'Legal'}
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => setActiveModal('shipping')}
                className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors"
              >
                {isZh ? '直发物流' : 'Direct Express'}
              </button>
            </div>
          </div>

          {/* Country / Region Indicator */}
          <div className="flex items-center gap-1.5 text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 hover:text-[#c5a059] transition-colors cursor-pointer self-start md:self-auto">
            <Globe className="w-3.5 h-3.5" />
            <span className="font-medium">
              {isZh ? '全球配送 • 美元结算 (USD $)' : 'United States (English / USD $)'}
            </span>
          </div>
        </section>
      </div>

      {/* 4. Interactive Apple Compliance Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setActiveModal(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-200 ease-out"
          />
          <div className="relative glass-panel-elevated rounded-3xl w-full max-w-lg p-8 shadow-2xl z-10 text-left animate-apple-modal">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-all"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {activeModal === 'warranty' && (
              <div>
                <div className="flex items-center gap-2 text-[#c5a059] text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isZh ? '官方质保与维保条款' : 'Official Warranty & Maintenance'}</span>
                </div>
                <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                  {isZh ? '官方 2 年原厂机芯质保与终身寄修服务' : '2-Year Motor Warranty & Lifetime Support'}
                </h3>
                <div className="mt-4 space-y-3 text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
                  <p>
                    {isZh
                      ? '所有由 Kylin Tattoo 官方直营发售的精密纹身机（含 E30 钛合金笔、Faulhaber 2610、T7max 无线笔等）均享有自签收之日起 2 年的官方原厂机芯免费质保。在正常刺青操作规范下出现马达故障、驱动轴承异响或偏心轮精度偏差，官方提供免费更换核心动力模组或原厂寄修服务。'
                      : 'Every authentic Kylin Tattoo machine includes a 2-year warranty covering internal motor assemblies and precision eccentric linkages under standard professional studio operation.'}
                  </p>
                  <p>
                    {isZh
                      ? '专业卫生与品质标准：作为高精度专业人体接触性刺青硬件，出厂均经严格无菌环境密封与激光动平衡校准。如遇出厂质量缺陷或国际运输损坏，官方质保通道将提供全程技术支持、终身成本价寄修与原厂正品配件保障。'
                      : 'Professional Hygiene & Standards: As precision instruments designed for professional studio application, all units are hermetically sealed after cleanroom balancing and inspection. Lifetime technical support, OEM repair, and replacement parts are fully guaranteed.'}
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'shipping' && (
              <div>
                <div className="flex items-center gap-2 text-[#c5a059] text-xs font-bold uppercase tracking-wider mb-2">
                  <Truck className="w-4 h-4" />
                  <span>{isZh ? '全球物流政策' : 'Global Logistics Policy'}</span>
                </div>
                <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                  {isZh ? '全球免邮直达专线' : 'Free Worldwide Shipping Policy'}
                </h3>
                <div className="mt-4 space-y-3 text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
                  <p>
                    {isZh
                      ? '全场订单均享受免运费特权（Free Shipping）。由中国制造与质检中心在 24-48 小时内完成严格的偏心轮动平衡调校、微量高真空润滑与减震封箱，全球 2-4 周平稳送达您的刺青工作室。'
                      : 'All hardware orders qualify for Free Worldwide Shipping direct from China. Instruments are dynamically calibrated, lubricated, and dispatched within 24-48 hours, arriving in 2-4 weeks worldwide.'}
                  </p>
                  <p>
                    {isZh
                      ? '提供全程国际快递运单单号，支持门到门轨迹追踪。含锂电池机型已全面获得 UN38.3 适航安全认证，清关合规安全。'
                      : 'Full international tracking provided for every package. Wireless battery pens are UN38.3 aviation safety certified for smooth customs clearance.'}
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'compliance' && (
              <div>
                <div className="flex items-center gap-2 text-[#c5a059] text-xs font-bold uppercase tracking-wider mb-2">
                  <Award className="w-4 h-4" />
                  <span>{isZh ? '工业与安全合规' : 'Regulatory & Industrial Standards'}</span>
                </div>
                <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                  {isZh ? '国际工业标准与卫生消毒合规' : 'International Industrial & Hygiene Standards'}
                </h3>
                <div className="mt-4 space-y-3 text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
                  <p>
                    {isZh
                      ? 'Kylin Tattoo 坚持以 Apple 等级硬件制造标准雕琢每一台纹身器材。整机外壳采用 7075 航空铝或 TC4 钛合金多轴 CNC 精雕成型，表面经过手术级硬质阳极氧化处理，全面兼容专业刺青工作室高压蒸汽灭菌与化学消毒剂。'
                      : 'Manufactured to Apple-grade physical tolerances using 5-axis CNC TC4 titanium and 7075 aerospace alloys with surgical-grade anodization, highly resistant to studio autoclaving and chemical sterilization.'}
                  </p>
                  <p>
                    {isZh
                      ? '全系产品通过 CE、FCC、RoHS 国际认证，全兼容 Cheyenne 标准一体卡针（含 Kylin, Kwadron, Bishop, DaVinci 等主流品牌）。'
                      : 'Certified for CE, FCC, and RoHS standards. Universally compatible with all standard Cheyenne-type needle cartridges.'}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="mt-6 px-6 py-2.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-semibold hover:opacity-90 transition-all uppercase tracking-wider"
            >
              {isZh ? '已了解' : 'Done'}
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
