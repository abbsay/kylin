import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useStore } from '../lib/StoreContext';
import { Wrench, Plus, Check, Search } from 'lucide-react';

interface PartItem {
  id: string;
  saleorVariantId: string;
  sku: string;
  nameEn: string;
  nameZh: string;
  category: 'Cams' | 'Motors' | 'Power' | 'Cables';
  price: number;
  specs: string;
  compatibility: string;
  imageUrl: string;
}

const HARDWARE_PARTS: PartItem[] = [
  {
    id: 'cam-35',
    saleorVariantId: 'UHJvZHVjdFZhcmlhbnQ6MTI=',
    sku: 'KYLIN-PART-CAM-35',
    nameEn: 'Titanium Eccentric Cam 3.5mm',
    nameZh: 'E30 钛合金偏心轮 (3.5mm 标准行程)',
    category: 'Cams',
    price: 38.0,
    specs: 'Stroke: 3.5mm • Weight: 6.2g',
    compatibility: 'Kylin E30 / BL1 / Faulhaber 2610',
    imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80',
  },
  {
    id: 'cam-42',
    saleorVariantId: 'UHJvZHVjdFZhcmlhbnQ6MTM=',
    sku: 'KYLIN-PART-CAM-42',
    nameEn: 'Direct-Drive High-Impact Cam 4.2mm',
    nameZh: '直驱高冲击力偏心轮 (4.2mm 割线打雾强化)',
    category: 'Cams',
    price: 42.0,
    specs: 'Stroke: 4.2mm • Heavy Duty Bearing',
    compatibility: 'Kylin E30 / Billow RCA',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&q=80',
  },
  {
    id: 'cam-50',
    saleorVariantId: 'UHJvZHVjdFZhcmlhbnQ6MTQ=',
    sku: 'KYLIN-PART-CAM-50',
    nameEn: 'Extreme Power Stroke Cam 5.0mm',
    nameZh: '极限爆发偏心轮 (5.0mm 传统大排针专用)',
    category: 'Cams',
    price: 45.0,
    specs: 'Stroke: 5.0mm • Japanese NMB Bearing',
    compatibility: 'Kylin T7max / E30 Pro',
    imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80',
  },
  {
    id: 'motor-faulhaber-2610',
    saleorVariantId: 'UHJvZHVjdFZhcmlhbnQ6MTU=',
    sku: 'KYLIN-PART-MOT-FH2610',
    nameEn: 'Faulhaber Coreless 2610 Motor Unit',
    nameZh: '德国 Faulhaber 2610 空心杯原装无刷马达模组',
    category: 'Motors',
    price: 135.0,
    specs: '12V 10,800 RPM • Low Vibration',
    compatibility: 'Kylin Faulhaber 2610 Direct Replacement',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&q=80',
  },
  {
    id: 'motor-mabuchi-pro',
    saleorVariantId: 'UHJvZHVjdFZhcmlhbnQ6MTY=',
    sku: 'KYLIN-PART-MOT-MABUCHI',
    nameEn: 'Mabuchi High-Torque Custom Core',
    nameZh: '日本万宝至定制高扭矩无刷直驱动力核心',
    category: 'Motors',
    price: 68.0,
    specs: '10V 9,500 RPM • High Efficiency',
    compatibility: 'Universal Kylin Rotary Pen',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&q=80',
  },
  {
    id: 'battery-t7-pack',
    saleorVariantId: 'UHJvZHVjdFZhcmlhbnQ6MTc=',
    sku: 'KYLIN-PART-BAT-T7',
    nameEn: 'T7max Wireless Li-Po Battery Pack 1800mAh',
    nameZh: 'T7max 专用磁吸锂电池组 (1800mAh 续航8小时)',
    category: 'Power',
    price: 59.0,
    specs: 'USB-C Fast Charging • OLED Voltage DSP',
    compatibility: 'Kylin T7max Wireless Pen',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80',
  },
  {
    id: 'battery-clip-dock',
    saleorVariantId: 'UHJvZHVjdFZhcmlhbnQ6MTg=',
    sku: 'KYLIN-PART-DOCK-DUAL',
    nameEn: 'Studio Dual-Slot Quick Charging Dock',
    nameZh: '工作室专用双槽快速充电机座 (带阻抗稳流)',
    category: 'Power',
    price: 75.0,
    specs: 'Input: PD 30W • Dual Smart Channels',
    compatibility: 'All Kylin Modular Battery Packs',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80',
  },
  {
    id: 'rca-gold-cable',
    saleorVariantId: 'UHJvZHVjdFZhcmlhbnQ6MTk=',
    sku: 'KYLIN-PART-RCA-GOLD',
    nameEn: '90° 24K Gold-Plated Ultra-Flex RCA Cord 2.5m',
    nameZh: '90度直角 24K 镀金无氧铜超软硅胶 RCA 勾线 (2.5米)',
    category: 'Cables',
    price: 28.0,
    specs: 'Zero Voltage Drop • Pure OFC Copper',
    compatibility: 'Universal RCA Tattoo Machines',
    imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80',
  },
  {
    id: 'brass-spring-kit',
    saleorVariantId: 'UHJvZHVjdFZhcmlhbnQ6MjA=',
    sku: 'KYLIN-PART-SPR-SWEDEN',
    nameEn: 'Hand-Tempered Swedish Blue Spring Set (x10)',
    nameZh: '瑞典蓝钢手工淬火回弹弹片套件 (10片装)',
    category: 'Cams',
    price: 32.0,
    specs: '0.45mm / 0.50mm thickness precision cut',
    compatibility: 'Kylin R07 / 20128 / Black Ghost',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&q=80',
  },
  {
    id: 'brass-binding-posts',
    saleorVariantId: 'UHJvZHVjdFZhcmlhbnQ6MjE=',
    sku: 'KYLIN-PART-POST-BRASS',
    nameEn: 'Carved Solid Brass Binding Post Pair',
    nameZh: '实心黄铜精雕接线柱对装 (纯银触点螺丝)',
    category: 'Cams',
    price: 26.0,
    specs: '999 Sterling Silver Contact Screw',
    compatibility: 'Classic Coil Tattoo Machines',
    imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80',
  },
];

