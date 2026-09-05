import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../lib/StoreContext';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { X, User, Package, Shield, Mail, Phone, MapPin, LogOut, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const AccountModal: React.FC = () => {
  const { i18n } = useTranslation();
  const { isAccountOpen, setIsAccountOpen, currentUser, loginUser, registerUser, logoutUser } = useStore();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isZh = i18n.language.startsWith('zh');

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setErrorMessage(null);
      try {
        if (authMode === 'login') {
          await loginUser(value.email, value.password);
        } else {
          await registerUser(value.email, value.password);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Authentication error');
      }
    },
  });

  if (!isAccountOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop with Asymmetric Smooth Fade */}
      <div
        onClick={() => setIsAccountOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-200 ease-out"
      />

      <div className="relative glass-panel-elevated rounded-3xl w-full max-w-lg p-8 shadow-2xl z-10 animate-apple-modal">
        {/* Close Button */}
        <button
          onClick={() => setIsAccountOpen(false)}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge & Title */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#c5a059] uppercase tracking-wider mb-2">
          <Shield className="w-3.5 h-3.5" />
          <span>{isZh ? 'Saleor 认证刺青艺术家专区' : 'Saleor Verified Artist Portal'}</span>
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
          {isZh ? '我的账户' : 'My Account'}
        </h3>
        <p className="text-xs text-[#6e6e73] dark:text-[#86868b] mt-1 leading-relaxed">
          {currentUser
            ? isZh
              ? '已通过 Saleor Core GraphQL 鉴权，实时读取云端订单与收货地址。'
              : 'Authenticated via Saleor Core GraphQL. Synced with real-time orders & address.'
            : isZh
              ? '登录或注册您的 Kylin 专属艺术家账户以同步器材订单。'
              : 'Sign in or create your Kylin Pro Artist account to sync hardware orders.'}
        </p>

        {/* CASE 1: USER NOT LOGGED IN -> TANSTACK FORM SALEOR AUTH */}
        {!currentUser ? (
          <div className="mt-6">
            <div className="flex rounded-full bg-black/5 dark:bg-white/10 p-1 mb-5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-full transition-all ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-[#252528] text-[#1d1d1f] dark:text-white shadow-sm font-bold'
                    : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
                }`}
              >
                {isZh ? '刺青艺术家登录' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-full transition-all ${
                  authMode === 'register'
                    ? 'bg-white dark:bg-[#252528] text-[#1d1d1f] dark:text-white shadow-sm font-bold'
                    : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
                }`}
              >
                {isZh ? '新工作室注册' : 'Register'}
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form
              onSubmit={e => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-4 text-left"
            >
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    const res = loginSchema.shape.email.safeParse(value);
                    return res.success ? undefined : res.error.errors[0]?.message;
                  },
                }}
                children={field => (
                  <div>
                    <label className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider block mb-1">
                      {isZh ? '艺术家邮箱' : 'Artist Email'}
                    </label>
                    <input
                      type="email"
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      placeholder="artist@kylinstudio.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20 transition-all text-[#1d1d1f] dark:text-[#f5f5f7]"
                    />
                    {field.state.meta.errors?.[0] && (
                      <p className="text-[10px] text-red-500 mt-1">{String(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              />

              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => {
                    const res = loginSchema.shape.password.safeParse(value);
                    return res.success ? undefined : res.error.errors[0]?.message;
                  },
                }}
                children={field => (
                  <div>
                    <label className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider block mb-1">
                      {isZh ? '账户密码 (至少8位)' : 'Password (Min 8 chars)'}
                    </label>
                    <input
                      type="password"
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20 transition-all text-[#1d1d1f] dark:text-[#f5f5f7]"
                    />
                    {field.state.meta.errors?.[0] && (
                      <p className="text-[10px] text-red-500 mt-1">{String(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              />

              <form.Subscribe
                selector={state => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="w-full py-3.5 rounded-full bg-[#c5a059] text-white font-semibold text-xs uppercase tracking-wider hover:bg-[#b08e4c] transition-all disabled:opacity-50 shadow-md flex items-center justify-center gap-2 mt-4"
                  >
                    {isSubmitting
                      ? isZh
                        ? '正在鉴权...'
                        : 'Authenticating...'
                      : authMode === 'login'
                      ? isZh
                        ? '安全登录 Saleor 账户'
                        : 'Sign In with Saleor JWT'
                      : isZh
                        ? '创建新账户'
                        : 'Create Account'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              />
            </form>

            <div className="mt-5 p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 text-[11px] text-[#86868b] text-left leading-relaxed">
              <span className="font-semibold text-[#c5a059] block mb-1">Saleor Core JWT 凭据提示：</span>
              可用管理员账户直接体验：<code className="text-xs font-mono font-semibold text-[#1d1d1f] dark:text-white">admin@kylintattoo.com</code> / 密码：<code className="text-xs font-mono font-semibold text-[#1d1d1f] dark:text-white">KylinTattoo2026!</code> 或直接注册个人邮箱。
            </div>
          </div>
        ) : (
          /* CASE 2: USER LOGGED IN -> DISPLAY REAL SALEOR ME DATA */
          <div className="mt-5">
            {/* Tab switcher */}
            <div className="flex items-center gap-2 p-1 rounded-full bg-black/5 dark:bg-white/10 text-xs font-medium">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-2 rounded-full flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'profile'
                    ? 'bg-white dark:bg-[#252528] text-[#1d1d1f] dark:text-white shadow-sm font-bold'
                    : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{isZh ? '认证身份档案' : 'Profile'}</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-2 rounded-full flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'orders'
                    ? 'bg-white dark:bg-[#252528] text-[#1d1d1f] dark:text-white shadow-sm font-bold'
                    : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>
                  {isZh ? 'Saleor 订单' : 'Orders'} ({currentUser.orders?.edges?.length || 0})
                </span>
              </button>
            </div>

            {activeTab === 'profile' ? (
              <div className="mt-5 space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#c5a059]/20 text-[#c5a059] flex items-center justify-center font-bold text-base uppercase font-brand">
                    {currentUser.firstName ? currentUser.firstName[0] : currentUser.email.slice(0, 2)}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">
                      {currentUser.firstName
                        ? `${currentUser.firstName} ${currentUser.lastName || ''}`
                        : currentUser.email.split('@')[0]}
                    </h4>
                    <p className="text-[#86868b] text-[11px] font-mono mt-0.5">
                      {currentUser.isStaff ? 'Master Artist / Staff Admin' : 'Pro Verified Artist Tier'} • ID: {currentUser.id}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 text-[#6e6e73] dark:text-[#a1a1a6] text-left">
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                    <Mail className="w-4 h-4 text-[#c5a059]" />
                    <span className="font-mono text-xs text-[#1d1d1f] dark:text-[#f5f5f7]">
                      {currentUser.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                    <MapPin className="w-4 h-4 text-[#c5a059]" />
                    <span className="text-xs text-[#1d1d1f] dark:text-[#f5f5f7]">
                      {currentUser.defaultShippingAddress
                        ? `${currentUser.defaultShippingAddress.streetAddress1}, ${currentUser.defaultShippingAddress.city}, ${currentUser.defaultShippingAddress.country.country}`
                        : isZh
                        ? '暂未保存默认收货地址（可在结算时自动同步）'
                        : 'No default address stored (Auto-saved on checkout)'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/10 flex justify-between items-center text-[11px] text-[#86868b]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    <span>Saleor JWT Session: Active</span>
                  </span>
                  <button
                    onClick={() => logoutUser()}
                    className="text-red-500 hover:text-red-600 flex items-center gap-1 font-semibold transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isZh ? '退出当前账户' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-5 space-y-3 max-h-60 overflow-y-auto text-left">
                {currentUser.orders?.edges?.length === 0 || !currentUser.orders ? (
                  <div className="py-12 text-center text-[#86868b] text-xs">
                    <Package className="w-8 h-8 mx-auto mb-2 text-[#86868b]/40" />
                    <p>{isZh ? '您在 Saleor 后端尚无历史订单' : 'No orders placed on Saleor yet.'}</p>
                    <p className="text-[10px] mt-1">{isZh ? '完成结算后将自动同步至此' : 'Orders will appear here after checkout.'}</p>
                  </div>
                ) : (
                  currentUser.orders.edges.map(({ node }) => (
                    <div
                      key={node.id}
                      className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 text-xs"
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-mono font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                          #{node.number}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold font-mono">
                          {node.status}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {node.lines.map((line, idx) => (
                          <p key={idx} className="text-[#86868b] text-[11px]">
                            {line.quantity}x {line.productName} ({line.variantName})
                          </p>
                        ))}
                      </div>
                      <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/5 flex justify-between items-center text-[11px]">
                        <span className="text-[#86868b]">{new Date(node.created).toLocaleDateString()}</span>
                        <span className="font-mono font-bold text-[#c5a059]">
                          ${node.total.gross.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
