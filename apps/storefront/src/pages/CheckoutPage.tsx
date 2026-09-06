import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from '@tanstack/react-router';
import { useStore } from '../lib/StoreContext';
import { useForm } from '@tanstack/react-form';
import NumberFlow from '@number-flow/react';
import { z } from 'zod';
import {
  CheckCircle,
  Lock,
  ShieldCheck,
  AlertCircle,
  Truck,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  PackageCheck,
  Building2,
  ChevronRight,
  Sun,
  Moon,
  ShoppingBag,
} from 'lucide-react';
import {
  saleorCreateCheckout,
  saleorUpdateDeliveryMethod,
  saleorCompleteCheckout,
  ShippingMethodItem,
  SaleorOrderResult,
} from '../lib/saleorAuth';
import { LanguageDropdown } from '../components/LanguageDropdown';
import { FooterCompliance } from '../components/FooterCompliance';
import { INITIAL_PRODUCTS } from '../lib/catalog';
import { STATIC_HARDWARE_PARTS } from '../components/VirtualPartsList';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Address is required for DHL shipping'),
  city: z.string().min(2, 'City is required'),
  countryArea: z.string().min(2, 'State / Province is required'),
  postalCode: z.string().min(3, 'Postal / Zip code is required'),
  country: z.string().min(2, 'Country is required'),
});

