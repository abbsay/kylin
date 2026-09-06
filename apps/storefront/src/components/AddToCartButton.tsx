import React, { useState, useRef, useEffect, useTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Check, AlertCircle } from 'lucide-react';
import { useAddToCartMutation } from '../lib/cartQuery';
import { CartItem } from '../types';

interface AddToCartButtonProps {
  item: CartItem;
  label?: string;
  successLabel?: string;
  size?: 'default' | 'compact';
  className?: string;
  showPrice?: boolean;
  onSuccess?: () => void;
  simulateError?: boolean;
}

/**
 * Apple Ergonomics & Fluid Physics Add-to-Cart Button
 * - Instant physical feedback on pointerdown (scale 0.97)
 * - Zero-latency TanStack Query optimistic update (onMutate)
 * - Smooth morphing into micro-success state and automatic restoration
 * - Gentle shake alert and query cache automatic rollback on error
 */
export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  item,
  label,
  successLabel,
  size = 'default',
  className = '',
  showPrice = false,
  onSuccess,
  simulateError = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [, startTransition] = useTransition();

  const { i18n } = useTranslation();
  const isZh = i18n.language?.startsWith('zh');

  const addToCartMutation = useAddToCartMutation();

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only respond to primary mouse button or touch
    if (e.button === 0) {
      setIsPressed(true);
    }
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  const handlePointerCancel = () => {
    setIsPressed(false);
  };

  const handlePointerLeave = () => {
    setIsPressed(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (simulateError) {
      setStatus('idle');
    } else {
      setStatus('success');
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setStatus('idle');
      }, 1500);
    }

    addToCartMutation.mutate(
      { item, simulateError },
      {
        onSuccess: () => {
          setStatus('success');
          setErrorNotice(null);
          onSuccess?.();

          if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
          resetTimerRef.current = setTimeout(() => {
            setStatus('idle');
          }, 1500);
        },
        onError: (err) => {
          setStatus('error');
          setErrorNotice(err.message || 'Error');

          if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
          resetTimerRef.current = setTimeout(() => {
            setStatus('idle');
            setErrorNotice(null);
          }, 1800);
        },
      }
    );
  };

  const isCompact = size === 'compact';
  const totalAmount = item.price * item.quantity;

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      style={{
        transform: isPressed ? 'scale(0.97)' : 'scale(1)',
      }}
      className={`relative select-none overflow-hidden rounded-full font-semibold transition-all duration-200 ease-out flex items-center justify-center gap-2 will-change-transform active:scale-[0.97] ${
        status === 'success'
          ? 'bg-[#121214] text-[#c5a059] dark:bg-white dark:text-[#121214] ring-1 ring-[#c5a059]/50 shadow-md'
          : status === 'error'
          ? 'animate-soft-shake bg-[#2a1717] text-[#f87171] border border-[#ef4444]/40 shadow-xs'
          : 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] hover:opacity-95 shadow-md'
      } ${
        isCompact
          ? 'px-3.5 sm:px-5 py-2 text-[11px] sm:text-xs'
          : 'py-3.5 px-6 text-xs tracking-tight'
      } ${className}`}
      aria-label={label || 'Add to Bag'}
    >
      {/* Specular hairline shimmer on surface */}
      <span className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Dynamic Content Transitions with Zero Layout Shift */}
      <span className="flex items-center justify-center gap-2 pointer-events-none">
        {status === 'success' ? (
          <>
            <span className="animate-check-pop flex items-center justify-center">
              <Check className={`${isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-[#c5a059] dark:text-[#121214] stroke-[2.5]`} />
            </span>
            <span className="animate-fade-in font-semibold">
              {successLabel || (isZh ? '已加入 ✓' : 'Added ✓')}
            </span>
          </>
        ) : status === 'error' ? (
          <>
            <AlertCircle className={`${isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-[#f87171]`} />
            <span className="font-medium text-[11px]">
              {errorNotice === 'INVENTORY_SYNC_TIMEOUT'
                ? (isZh ? '库存同步异常' : 'Inventory Sync Error')
                : (isZh ? '加购失败 (已自动回滚)' : 'Add Failed (Reverted)')}
            </span>
          </>
        ) : (
          <>
            <ShoppingBag className={`${isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'} shrink-0`} />
            <span>
              {label ||
                (showPrice
                  ? (isZh ? `加入购物袋 · $${totalAmount.toFixed(2)}` : `Add to Bag · $${totalAmount.toFixed(2)}`)
                  : (isZh ? '加入购物袋' : 'Add to Bag'))}
            </span>
          </>
        )}
      </span>
    </button>
  );
};
