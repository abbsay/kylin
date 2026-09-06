import { createRootRouteWithContext, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { App } from '../App';
import { AccountPage } from '../pages/AccountPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { AuthPage } from '../pages/AuthPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { queryClient, productsQueryOptions } from '../lib/queryClient';

// Root route with typed queryClient context
export const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => <Outlet />,
});

// Index route rendering the main flagship store with query prefetching
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions),
  component: App,
});

// Dedicated full-page Account route
export const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account',
  component: AccountPage,
});

// Dedicated full-page Login route
export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => <AuthPage defaultMode="login" />,
});

// Dedicated full-page Register route
export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: () => <AuthPage defaultMode="register" />,
});

// Dedicated full-page Product Detail route with route loader prefetching
export const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$slug',
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions),
  component: ProductDetailPage,
});

// Dedicated full-page Checkout route
export const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

// Create the router configuration tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  accountRoute,
  loginRoute,
  registerRoute,
  productRoute,
  checkoutRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0, // Hand caching control to TanStack Query (router-query rule)
  context: {
    queryClient,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
