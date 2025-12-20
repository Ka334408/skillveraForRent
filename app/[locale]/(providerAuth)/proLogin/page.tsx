"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import api from "@/lib/axiosInstance";
import { useUserStore } from "@/app/store/userStore";
import { EyeIcon, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function Login() {
  const t = useTranslations("loginWords");
  const locale = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { setUser, setToken } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post(
        `/authentication/${"PROVIDER"}/login`,
        { email, password },
        { withCredentials: true }
      );

      const payload = res.data?.data;
      if (!payload) throw new Error("Invalid response from server");

      const user = payload.user;
      const token = payload.token || payload.accessToken;

      if (!user) throw new Error("User object missing");
      if (!token) throw new Error("Token missing from API");

      setUser(user);
      setToken(token);

      router.push("/providerview/dashBoardHome/dashBoard");
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-[#F3F4F6] dark:bg-[#0a0a0a] flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-[#111] rounded-[2.5rem] shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden border border-white/20">
        
        {/* --- Left Side: Aesthetic Info Panel --- */}
        <div className="md:w-5/12 bg-[#0E766E] p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-black/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <h2 className="text-3xl font-bold leading-tight mb-4">
              Manage your professional dashboard with ease.
            </h2>
            <p className="text-emerald-100/80 leading-relaxed">
              Access your profile, track your analytics, and connect with your clients in one secure place.
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-emerald-400/30 rounded-full flex items-center justify-center">
                <ArrowRight size={20} className={locale === 'ar' ? 'rotate-180' : ''} />
              </div>
              <span className="text-sm font-medium">Secure Provider Portal</span>
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-emerald-400" />
              </div>
              <div className="h-2 w-1/2 bg-white/20 rounded-full" />
            </div>
          </div>
        </div>

        {/* --- Right Side: Login Form --- */}
        <div className="md:w-7/12 w-full p-8 md:p-16 flex flex-col justify-center bg-white dark:bg-black">
          <div className="mb-10 text-center md:text-start">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
              {t("welcome")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {t("tagline")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-4 rtl:mr-4">
                {t("email")}
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 rtl:right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0E766E] transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-14 pr-5 rtl:pr-14 rtl:pl-5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0E766E]/50 focus:border-[#0E766E] transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-4 rtl:px-4">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {t("password")}
                </label>
                <a href="/auth/resetPass" className="text-xs font-semibold text-[#0E766E] hover:underline">
                  {t("forgot")}
                </a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 rtl:right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0E766E] transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-14 pr-14 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0E766E]/50 focus:border-[#0E766E] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 rtl:left-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeIcon size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm text-center font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0E766E] text-white rounded-2xl py-4 font-bold text-lg hover:bg-[#0A5D57] transition-all transform active:scale-[0.98] shadow-xl shadow-[#0E766E]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                t("login")
              )}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">{t("no_account")}</span>
              <button
                onClick={() => router.push("/providerRegistration")}
                className="text-[#0E766E] font-bold hover:underline"
              >
                {t("signup")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}