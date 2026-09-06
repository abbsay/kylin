import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from '@tanstack/react-router';
import { useStore } from '../lib/StoreContext';
import { useQuery } from '@tanstack/react-query';
import { productsQueryOptions } from '../lib/queryClient';
import { AuthView } from '../components/AuthView';
import {
  Shield,
  User,
  Package,
  MapPin,
  Mail,
  LogOut,
  ArrowLeft,
  AlertCircle,
  Clock,
  ChevronRight,
  Sun,
  Moon,
  ShoppingBag,
  Truck,
  CreditCard,
  Phone,
  CheckCircle2,
  Plus,
  Check,
  Edit2,
  Trash2,
  Lock,
  X,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Wrench,
  Layers,
  ArrowUpRight,
  ArrowRight
} from 'lucide-react';
import { SaleorAddress, AddressInputData } from '../lib/saleorAuth';
import { LanguageDropdown } from '../components/LanguageDropdown';
import { FooterCompliance } from '../components/FooterCompliance';

interface QuickPartItem {
  id: string;
  saleorVariantId: string;
  sku: string;
  nameEn: string;
  nameZh: string;
  price: number;
  specs: string;
  imageUrl: string;
}

const QUICK_PARTS: QuickPartItem[] = [
  {
    id: 'cam-35',
    saleorVariantId: 'UHJvZHVjdFZhcmlhbnQ6MTI=',
    sku: 'KYLIN-PART-CAM-35',
    nameEn: 'Titanium Eccentric Cam 3.5mm',
    nameZh: 'E30 钛合金偏心轮 (3.5mm 标准行程)',
    price: 38.0,
    specs: 'Stroke: 3.5mm • Swiss Maxon Spec',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'rca-gold-cable',
    saleorVariantId: 'UHJvZHVjdFZhcmlhbnQ6MTk=',
    sku: 'KYLIN-PART-RCA-GOLD',
    nameEn: '90° 24K Gold-Plated Ultra-Flex RCA Cord',
    nameZh: '90度直角 24K 镀金超软硅胶 RCA 勾线',
    price: 28.0,
    specs: 'Zero Voltage Drop • Pure OFC Copper',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'battery-t7-pack',
    saleorVariantId: 'UHJvZHVjdFZhcmlhbnQ6MTc=',
    sku: 'KYLIN-PART-BAT-T7',
    nameEn: 'T7max Wireless Li-Po Battery Pack 1800mAh',
    nameZh: 'T7max 专用磁吸锂电池组 (1800mAh 续航8小时)',
    price: 59.0,
    specs: 'USB-C Fast Charging • Magnetic Click',
    imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=85',
  },
];

