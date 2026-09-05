import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { useStore } from '../lib/StoreContext';
import { useForm } from '@tanstack/react-form';
import NumberFlow from '@number-flow/react';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  X,
  CheckCircle,
  Lock,
  ShieldCheck,
  AlertCircle,
  Truck,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  PackageCheck,
  Receipt,
  Building2,
} from 'lucide-react';
import {
  saleorCreateCheckout,
  saleorUpdateDeliveryMethod,
  saleorCompleteCheckout,
  ShippingMethodItem,
  SaleorOrderResult,
} from '../lib/saleorAuth';

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

export const CheckoutModal: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');
  const navigate = useNavigate();
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    clearCart,
    currentUser,
    authToken,
    refreshUserData,
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

  const form = useForm({
    defaultValues: {
      fullName: currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() : '',
      email: currentUser ? currentUser.email : '',
      phone: '',
      address: currentUser?.defaultShippingAddress?.streetAddress1 || '',
      city: currentUser?.defaultShippingAddress?.city || '',
      countryArea: 'CA',
      postalCode: '90001',
      country: currentUser?.defaultShippingAddress?.country?.country || 'United States',
    },
    onSubmit: async ({ value }) => {
      setCheckoutError(null);
      const nameParts = value.fullName.split(' ');
      const firstName = nameParts[0] || 'Artist';
      const lastName = nameParts.slice(1).join(' ') || 'Studio';

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
          // Default to first shipping method
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
      const order = await saleorCompleteCheckout(checkoutId, authToken);
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

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCurrentStep(1);
    setCompletedOrder(null);
    setCheckoutError(null);
  };

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop with Asymmetric Smooth Fade */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-200 ease-out"
      />

      <div className="relative glass-panel-elevated rounded-3xl w-full max-w-lg p-7 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto animate-apple-modal">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {completedOrder ? (
          /* SUCCESS STATE */
          <div className="py-8 text-center">
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
                <span className="text-[#86868b]">{isZh ? '订单状态:' : 'Order Status:'}</span>
                <span className="font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-500 text-[10px]">
                  {completedOrder.status}
                </span>
              </div>
              {completedOrder.shippingMethodName && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#86868b]">Carrier:</span>
                  <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {completedOrder.shippingMethodName}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex justify-between items-center text-xs font-bold">
                <span className="text-[#1d1d1f] dark:text-[#f5f5f7]">Total Authorized:</span>
                <span className="font-mono text-base text-[#1d1d1f] dark:text-[#f5f5f7]">
                  ${completedOrder.totalAmount.toFixed(2)} USD
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  handleClose();
                  navigate({ to: '/account' });
                }}
                className="flex-1 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>{t('accountPage.tabOrders') || 'View in My Account'}</span>
              </button>
              <button
                onClick={handleClose}
                className="py-3 px-6 rounded-full border border-black/10 dark:border-white/10 text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-all cursor-pointer"
              >
                {t('checkoutModal.close')}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header and Step Indicators */}
            <div className="flex items-center justify-between mb-4 pr-8">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#c5a059] uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                <span>{t('checkoutModal.title')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-[#86868b]">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    currentStep === 1
                      ? 'bg-[#c5a059] text-white font-bold'
                      : 'bg-emerald-500/20 text-emerald-500'
                  }`}
                >
                  1
                </span>
                <span>—</span>
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    currentStep === 2
                      ? 'bg-[#c5a059] text-white font-bold'
                      : 'bg-black/10 dark:bg-white/10'
                  }`}
                >
                  2
                </span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
              {currentStep === 1 ? t('checkoutModal.step1') : t('checkoutModal.step2')}
            </h3>
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
                className="mt-5 space-y-3.5 text-left"
              >
                {/* Full Name */}
                <form.Field
                  name="fullName"
                  validators={{
                    onChange: ({ value }) => {
                      const res = checkoutSchema.shape.fullName.safeParse(value);
                      return res.success ? undefined : res.error.errors[0]?.message;
                    },
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
                      onChange: ({ value }) => {
                        const res = checkoutSchema.shape.email.safeParse(value);
                        return res.success ? undefined : res.error.errors[0]?.message;
                      },
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
                      onChange: ({ value }) => {
                        const res = checkoutSchema.shape.phone.safeParse(value);
                        return res.success ? undefined : res.error.errors[0]?.message;
                      },
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
                    onChange: ({ value }) => {
                      const res = checkoutSchema.shape.address.safeParse(value);
                      return res.success ? undefined : res.error.errors[0]?.message;
                    },
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
                      onChange: ({ value }) => {
                        const res = checkoutSchema.shape.countryArea.safeParse(value);
                        return res.success ? undefined : res.error.errors[0]?.message;
                      },
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
                      onChange: ({ value }) => {
                        const res = checkoutSchema.shape.postalCode.safeParse(value);
                        return res.success ? undefined : res.error.errors[0]?.message;
                      },
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
                      </div>
                    )}
                  />

                  <form.Field
                    name="country"
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
                      </div>
                    )}
                  />
                </div>

                {/* Items & Subtotal */}
                <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 flex justify-between items-center text-xs">
                  <span className="text-[#86868b] font-medium">Hardware Subtotal:</span>
                  <span className="font-mono font-bold text-sm text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums">
                    ${cartTotal.toFixed(2)} USD
                  </span>
                </div>

                <form.Subscribe
                  selector={state => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <button
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                      className="w-full py-3.5 rounded-full bg-[#c5a059] text-white font-semibold text-xs uppercase tracking-wider hover:bg-[#b08e4c] transition-all disabled:opacity-50 shadow-md flex items-center justify-center gap-2 mt-4"
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

            {/* STEP 2: SHIPPING METHODS & PAYMENT CONFIRMATION */}
            {currentStep === 2 && (
              <div className="mt-5 space-y-4 text-left">
                {/* Shipping Method Selector */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#86868b] uppercase tracking-wider mb-2">
                    <Truck className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>{t('checkoutModal.selectShipping')}</span>
                  </div>

                  <div className="space-y-2">
                    {shippingMethods.map(method => (
                      <div
                        key={method.id}
                        onClick={() => handleMethodChange(method.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          selectedMethodId === method.id
                            ? 'border-[#c5a059] bg-[#c5a059]/10 shadow-sm'
                            : 'border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black/20 dark:hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={selectedMethodId === method.id}
                            onChange={() => handleMethodChange(method.id)}
                            className="accent-[#c5a059] w-4 h-4"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                              {method.name}
                            </p>
                            <p className="text-[11px] text-[#86868b]">
                              Estimated Transit:{' '}
                              {method.minimumDeliveryDays && method.maximumDeliveryDays
                                ? `${method.minimumDeliveryDays}-${method.maximumDeliveryDays} business days`
                                : 'Fast air courier'}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-xs text-[#1d1d1f] dark:text-[#f5f5f7]">
                          {method.price.amount === 0
                            ? 'FREE'
                            : `$${method.price.amount.toFixed(2)}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Terms Selector */}
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#86868b] uppercase tracking-wider mb-2">
                    <CreditCard className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>{t('checkoutModal.selectPayment')}</span>
                  </div>

                  <div className="space-y-2">
                    <div
                      onClick={() => setPaymentMethod('card_terms')}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        paymentMethod === 'card_terms'
                          ? 'border-[#c5a059] bg-[#c5a059]/10 shadow-sm'
                          : 'border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'card_terms'}
                          onChange={() => setPaymentMethod('card_terms')}
                          className="accent-[#c5a059] w-4 h-4"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                            {t('checkoutModal.paymentTerms1')}
                          </p>
                          <p className="text-[11px] text-[#86868b]">
                            Billed with Net-30 terms upon dispatch confirmation.
                          </p>
                        </div>
                      </div>
                      <ShieldCheck className="w-4 h-4 text-[#c5a059] shrink-0" />
                    </div>

                    <div
                      onClick={() => setPaymentMethod('wire_transfer')}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        paymentMethod === 'wire_transfer'
                          ? 'border-[#c5a059] bg-[#c5a059]/10 shadow-sm'
                          : 'border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'wire_transfer'}
                          onChange={() => setPaymentMethod('wire_transfer')}
                          className="accent-[#c5a059] w-4 h-4"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                            {t('checkoutModal.paymentTerms2')}
                          </p>
                          <p className="text-[11px] text-[#86868b]">
                            International wire details and swift instructions dispatched via email.
                          </p>
                        </div>
                      </div>
                      <Building2 className="w-4 h-4 text-[#86868b] shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Calculation breakdown with NumberFlow */}
                <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between text-[#86868b]">
                    <span>Items Subtotal:</span>
                    <span className="font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">
                      <NumberFlow
                        value={cartTotal}
                        format={{ style: 'currency', currency: 'USD' }}
                      />
                    </span>
                  </div>
                  <div className="flex justify-between text-[#86868b]">
                    <span>Logistics Courier:</span>
                    <span className="font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">
                      {shippingFee === 0 ? 'FREE' : (
                        <NumberFlow
                          value={shippingFee}
                          format={{ style: 'currency', currency: 'USD' }}
                        />
                      )}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-black/5 dark:border-white/5 flex justify-between items-center font-bold">
                    <span className="text-[#1d1d1f] dark:text-[#f5f5f7]">Grand Total:</span>
                    <span className="font-mono text-base text-[#c5a059] flex items-center gap-1">
                      <NumberFlow
                        value={grandTotal}
                        format={{ style: 'currency', currency: 'USD' }}
                      />
                      <span className="text-xs">USD</span>
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="py-3 px-5 rounded-full border border-black/10 dark:border-white/10 text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-all flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isCompletingOrder || isSubmittingDelivery}
                    className="flex-1 py-3.5 rounded-full bg-[#c5a059] text-white font-semibold text-xs uppercase tracking-wider hover:bg-[#b08e4c] transition-all disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
                  >
                    {isCompletingOrder ? (
                      isZh ? '正在提交订单...' : 'Placing Order...'
                    ) : (
                      <>
                        <PackageCheck className="w-4 h-4" />
                        <span>{t('checkoutModal.submit')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
