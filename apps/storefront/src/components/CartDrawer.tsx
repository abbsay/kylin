import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../lib/StoreContext';
import NumberFlow from '@number-flow/react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartTotal,
    removeFromCart,
    updateQty,
    setIsCheckoutOpen,
  } = useStore();

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
        isCartOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
      }`}
    >
      {/* Backdrop with Asymmetric Smooth Fade */}
      <div
        onClick={() => setIsCartOpen(false)}
        className={`absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-250 ease-out ${
          isCartOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen max-w-md glass-panel-elevated !rounded-l-3xl shadow-2xl flex flex-col justify-between overflow-hidden border-l border-black/[0.08] dark:border-white/[0.1] transform transition-transform duration-280 cubic-bezier(0.16, 1, 0.3, 1) will-change-transform ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c5a059] block">
                {isZh ? '商品清单' : 'Order List'}
              </span>
              <h3 className="text-base font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                {t('cart.title')} ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="apple-btn p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="p-6 flex-1 overflow-y-auto divide-y divide-black/[0.05] dark:divide-white/[0.06]">
            {cart.length === 0 ? (
              <div className="py-24 text-center">
                <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-3 text-[#86868b]">
                  <ShoppingBag className="w-6 h-6 opacity-40" />
                </div>
                <p className="text-sm font-medium text-[#86868b]">{t('cart.empty')}</p>
                <p className="text-xs text-[#86868b]/70 mt-1">Add machines, precision cams or motors to begin.</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.variantId} className="py-4.5 flex gap-4 items-center">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-16 h-16 rounded-2xl object-cover bg-neutral-100 dark:bg-neutral-800 border border-black/5 dark:border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
                      {item.productName}
                    </h4>
                    <p className="text-[11px] text-[#86868b] truncate mt-0.5">{item.variantName}</p>
                    <div className="text-sm font-mono font-bold text-[#c5a059] mt-1">
                      <NumberFlow
                        value={item.price}
                        format={{ style: 'currency', currency: 'USD' }}
                      />
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 border border-black/10 dark:border-white/10 rounded-full px-2.5 py-1 bg-black/[0.02] dark:bg-white/[0.03]">
                    <button
                      onClick={() => updateQty(item.variantId, -1)}
                      className="apple-btn text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-mono font-bold tabular-nums min-w-3 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.variantId, 1)}
                      className="apple-btn text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.variantId)}
                    className="apple-btn text-[#86868b] hover:text-red-500 p-1.5 transition-colors rounded-lg hover:bg-red-500/10"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.015] space-y-4">
              <div className="flex justify-between items-baseline text-sm">
                <span className="text-xs font-medium text-[#86868b] uppercase tracking-wider">{t('cart.subtotal')}</span>
                <span className="font-mono font-bold text-2xl text-[#1d1d1f] dark:text-[#f5f5f7]">
                  <NumberFlow
                    value={cartTotal}
                    format={{ style: 'currency', currency: 'USD' }}
                  />
                </span>
              </div>
              <p className="text-[11px] text-[#86868b] leading-relaxed">{t('cart.freeShippingNote')}</p>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="apple-btn w-full py-3.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-semibold hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <span>{t('cart.checkout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
