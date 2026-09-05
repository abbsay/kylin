import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { productRoute } from '../routes/router';
import { useStore } from '../lib/StoreContext';
import { useQuery } from '@tanstack/react-query';
import { fetchSaleorProducts, INITIAL_PRODUCTS } from '../lib/catalog';
import { productsQueryOptions } from '../lib/queryClient';
import { KylinProduct, ProductVariant } from '../types';
import NumberFlow from '@number-flow/react';
import { toast } from 'sonner';
import { CartDrawer } from '../components/CartDrawer';
import { CheckoutModal } from '../components/CheckoutModal';
import { LanguageDropdown } from '../components/LanguageDropdown';
import { FooterCompliance } from '../components/FooterCompliance';
import {
  ArrowLeft,
  ShoppingBag,
  Sun,
  Moon,
  ShieldCheck,
  Check,
  Truck,
  Zap,
  Cpu,
  Layers,
  Award,
  Sparkles,
  Gauge,
  Sliders,
  Volume2,
  Box,
  CircleDot,
  CheckCircle2,
  Plus,
  Minus,
  Activity
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = productRoute.useParams();
  const { t, i18n } = useTranslation();
  const {
    addToCart,
    cart,
    setIsCartOpen,
    theme,
    toggleTheme,
  } = useStore();

  const isZh = i18n.language.startsWith('zh');
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Query Saleor GraphQL products or fallback to local dataset (prefetched by route loader)
  const { data: saleorData } = useQuery(productsQueryOptions);

  const allProducts = saleorData && saleorData.length > 0 ? saleorData : INITIAL_PRODUCTS;
  const product = allProducts.find(p => p.slug === slug) || INITIAL_PRODUCTS.find(p => p.slug === slug);

  // Dynamic document title
  useEffect(() => {
    if (product) {
      const productName = isZh ? product.nameZh : product.name;
      document.title = `${productName} | Kylin Tattoo Official`;
    } else {
      document.title = 'Kylin Tattoo | Precision Engineering Hardware';
    }
  }, [product, isZh]);

  // Variant and quantity states
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'engineering' | 'craft'>('overview');

  // Set default variant
  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product]);

  // Track scroll position to trigger Apple-style floating purchase island
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowStickyBar(scrollY > 520);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fbfbfd] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7]">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            {isZh ? '未找到该产品' : 'Product Not Found'}
          </h2>
          <p className="text-sm text-[#86868b] mb-6">
            {isZh ? '该机型可能已下架或网址输入有误。' : 'The requested hardware profile does not exist or has been archived.'}
          </p>
          <Link
            to="/"
            className="apple-btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isZh ? '返回展厅' : 'Return to Catalog'}</span>
          </Link>
        </div>
      </div>
    );
  }

  const currentVariant: ProductVariant =
    product.variants.find(v => v.id === selectedVariantId) || product.variants[0];
  const displayPrice = currentVariant?.price || product.startingPriceUsd;
  const currentHeroImage = currentVariant?.imageUrl || product.imageUrl;

  // Consolidate all available product media and variant images into a deduplicated gallery
  const galleryImages = useMemo(() => {
    const list: { id: string; url: string; alt?: string; variantId?: string }[] = [];
    const seenUrls = new Set<string>();

    // 1. Add official product.media entries if available
    if (product.media && product.media.length > 0) {
      for (const m of product.media) {
        if (m.url && !seenUrls.has(m.url)) {
          seenUrls.add(m.url);
          const matchedVariant = product.variants.find(v => v.imageUrl === m.url);
          list.push({
            id: m.id,
            url: m.url,
            alt: m.alt || product.name,
            variantId: matchedVariant?.id,
          });
        }
      }
    }

    // 2. Add hero image if not yet in list
    if (product.imageUrl && !seenUrls.has(product.imageUrl)) {
      seenUrls.add(product.imageUrl);
      list.push({
        id: 'hero',
        url: product.imageUrl,
        alt: product.name,
      });
    }

    // 3. Add variant images
    for (const v of product.variants) {
      if (v.imageUrl && !seenUrls.has(v.imageUrl)) {
        seenUrls.add(v.imageUrl);
        list.push({
          id: v.id,
          url: v.imageUrl,
          alt: `${product.name} - ${v.name}`,
          variantId: v.id,
        });
      }
    }

    return list;
  }, [product]);

  // Active displayed image URL (switchable by clicking gallery thumbnails OR selecting a variant)
  const [activeImageUrl, setActiveImageUrl] = useState<string>('');

  // Synchronize active image when variant selection changes
  useEffect(() => {
    if (currentVariant?.imageUrl) {
      setActiveImageUrl(currentVariant.imageUrl);
    } else if (galleryImages.length > 0 && !activeImageUrl) {
      setActiveImageUrl(galleryImages[0].url);
    }
  }, [selectedVariantId, currentVariant, galleryImages]);

  // Fallback to hero image if activeImageUrl is empty
  const displayImageUrl = activeImageUrl || currentHeroImage;

  const handleThumbnailClick = (img: { url: string; variantId?: string }) => {
    setActiveImageUrl(img.url);
    if (img.variantId && img.variantId !== selectedVariantId) {
      setSelectedVariantId(img.variantId);
    }
  };

  const handleAddToCart = () => {
    if (!currentVariant) return;
    addToCart({
      variantId: currentVariant.id,
      productSlug: product.slug,
      productName: isZh ? product.nameZh : product.name,
      variantName: currentVariant.name,
      sku: currentVariant.sku,
      price: currentVariant.price,
      currency: 'USD',
      quantity,
      imageUrl: displayImageUrl,
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);

    toast.success(
      isZh
        ? `已将 ${isZh ? product.nameZh : product.name} (${currentVariant.name}) × ${quantity} 加入购物袋`
        : `Added ${product.name} (${currentVariant.name}) × ${quantity} to Bag`,
      {
        description: `$${(currentVariant.price * quantity).toFixed(2)} USD • Free Global Delivery`,
      }
    );
  };

  // Color Swatch Generator for Apple Finish Selector
  const getVariantVisual = (variantName: string) => {
    const lower = variantName.toLowerCase();
    if (lower.includes('titanium') || lower.includes('raw titanium') || lower.includes('钛原色')) {
      return {
        bg: 'from-[#e3e3e8] via-[#c5c5cb] to-[#8e8e93]',
        labelZh: '原色钛金',
        labelEn: 'Raw Titanium',
      };
    }
    if (lower.includes('black') || lower.includes('ghost') || lower.includes('matte') || lower.includes('曜石黑') || lower.includes('哑光黑')) {
      return {
        bg: 'from-[#3a3a3c] via-[#242426] to-[#121214]',
        labelZh: '曜石哑黑',
        labelEn: 'Matte Space Black',
      };
    }
    if (lower.includes('grey') || lower.includes('gray') || lower.includes('space grey') || lower.includes('深空灰')) {
      return {
        bg: 'from-[#7c7c82] via-[#5b5b60] to-[#3a3a3c]',
        labelZh: '深空微雕灰',
        labelEn: 'Space Grey',
      };
    }
    if (lower.includes('blue') || lower.includes('antique blue') || lower.includes('药水发蓝') || lower.includes('发蓝')) {
      return {
        bg: 'from-[#4a6b82] via-[#2c4456] to-[#1a2d3c]',
        labelZh: '古法药水发蓝',
        labelEn: 'Antique Patina Blue',
      };
    }
    if (lower.includes('brass') || lower.includes('gold') || lower.includes('copper') || lower.includes('黄铜') || lower.includes('金')) {
      return {
        bg: 'from-[#f3d38c] via-[#d4af37] to-[#997928]',
        labelZh: '手工纯铜金华',
        labelEn: 'Handcrafted Brass / Gold',
      };
    }
    return {
      bg: 'from-[#c5a059] to-[#8a6c31]',
      labelZh: '原厂典藏',
      labelEn: 'Master Edition',
    };
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfd] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-200 selection:bg-[#c5a059]/30">
      {/* 1. Apple Floating Glass Micro-Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#fbfbfd]/80 dark:bg-[#000000]/80 border-b border-black/[0.06] dark:border-white/[0.08] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
            <Link
              to="/"
              className="apple-btn inline-flex items-center gap-1.5 text-xs text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              <span className="font-medium whitespace-nowrap">{isZh ? '全系产品' : 'Store'}</span>
            </Link>

            <span className="text-black/20 dark:text-white/20 shrink-0">/</span>

            <span className="text-xs text-[#86868b] hidden sm:inline whitespace-nowrap shrink-0">
              {isZh ? product.categoryNameZh : product.categoryName}
            </span>

            <span className="text-black/20 dark:text-white/20 hidden sm:inline shrink-0">/</span>

            <span className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] truncate max-w-[180px] sm:max-w-[320px]">
              {isZh ? product.nameZh : product.name}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <LanguageDropdown size="sm" />

            <button
              onClick={toggleTheme}
              className="apple-btn p-1.5 rounded-full text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="apple-btn relative p-1.5 text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#c5a059] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Apple Keynote Hero Presentation Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column: Visual Showcase (1:1 Square per User Guideline) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="relative">
              {/* 1:1 Hardware Image Showcase Card */}
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-b from-[#f5f5f7] via-[#efeff2] to-[#e5e5ea] dark:from-[#161618] dark:via-[#101012] dark:to-[#09090b] border border-black/[0.08] dark:border-white/[0.1] shadow-2xl group flex items-center justify-center">
                {/* Subtle Apple Radial Lighting Backdrop */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(197,160,89,0.12),transparent_70%)] pointer-events-none" />

                <img
                  key={displayImageUrl}
                  src={displayImageUrl}
                  alt={currentVariant ? `${product.name} - ${currentVariant.name}` : product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-all duration-700 ease-out"
                />

                {/* Apple Keynote Style Precision Floating Metallic Seal Badge */}
                {product.badge && (
                  <div className="absolute top-4 right-4 z-20 select-none pointer-events-none">
                    <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-xl bg-white/80 dark:bg-[#141416]/85 border border-black/[0.08] dark:border-[#c5a059]/35 shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.65)] ring-1 ring-black/[0.04] dark:ring-white/[0.06] overflow-hidden">
                      {/* Hairline Specular Reflection */}
                      <div className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059]/70 to-transparent pointer-events-none" />

                      {/* Precision Core Indicator Dot */}
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-[#99732b] via-[#c5a059] to-[#fff1c2] shadow-[0_0_8px_rgba(197,160,89,0.7)] shrink-0" />

                      {/* Laser-Etched Brand Typography */}
                      <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase text-[#1d1d1f] dark:text-[#f5f5f7]">
                        {isZh ? product.badgeZh || product.badge : product.badge}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Apple Gallery Thumbnail Strip (Multi-Image Interactive Carousel) */}
            {galleryImages.length > 1 && (
              <div className="pt-1">
                <div className="flex items-center gap-2.5 overflow-x-auto py-2.5 px-2.5 -mx-2.5 no-scrollbar scroll-smooth">
                  {galleryImages.map((img, idx) => {
                    const isActive = displayImageUrl === img.url;
                    return (
                      <button
                        key={img.id || img.url}
                        type="button"
                        onClick={() => handleThumbnailClick(img)}
                        className={`group relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${
                          isActive
                            ? 'ring-2 ring-[#c5a059] ring-offset-2 ring-offset-[#fbfbfd] dark:ring-offset-[#000000] shadow-[0_4px_16px_rgba(197,160,89,0.25)] scale-[1.03] opacity-100'
                            : 'opacity-60 hover:opacity-100 border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 hover:scale-[1.02]'
                        }`}
                        title={img.alt || `Photo ${idx + 1}`}
                      >
                        <img
                          src={img.url}
                          alt={img.alt || `Product thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Apple Triad Service Assurance (Refined Frameless Inline Bar) */}
            <div className="flex items-center justify-around py-3.5 px-2 text-center text-[#86868b] border-t border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {isZh ? '2年原厂质保' : '2-Year Warranty'}
                </span>
              </div>
              <span className="text-black/15 dark:text-white/15">•</span>
              <div className="flex items-center gap-1.5 text-xs">
                <Truck className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {isZh ? '全球直发免邮' : 'Free Global Delivery'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Apple Store-Style Configurator (Pure Frameless Typography) */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[10px] font-bold uppercase tracking-widest text-[#c5a059] mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                <span>{isZh ? product.categoryNameZh : product.categoryName}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] leading-[1.12]">
                {isZh ? product.nameZh : product.name}
              </h1>

              <p className="mt-2 text-xs sm:text-[13px] text-[#6e6e73] dark:text-[#86868b] leading-relaxed line-clamp-2">
                {isZh ? product.descriptionZh : product.description}
              </p>
            </div>

            {/* Apple Direct Pricing Line (Zero-Box Frameless Layout with Precision NumberFlow) */}
            <div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                  <NumberFlow
                    value={displayPrice}
                    format={{ style: 'currency', currency: 'USD' }}
                  />
                </div>
                <span className="text-xs font-semibold text-[#86868b]">USD</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#86868b]">
                <span className="text-[11px]">{isZh ? 'Free Shipping. 全球2-4周到货，中国直发。' : 'Free Shipping. 2-4w delivery, direct from China.'}</span>
              </div>
            </div>

            {/* Apple Keynote Stat Callouts */}
            <div className="py-3 border-y border-black/[0.06] dark:border-white/[0.08] grid grid-cols-3 gap-3 text-left">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#86868b] block mb-1">
                  {isZh ? '核心动力' : 'Core Motor'}
                </span>
                <span className="text-xs sm:text-sm font-bold font-mono text-[#1d1d1f] dark:text-[#f5f5f7] block leading-tight">
                  {isZh
                    ? (product.motor?.toLowerCase().includes('maxon') ? '瑞士 Maxon 无刷' : product.motor?.toLowerCase().includes('faulhaber') ? '德国 Faulhaber' : (product.motor ? product.motor.split('(')[0].trim() : '瑞士原装核心'))
                    : (product.motor ? product.motor.split('(')[0].trim() : 'Swiss Core')}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#86868b] block mb-1">
                  {isZh ? '同轴跳动公差' : 'Axial Runout'}
                </span>
                <span className="text-xs sm:text-sm font-bold font-mono text-[#c5a059] block leading-tight">
                  &lt; 0.02mm
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#86868b] block mb-1">
                  {isZh ? '机身平衡净重' : 'Net Weight'}
                </span>
                <span className="text-xs sm:text-sm font-bold font-mono text-[#1d1d1f] dark:text-[#f5f5f7] block leading-tight">
                  {product.weight ? product.weight.split('(')[0].trim() : '142g'}
                </span>
              </div>
            </div>

            {/* Apple Tactile Finish Swatches & Adaptive Spec Selector */}
            {product.variants.length > 0 && (
              <div className="space-y-3.5 pt-0.5">
                {/* Finish & Edition - Only for machines with aesthetic finishes */}
                {product.type !== 'part' && product.variants.some(v => v.color) && (
                  <div>
                    <span className="font-bold text-[#1d1d1f] dark:text-[#f5f5f7] uppercase tracking-wider text-[11px] block">
                      {isZh ? '机身外观与工艺' : 'Finish & Edition'} —{' '}
                      <span className="text-[#c5a059] normal-case">
                        {isZh ? getVariantVisual(currentVariant.name).labelZh : getVariantVisual(currentVariant.name).labelEn}
                      </span>
                    </span>

                    {/* Tactile Metallic Discs (Apple Style) */}
                    <div className="flex items-center gap-3 mt-2">
                      {product.variants.map(v => {
                        const isSelected = v.id === currentVariant.id;
                        const visual = getVariantVisual(v.name);

                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setSelectedVariantId(v.id)}
                            aria-label={v.name}
                            className={`group relative p-1 rounded-full transition-all ${
                              isSelected
                                ? 'ring-2 ring-[#c5a059] ring-offset-2 ring-offset-[#fbfbfd] dark:ring-offset-[#000000] scale-105'
                                : 'hover:scale-105 opacity-75 hover:opacity-100'
                            }`}
                          >
                            <div
                              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr ${visual.bg} shadow-md border border-white/20 flex items-center justify-center`}
                            >
                              {isSelected && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Apple Store Responsive Configuration Selector */}
                {product.variants.length > 1 && (
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-2 gap-2">
                      <span className="font-bold text-[#1d1d1f] dark:text-[#f5f5f7] uppercase tracking-wider shrink-0">
                        {isZh
                          ? product.type === 'part'
                            ? '规格与型号'
                            : '规格与行程'
                          : product.type === 'part'
                          ? 'Specification'
                          : 'Configuration'}
                      </span>
                      <span className="text-[#86868b] font-mono text-[11px] truncate text-right max-w-[200px]">
                        {currentVariant.name}
                      </span>
                    </div>

                    {/* Stacked Apple Option Cards for Long Descriptions / Accessories, Grid for Short Specs */}
                    {product.variants.some(v => v.name.length > 18) || product.type === 'part' ? (
                      <div className="space-y-2">
                        {product.variants.map(v => {
                          const isSelected = v.id === currentVariant.id;

                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => setSelectedVariantId(v.id)}
                              className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                                isSelected
                                  ? 'border-[#c5a059] bg-[#c5a059]/[0.08] dark:bg-[#c5a059]/15 ring-1 ring-[#c5a059] shadow-xs'
                                  : 'border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] text-[#1d1d1f] dark:text-[#f5f5f7]'
                              }`}
                            >
                              <div className="min-w-0 flex-1 flex items-center gap-2.5">
                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                    isSelected
                                      ? 'border-[#c5a059] bg-[#c5a059]'
                                      : 'border-black/30 dark:border-white/30'
                                  }`}
                                >
                                  {isSelected && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span
                                    className={`text-xs block leading-snug break-words ${
                                      isSelected
                                        ? 'text-[#1d1d1f] dark:text-white font-semibold'
                                        : 'text-[#424245] dark:text-[#d1d1d6] font-medium'
                                    }`}
                                  >
                                    {v.name}
                                  </span>
                                  {v.sku && (
                                    <span className="text-[10px] font-mono text-[#86868b] block mt-0.5">
                                      {v.sku}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-xs font-semibold font-mono text-[#1d1d1f] dark:text-[#f5f5f7] block">
                                  ${v.price.toFixed(2)}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {product.variants.map(v => {
                          const isSelected = v.id === currentVariant.id;

                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => setSelectedVariantId(v.id)}
                              className={`py-2.5 px-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                                isSelected
                                  ? 'border-[#c5a059] bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white shadow-xs ring-1 ring-[#c5a059] font-semibold'
                                  : 'border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] text-[#6e6e73] dark:text-[#86868b] hover:border-black/20 dark:hover:border-white/20 hover:text-[#1d1d1f] dark:hover:text-white'
                              }`}
                            >
                              <span className="text-xs font-medium block truncate max-w-full">
                                {v.name}
                              </span>
                              <span className="text-[10px] font-mono text-[#86868b] block mt-0.5">
                                ${v.price.toFixed(2)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Apple Action Buttons (Pill Shapes, High Ergonomics) */}
            <div className="pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-black/10 dark:border-white/10 rounded-full bg-black/[0.03] dark:bg-white/[0.04] p-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="apple-btn w-8 h-8 rounded-full flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-xs tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="apple-btn w-8 h-8 rounded-full flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="apple-btn flex-1 py-3.5 px-6 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] hover:opacity-95 font-semibold text-xs tracking-tight transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {addedNotice ? (isZh ? '已加入 ✓' : 'Added to Bag ✓') : isZh ? `加入购物袋 · $${(displayPrice * quantity).toFixed(2)}` : `Add to Bag · $${(displayPrice * quantity).toFixed(2)}`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Apple "Pro" Bento Grid: Exploded Architecture & Kinetic Breakdown */}
        <section className="mt-20 pt-14 border-t border-black/[0.08] dark:border-white/[0.08]">
          <div className="max-w-3xl mb-10">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#c5a059] uppercase tracking-wider mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>{isZh ? '微米级解构' : 'Exploded Architecture'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
              {isZh ? '每一处细节，皆为纯粹性能而生。' : 'Engineered Down to the Micron.'}
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
              {isZh
                ? 'Kylin 舍弃一切冗余装饰。从瑞士原厂医用级无刷核心，到 Grade 5 航空钛合金骨骼，重新定义刺青动力学的极限。'
                : 'Zero superfluous ornaments. From the medical-grade brushless core to Grade 5 titanium chassis, redefining tattoo kinetic dynamics.'}
            </p>
          </div>

          {/* Apple Bento Grid 4-Cell Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Card 1: Motor Kinetic Core (Spans 7 cols) */}
            <div className="md:col-span-7 rounded-3xl p-6 sm:p-9 bg-white dark:bg-[#121214] border border-black/[0.08] dark:border-white/[0.1] shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_70%_20%,rgba(197,160,89,0.12),transparent_70%)] pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-[#c5a059] text-xs font-mono font-semibold">
                    <Zap className="w-4 h-4" />
                    <span>KINETIC DRIVE CORE</span>
                  </div>

                  {/* Micro Pulse Wave Graphic */}
                  <div className="flex items-center gap-0.5 opacity-60">
                    <span className="w-0.5 h-3 bg-[#c5a059] rounded-full animate-pulse" />
                    <span className="w-0.5 h-5 bg-[#c5a059] rounded-full animate-pulse delay-75" />
                    <span className="w-0.5 h-2 bg-[#c5a059] rounded-full animate-pulse delay-150" />
                    <span className="w-0.5 h-6 bg-[#c5a059] rounded-full animate-pulse delay-100" />
                    <span className="w-0.5 h-4 bg-[#c5a059] rounded-full animate-pulse delay-200" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                  {product.motor || (isZh ? '瑞士 Maxon 医用级电机' : 'Swiss Maxon Core')}
                </h3>
                <p className="text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed max-w-md">
                  {isZh
                    ? '转速高达 11,500 RPM，轴向跳动误差小于 0.02mm。即便连续运转 8 小时，机身表面温升仍维持在室温舒适区间，彻底告别震颤手部麻木。'
                    : 'Up to 11,500 RPM with axial runout below 0.02mm. Thermal dissipation engineered for 8+ hour sustained lining without hand numbness.'}
                </p>
              </div>

              {/* Kinetic Performance Meters */}
              <div className="mt-8 pt-6 border-t border-black/[0.06] dark:border-white/[0.08] grid grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-[#86868b] uppercase font-bold tracking-wider block mb-1 truncate">
                    {isZh ? '轴向跳动' : 'Axial Runout'}
                  </span>
                  <span className="text-base sm:text-xl font-bold font-mono text-[#c5a059]">
                    &lt; 0.02mm
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#86868b] uppercase font-bold tracking-wider block mb-1 truncate">
                    {isZh ? '最高转速' : 'Max Speed'}
                  </span>
                  <span className="text-base sm:text-xl font-bold font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">
                    11,500 RPM
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#86868b] uppercase font-bold tracking-wider block mb-1 truncate">
                    {isZh ? '热衰减率' : 'Thermal Decay'}
                  </span>
                  <span className="text-base sm:text-xl font-bold font-mono text-emerald-500">
                    0.0%
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Material & Metallurgy (Spans 5 cols) */}
            <div className="md:col-span-5 rounded-3xl p-6 sm:p-9 bg-white dark:bg-[#121214] border border-black/[0.08] dark:border-white/[0.1] shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-10">
                <CircleDot className="w-16 h-16 text-[#c5a059]" />
              </div>

              <div>
                <div className="flex items-center gap-2 text-[#c5a059] text-xs font-mono font-semibold mb-3">
                  <Award className="w-4 h-4" />
                  <span>METALLURGIC CRAFT</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                  {product.material || (isZh ? 'Grade 5 钛合金' : 'Grade 5 Titanium')}
                </h3>
                <p className="text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
                  {isZh
                    ? '航空级 5 级钛合金（Ti-6Al-4V）数控五轴联动铣削，具备极高强重比与强抗腐蚀性，耐受医用高压灭菌器及任何化学消毒试剂。'
                    : 'CNC 5-axis milled from medical Grade 5 Titanium (Ti-6Al-4V). Uncompromising strength-to-weight ratio and full autoclave sterilization resistance.'}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-[#86868b] uppercase font-bold tracking-wider block mb-0.5">
                    {isZh ? '机身净重' : 'Net Weight'}
                  </span>
                  <span className="text-base sm:text-lg font-bold font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {product.weight || '142g'}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-semibold bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/20 whitespace-nowrap">
                  ISO 13485 Spec
                </span>
              </div>
            </div>

            {/* Card 3: Kinetic Stroke Modulation (Spans 6 cols) */}
            <div className="md:col-span-6 rounded-3xl p-7 sm:p-9 bg-white dark:bg-[#121214] border border-black/[0.08] dark:border-white/[0.1] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#c5a059] text-xs font-mono font-semibold mb-3">
                  <Sliders className="w-4 h-4" />
                  <span>KINETIC STROKE ADAPTATION</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                  {isZh ? '从极致细线到饱和铺色' : 'Versatile Stroke Dynamics'}
                </h3>
                <p className="text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
                  {isZh
                    ? '提供 3.5mm 全能平衡行程与 4.2mm 强力割线行程切换，搭配硬朗撞击回弹曲线，完美适应单针点刺到大排针重色块填入。'
                    : 'Equipped with 3.5mm universal balance and 4.2mm bold liner options. Direct crisp hit curve designed for single needle to large magnum packing.'}
                </p>
              </div>

              {/* Visual Tuning Spectrum */}
              <div className="mt-6 space-y-2.5">
                <div className="flex justify-between text-[11px] font-medium">
                  <span className="text-[#86868b]">{isZh ? '黑灰微雕与轻雾 (Dotwork / Shading)' : 'Dotwork & Shading'}</span>
                  <span className="text-[#c5a059] font-mono font-bold">3.5mm</span>
                </div>
                <div className="w-full h-1.5 bg-black/[0.06] dark:bg-white/[0.08] rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-[#c5a059] rounded-full" />
                </div>

                <div className="flex justify-between text-[11px] font-medium pt-1">
                  <span className="text-[#86868b]">{isZh ? '传统粗线与饱和填色 (Bold Liner / Packing)' : 'Bold Liner & Packing'}</span>
                  <span className="text-[#c5a059] font-mono font-bold">4.2mm</span>
                </div>
                <div className="w-full h-1.5 bg-black/[0.06] dark:bg-white/[0.08] rounded-full overflow-hidden">
                  <div className="w-full h-full bg-[#c5a059] rounded-full" />
                </div>
              </div>
            </div>

            {/* Card 4: Acoustic & Ergonomic Isolation (Spans 6 cols) */}
            <div className="md:col-span-6 rounded-3xl p-7 sm:p-9 bg-white dark:bg-[#121214] border border-black/[0.08] dark:border-white/[0.1] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#c5a059] text-xs font-mono font-semibold mb-3">
                  <Volume2 className="w-4 h-4" />
                  <span>ACOUSTIC & ERGONOMIC COMFORT</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                  {isZh ? '&lt; 38dB 极静运转 · 第一指节黄金重心' : '&lt; 38dB Whisper Drive · Joint Balanced'}
                </h3>
                <p className="text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
                  {isZh
                    ? '内部采用特制航空阻尼圈与静音轴承舱，彻底吸收电机高频杂音；质心配重精准落于手握的第一关节，将全天候连续创作的腕部压力降低 40%。'
                    : 'Custom acoustic damping chambers suppress high-frequency pitch below 38dB. The center of mass aligns with the first finger knuckle to reduce wrist fatigue.'}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs">
                <span className="text-[#86868b]">{isZh ? '工作电压区间' : 'Operating Voltage'}</span>
                <span className="font-mono font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {product.voltage || '5.5V – 10.5V'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Deep Technical Specifications Matrix */}
        <section className="mt-16 pt-12 border-t border-black/[0.08] dark:border-white/[0.08]">
          <div className="max-w-3xl mb-8">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#c5a059] uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>{isZh ? '技术规格' : 'Full Specifications'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
              {isZh ? '工程参数与机械公差' : 'Kinetic Tolerances & Specs'}
            </h2>
          </div>

          <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#121214] divide-y divide-black/[0.06] dark:divide-white/[0.06] text-xs">
            {product.motor && (
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[#6e6e73] dark:text-[#86868b] w-48 shrink-0">{isZh ? '马达核心 (Motor Core)' : 'Motor Core'}</span>
                <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] sm:text-right">{product.motor}</span>
              </div>
            )}

            {product.material && (
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[#6e6e73] dark:text-[#86868b] w-48 shrink-0">{isZh ? '机身材质与表面工艺' : 'Chassis Material & Finish'}</span>
                <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] sm:text-right">{product.material}</span>
              </div>
            )}

            {product.voltage && (
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[#6e6e73] dark:text-[#86868b] w-48 shrink-0">{isZh ? '推荐工作电压区间' : 'Operating Voltage Range'}</span>
                <span className="font-mono font-medium text-[#1d1d1f] dark:text-[#f5f5f7] sm:text-right">{product.voltage}</span>
              </div>
            )}

            {product.strokeOptions && product.strokeOptions.length > 0 && (
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[#6e6e73] dark:text-[#86868b] w-48 shrink-0">{isZh ? '出针行程配置' : 'Available Stroke Cams'}</span>
                <span className="font-mono font-bold text-[#c5a059] sm:text-right">{product.strokeOptions.join(' • ')}</span>
              </div>
            )}

            {product.weight && (
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[#6e6e73] dark:text-[#86868b] w-48 shrink-0">{isZh ? '机身重量平衡' : 'Net Weight & Balance'}</span>
                <span className="font-mono font-medium text-[#1d1d1f] dark:text-[#f5f5f7] sm:text-right">{product.weight}</span>
              </div>
            )}

            <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[#6e6e73] dark:text-[#86868b] w-48 shrink-0">{isZh ? '针头通用兼容性' : 'Needle Cartridge Support'}</span>
              <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7] sm:text-right">
                {isZh ? '全兼容 Cheyenne 标准卡针 (Kylin, Kwadron, Bishop, DaVinci)' : 'Universal Cheyenne standard cartridges'}
              </span>
            </div>
          </div>
        </section>

        {/* 5. In The Box (Apple Unboxing Experience) */}
        <section className="mt-16 pt-12 border-t border-black/[0.08] dark:border-white/[0.08]">
          <div className="max-w-3xl mb-8">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#c5a059] uppercase tracking-wider mb-2">
              <Box className="w-3.5 h-3.5" />
              <span>{isZh ? '包装清单' : "What's in the Box"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
              {isZh ? '开箱即用的精密配置' : 'Ready-to-Tattoo Setup'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#121214]">
              <span className="text-xs font-bold text-[#c5a059] block mb-1">01</span>
              <h4 className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                {isZh ? 'Kylin 纹身机机身' : 'Kylin Precision Chassis'}
              </h4>
              <p className="text-[11px] text-[#86868b]">
                {isZh ? '出厂经无尘净化与润滑处理' : 'Calibrated and cleanroom sealed'}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#121214]">
              <span className="text-xs font-bold text-[#c5a059] block mb-1">02</span>
              <h4 className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                {product.type === 'pen' ? (isZh ? '24K 镀金 RCA 极细勾线' : '90° Gold-Plated RCA Cable') : (isZh ? '纯铜备用触点螺丝组' : 'Spare Copper Binding Posts')}
              </h4>
              <p className="text-[11px] text-[#86868b]">
                {isZh ? '超软硅胶线身，零电压损耗' : 'Ultra-flexible zero voltage-drop'}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#121214]">
              <span className="text-xs font-bold text-[#c5a059] block mb-1">03</span>
              <h4 className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                {isZh ? '氟橡胶备用密封圈 & 扳手' : 'Viton O-Rings & Hex Key'}
              </h4>
              <p className="text-[11px] text-[#86868b]">
                {isZh ? '原厂维护保养易损备件' : 'Complete servicing hardware kit'}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#121214]">
              <span className="text-xs font-bold text-[#c5a059] block mb-1">04</span>
              <h4 className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                {isZh ? '质保出厂证书' : 'Certificate & Serial Card'}
              </h4>
              <p className="text-[11px] text-[#86868b]">
                {isZh ? '带独立防伪唯一序列号' : 'Individual laser etched serial ID'}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Sticky Floating Purchase Island (Appears upon scrolling past top section) */}
      <div
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 w-[94%] sm:w-auto max-w-lg ${
          showStickyBar ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <div className="glass-panel-elevated p-2 sm:p-2.5 rounded-full border border-black/[0.1] dark:border-white/[0.15] shadow-2xl flex items-center justify-between gap-2 backdrop-blur-2xl">
          <div className="flex items-center gap-2 pl-1 overflow-hidden min-w-0">
            <img
              key={currentHeroImage}
              src={currentHeroImage}
              alt={product.name}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover shrink-0 border border-black/10 dark:border-white/10 transition-all duration-300"
            />
            <div className="truncate min-w-0 pr-1">
              <span className="text-[11px] sm:text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7] block truncate max-w-[110px] sm:max-w-[180px]">
                {isZh ? product.nameZh : product.name}
              </span>
              <div className="text-[10px] sm:text-[11px] font-mono text-[#c5a059] font-bold">
                <NumberFlow
                  value={displayPrice}
                  format={{ style: 'currency', currency: 'USD' }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleAddToCart}
              className="apple-btn px-3.5 sm:px-5 py-2 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-[11px] sm:text-xs font-semibold shadow-xs hover:opacity-95 whitespace-nowrap active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{addedNotice ? (isZh ? '已加入 ✓' : 'Added ✓') : isZh ? '加入购物袋' : 'Add to Bag'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7. Apple Directory Footer & Compliance */}
      <div className="mt-16">
        <FooterCompliance />
      </div>

      {/* Global Drawers */}
      <CartDrawer />
      <CheckoutModal />
    </div>
  );
};