export const VirtualPartsList: React.FC = () => {
  const { i18n } = useTranslation();
  const { addToCart } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const isZh = i18n.language.startsWith('zh');

  const filteredParts = HARDWARE_PARTS.filter(p => {
    const matchesSearch =
      p.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      p.nameZh.includes(search) ||
      p.specs.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const parentRef = useRef<HTMLDivElement>(null);

  // TanStack Virtualizer implementation for 60fps hardware parts list with stable keys and dynamic measurement
  const rowVirtualizer = useVirtualizer({
    count: filteredParts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 88,
    overscan: 4,
    getItemKey: (index: number) => filteredParts[index]?.id || index,
  });

  const handleAddToCart = (part: PartItem) => {
    addToCart({
      variantId: part.saleorVariantId,
      productSlug: `part-${part.id}`,
      productName: isZh ? part.nameZh : part.nameEn,
      variantName: part.specs,
      sku: part.sku,
      price: part.price,
      currency: 'USD',
      quantity: 1,
      imageUrl: part.imageUrl,
    });

    setAddedMap(prev => ({ ...prev, [part.id]: true }));
    setTimeout(() => {
      setAddedMap(prev => ({ ...prev, [part.id]: false }));
    }, 1200);
  };

  return (
    <section id="parts" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#c5a059] uppercase tracking-wider mb-2">
            <Wrench className="w-3.5 h-3.5" />
            <span>{isZh ? 'TanStack Virtual 驱动的精密配件库' : 'TanStack Virtualized Parts & Tuning'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
            {isZh ? '原厂配件与调校模块' : 'Original Hardware & Tuning Kits'}
          </h2>
          <p className="text-[13px] text-[#6e6e73] dark:text-[#86868b] mt-1 tracking-tight">
            {isZh
              ? '采用 @tanstack/react-virtual 虚拟化渲染引擎，毫秒级快速匹配偏心轮、无刷电机与高柔电缆。'
              : 'Rendered with @tanstack/react-virtual for ultra-smooth 60fps browsing of cams, motors, and precision leads.'}
          </p>
        </div>

        {/* Search and Category Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isZh ? '搜索偏心轮/马达/电池...' : 'Filter cams, motors...'}
              className="pl-9 pr-4 py-2 rounded-full text-xs bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.08] focus:outline-none focus:border-[#c5a059] text-[#1d1d1f] dark:text-[#f5f5f7] w-48 sm:w-60 transition-all placeholder:text-[#86868b]"
            />
          </div>

          <div className="flex rounded-full bg-black/[0.05] dark:bg-white/[0.08] p-1 text-xs">
            {(['All', 'Cams', 'Motors', 'Power', 'Cables'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`apple-btn px-3.5 py-1 rounded-full transition-all text-[11px] font-medium ${
                  selectedCategory === cat
                    ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs font-semibold'
                    : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Virtual Scroll Container */}
      <div
        ref={parentRef}
        className="h-[400px] overflow-y-auto rounded-3xl border border-black/[0.06] dark:border-white/[0.08] glass-panel-elevated p-2 shadow-xs"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            const part = filteredParts[virtualRow.index];
            const isAdded = !!addedMap[part.id];

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="p-1.5 will-change-transform"
              >
                <div className="h-full rounded-2xl bg-black/[0.015] dark:bg-white/[0.025] hover:bg-black/[0.04] dark:hover:bg-white/[0.05] border border-black/[0.04] dark:border-white/[0.06] p-3.5 flex items-center justify-between transition-all">
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={part.imageUrl}
                      alt={part.nameEn}
                      className="w-13 h-13 rounded-2xl object-cover bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-black/[0.06] dark:border-white/[0.08]"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
                          {isZh ? part.nameZh : part.nameEn}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#c5a059]/15 text-[#c5a059] font-mono font-bold shrink-0">
                          {part.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6e6e73] dark:text-[#86868b] truncate mt-1">
                        <span className="font-mono text-[#1d1d1f] dark:text-[#f5f5f7] font-medium">{part.specs}</span> • 适配: {part.compatibility}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 pl-4">
                    <span className="font-mono font-bold text-sm text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums">
                      ${part.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(part)}
                      className={`apple-btn px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                        isAdded
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] hover:opacity-95 tracking-tight'
                      }`}
                    >
                      {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{isAdded ? (isZh ? '已加入' : 'Added') : (isZh ? '加入购物车' : 'Add to Bag')}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
