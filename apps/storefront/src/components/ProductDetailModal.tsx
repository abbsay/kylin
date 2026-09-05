import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KylinProduct } from '../types';
import { useStore } from '../lib/StoreContext';
import { X, Check, ShieldCheck, Wrench, Zap, Scale, Award } from 'lucide-react';

interface Props {
  product: KylinProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<Props> = ({ product, isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { addToCart, setIsCartOpen } = useStore();
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);

  const isZh = i18n.language.startsWith('zh');

  if (!isOpen || !product) return null;

  const currentVariant =
    product.variants.find(v => v.id === (selectedVariantId || product.variants[0]?.id)) ||
    product.variants[0];
  const displayPrice = currentVariant?.price || product.startingPriceUsd;

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
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setIsCartOpen(true);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop with Apple Ultra-Blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xl transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative glass-panel-elevated rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 border border-black/[0.08] dark:border-white/[0.12]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="apple-btn absolute top-5 right-5 z-20 p-2.5 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 transition-all backdrop-blur-md"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Visual */}
        <div className="relative bg-[#f0f0f2] dark:bg-[#151517] flex items-center justify-center p-6 aspect-square overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover rounded-2xl shadow-md"
          />
          {product.badge && (
            <span className="absolute top-6 left-6 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#1d1d1f]/85 text-[#c5a059] border border-[#c5a059]/30 backdrop-blur-xl">
              {isZh ? product.badgeZh || product.badge : product.badge}
            </span>
          )}
        </div>

        {/* Details & Selection Body */}
        <div className="p-7 sm:p-8 flex flex-col justify-between text-left">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#c5a059] mb-1">
              {isZh ? product.categoryNameZh : product.categoryName}
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
              {isZh ? product.nameZh : product.name}
            </h2>

            <div className="mt-3 text-2xl font-bold font-mono tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums">
              ${displayPrice.toFixed(2)}{' '}
              <span className="text-xs font-normal text-[#86868b] font-sans">USD</span>
            </div>

            <p className="mt-4 text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
              {isZh ? product.descriptionZh : product.description}
            </p>

            {/* Hardware Parameters */}
            <div className="mt-6 pt-5 border-t border-black/[0.06] dark:border-white/[0.08] space-y-2.5 text-xs">
              {product.motor && (
                <div className="flex items-center justify-between">
                  <span className="text-[#86868b] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#c5a059]" />
                    {t('catalog.motor')}
                  </span>
                  <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {product.motor}
                  </span>
                </div>
              )}
              {product.material && (
                <div className="flex items-center justify-between">
                  <span className="text-[#86868b] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#c5a059]" />
                    {t('catalog.material')}
                  </span>
                  <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {product.material}
                  </span>
                </div>
              )}
              {product.strokeOptions && product.strokeOptions.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[#86868b] flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-[#c5a059]" />
                    {t('compare.colStroke')}
                  </span>
                  <span className="font-mono text-[#c5a059] font-medium">
                    {product.strokeOptions.join(' / ')}
                  </span>
                </div>
              )}
              {product.weight && (
                <div className="flex items-center justify-between">
                  <span className="text-[#86868b] flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-[#c5a059]" />
                    {t('compare.colWeight')}
                  </span>
                  <span className="font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {product.weight}
                  </span>
                </div>
              )}
            </div>

            {/* Variant Selector */}
            {product.variants.length > 1 && (
              <div className="mt-6">
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#86868b] block mb-2">
                  {t('catalog.quickBuy')}:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {product.variants.map(v => {
                    const isSelected = currentVariant.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`apple-btn text-xs p-3 rounded-2xl transition-all border flex items-center justify-between ${
                          isSelected
                            ? 'border-[#c5a059] bg-[#c5a059]/10 text-[#1d1d1f] dark:text-white font-semibold'
                            : 'border-black/[0.06] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 text-[#6e6e73] dark:text-[#86868b]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#c5a059] bg-[#c5a059]' : 'border-[#86868b]'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span>{v.name}</span>
                        </div>
                        <span className="font-mono font-bold">${v.price.toFixed(2)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`apple-btn flex-1 py-3.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all ${
                isAdded
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] hover:opacity-95'
              }`}
            >
              {isAdded ? <Check className="w-4 h-4" /> : null}
              <span>{isAdded ? (isZh ? '已加入购物车' : 'Added to Bag') : t('cart.title')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
