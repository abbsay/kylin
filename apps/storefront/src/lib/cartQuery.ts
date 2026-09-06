import { queryOptions, useMutation, useQuery, useQueryClient, QueryClient } from '@tanstack/react-query';
import { CartItem } from '../types';
import { toast } from 'sonner';
import i18n from '../i18n';

export const CART_QUERY_KEY = ['cart'] as const;

const LOCAL_STORAGE_CART_KEY = 'kylin_cart';

// Safe localStorage helpers
export const getStoredCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveStoredCart = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
  } catch {
    // Ignore storage quota errors
  }
};

// Reusable type-safe query options for TanStack Query
export const cartQueryOptions = queryOptions({
  queryKey: CART_QUERY_KEY,
  queryFn: async (): Promise<CartItem[]> => {
    return getStoredCart();
  },
  initialData: () => getStoredCart(),
  staleTime: Infinity, // Single source of truth driven directly by mutations
});

export interface AddToCartVariables {
  item: CartItem;
  simulateError?: boolean;
}

export interface AddToCartContext {
  previousCart: CartItem[];
  item: CartItem;
}

/**
 * High-performance TanStack Query hook for cart state
 */
export const useCartQuery = () => {
  const query = useQuery(cartQueryOptions);
  const cart: CartItem[] = query.data || [];
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return {
    ...query,
    cart,
    totalItems,
    cartTotal,
  };
};

/**
 * High-performance TanStack Query mutation for zero-latency optimistic addition
 */
export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CartItem, Error, AddToCartVariables, AddToCartContext>({
    mutationKey: ['addToCart'],
    // Simulated remote network request with realistic latency (400ms)
    mutationFn: async ({ item, simulateError }) => {
      await new Promise(resolve => setTimeout(resolve, 400));
      if (simulateError) {
        throw new Error('INVENTORY_SYNC_TIMEOUT');
      }
      return item;
    },
    // 0ms Synchronous Optimistic Update - Kill Latency (Apple Fluid Standard)
    onMutate: async ({ item }) => {
      // 1. Cancel any in-flight cart queries so they don't overwrite optimistic data
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });

      // 2. Snapshot current state for rollback
      const previousCart = queryClient.getQueryData<CartItem[]>(CART_QUERY_KEY) || getStoredCart();

      // 3. Compute next cart state immediately
      const existingIndex = previousCart.findIndex(i => i.variantId === item.variantId);
      let nextCart: CartItem[];
      if (existingIndex > -1) {
        nextCart = previousCart.map((i, idx) =>
          idx === existingIndex ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        nextCart = [...previousCart, item];
      }

      // 4. Update TanStack Query cache synchronously (0ms UI reaction)
      queryClient.setQueryData<CartItem[]>(CART_QUERY_KEY, nextCart);

      // 5. Return context with snapshot
      return { previousCart, item };
    },
    // Graceful automatic rollback on error
    onError: (error, variables, context) => {
      // Rollback cache to snapshot
      if (context?.previousCart) {
        queryClient.setQueryData<CartItem[]>(CART_QUERY_KEY, context.previousCart);
        saveStoredCart(context.previousCart);
      }

      // Soft non-destructive alert without breaking layout
      const isZh = i18n.language.startsWith('zh');
      toast.error(
        isZh ? '库存同步异常，加购已撤销' : 'Inventory sync failed, cart reverted',
        {
          description: isZh
            ? '已自动回滚购物车至加购前状态，请稍后重试。'
            : 'Your cart has been safely restored to previous state.',
          duration: 3200,
        }
      );
    },
    // Final sync & persist
    onSettled: () => {
      const current = queryClient.getQueryData<CartItem[]>(CART_QUERY_KEY) || [];
      saveStoredCart(current);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

/**
 * Direct cache mutation helpers for cart drawer and other components
 */
export const updateCartItemQtyInCache = (client: QueryClient, variantId: string, delta: number) => {
  client.setQueryData<CartItem[]>(CART_QUERY_KEY, (old: CartItem[] | undefined) => {
    const safeOld = old || [];
    const next = safeOld
      .map(i => {
        if (i.variantId === variantId) {
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : null;
        }
        return i;
      })
      .filter((i): i is CartItem => Boolean(i));
    saveStoredCart(next);
    return next;
  });
};

export const removeCartItemFromCache = (client: QueryClient, variantId: string) => {
  client.setQueryData<CartItem[]>(CART_QUERY_KEY, (old: CartItem[] | undefined) => {
    const safeOld = old || [];
    const next = safeOld.filter(i => i.variantId !== variantId);
    saveStoredCart(next);
    return next;
  });
};

export const clearCartInCache = (client: QueryClient) => {
  client.setQueryData<CartItem[]>(CART_QUERY_KEY, []);
  saveStoredCart([]);
};