export const CheckoutPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');
  const navigate = useNavigate();
  const {
    cart,
    cartTotal,
    clearCart,
    currentUser,
    authToken,
    refreshUserData,
    theme,
    toggleTheme,
    setIsCartOpen,
  } = useStore();

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethodItem[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<string>('');
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(cartTotal);
  const [paymentMethod, setPaymentMethod] = useState<'card_terms' | 'wire_transfer'>('card_terms');

  const [isSubmittingDelivery, setIsSubmittingDelivery] = useState(false);
  const [isCompletingOrder, setIsCompletingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<SaleorOrderResult | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const form = useForm({
    defaultValues: {
      fullName: currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() : '',
      email: currentUser ? currentUser.email : '',
      phone: '',
      address: currentUser?.defaultShippingAddress?.streetAddress1 || '',
      city: currentUser?.defaultShippingAddress?.city || '',
      countryArea: currentUser?.defaultShippingAddress?.countryArea || '',
      postalCode: currentUser?.defaultShippingAddress?.postalCode || '',
      country: currentUser?.defaultShippingAddress?.country?.country || 'United States',
    },
    validators: {
      onChange: checkoutSchema,
    },
    onSubmit: async ({ value }) => {
      setCheckoutError(null);
      const nameParts = value.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      try {
        const result = await saleorCreateCheckout(
          {
            email: value.email,
            lines: cart.map(i => ({ variantId: i.variantId, quantity: i.quantity })),
            shippingAddress: {
              firstName,
              lastName,
              streetAddress1: value.address,
              city: value.city,
              countryArea: value.countryArea,
              postalCode: value.postalCode,
              country: value.country,
              phone: value.phone,
            },
          },
          authToken
        );

        setCheckoutId(result.id);
        setShippingMethods(result.shippingMethods || []);

        if (result.shippingMethods && result.shippingMethods.length > 0) {
          const defaultMethod = result.shippingMethods[0];
          setSelectedMethodId(defaultMethod.id);
          const updateRes = await saleorUpdateDeliveryMethod(result.id, defaultMethod.id, authToken);
          setShippingFee(updateRes.shippingPrice);
          setGrandTotal(updateRes.totalGrossAmount);
        } else {
          setGrandTotal(result.totalGrossAmount);
        }

        setCurrentStep(2);
      } catch (err) {
        console.error('Checkout error:', err);
        setCheckoutError(err instanceof Error ? err.message : 'Checkout initialization failed');
      }
    },
  });

  const handleMethodChange = async (methodId: string) => {
    if (!checkoutId) return;
    setSelectedMethodId(methodId);
    setIsSubmittingDelivery(true);
    try {
      const res = await saleorUpdateDeliveryMethod(checkoutId, methodId, authToken);
      setShippingFee(res.shippingPrice);
      setGrandTotal(res.totalGrossAmount);
    } catch (err) {
      console.error('Failed to update shipping method:', err);
    } finally {
      setIsSubmittingDelivery(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!checkoutId) return;
    setIsCompletingOrder(true);
    setCheckoutError(null);
    try {
      const metadata = [
        { key: 'payment_method', value: paymentMethod },
        { key: 'settlement_type', value: paymentMethod === 'card_terms' ? 'Net-30 B2B Commercial Dispatch' : 'International Wire TT Transfer' },
        { key: 'authorization_timestamp', value: new Date().toISOString() },
        { key: 'client_platform', value: 'Kylin Tattoo Official Storefront SPA (Checkout Page)' },
      ];
      const order = await saleorCompleteCheckout(checkoutId, authToken, metadata);
      setCompletedOrder(order);
      clearCart();
      await refreshUserData();
    } catch (err) {
      console.error('Failed to complete order:', err);
      setCheckoutError(err instanceof Error ? err.message : 'Failed to finalize order');
    } finally {
      setIsCompletingOrder(false);
    }
  };

  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfbfd] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7]">
        <header className="border-b border-black/[0.06] dark:border-white/[0.08] py-4 px-6 flex justify-between items-center glass-panel">
          <Link to="/" className="text-sm font-bold tracking-tight uppercase">
            Kylin Tattoo Official
          </Link>
          <LanguageDropdown />
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8 text-[#86868b]" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            {isZh ? '您的购物车为空' : 'Your Bag is Empty'}
          </h2>
          <p className="text-xs text-[#86868b] mb-6 leading-relaxed">
            {isZh
              ? '请先挑选所需的专业纹身机或精密配件，然后再前往结算。'
              : 'Please select professional tattoo machines or precision accessories before proceeding to checkout.'}
          </p>
          <Link
            to="/"
            className="apple-btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isZh ? '浏览全系机型' : 'Explore Catalog'}</span>
          </Link>
        </div>
        <FooterCompliance />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfd] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7]">
      {/* Top Minimal Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-black/[0.06] dark:border-white/[0.08] bg-[#fbfbfd]/80 dark:bg-[#000000]/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="apple-btn p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 hidden sm:block" />
          <span className="text-xs font-bold tracking-wider uppercase text-[#c5a059] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Kylin Secure Checkout</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="apple-btn p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#86868b] transition-all"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#1d1d1f]" />}
          </button>
          <LanguageDropdown />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {completedOrder ? (
          /* SUCCESS STATE */
          <div className="max-w-xl mx-auto py-12 text-center glass-panel-elevated rounded-3xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
              {t('checkoutModal.successTitle')}
            </h3>
            <p className="mt-2 text-xs text-[#6e6e73] dark:text-[#86868b] max-w-sm mx-auto leading-relaxed">
              {t('checkoutModal.successDesc')}
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#86868b]">{t('checkoutModal.orderNumber')}:</span>
                <span className="font-mono font-bold text-sm text-[#c5a059]">
                  #{completedOrder.number}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#86868b]">{t('checkoutModal.orderStatus')}:</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-semibold">
                  {completedOrder.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#86868b]">{t('checkoutModal.totalAmount')}:</span>
                <span className="font-mono font-bold text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">
                  ${completedOrder.totalAmount?.toFixed(2) || grandTotal.toFixed(2)} USD
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/account"
                className="apple-btn w-full sm:w-auto px-6 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-semibold"
              >
                {isZh ? '进入个人中心查看' : 'View in Account'}
              </Link>
              <Link
                to="/"
                className="apple-btn w-full sm:w-auto px-6 py-3 rounded-full bg-black/5 dark:bg-white/10 text-[#1d1d1f] dark:text-[#f5f5f7] text-xs font-semibold"
              >
                {isZh ? '返回展厅' : 'Return to Catalog'}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form & Steps */}
            <div className="lg:col-span-7 space-y-6">
              <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8">
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#c5a059] uppercase tracking-wider">
                    <span>{currentStep === 1 ? t('checkoutModal.step1') : t('checkoutModal.step2')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono font-medium text-[#86868b]">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        currentStep === 1
                          ? 'bg-[#c5a059] text-white font-bold'
                          : 'bg-emerald-500/20 text-emerald-500'
                      }`}
                    >
                      1
                    </span>
                    <span className="text-black/20 dark:text-white/20">—</span>
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        currentStep === 2
                          ? 'bg-[#c5a059] text-white font-bold'
                          : 'bg-black/10 dark:bg-white/10'
                      }`}
                    >
                      2
                    </span>
                  </div>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {currentStep === 1 ? 'Global Express Shipping Details' : 'Verify & Authorize Transaction'}
                </h1>
                <p className="text-xs text-[#6e6e73] dark:text-[#86868b] mt-1 leading-relaxed">
                  {currentStep === 1
                    ? t('checkoutModal.desc')
                    : t('checkoutModal.authorizedPaymentDesc')}
                </p>

                {checkoutError && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Checkout authorization notice</p>
                      <p className="mt-0.5 text-[11px] opacity-90">{checkoutError}</p>
                    </div>
                  </div>
                )}

                {/* STEP 1: ADDRESS FORM */}
                {currentStep === 1 && (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      form.handleSubmit();
                    }}
                    className="mt-6 space-y-4 text-left"
                  >
                    {/* Full Name */}
                    <form.Field
                      name="fullName"
                      validators={{
                        onChange: z.string().min(2, 'Name must be at least 2 characters'),
                      }}
                      children={field => (
                        <div>
                          <label className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider block mb-1">
                            {t('checkoutModal.nameLabel')}
                          </label>
                          <input
                            value={field.state.value}
                            onChange={e => field.handleChange(e.target.value)}
                            placeholder="e.g. Austin Lee (Master Artist)"
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20 transition-all text-[#1d1d1f] dark:text-[#f5f5f7]"
                          />
                          {field.state.meta.errors?.[0] && (
                            <p className="text-[10px] text-red-500 mt-1">{String(field.state.meta.errors[0])}</p>
                          )}
                        </div>
                      )}
                    />

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <form.Field
                        name="email"
                        validators={{
                          onChange: z.string().email('Invalid email address'),
                        }}
                        children={field => (
                          <div>
                            <label className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider block mb-1">
                              {t('checkoutModal.emailLabel')}
                            </label>
                            <input
                              type="email"
                              value={field.state.value}
                              onChange={e => field.handleChange(e.target.value)}
                              placeholder="artist@studio.com"
                              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20 transition-all text-[#1d1d1f] dark:text-[#f5f5f7]"
                            />
                            {field.state.meta.errors?.[0] && (
                              <p className="text-[10px] text-red-500 mt-1">{String(field.state.meta.errors[0])}</p>
                            )}
                          </div>
                        )}
                      />

                      <form.Field
                        name="phone"
                        validators={{
                          onChange: z.string().min(6, 'Please enter a valid phone number'),
                        }}
                        children={field => (
                          <div>
                            <label className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider block mb-1">
                              {t('checkoutModal.phoneLabel')}
                            </label>
                            <input
                              value={field.state.value}
                              onChange={e => field.handleChange(e.target.value)}
                              placeholder="+1 (555) 019-2834"
                              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20 transition-all text-[#1d1d1f] dark:text-[#f5f5f7]"
                            />
                            {field.state.meta.errors?.[0] && (
                              <p className="text-[10px] text-red-500 mt-1">{String(field.state.meta.errors[0])}</p>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    {/* Street Address */}
                    <form.Field
                      name="address"
                      validators={{
                        onChange: z.string().min(5, 'Address is required for DHL shipping'),
                      }}
                      children={field => (
                        <div>
                          <label className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider block mb-1">
                            {t('checkoutModal.addressLabel')}
                          </label>
                          <input
                            value={field.state.value}
                            onChange={e => field.handleChange(e.target.value)}
                            placeholder="Suite 402, 1080 S Arts District"
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20 transition-all text-[#1d1d1f] dark:text-[#f5f5f7]"
                          />
                          {field.state.meta.errors?.[0] && (
                            <p className="text-[10px] text-red-500 mt-1">{String(field.state.meta.errors[0])}</p>
                          )}
                        </div>
                      )}
                    />

                    {/* State & Postal Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <form.Field
                        name="countryArea"
                        validators={{
                          onChange: z.string().min(2, 'State / Province is required'),
                        }}
                        children={field => (
                          <div>
                            <label className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider block mb-1">
                              State / Province
                            </label>
                            <input
                              value={field.state.value}
                              onChange={e => field.handleChange(e.target.value)}
                              placeholder="e.g. CA or NY"
                              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20 transition-all text-[#1d1d1f] dark:text-[#f5f5f7]"
                            />
                            {field.state.meta.errors?.[0] && (
                              <p className="text-[10px] text-red-500 mt-1">{String(field.state.meta.errors[0])}</p>
                            )}
                          </div>
                        )}
                      />

                      <form.Field
                        name="postalCode"
                        validators={{
                          onChange: z.string().min(3, 'Postal / Zip code is required'),
                        }}
                        children={field => (
                          <div>
                            <label className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider block mb-1">
                              ZIP / Postal Code
                            </label>
                            <input
                              value={field.state.value}
                              onChange={e => field.handleChange(e.target.value)}
                              placeholder="e.g. 90001"
                              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20 transition-all text-[#1d1d1f] dark:text-[#f5f5f7]"
                            />
                            {field.state.meta.errors?.[0] && (
                              <p className="text-[10px] text-red-500 mt-1">{String(field.state.meta.errors[0])}</p>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    {/* City & Country */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <form.Field
                        name="city"
                        validators={{
                          onChange: z.string().min(2, 'City is required'),
                        }}
                        children={field => (
                          <div>
                            <label className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider block mb-1">
                              {t('checkoutModal.cityLabel')}
                            </label>
                            <input
                              value={field.state.value}
                              onChange={e => field.handleChange(e.target.value)}
                              placeholder="Los Angeles"
                              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20 transition-all text-[#1d1d1f] dark:text-[#f5f5f7]"
                            />
                            {field.state.meta.errors?.[0] && (
                              <p className="text-[10px] text-red-500 mt-1">{String(field.state.meta.errors[0])}</p>
                            )}
                          </div>
                        )}
                      />

                      <form.Field
                        name="country"
                        validators={{
                          onChange: z.string().min(2, 'Country is required'),
                        }}
                        children={field => (
                          <div>
                            <label className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider block mb-1">
                              {t('checkoutModal.countryLabel')}
                            </label>
                            <select
                              value={field.state.value}
                              onChange={e => field.handleChange(e.target.value)}
                              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20 transition-all text-[#1d1d1f] dark:text-[#f5f5f7]"
                            >
                              <option value="United States">United States (US)</option>
                              <option value="Canada">Canada</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="Germany">Germany</option>
                              <option value="Australia">Australia</option>
                            </select>
                            {field.state.meta.errors?.[0] && (
                              <p className="text-[10px] text-red-500 mt-1">{String(field.state.meta.errors[0])}</p>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    <form.Subscribe
                      selector={state => [state.canSubmit, state.isSubmitting]}
                      children={([canSubmit, isSubmitting]) => (
                        <button
                          type="submit"
                          disabled={!canSubmit || isSubmitting}
                          className="apple-btn w-full py-4 rounded-full bg-[#c5a059] text-white font-semibold text-xs uppercase tracking-wider hover:bg-[#b08e4c] transition-all disabled:opacity-50 shadow-md flex items-center justify-center gap-2 mt-6"
                        >
                          {isSubmitting ? (
                            isZh ? '正在创建订单会话...' : 'Creating Session...'
                          ) : (
                            <>
                              <span>{t('checkoutModal.continueToDelivery')}</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      )}
                    />
                  </form>
                )}

                {/* STEP 2: DELIVERY METHOD & PAYMENT */}
                {currentStep === 2 && (
                  <div className="mt-6 space-y-6 text-left">
                    <div>
                      <label className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider block mb-2">
                        {t('checkoutModal.shippingMethod')}
                      </label>
                      <div className="space-y-2">
                        {shippingMethods.length === 0 ? (
                          <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-xs text-[#86868b]">
                            {t('checkoutModal.noShippingAvailable')}
                          </div>
                        ) : (
                          shippingMethods.map(method => (
                            <label
                              key={method.id}
                              className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                                selectedMethodId === method.id
                                  ? 'border-[#c5a059] bg-[#c5a059]/5'
                                  : 'border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name="shippingMethod"
                                  value={method.id}
                                  checked={selectedMethodId === method.id}
                                  onChange={() => handleMethodChange(method.id)}
                                  className="accent-[#c5a059]"
                                />
                                <div>
                                  <span className="text-xs font-semibold block text-[#1d1d1f] dark:text-[#f5f5f7]">
                                    {method.name}
                                  </span>
                                  <span className="text-[10px] text-[#86868b]">
                                    Estimated: {method.minimumDeliveryDays || 2}-{method.maximumDeliveryDays || 4} business days
                                  </span>
                                </div>
                              </div>
                              <span className="text-xs font-mono font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                                {method.price.amount === 0 ? 'FREE' : `$${method.price.amount.toFixed(2)}`}
                              </span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Payment Mode Selection */}
                    <div>
                      <label className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider block mb-2">
                        {t('checkoutModal.paymentMethod')}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div
                          onClick={() => setPaymentMethod('card_terms')}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            paymentMethod === 'card_terms'
                              ? 'border-[#c5a059] bg-[#c5a059]/5 ring-1 ring-[#c5a059]'
                              : 'border-black/10 dark:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <CreditCard className="w-4 h-4 text-[#c5a059]" />
                            <span className="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                              {t('checkoutModal.cardTerms')}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#86868b] leading-tight">
                            {t('checkoutModal.cardTermsDesc')}
                          </p>
                        </div>

                        <div
                          onClick={() => setPaymentMethod('wire_transfer')}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            paymentMethod === 'wire_transfer'
                              ? 'border-[#c5a059] bg-[#c5a059]/5 ring-1 ring-[#c5a059]'
                              : 'border-black/10 dark:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 className="w-4 h-4 text-[#c5a059]" />
                            <span className="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                              {t('checkoutModal.wireTransfer')}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#86868b] leading-tight">
                            {t('checkoutModal.wireTransferDesc')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-black/5 dark:border-white/10">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="apple-btn px-5 py-3 rounded-full text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{isZh ? '返回修改' : 'Back'}</span>
                      </button>

                      <button
                        onClick={handlePlaceOrder}
                        disabled={isCompletingOrder || isSubmittingDelivery}
                        className="apple-btn flex-1 py-3.5 rounded-full bg-[#c5a059] text-white font-semibold text-xs uppercase tracking-wider hover:bg-[#b08e4c] transition-all disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
                      >
                        {isCompletingOrder ? (
                          isZh ? '正在向工坊授权订单...' : 'Authorizing Order...'
                        ) : (
                          <>
                            <PackageCheck className="w-4 h-4" />
                            <span>{t('checkoutModal.authorizeOrder')}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-5">
              <div className="glass-panel-elevated rounded-3xl p-6 sm:p-7 sticky top-24 space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1d1d1f] dark:text-[#f5f5f7] pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
                  {isZh ? '订单明细与配置' : 'Hardware Configuration'}
                </h3>

                <div className="divide-y divide-black/[0.04] dark:divide-white/[0.06] max-h-72 overflow-y-auto pr-1">
                  {cart.map(item => {
                    const matchedProduct = INITIAL_PRODUCTS.find(p => p.slug === item.productSlug);
                    const matchedPart = STATIC_HARDWARE_PARTS.find(
                      p => `part-${p.id}` === item.productSlug || p.sku === item.sku || p.saleorVariantId === item.variantId
                    );
                    const matchedVariant = matchedProduct?.variants.find(
                      v => v.id === item.variantId || (item.sku && v.sku === item.sku)
                    );
                    const displayProductName = matchedProduct
                      ? (isZh ? matchedProduct.nameZh : matchedProduct.name)
                      : matchedPart
                      ? (isZh ? matchedPart.nameZh : matchedPart.nameEn)
                      : (isZh ? item.productName : item.productName.replace(/[一-龥]/g, '').trim());
                    const displayVariantName = isZh
                      ? (matchedVariant?.nameZh || item.variantName)
                      : (matchedVariant?.name || item.variantName.replace(/\s*\([^)]*[一-龥]+[^)]*\)/g, '').replace(/[一-龥]/g, '').trim());

                    return (
                      <div key={item.variantId} className="py-3 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.imageUrl}
                            alt={displayProductName}
                            className="w-10 h-10 rounded-xl object-cover bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-black/5 dark:border-white/5"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
                              {displayProductName}
                            </p>
                            <p className="text-[10px] text-[#86868b] truncate">
                              {displayVariantName} • Qty {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono font-bold shrink-0 text-[#1d1d1f] dark:text-[#f5f5f7]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] space-y-2 text-xs">
                  <div className="flex justify-between text-[#86868b]">
                    <span>{isZh ? '硬件小计' : 'Hardware Subtotal'}</span>
                    <span className="font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#86868b]">
                    <span>{isZh ? '洁净室特快包装与出海运费' : 'DHL Express Freight'}</span>
                    <span className="font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">
                      {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex justify-between items-baseline">
                    <span className="font-bold text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">
                      {isZh ? '订单应付总额' : 'Total Payable'}
                    </span>
                    <span className="font-mono font-bold text-xl text-[#c5a059]">
                      <NumberFlow value={grandTotal} format={{ style: 'currency', currency: 'USD' }} />
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#c5a059] text-[11px] flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>2-Year Global Warranty & Direct Factory Precision Assurance</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <FooterCompliance />
    </div>
  );
};
