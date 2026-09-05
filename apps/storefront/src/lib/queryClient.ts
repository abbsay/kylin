import { QueryClient, queryOptions } from '@tanstack/react-query';
import { fetchSaleorProducts } from './catalog';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes fresh
    },
  },
});

export const productsQueryOptions = queryOptions({
  queryKey: ['saleor-products-usd'],
  queryFn: () => fetchSaleorProducts(),
  staleTime: 1000 * 60 * 5,
});
