import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes/router';
import { queryClient } from './lib/queryClient';
import { StoreProvider } from './lib/StoreContext';
import { Toaster } from 'sonner';
import { registerSW } from 'virtual:pwa-register';
import './i18n';
import './index.css';

// Explicit PWA Service Worker Registration with automatic updates
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      console.log('[PWA] New version detected, updating service worker...');
    },
    onOfflineReady() {
      console.log('[PWA] Kylin Tattoo is ready for offline use.');
    },
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <RouterProvider router={router} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 2600,
            className:
              '!glass-panel-elevated !border !border-black/10 dark:!border-white/15 !text-[#1d1d1f] dark:!text-[#f5f5f7] !shadow-2xl !rounded-2xl !px-4 !py-3',
          }}
        />
        {import.meta.env.DEV && (
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
        )}
      </StoreProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
