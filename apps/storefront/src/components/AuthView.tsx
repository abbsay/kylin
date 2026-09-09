import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { useStore } from '../lib/StoreContext';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

interface AuthViewProps {
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'login',
  onSuccess,
}) => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');
  const navigate = useNavigate();
  const { loginUser, registerUser, updateUserProfile } = useStore();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Additional fields for registration
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // TanStack Form configuration
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setErrorMessage(null);
      setSuccessMessage(null);

      // Validate registration specifics
      if (mode === 'register') {
        if (!firstName.trim()) {
          setErrorMessage(isZh ? '请填写您的名 (First Name)' : 'Please enter your first name');
          return;
        }
        if (value.password !== confirmPassword) {
          setErrorMessage(isZh ? '两次输入的密码不一致' : 'Passwords do not match');
          return;
        }
      }

      try {
        if (mode === 'login') {
          await loginUser(value.email, value.password);
          setSuccessMessage(isZh ? '登录成功，正在加载您的专属工坊...' : 'Signed in successfully. Loading workshop...');
        } else {
          await registerUser(value.email, value.password);
          if (firstName || lastName) {
            try {
              await updateUserProfile(firstName, lastName);
            } catch {
              // Non-blocking profile update
            }
          }
          setSuccessMessage(isZh ? '注册成功！欢迎加入 Kylin Tattoo 艺术家联盟' : 'Account created! Welcome to Kylin Tattoo.');
        }

        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            navigate({ to: '/account' });
          }
        }, 600);
      } catch (err: any) {
        setErrorMessage(
          err.message || (isZh ? '验证失败，请检查账号密码' : 'Authentication failed. Please check credentials.')
        );
      }
    },
  });

  // Calculate password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
    return score; // 0 to 3
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      {/* 1. Apple Monogram & Brand Masthead */}
      <div className="text-center mb-6">
        <div className="relative inline-block mb-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1d1d1f] via-[#c5a059] to-[#fbfbfd] dark:from-[#c5a059] dark:via-[#f7d995] dark:to-[#8c6f32] p-[2px] shadow-[0_10px_28px_rgba(197,160,89,0.2)] flex items-center justify-center transition-transform hover:scale-105">
            <img
              src="/kylin-logo.png"
              alt="KYLIN TATTOO MACHINES"
              className="w-full h-full rounded-full object-contain bg-white dark:bg-[#161617] p-1"
            />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-[#fbfbfd] dark:ring-[#000000] flex items-center justify-center text-[9px] text-white">
            <Sparkles className="w-2 h-2" />
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
          {mode === 'login'
            ? isZh
              ? '登录'
              : 'Sign In'
            : isZh
            ? '注册'
            : 'Register'}
        </h1>
      </div>

      {/* 2. Apple Sliding Segmented Control */}
      <div className="flex items-center justify-center mb-6">
        <div className="p-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.05] dark:border-white/[0.08] flex items-center w-full max-w-[260px]">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 px-4 rounded-full text-xs font-medium transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white shadow-xs font-semibold'
                : 'text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
          >
            {isZh ? '登录' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 px-4 rounded-full text-xs font-medium transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white shadow-xs font-semibold'
                : 'text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
          >
            {isZh ? '注册' : 'Register'}
          </button>
        </div>
      </div>

      {/* 3. Feedback Banners */}
      {successMessage && (
        <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5 shadow-xs transition-all animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2.5 shadow-xs transition-all animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* 5. Main Form Surface (Frameless Apple Grouped Inputs) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-black/[0.06] dark:border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
        <form
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Registration Extra Fields: Name Row */}
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3 animate-fadeIn">
              <div>
                <label className="block text-[11px] font-medium text-[#86868b] mb-1.5">
                  {isZh ? '名 (First Name)' : 'First Name'}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder={isZh ? '例如：Vincent' : 'First name'}
                    className="w-full text-xs pl-10 pr-3.5 py-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] focus:outline-none focus:border-[#c5a059] focus:ring-4 focus:ring-[#c5a059]/10 transition-all text-[#1d1d1f] dark:text-[#f5f5f7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#86868b] mb-1.5">
                  {isZh ? '姓 (Last Name)' : 'Last Name'}
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder={isZh ? '例如：Zhang' : 'Last name'}
                  className="w-full text-xs px-3.5 py-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] focus:outline-none focus:border-[#c5a059] focus:ring-4 focus:ring-[#c5a059]/10 transition-all text-[#1d1d1f] dark:text-[#f5f5f7]"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const res = authSchema.shape.email.safeParse(value);
                return res.success ? undefined : res.error.errors[0]?.message;
              },
            }}
            children={field => (
              <div>
                <label className="block text-[11px] font-medium text-[#86868b] mb-1.5">
                  {isZh ? '电子邮箱' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
                  <input
                    type="email"
                    required
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    placeholder="artist@kylintattoo.com"
                    className="w-full text-xs pl-10 pr-3.5 py-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] focus:outline-none focus:border-[#c5a059] focus:ring-4 focus:ring-[#c5a059]/10 transition-all text-[#1d1d1f] dark:text-[#f5f5f7]"
                  />
                </div>
                {field.state.meta.errors?.[0] && (
                  <p className="text-[10px] text-red-500 mt-1 pl-1">{String(field.state.meta.errors[0])}</p>
                )}
              </div>
            )}
          />

          {/* Password Field with Eye Toggle */}
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                const res = authSchema.shape.password.safeParse(value);
                return res.success ? undefined : res.error.errors[0]?.message;
              },
            }}
            children={field => {
              const strength = getPasswordStrength(field.state.value);
              return (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-medium text-[#86868b]">
                      {isZh ? '账户密码' : 'Password'}
                    </label>
                    {mode === 'login' && (
                      <span className="text-[10px] text-[#86868b] hover:text-[#c5a059] cursor-pointer">
                        {isZh ? '忘记密码？' : 'Forgot?'}
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      placeholder={isZh ? '至少8位安全字符' : 'At least 8 characters'}
                      className="w-full text-xs pl-10 pr-10 py-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] focus:outline-none focus:border-[#c5a059] focus:ring-4 focus:ring-[#c5a059]/10 transition-all text-[#1d1d1f] dark:text-[#f5f5f7]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Meter for Registration */}
                  {mode === 'register' && field.state.value.length > 0 && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="flex-1 h-1 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            strength >= 1 ? 'bg-red-400' : 'bg-transparent'
                          }`}
                        />
                      </div>
                      <div className="flex-1 h-1 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            strength >= 2 ? 'bg-amber-400' : 'bg-transparent'
                          }`}
                        />
                      </div>
                      <div className="flex-1 h-1 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            strength >= 3 ? 'bg-emerald-400' : 'bg-transparent'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] text-[#86868b] pl-1 font-medium">
                        {strength <= 1 ? (isZh ? '较弱' : 'Weak') : strength === 2 ? (isZh ? '良好' : 'Good') : (isZh ? '极佳' : 'Strong')}
                      </span>
                    </div>
                  )}

                  {field.state.meta.errors?.[0] && (
                    <p className="text-[10px] text-red-500 mt-1 pl-1">{String(field.state.meta.errors[0])}</p>
                  )}
                </div>
              );
            }}
          />

          {/* Registration Confirm Password */}
          {mode === 'register' && (
            <div className="animate-fadeIn">
              <label className="block text-[11px] font-medium text-[#86868b] mb-1.5">
                {isZh ? '确认新密码' : 'Confirm Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder={isZh ? '再次输入密码' : 'Repeat password'}
                  className="w-full text-xs pl-10 pr-10 py-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] focus:outline-none focus:border-[#c5a059] focus:ring-4 focus:ring-[#c5a059]/10 transition-all text-[#1d1d1f] dark:text-[#f5f5f7]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Remember me & terms */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded-md text-[#c5a059] border-black/20 dark:border-white/20 focus:ring-[#c5a059] accent-[#c5a059]"
              />
              <span className="text-[11px] text-[#6e6e73] dark:text-[#86868b]">
                {isZh ? '在此设备保持登录' : 'Keep me signed in'}
              </span>
            </label>
          </div>

          {/* Submit Action Button */}
          <form.Subscribe
            selector={state => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="apple-btn w-full py-3.5 rounded-2xl bg-[#c5a059] hover:bg-[#d4af37] text-black font-bold text-xs sm:text-sm tracking-tight transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2 cursor-pointer shadow-[0_8px_25px_rgba(197,160,89,0.3)] hover:scale-[1.01] active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                    <span>{isZh ? '处理中...' : 'Processing...'}</span>
                  </>
                ) : (
                  <>
                    <span>
                      {mode === 'login'
                        ? isZh
                          ? '登录'
                          : 'Sign In'
                        : isZh
                        ? '注册'
                        : 'Register'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </>
                )}
              </button>
            )}
          />
        </form>

        {/* Switch mode footer */}
        <div className="mt-6 pt-5 border-t border-black/[0.05] dark:border-white/[0.06] text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setErrorMessage(null);
            }}
            className="apple-btn text-xs text-[#6e6e73] dark:text-[#86868b] hover:text-[#c5a059] transition-colors"
          >
            {mode === 'login' ? (
              <span>
                {isZh ? '没有账号？' : "Don't have an account? "}
                <strong className="text-[#1d1d1f] dark:text-white font-semibold underline underline-offset-4 ml-1">
                  {isZh ? '注册' : 'Register'}
                </strong>
              </span>
            ) : (
              <span>
                {isZh ? '已有账号？' : 'Already have an account? '}
                <strong className="text-[#1d1d1f] dark:text-white font-semibold underline underline-offset-4 ml-1">
                  {isZh ? '登录' : 'Sign In'}
                </strong>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
