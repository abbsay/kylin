import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { useStore } from '../lib/StoreContext';
import { KylinProduct } from '../types';
import NumberFlow from '@number-flow/react';
import { toast } from 'sonner';
import { Check, Plus, ArrowUpRight } from 'lucide-react';

interface Props {
  products: KylinProduct[];
}

export const Catalog: React.FC<Props> = ({ products }) => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useStore();
  const [filter, setFilter] = useState<'all' | 'machines' | 'parts-and-cams'>('all');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const isZh = i18n.language.startsWith('zh');

  const filteredProducts = products.filter(p => {
    if (filter === 'all') return true;
    return p.categorySlug === filter;
  });

  const handleSelectVariant = (productSlug: string, variantId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVariants(prev => ({ ...prev, [productSlug]: variantId }));
  };

  const handleAddToCart = (product: KylinProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const chosenVariantId = selectedVariants[product.slug] || product.variants[0]?.id;
    const variant = product.variants.find(v => v.id === chosenVariantId) || product.variants[0];

    addToCart({
      variantId: variant.id,
      productSlug: product.slug,
      productName: isZh ? product.nameZh : product.name,
      variantName: variant.name,
      sku: variant.sku,
      price: variant.price,
      currency: 'USD',
      quantity: 1,
      imageUrl: product.imageUrl,
    });

    toast.success(
      isZh
        ? `已将 ${isZh ? product.nameZh : product.name} (${variant.name}) 加入购物袋`
        : `Added ${product.name} (${variant.name}) to Bag`,
      {
        description: `$${variant.price.toFixed(2)} USD • Free Global Express`,
      }
    );
  };

  return (
    <section id="catalog" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#c5a059] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
            <span>{isZh ? '全系机型' : 'All Products'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
            {t('catalog.heading')}
          </h2>
          <p className="mt-2 text-[14px] text-[#6e6e73] dark:text-[#86868b] max-w-xl leading-relaxed tracking-tight">
            {t('catalog.subheading')}
          </p>
        </div>

        {/* Segmented Filter Pills - Apple Segmented Control */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] self-start md:self-auto text-xs font-medium">
          <button
            onClick={() => setFilter('all')}
            className={`apple-btn px-4 py-1.5 rounded-full transition-all text-xs ${
              filter === 'all'
                ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs font-semibold'
                : 'text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
          >
            {t('catalog.all')}
          </button>
          <button
            onClick={() => setFilter('machines')}
            className={`apple-btn px-4 py-1.5 rounded-full transition-all text-xs ${
              filter === 'machines'
                ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs font-semibold'
                : 'text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
          >
            {t('catalog.pens')}
          </button>
          <button
            onClick={() => setFilter('parts-and-cams')}
            className={`apple-btn px-4 py-1.5 rounded-full transition-all text-xs ${
              filter === 'parts-and-cams'
                ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs font-semibold'
                : 'text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
          >
            {t('catalog.parts')}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(product => {
          const selectedVariantId = selectedVariants[product.slug] || product.variants[0]?.id;
          const currentVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];
          const displayPrice = currentVariant?.price || product.startingPriceUsd;

          return (
            <div
              key={product.slug}
              className="glass-panel rounded-3xl overflow-hidden flex flex-col hover:border-[#c5a059]/40 transition-all duration-300 group hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.7)] hover:-translate-y-1"
            >
              {/* Product Visual Container linking to dedicated page */}
              <Link
                to="/products/$slug"
                params={{ slug: product.slug }}
                className="relative aspect-square bg-[#f0f0f2] dark:bg-[#151517] overflow-hidden block cursor-pointer"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 opacity-95 group-hover:opacity-100"
                  loading="lazy"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#1d1d1f]/85 text-white dark:bg-black/80 dark:text-[#c5a059] border border-black/10 dark:border-[#c5a059]/30 backdrop-blur-xl">
                    {isZh ? product.badgeZh || product.badge : product.badge}
                  </span>
                )}
              </Link>

              {/* Info Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#c5a059] mb-1">
                    {isZh ? product.categoryNameZh : product.categoryName}
                  </div>

                  <Link
                    to="/products/$slug"
                    params={{ slug: product.slug }}
                    className="block group/title"
                  >
                    <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight hover:text-[#c5a059] transition-colors flex items-center justify-between">
                      <span>{isZh ? product.nameZh : product.name}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover/title:opacity-100 transition-opacity text-[#c5a059] shrink-0 ml-1" />
                    </h3>
                  </Link>

                  <p className="mt-2 text-xs text-[#6e6e73] dark:text-[#86868b] line-clamp-2 leading-relaxed">
                    {isZh ? product.descriptionZh : product.description}
                  </p>

                  {/* Machine Specs Badges */}
                  <div className="mt-5 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] space-y-2 text-xs">
                    {product.motor && (
                      <div className="flex justify-between items-center">
                        <span className="text-[#86868b] text-[11px]">{t('catalog.motor')}</span>
                        <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] truncate max-w-[200px] text-right">
                          {product.motor}
                        </span>
                      </div>
                    )}
                    {product.material && (
                      <div className="flex justify-between items-center">
                        <span className="text-[#86868b] text-[11px]">{t('catalog.material')}</span>
                        <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] text-right">
                          {product.material}
                        </span>
                      </div>
                    )}
                    {product.strokeOptions && product.strokeOptions.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-[#86868b] text-[11px]">{t('compare.colStroke')}</span>
                        <span className="font-mono font-medium text-[11px] text-[#c5a059]">
                          {product.strokeOptions.join(' / ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Variant Selection Chips */}
                  {product.variants.length > 1 && (
                    <div className="mt-5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#86868b] block mb-2">
                        {t('catalog.quickBuy')}:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {product.variants.map(v => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={e => handleSelectVariant(product.slug, v.id, e)}
                            className={`apple-btn text-xs px-3 py-1.5 rounded-xl transition-all border ${
                              selectedVariantId === v.id
                                ? 'bg-[#c5a059]/15 border-[#c5a059] text-[#c5a059] font-bold shadow-xs'
                                : 'border-black/10 dark:border-white/10 text-[#6e6e73] dark:text-[#86868b] hover:border-black/25 dark:hover:border-white/25 hover:text-[#1d1d1f] dark:hover:text-white'
                            }`}
                          >
                            {v.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Pricing & Add to Cart */}
                <div className="mt-6 pt-5 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                  <div className="text-2xl font-bold font-mono tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                    <NumberFlow
                      value={displayPrice}
                      format={{ style: 'currency', currency: 'USD' }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={e => handleAddToCart(product, e)}
                    className="apple-btn px-4 py-2 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] hover:opacity-90 text-xs font-semibold flex items-center gap-1.5 shadow-xs tracking-tight cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isZh ? '购物袋' : 'Bag'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
