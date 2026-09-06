import React, { useEffect, useState, useRef } from 'react';
import NumberFlow from '@number-flow/react';

interface MiniCartBadgeProps {
  count: number;
  className?: string;
}

/**
 * Apple Fluid Spring Badge for Mini Cart
 * Immediately springs and pulses on count changes (0ms delay with TanStack Query onMutate)
 */
export const MiniCartBadge: React.FC<MiniCartBadgeProps> = ({ count, className = '' }) => {
  const [isBouncing, setIsBouncing] = useState(false);
  const prevCountRef = useRef(count);

  useEffect(() => {
    // When count increases or changes, trigger spring bounce instantly
    if (count !== prevCountRef.current) {
      setIsBouncing(true);
      const timer = setTimeout(() => {
        setIsBouncing(false);
      }, 420);
      prevCountRef.current = count;
      return () => clearTimeout(timer);
    }
  }, [count]);

  if (count <= 0) return null;

  return (
    <span
      className={`absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-gradient-to-tr from-[#99732b] via-[#c5a059] to-[#dfbe78] text-white text-[9px] font-bold flex items-center justify-center shadow-xs border border-white/30 dark:border-black/40 pointer-events-none select-none z-10 transition-transform ${
        isBouncing ? 'animate-badge-spring ring-2 ring-[#c5a059]/40' : ''
      } ${className}`}
      aria-label={`${count} items in cart`}
    >
      <NumberFlow
        value={count}
        transformTiming={{
          duration: 280,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        spinTiming={{
          duration: 320,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
    </span>
  );
};
