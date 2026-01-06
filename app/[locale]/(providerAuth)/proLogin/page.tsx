"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import api from "@/lib/axiosInstance";
import { useUserStore } from "@/app/store/userStore";
import { EyeIcon, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";

export default function Login() {
  const t = useTranslations("providerLoginWords");
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "ar";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { setUser, setToken } = useUserStore();
  const forgetUrl = `/${locale}/proforgetpass`;
  const signupUrl = `/${locale}/providerRegistration`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // ملاحظة: تأكد من تغيير "PROVIDER" حسب نوع المستخدم في مشروعك
      const res = await api.post(
        `/authentication/PROVIDER/login`,
        { email, password },
        { withCredentials: true }
      );

      const payload = res.data?.data;
      if (!payload) throw new Error("Invalid response from server");

      const user = payload.user;
      const token = payload.token || payload.accessToken;

      if (!user || !token) throw new Error("Missing authentication data");

      setUser(user);
      setToken(token);

      router.push(`/${locale}/providerview/dashBoardHome/dashBoard`);
    } catch (err: any) {
      setError(err?.response?.data?.message || t("login_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-zinc-100 dark:bg-[#0a0a0a] flex items-center justify-center p-4 transition-colors duration-300"
    >
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden border border-zinc-200/50 dark:border-white/5">
        
        {/* --- الجانب الأيسر: لوحة المعلومات الجمالية --- */}
        <div className="md:w-5/12 bg-[#0E766E] p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* خلفية جمالية */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-black/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-inner">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-black leading-tight mb-6">
              {t("sidebar_title")}
            </h2>
            <p className="text-emerald-50/70 leading-relaxed text-sm">
              {t("sidebar_desc")}
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-[2rem] p-6 border border-white/20 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-emerald-400/30 rounded-xl flex items-center justify-center">
                <ArrowRight size={20} className={isRTL ? 'rotate-180' : ''} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">{t("portal_badge")}</span>
            </div>
            <div className="space-y-3">
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
              </div>
              <div className="h-1.5 w-1/2 bg-white/10 rounded-full" />
            </div>
          </div>
        </div>

        {/* --- الجانب الأيمن: فورم تسجيل الدخول --- */}
        <div className="md:w-7/12 w-full p-8 md:p-16 flex flex-col justify-center bg-white dark:bg-[#111]">
          <div className="mb-10 text-center md:text-start">
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-3 tracking-tight">
              {t("welcome")}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">
              {t("tagline")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* حقل البريد الإلكتروني */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 px-1">
                {t("email_label")}
              </label>
              <div className="relative group">
                <Mail className={`absolute ${isRTL ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#0E766E] transition-colors`} size={20} />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl py-4 ${isRTL ? 'pr-14 pl-5' : 'pl-14 pr-5'} text-zinc-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#0E766E]/10 focus:border-[#0E766E] transition-all`}
                  required
                />
              </div>
            </div>

            {/* حقل كلمة المرور */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  {t("password_label")}
                </label>
                <Link href={forgetUrl} className="text-xs font-bold text-[#0E766E] hover:underline">
                  {t("forgot")}
                </Link>
              </div>
              <div className="relative group">
                <Lock className={`absolute ${isRTL ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#0E766E] transition-colors`} size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl py-4 ${isRTL ? 'pr-14 pl-14' : 'pl-14 pr-14'} text-zinc-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#0E766E]/10 focus:border-[#0E766E] transition-all`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRTL ? 'left-5' : 'right-5'} top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors`}
                >
                  {showPassword ? <EyeOff size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm text-center font-bold animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0E766E] text-white rounded-2xl py-4 font-bold text-lg hover:bg-[#0A5D57] active:scale-[0.98] transition-all shadow-xl shadow-[#0E766E]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : t("login_btn")}
            </button>
          </form>

          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-zinc-500 dark:text-zinc-400">{t("no_account")}</span>
              <Link href={signupUrl} className="text-[#0E766E] font-bold hover:underline">
                {t("signup")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}