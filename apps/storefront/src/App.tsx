import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from './components/Navbar';
import { HeroBannerSlides } from './components/HeroBannerSlides';
import { Hero } from './components/Hero';
import { Catalog } from './components/Catalog';
import { SpecsMatrix } from './components/SpecsMatrix';
import { VirtualPartsList } from './components/VirtualPartsList';
import { CraftSection } from './components/CraftSection';
import { FooterCompliance } from './components/FooterCompliance';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { useQuery } from '@tanstack/react-query';
import { fetchSaleorProducts, INITIAL_PRODUCTS } from './lib/catalog';

export const App: React.FC = () => {
  const { i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

  // TanStack Query to keep catalog in sync with Saleor GraphQL backend (US Default USD Channel)
  const { data: saleorData } = useQuery({
    queryKey: ['saleor-products-usd'],
    queryFn: () => fetchSaleorProducts(),
    staleTime: 1000 * 60 * 5, // 5 mins
  });

  const productsList = saleorData && saleorData.length > 0 ? saleorData : INITIAL_PRODUCTS;

  // Dynamic document title for Apple-grade Home experience
  useEffect(() => {
    document.title = isZh
      ? 'Kylin 麒麟纹身器材 | 官方旗舰店'
      : 'Kylin Tattoo | Precision Craftsmanship';
  }, [isZh]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfd] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-300">
      {/* Sticky Navigation with Integrated Announcement Banner */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Apple Keynote Billboard Slides */}
        <HeroBannerSlides />

        <Hero />
        <Catalog products={productsList} />
        <SpecsMatrix products={productsList} />
        <VirtualPartsList />
        <CraftSection />
      </main>

      {/* Apple Directory Footer & Compliance */}
      <FooterCompliance />

      {/* Interactive Drawers & Modals */}
      <CartDrawer />
      <CheckoutModal />
    </div>
  );
};