export const AccountPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data: saleorProducts } = useQuery(productsQueryOptions);

  const dynamicQuickParts = useMemo<QuickPartItem[]>(() => {
    if (!saleorProducts || saleorProducts.length === 0) return QUICK_PARTS;
    const skuMap = new Map<string, { id: string; price: number; imageUrl?: string }>();
    saleorProducts.forEach(p => {
      p.variants.forEach(v => {
        if (v.sku) skuMap.set(v.sku, { id: v.id, price: v.price, imageUrl: v.imageUrl });
      });
    });
    return QUICK_PARTS.map(part => {
      const live = skuMap.get(part.sku);
      if (live) {
        return {
          ...part,
          saleorVariantId: live.id,
          price: live.price > 0 ? live.price : part.price,
          imageUrl: live.imageUrl || part.imageUrl,
        };
      }
      return part;
    });
  }, [saleorProducts]);
  const {
    currentUser,
    logoutUser,
    updateUserProfile,
    changePassword,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    theme,
    toggleTheme,
    cart,
    setIsCartOpen,
    addToCart,
  } = useStore();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'parts'>('profile');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [addedPartId, setAddedPartId] = useState<string | null>(null);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFirstName, setProfileFirstName] = useState('');
  const [profileLastName, setProfileLastName] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Change Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Address Modal State
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressFormData, setAddressFormData] = useState<AddressInputData>({
    firstName: '',
    lastName: '',
    companyName: '',
    streetAddress1: '',
    streetAddress2: '',
    city: '',
    countryArea: '',
    postalCode: '',
    country: 'US',
    phone: '',
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const isZh = i18n.language.startsWith('zh');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Dynamic document title
  useEffect(() => {
    document.title = isZh
      ? '艺术家工坊与个人中心 | 麒麟官方旗舰店'
      : 'Artist Workshop & Account | Kylin Tattoo Official';
  }, [isZh]);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setErrorMessage(null);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setSuccessMessage(null);
  };

  const handleStartEditProfile = () => {
    setProfileFirstName(currentUser?.firstName || '');
    setProfileLastName(currentUser?.lastName || '');
    setIsEditingProfile(true);
    setErrorMessage(null);
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await updateUserProfile(profileFirstName, profileLastName);
      setIsEditingProfile(false);
      showSuccess(isZh ? '艺术家姓名已成功更新' : 'Artist profile updated successfully');
    } catch (err: any) {
      showError(err.message || (isZh ? '更新档案失败' : 'Failed to update profile'));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      showError(isZh ? '请输入原密码与新密码' : 'Please fill in both current and new passwords');
      return;
    }
    if (newPassword.length < 8) {
      showError(isZh ? '新密码至少需要8位字符' : 'New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showError(isZh ? '两次输入的新密码不一致' : 'New passwords do not match');
      return;
    }
    setIsSavingPassword(true);
    try {
      await changePassword(oldPassword, newPassword);
      setIsPasswordModalOpen(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      showSuccess(isZh ? '密码已成功修改，安全令牌已刷新' : 'Password changed successfully');
    } catch (err: any) {
      showError(err.message || (isZh ? '修改密码失败，请核对原密码' : 'Failed to change password'));
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressFormData({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      companyName: '',
      streetAddress1: '',
      streetAddress2: '',
      city: '',
      countryArea: 'CA',
      postalCode: '',
      country: 'US',
      phone: '',
    });
    setAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: SaleorAddress) => {
    setEditingAddressId(addr.id);
    setAddressFormData({
      firstName: addr.firstName || '',
      lastName: addr.lastName || '',
      companyName: addr.companyName || '',
      streetAddress1: addr.streetAddress1 || '',
      streetAddress2: addr.streetAddress2 || '',
      city: addr.city || '',
      countryArea: addr.countryArea || 'CA',
      postalCode: addr.postalCode || '',
      country: addr.country?.code || 'US',
      phone: addr.phone || '',
    });
    setAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressFormData.streetAddress1 || !addressFormData.city || !addressFormData.postalCode) {
      showError(isZh ? '请填写完整的街道、城市与邮编' : 'Please fill in street address, city, and postal code');
      return;
    }
    setIsSavingAddress(true);
    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, addressFormData);
        showSuccess(isZh ? '收货地址已成功更新' : 'Address updated successfully');
      } else {
        await createAddress(addressFormData, 'SHIPPING');
        showSuccess(isZh ? '新收货地址已保存' : 'New address saved');
      }
      setAddressModalOpen(false);
    } catch (err: any) {
      showError(err.message || (isZh ? '保存地址失败' : 'Failed to save address'));
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm(isZh ? '确定要删除该收货地址吗？' : 'Are you sure you want to delete this address?')) return;
    try {
      await deleteAddress(id);
      showSuccess(isZh ? '地址已删除' : 'Address deleted');
    } catch (err: any) {
      showError(err.message || (isZh ? '删除失败' : 'Failed to delete address'));
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      await setDefaultAddress(id, 'SHIPPING');
      showSuccess(isZh ? '已设为默认特快配送地址' : 'Set as default shipping address');
    } catch (err: any) {
      showError(err.message || (isZh ? '设置失败' : 'Failed to set default address'));
    }
  };

  const handleQuickAdd = (part: QuickPartItem) => {
    addToCart({
      variantId: part.saleorVariantId,
      productSlug: `part-${part.id}`,
      productName: isZh ? part.nameZh : part.nameEn,
      variantName: part.specs,
      sku: part.sku,
      price: part.price,
      currency: 'USD',
      quantity: 1,
      imageUrl: part.imageUrl,
    });
    setAddedPartId(part.id);
    setTimeout(() => setAddedPartId(null), 1500);
  };

  const orders = currentUser?.orders?.edges || [];
  const addresses = currentUser?.addresses || (currentUser?.defaultShippingAddress ? [currentUser.defaultShippingAddress] : []);

  // Display initial for avatar
  const userInitial = (currentUser?.firstName?.[0] || currentUser?.email?.[0] || 'K').toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfd] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-200 selection:bg-[#c5a059]/20">
      {/* 1. Apple Keynote Top Navigation Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#fbfbfd]/80 dark:bg-[#000000]/80 border-b border-black/[0.06] dark:border-white/[0.08] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="apple-btn flex items-center gap-1.5 text-xs text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="font-medium">{isZh ? '返回商店' : 'Store'}</span>
            </Link>

            <span className="text-black/20 dark:text-white/20">/</span>

            <span className="font-brand text-xs font-semibold tracking-wider text-[#1d1d1f] dark:text-[#f5f5f7]">
              KYLIN WORKSHOP
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <LanguageDropdown size="sm" />

            <button
              onClick={toggleTheme}
              className="apple-btn p-1.5 rounded-full text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="apple-btn relative p-1.5 text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#c5a059] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {currentUser && (
              <button
                onClick={() => logoutUser()}
                className="apple-btn ml-2 text-xs text-[#6e6e73] dark:text-[#86868b] hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.05]"
                title={isZh ? '安全退出登录' : 'Sign Out'}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isZh ? '退出' : 'Sign Out'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Account Surface */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Global Feedback Notifications */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-3 shadow-xs animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-3 shadow-xs animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {!currentUser ? (
          /* ========================================================================= */
          /* UNAUTHENTICATED: Seamless Apple ID Authentication View                     */
          /* ========================================================================= */
          <div className="py-6 sm:py-12">
            <AuthView />
          </div>
        ) : (
          /* ========================================================================= */
          /* AUTHENTICATED: Apple Open Studio Canvas (Frameless macOS Workspace)       */
          /* Completely frameless: No monolithic outer box, pure open breathing canvas */
          /* ========================================================================= */
          <div className="space-y-8 sm:space-y-10 animate-fadeIn">
            {/* 2.1 Frameless Hero Identity Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-black/[0.06] dark:border-white/[0.08]">
              {/* Left: Avatar & Identity */}
              <div className="flex items-center gap-5 sm:gap-6">
                {/* Luxury Squircle Avatar */}
                <div className="relative shrink-0">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-[28%] bg-gradient-to-tr from-[#1d1d1f] via-[#c5a059] to-[#fbfbfd] dark:from-[#c5a059] dark:via-[#ecd599] dark:to-[#8c6f32] p-[2px] shadow-[0_8px_30px_rgba(197,160,89,0.22)] flex items-center justify-center">
                    <div className="w-full h-full bg-white dark:bg-[#121214] rounded-[26%] flex items-center justify-center font-brand font-bold text-2xl sm:text-3xl text-[#c5a059]">
                      {userInitial}
                    </div>
                  </div>
                  {/* Active Studio Online Heartbeat */}
                  <span
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-[#fbfbfd] dark:ring-[#000000] flex items-center justify-center"
                    title="Kylin Hardware Session Active"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  </span>
                </div>

                {/* Typography & Verified Badges */}
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/25">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>
                        {currentUser.isStaff
                          ? isZh
                            ? '官方团队 (Staff)'
                            : 'Official Staff'
                          : isZh
                          ? '认证刺青艺术家 (Verified Artist)'
                          : 'Verified Pro Artist'}
                      </span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/[0.04] dark:bg-white/[0.06] text-[#86868b]">
                      <span>Kylin ID • Saleor Core</span>
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {currentUser.firstName
                      ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim()
                      : currentUser.email.split('@')[0]}
                  </h1>

                  <p className="text-xs text-[#86868b] mt-1 font-mono flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>{currentUser.email}</span>
                  </p>
                </div>
              </div>

              {/* Right: Quick Studio Action Pills */}
              <div className="flex items-center gap-2.5 self-start md:self-center flex-wrap">
                <button
                  onClick={handleStartEditProfile}
                  className="apple-btn px-4 py-2 rounded-full text-xs font-medium bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-[#1d1d1f] dark:text-white transition-all flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isZh ? '编辑工坊资料' : 'Edit Profile'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsPasswordModalOpen(true);
                    setErrorMessage(null);
                  }}
                  className="apple-btn px-4 py-2 rounded-full text-xs font-medium border border-black/10 dark:border-white/15 hover:bg-black/[0.03] dark:hover:bg-white/[0.06] text-[#1d1d1f] dark:text-white transition-all flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isZh ? '修改密码' : 'Password'}</span>
                </button>

                <button
                  onClick={() => logoutUser()}
                  className="apple-btn px-3.5 py-2 rounded-full text-xs font-medium text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-1.5"
                  title={isZh ? '退出登录' : 'Sign Out'}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isZh ? '退出' : 'Sign Out'}</span>
                </button>
              </div>
            </div>

            {/* 2.2 Borderless Stats Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 py-2">
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05]">
                <span className="block text-[11px] text-[#86868b] mb-1">{isZh ? '工坊累计订单' : 'Studio Orders'}</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-[#1d1d1f] dark:text-white">
                  {orders.length}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05]">
                <span className="block text-[11px] text-[#86868b] mb-1">{isZh ? '认证收货地址' : 'Verified Addresses'}</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-[#1d1d1f] dark:text-white">
                  {addresses.length}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05]">
                <span className="block text-[11px] text-[#86868b] mb-1">{isZh ? '特快物流权益' : 'Express Delivery'}</span>
                <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
                  <Truck className="w-4 h-4 shrink-0" />
                  <span>{isZh ? '全球免邮特快直达' : 'Free Global Priority'}</span>
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05]">
                <span className="block text-[11px] text-[#86868b] mb-1">{isZh ? '马达原厂质保' : 'Warranty Protection'}</span>
                <span className="text-xs sm:text-sm font-semibold text-[#c5a059] flex items-center gap-1.5 mt-1">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{isZh ? '2年原厂包换联保' : '2-Year Guarantee'}</span>
                </span>
              </div>
            </div>

            {/* 2.3 macOS System Settings Dual-Column Layout (Frameless Master-Detail) */}
            <div className="pt-4 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Navigation Sidebar */}
              <div className="md:col-span-4 lg:col-span-3 space-y-4 md:sticky md:top-24">
                {/* Mobile scrollable pills / Desktop vertical macOS menu */}
                <div className="flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className={`w-full py-3 px-4 rounded-2xl text-xs font-medium transition-all text-left flex items-center justify-between shrink-0 md:shrink ${
                      activeTab === 'profile'
                        ? 'bg-black/[0.08] dark:bg-white/[0.12] text-[#1d1d1f] dark:text-white font-semibold shadow-xs'
                        : 'text-[#6e6e73] dark:text-[#86868b] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                        activeTab === 'profile'
                          ? 'bg-[#c5a059] text-black'
                          : 'bg-black/[0.04] dark:bg-white/[0.06] text-[#86868b]'
                      }`}>
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span>{isZh ? '工坊档案与认证' : 'Artist Profile'}</span>
                    </div>
                    <ChevronRight className={`hidden md:block w-3.5 h-3.5 opacity-40 ${activeTab === 'profile' ? 'opacity-100 text-[#c5a059]' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full py-3 px-4 rounded-2xl text-xs font-medium transition-all text-left flex items-center justify-between shrink-0 md:shrink ${
                      activeTab === 'addresses'
                        ? 'bg-black/[0.08] dark:bg-white/[0.12] text-[#1d1d1f] dark:text-white font-semibold shadow-xs'
                        : 'text-[#6e6e73] dark:text-[#86868b] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                        activeTab === 'addresses'
                          ? 'bg-[#c5a059] text-black'
                          : 'bg-black/[0.04] dark:bg-white/[0.06] text-[#86868b]'
                      }`}>
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span>{isZh ? '收货地址簿' : 'Addresses'}</span>
                    </div>
                    {addresses.length > 0 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/[0.06] dark:bg-white/[0.1] text-[#86868b]">
                        {addresses.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className={`w-full py-3 px-4 rounded-2xl text-xs font-medium transition-all text-left flex items-center justify-between shrink-0 md:shrink ${
                      activeTab === 'orders'
                        ? 'bg-black/[0.08] dark:bg-white/[0.12] text-[#1d1d1f] dark:text-white font-semibold shadow-xs'
                        : 'text-[#6e6e73] dark:text-[#86868b] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                        activeTab === 'orders'
                          ? 'bg-[#c5a059] text-black'
                          : 'bg-black/[0.04] dark:bg-white/[0.06] text-[#86868b]'
                      }`}>
                        <Package className="w-3.5 h-3.5" />
                      </div>
                      <span>{isZh ? '订单与追踪' : 'Orders & Tracking'}</span>
                    </div>
                    {orders.length > 0 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/[0.06] dark:bg-white/[0.1] text-[#86868b]">
                        {orders.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('parts')}
                    className={`w-full py-3 px-4 rounded-2xl text-xs font-medium transition-all text-left flex items-center justify-between shrink-0 md:shrink ${
                      activeTab === 'parts'
                        ? 'bg-black/[0.08] dark:bg-white/[0.12] text-[#1d1d1f] dark:text-white font-semibold shadow-xs'
                        : 'text-[#6e6e73] dark:text-[#86868b] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                        activeTab === 'parts'
                          ? 'bg-[#c5a059] text-black'
                          : 'bg-black/[0.04] dark:bg-white/[0.06] text-[#86868b]'
                      }`}>
                        <Wrench className="w-3.5 h-3.5" />
                      </div>
                      <span>{isZh ? '常用配件补给' : 'Quick Parts'}</span>
                    </div>
                    <ChevronRight className={`hidden md:block w-3.5 h-3.5 opacity-40 ${activeTab === 'parts' ? 'opacity-100 text-[#c5a059]' : ''}`} />
                  </button>
                </div>

                {/* Studio Guarantee Badge */}
                <div className="hidden md:block p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02]">
                  <div className="flex items-center gap-2 text-[#c5a059] text-xs font-semibold mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isZh ? 'Kylin 官方认证保障' : 'Kylin Studio Care'}</span>
                  </div>
                  <p className="text-[11px] text-[#86868b] leading-relaxed">
                    {isZh
                      ? '所有注册工坊直享瑞士 Maxon 电机原厂换新质保与中国直发全程保价。'
                      : 'Verified artists receive 2-year Maxon replacement warranty and priority insured fulfillment.'}
                  </p>
                </div>
              </div>

              {/* Right Column: Main Content Canvas */}
              <div className="md:col-span-8 lg:col-span-9">
                {/* ===================================================================== */}
                {/* TAB 1: PROFILE & SYSTEM SETTINGS (Apple Inset Grouped Settings)       */}
                {/* ===================================================================== */}
                {activeTab === 'profile' && (
                  <div className="space-y-8 animate-fadeIn">
                    {/* Section Header */}
                    <div>
                      <h2 className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                        {isZh ? '艺术家档案与工坊凭据' : 'Artist Profile & Credentials'}
                      </h2>
                      <p className="text-xs text-[#86868b] mt-1">
                        {isZh ? '管理您的官方认证信息、联络邮箱及官方安全凭据。' : 'Manage your verified credentials, contact details, and account security.'}
                      </p>
                    </div>

                    {/* Apple Inset Grouped Settings Block */}
                    <div className="rounded-3xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02] p-6 sm:p-8">
                      {isEditingProfile ? (
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                            {isZh ? '修改姓名与工坊显示' : 'Edit Artist Name'}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-medium text-[#86868b] mb-1.5">
                                {isZh ? '名 (First Name)' : 'First Name'}
                              </label>
                              <input
                                type="text"
                                value={profileFirstName}
                                onChange={e => setProfileFirstName(e.target.value)}
                                placeholder="First name"
                                className="w-full text-xs px-4 py-3 rounded-2xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.1] focus:outline-none focus:border-[#c5a059] text-[#1d1d1f] dark:text-[#f5f5f7]"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-medium text-[#86868b] mb-1.5">
                                {isZh ? '姓 (Last Name)' : 'Last Name'}
                              </label>
                              <input
                                type="text"
                                value={profileLastName}
                                onChange={e => setProfileLastName(e.target.value)}
                                placeholder="Last name"
                                className="w-full text-xs px-4 py-3 rounded-2xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.1] focus:outline-none focus:border-[#c5a059] text-[#1d1d1f] dark:text-[#f5f5f7]"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
                            <button
                              type="button"
                              onClick={() => setIsEditingProfile(false)}
                              className="apple-btn px-4 py-2 rounded-full text-xs text-[#6e6e73] dark:text-[#86868b] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                            >
                              {isZh ? '取消' : 'Cancel'}
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveProfile}
                              disabled={isSavingProfile}
                              className="apple-btn px-5 py-2 rounded-full text-xs font-semibold bg-[#c5a059] hover:bg-[#d4af37] text-black disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                            >
                              {isSavingProfile && <div className="w-3 h-3 rounded-full border-2 border-black/30 border-t-black animate-spin" />}
                              <span>{isZh ? '保存更新' : 'Save Changes'}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06] text-xs">
                          <div className="py-4.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-[#86868b] flex items-center gap-2.5">
                              <User className="w-4 h-4 text-[#c5a059]" />
                              <span>{isZh ? '艺术家姓名' : 'Full Name'}</span>
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">
                                {currentUser.firstName || currentUser.lastName
                                  ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()
                                  : isZh ? '未填写真实姓名' : 'Not set'}
                              </span>
                              <button
                                onClick={handleStartEditProfile}
                                className="apple-btn text-[#c5a059] hover:underline text-xs font-medium"
                              >
                                {isZh ? '修改' : 'Edit'}
                              </button>
                            </div>
                          </div>

                          <div className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-[#86868b] flex items-center gap-2.5">
                              <Mail className="w-4 h-4 text-[#c5a059]" />
                              <span>{isZh ? '官方绑定邮箱' : 'Email Address'}</span>
                            </span>
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="font-mono text-xs text-[#1d1d1f] dark:text-[#f5f5f7] font-medium">{currentUser.email}</span>
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                {isZh ? '✓ 官方认证' : '✓ Verified'}
                              </span>
                            </div>
                          </div>

                          <div className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-[#86868b] flex items-center gap-2.5">
                              <Shield className="w-4 h-4 text-[#c5a059]" />
                              <span>{isZh ? '工坊会员级别' : 'Membership Tier'}</span>
                            </span>
                            <span className="font-semibold text-[#c5a059] flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>
                                {currentUser.isStaff
                                  ? isZh
                                    ? '官方管理中心 (Staff Administrator)'
                                    : 'Official Staff Admin'
                                  : isZh
                                  ? '认证专业刺青师 (Pro Hardware VIP)'
                                  : 'Verified Pro Hardware VIP'}
                              </span>
                            </span>
                          </div>

                          <div className="py-4.5 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-[#86868b] flex items-center gap-2.5">
                              <Lock className="w-4 h-4 text-[#c5a059]" />
                              <span>{isZh ? '账户安全密码' : 'Account Password'}</span>
                            </span>
                            <div className="flex items-center gap-4">
                              <span className="font-mono text-[#86868b] tracking-widest text-xs">••••••••••••</span>
                              <button
                                onClick={() => {
                                  setIsPasswordModalOpen(true);
                                  setErrorMessage(null);
                                }}
                                className="apple-btn px-3 py-1 rounded-full text-xs font-medium border border-black/10 dark:border-white/15 hover:bg-black/[0.04] dark:hover:bg-white/[0.08] text-[#1d1d1f] dark:text-white transition-all"
                              >
                                {isZh ? '更改密码' : 'Change Password'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ===================================================================== */}
                {/* TAB 2: ADDRESS BOOK (Frameless Apple Destination Cards)               */}
                {/* ===================================================================== */}
                {activeTab === 'addresses' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                          {isZh ? '工作室与配送地址簿' : 'Saved Delivery Destinations'}
                        </h2>
                        <p className="text-xs text-[#86868b] mt-1">
                          {isZh ? '实时维护您的工作室、展会临时展位或常用收货地址。' : 'Manage your studio locations and shipping addresses.'}
                        </p>
                      </div>

                      <button
                        onClick={handleOpenAddAddress}
                        className="apple-btn px-4 py-2.5 rounded-full text-xs font-semibold bg-[#c5a059] hover:bg-[#d4af37] text-black shadow-xs transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{isZh ? '添加新地址' : 'Add Address'}</span>
                      </button>
                    </div>

                    {addresses.length === 0 ? (
                      <div className="rounded-3xl border border-dashed border-black/15 dark:border-white/15 p-12 text-center bg-black/[0.01] dark:bg-white/[0.01]">
                        <MapPin className="w-8 h-8 text-[#86868b] mx-auto mb-3 opacity-40" />
                        <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                          {isZh ? '您当前暂无保存的收货地址' : 'No addresses saved yet'}
                        </h3>
                        <p className="text-xs text-[#86868b] mt-1 max-w-sm mx-auto">
                          {isZh ? '添加常用收货地址后，在结账时可享受 1-Click 极速特快发货通道。' : 'Save your address to enjoy streamlined express delivery.'}
                        </p>
                        <button
                          onClick={handleOpenAddAddress}
                          className="apple-btn mt-5 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#c5a059] text-black inline-flex items-center gap-1.5 shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isZh ? '添加首个地址' : 'Add First Address'}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {addresses.map(addr => {
                          const isDefault = addr.isDefaultShippingAddress || addr.id === currentUser.defaultShippingAddress?.id;
                          return (
                            <div
                              key={addr.id}
                              className={`rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 relative group ${
                                isDefault
                                  ? 'border-[#c5a059] bg-gradient-to-b from-[#c5a059]/[0.08] via-black/[0.02] to-transparent dark:via-white/[0.02] dark:to-transparent shadow-[0_8px_25px_rgba(197,160,89,0.12)]'
                                  : 'border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02] hover:border-black/20 dark:hover:border-white/20'
                              }`}
                            >
                              <div>
                                {/* Card Header Tag */}
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-[10px] font-mono tracking-widest text-[#86868b] uppercase">
                                    {addr.companyName ? addr.companyName : isZh ? '工作室私享' : 'Studio Destination'}
                                  </span>

                                  {isDefault ? (
                                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#c5a059] text-black font-bold flex items-center gap-1 shadow-xs">
                                      <Check className="w-3 h-3 stroke-[3]" />
                                      <span>{isZh ? '默认配送' : 'Default'}</span>
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleSetDefaultAddress(addr.id)}
                                      className="apple-btn text-[10px] text-[#c5a059] hover:underline font-medium"
                                    >
                                      {isZh ? '设为默认' : 'Set Default'}
                                    </button>
                                  )}
                                </div>

                                {/* Recipient */}
                                <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                                  {addr.firstName} {addr.lastName}
                                </h3>

                                {/* Address details */}
                                <div className="text-xs text-[#6e6e73] dark:text-[#86868b] space-y-1 leading-relaxed">
                                  <p className="text-[#1d1d1f] dark:text-[#f5f5f7] font-medium">{addr.streetAddress1}</p>
                                  {addr.streetAddress2 && <p>{addr.streetAddress2}</p>}
                                  <p>
                                    {addr.city}, {addr.countryArea} {addr.postalCode}
                                  </p>
                                  <p className="font-mono text-[11px] text-[#86868b]">
                                    {addr.country?.country || addr.country?.code || 'United States'}
                                  </p>
                                  {addr.phone && (
                                    <p className="text-[11px] font-mono text-[#86868b] pt-1 flex items-center gap-1">
                                      <Phone className="w-3 h-3 text-[#c5a059]" />
                                      <span>{addr.phone}</span>
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Card Footer Actions */}
                              <div className="pt-4 mt-5 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs">
                                <button
                                  onClick={() => handleOpenEditAddress(addr)}
                                  className="apple-btn text-[#6e6e73] dark:text-[#86868b] hover:text-[#c5a059] dark:hover:text-[#c5a059] transition-colors flex items-center gap-1 font-medium"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>{isZh ? '修改' : 'Edit'}</span>
                                </button>

                                <button
                                  onClick={() => handleDeleteAddress(addr.id)}
                                  className="apple-btn text-red-500/70 hover:text-red-500 transition-colors flex items-center gap-1 font-medium"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>{isZh ? '删除' : 'Delete'}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* ===================================================================== */}
                {/* TAB 3: ORDERS (Frameless Apple Store Timeline Cards)                  */}
                {/* ===================================================================== */}
                {activeTab === 'orders' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div>
                      <h2 className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                        {isZh ? '订单与物流' : 'Orders & Tracking'}
                      </h2>
                      <p className="text-xs text-[#86868b] mt-1">
                        {isZh ? '查看您所采购的纹身机与配件的组装及出海特快进度。' : 'Track cleanroom preparation and global express logistics.'}
                      </p>
                    </div>

                    {orders.length === 0 ? (
                      <div className="py-16 text-center rounded-3xl border border-dashed border-black/15 dark:border-white/15 bg-black/[0.01] dark:bg-white/[0.01]">
                        <Package className="w-10 h-10 text-[#86868b] mx-auto mb-3 opacity-40" />
                        <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                          {isZh ? '您当前没有进行中的订单' : "You don't have any orders yet"}
                        </h3>
                        <p className="text-xs text-[#86868b] mt-1 max-w-sm mx-auto">
                          {isZh ? '当您在旗舰店下单后，订单的洁净室质检与特快物流动态会实时呈现在此。' : 'When you purchase machines or accessories, tracking will appear here.'}
                        </p>
                        <Link
                          to="/"
                          className="apple-btn mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#c5a059] text-black shadow-xs"
                        >
                          <span>{isZh ? '浏览全系机型' : 'Explore Machines'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ) : (
                      orders.map(({ node }) => (
                        <div
                          key={node.id}
                          className="rounded-3xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02] overflow-hidden shadow-xs"
                        >
                          {/* Top Apple Summary Bar */}
                          <div className="px-6 py-4 bg-black/[0.02] dark:bg-white/[0.03] border-b border-black/[0.05] dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs text-[#6e6e73] dark:text-[#86868b]">
                            <div className="flex flex-wrap items-center gap-6">
                              <div>
                                <span className="block text-[11px] text-[#86868b]">{isZh ? '下单时间' : 'Order Placed'}</span>
                                <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                                  {new Date(node.created).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                              </div>

                              <div>
                                <span className="block text-[11px] text-[#86868b]">{isZh ? '总计 (USD)' : 'Total Amount'}</span>
                                <span className="font-bold text-[#1d1d1f] dark:text-[#f5f5f7] font-mono">
                                  ${node.total?.gross?.amount?.toFixed(2) || '0.00'} USD
                                </span>
                              </div>

                              <div>
                                <span className="block text-[11px] text-[#86868b]">{isZh ? '收货人' : 'Ship To'}</span>
                                <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                                  {currentUser.firstName || 'Studio Artist'}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="block text-[11px] text-[#86868b]">{isZh ? '订单编号' : 'Order Number'}</span>
                              <span className="font-mono font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                                #{node.number}
                              </span>
                            </div>
                          </div>

                          {/* Order Body */}
                          <div className="p-6">
                            {/* 3-Step Apple Delivery Milestone Stepper */}
                            <div className="mb-6 p-4 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05]">
                              <div className="flex items-center justify-between text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
                                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                  <span>{isZh ? '订单已确认 • 洁净室质检中' : 'Order Confirmed • Cleanroom Assembly'}</span>
                                </span>
                                <span className="text-[11px] font-mono text-[#86868b]">
                                  {isZh ? '特快直发 • 全程保价' : 'Priority Express Insured'}
                                </span>
                              </div>

                              {/* Stepper track */}
                              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-medium text-[#86868b]">
                                <div className="flex flex-col items-center gap-1.5">
                                  <div className="w-full h-1 rounded-full bg-emerald-500" />
                                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{isZh ? '1. 订单已确认' : '1. Confirmed'}</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5">
                                  <div className="w-full h-1 rounded-full bg-[#c5a059]" />
                                  <span className="text-[#c5a059] font-semibold">{isZh ? '2. 组装与调校' : '2. Assembly & QC'}</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5">
                                  <div className="w-full h-1 rounded-full bg-black/10 dark:bg-white/10" />
                                  <span>{isZh ? '3. 特快出海直发' : '3. Express Transit'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Order Items List */}
                            <div className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
                              {node.lines.map((line, idx) => (
                                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-4">
                                    <img
                                      src="https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=300&q=80"
                                      alt={line.productName}
                                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-black/5 dark:border-white/10"
                                    />
                                    <div>
                                      <h4 className="text-xs sm:text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                                        {line.productName}
                                      </h4>
                                      <p className="text-xs text-[#6e6e73] dark:text-[#86868b] mt-0.5">
                                        {line.variantName} • {isZh ? '数量' : 'Qty'} {line.quantity}
                                      </p>
                                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-[#c5a059] font-medium">
                                        <ShieldCheck className="w-3 h-3" />
                                        <span>{isZh ? '瑞士 Maxon 2年原厂包换质保中' : '2-Yr Motor Warranty Active'}</span>
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Link
                                      to="/"
                                      className="apple-btn px-4 py-2 rounded-full text-xs font-semibold bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.06] dark:hover:bg-white/[0.12] transition-all text-[#1d1d1f] dark:text-white"
                                    >
                                      {isZh ? '再次购买' : 'Buy Again'}
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* ===================================================================== */}
                {/* TAB 4: QUICK PARTS & TUNING                                           */}
                {/* ===================================================================== */}
                {activeTab === 'parts' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div>
                      <h2 className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                        {isZh ? '常用配件与调校备件补给' : 'Frequently Serviced Hardware Restock'}
                      </h2>
                      <p className="text-xs text-[#86868b] mt-1">
                        {isZh ? '针对偏心轮、备用锂电池与 24K 镀金 RCA 勾线，支持一键加购并与整机订单合并顺丰直发。' : 'One-click restock for eccentric cams, battery packs, and RCA cords.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {dynamicQuickParts.map(part => {
                        const isAdded = addedPartId === part.id;
                        return (
                          <div
                            key={part.id}
                            className="rounded-3xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02] p-5 sm:p-6 flex flex-col justify-between hover:border-black/20 dark:hover:border-white/20 transition-all"
                          >
                            <div>
                              <div className="aspect-video w-full rounded-2xl overflow-hidden mb-4 bg-neutral-100 dark:bg-neutral-800 border border-black/5 dark:border-white/5">
                                <img
                                  src={part.imageUrl}
                                  alt={part.nameEn}
                                  className="w-full h-full object-cover object-center"
                                />
                              </div>

                              <h4 className="text-xs sm:text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] line-clamp-1">
                                {isZh ? part.nameZh : part.nameEn}
                              </h4>
                              <p className="text-[11px] text-[#6e6e73] dark:text-[#86868b] mt-1">
                                {part.specs}
                              </p>
                            </div>

                            <div className="pt-4 mt-5 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-[#86868b] block">{isZh ? '官方直发价' : 'Official Price'}</span>
                                <span className="font-mono font-bold text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">
                                  ${part.price.toFixed(2)} USD
                                </span>
                              </div>

                              <button
                                onClick={() => handleQuickAdd(part)}
                                className={`apple-btn px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 ${
                                  isAdded
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-[#c5a059] hover:bg-[#d4af37] text-black'
                                }`}
                              >
                                {isAdded ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>{isZh ? '已加入' : 'Added'}</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>{isZh ? '加入购物袋' : 'Add to Bag'}</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. Password Change Modal (Apple Sheet Style) */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#1c1c1e] border border-black/10 dark:border-white/15 p-6 sm:p-8 shadow-2xl transition-all">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#c5a059]/15 flex items-center justify-center text-[#c5a059]">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {isZh ? '修改账户密码' : 'Change Password'}
                  </h3>
                  <p className="text-[11px] text-[#86868b]">
                    {isZh ? '账户密码安全更新' : 'Account Security Update'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="apple-btn p-1.5 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-[#86868b] mb-1.5">
                  {isZh ? '当前原密码' : 'Current Password'}
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  placeholder={isZh ? '输入正在使用的密码' : 'Enter current password'}
                  className="w-full text-xs px-4 py-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] focus:outline-none focus:border-[#c5a059] text-[#1d1d1f] dark:text-[#f5f5f7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#86868b] mb-1.5">
                  {isZh ? '新密码 (至少8位)' : 'New Password (8+ chars)'}
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder={isZh ? '设置新的安全密码' : 'Enter new password'}
                  className="w-full text-xs px-4 py-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] focus:outline-none focus:border-[#c5a059] text-[#1d1d1f] dark:text-[#f5f5f7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#86868b] mb-1.5">
                  {isZh ? '确认新密码' : 'Confirm New Password'}
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  placeholder={isZh ? '再次输入新密码' : 'Repeat new password'}
                  className="w-full text-xs px-4 py-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] focus:outline-none focus:border-[#c5a059] text-[#1d1d1f] dark:text-[#f5f5f7]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 mt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="apple-btn px-4 py-2.5 rounded-xl text-xs text-[#6e6e73] dark:text-[#86868b] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                >
                  {isZh ? '取消' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="apple-btn px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#c5a059] hover:bg-[#d4af37] text-black disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSavingPassword && <div className="w-3 h-3 rounded-full border-2 border-black/30 border-t-black animate-spin" />}
                  <span>{isZh ? '更新密码' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Address Modal (Apple Sheet Style) */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#1c1c1e] border border-black/10 dark:border-white/15 p-6 sm:p-8 shadow-2xl transition-all">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div>
                <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {editingAddressId ? (isZh ? '编辑收货地址' : 'Edit Address') : (isZh ? '添加新收货地址' : 'Add New Address')}
                </h3>
                <p className="text-xs text-[#86868b] mt-0.5">
                  {isZh ? '云端安全加密存储' : 'Secure Cloud Storage'}
                </p>
              </div>
              <button
                onClick={() => setAddressModalOpen(false)}
                className="apple-btn p-1.5 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#86868b] mb-1">{isZh ? '名' : 'First Name'}</label>
                  <input
                    type="text"
                    required
                    value={addressFormData.firstName}
                    onChange={e => setAddressFormData({ ...addressFormData, firstName: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] focus:outline-none focus:border-[#c5a059] text-[#1d1d1f] dark:text-[#f5f5f7]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#86868b] mb-1">{isZh ? '姓' : 'Last Name'}</label>
                  <input
                    type="text"
                    required
                    value={addressFormData.lastName}
                    onChange={e => setAddressFormData({ ...addressFormData, lastName: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] focus:outline-none focus:border-[#c5a059] text-[#1d1d1f] dark:text-[#f5f5f7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#86868b] mb-1">{isZh ? '工作室 / 公司名称 (选填)' : 'Studio / Company (Optional)'}</label>
                <input
                  type="text"
                  value={addressFormData.companyName || ''}
                  onChange={e => setAddressFormData({ ...addressFormData, companyName: e.target.value })}
                  placeholder="e.g. Black Ink Studio"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] focus:outline-none focus:border-[#c5a059] text-[#1d1d1f] dark:text-[#f5f5f7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#86868b] mb-1">{isZh ? '街道与门牌地址' : 'Street Address'}</label>
                <input
                  type="text"
                  required
                  value={addressFormData.streetAddress1}
                  onChange={e => setAddressFormData({ ...addressFormData, streetAddress1: e.target.value })}
                  placeholder="e.g. 1080 S Arts District Blvd, Suite 400"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] focus:outline-none focus:border-[#c5a059] text-[#1d1d1f] dark:text-[#f5f5f7]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#86868b] mb-1">{isZh ? '城市' : 'City'}</label>
                  <input
                    type="text"
                    required
                    value={addressFormData.city}
                    onChange={e => setAddressFormData({ ...addressFormData, city: e.target.value })}
                    placeholder="Los Angeles"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] focus:outline-none focus:border-[#c5a059] text-[#1d1d1f] dark:text-[#f5f5f7]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#86868b] mb-1">{isZh ? '州 / 省' : 'State'}</label>
                  <input
                    type="text"
                    required
                    value={addressFormData.countryArea || ''}
                    onChange={e => setAddressFormData({ ...addressFormData, countryArea: e.target.value })}
                    placeholder="CA"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] focus:outline-none focus:border-[#c5a059] text-[#1d1d1f] dark:text-[#f5f5f7]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#86868b] mb-1">{isZh ? '邮编' : 'Postal Code'}</label>
                  <input
                    type="text"
                    required
                    value={addressFormData.postalCode || ''}
                    onChange={e => setAddressFormData({ ...addressFormData, postalCode: e.target.value })}
                    placeholder="90013"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] focus:outline-none focus:border-[#c5a059] text-[#1d1d1f] dark:text-[#f5f5f7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#86868b] mb-1">{isZh ? '国家/地区' : 'Country'}</label>
                  <select
                    value={addressFormData.country}
                    onChange={e => setAddressFormData({ ...addressFormData, country: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/[0.02] dark:bg-[#252528] border border-black/[0.08] dark:border-white/[0.1] focus:outline-none focus:border-[#c5a059] text-[#1d1d1f] dark:text-[#f5f5f7]"
                  >
                    <option value="US">United States (US)</option>
                    <option value="CA">Canada (CA)</option>
                    <option value="GB">United Kingdom (GB)</option>
                    <option value="DE">Germany (DE)</option>
                    <option value="AU">Australia (AU)</option>
                    <option value="JP">Japan (JP)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#86868b] mb-1">{isZh ? '联系电话' : 'Phone'}</label>
                  <input
                    type="tel"
                    value={addressFormData.phone || ''}
                    onChange={e => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                    placeholder="+1 555-0199"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] focus:outline-none focus:border-[#c5a059] text-[#1d1d1f] dark:text-[#f5f5f7]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 mt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="apple-btn px-4 py-2.5 rounded-xl text-xs text-[#6e6e73] dark:text-[#86868b] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                >
                  {isZh ? '取消' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="apple-btn px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#c5a059] hover:bg-[#d4af37] text-black disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSavingAddress && <div className="w-3 h-3 rounded-full border-2 border-black/30 border-t-black animate-spin" />}
                  <span>{editingAddressId ? (isZh ? '更新地址' : 'Save Changes') : (isZh ? '保存地址' : 'Add Address')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Apple Directory Footer & Compliance */}
      <div className="mt-16">
        <FooterCompliance />
      </div>
    </div>
  );
};
