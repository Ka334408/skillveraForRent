"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import LocalizedLink from "@/app/components/localized-link";
import { useRouter } from "next/navigation";
import api from "@/lib/axiosInstance";
import { useUserStore } from "@/app/store/userStore";
import { EyeIcon, EyeOff } from "lucide-react";
import GuestPage from "@/app/components/protectedpages/guestPage";
import Image from "next/image"; // استيراد Image لآداء أفضل

export default function Login() {
  const t = useTranslations("loginWords");
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "ar";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { setUser, setToken } = useUserStore();
  const resetpassUrl=`/${locale}/auth/resetPass`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post(
        "/authentication/user/login",
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

      const role = user.type.toLowerCase();
      switch (role) {
        case "user": router.replace(`/${locale}/userview/Home`); break;
        default: router.replace("/");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestPage>
      <main
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-screen bg-gray-100 flex items-center justify-center px-4 dark:bg-[#0a0a0a] transition-colors"
      >
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl min-h-[600px] flex flex-col md:flex-row overflow-hidden dark:bg-zinc-900 border dark:border-zinc-800">
          
          {/* --- قسم الصور (الجانب البصري) --- */}
          <div className="md:w-1/2 grid grid-cols-2 gap-3 bg-gray-50 p-6 dark:bg-zinc-900/50">
            <div className="relative bg-zinc-200 rounded-2xl h-64 overflow-hidden shadow-md">
               <img src="/login2.png" alt="Login Visual 2" className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="relative bg-zinc-200 rounded-2xl h-64 overflow-hidden shadow-md">
               <img src="/login1.png" alt="Login Visual 3" className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="relative col-span-2 bg-zinc-200 rounded-2xl h-44 overflow-hidden shadow-md">
               <img src="/login3.png" alt="Login Visual 1" className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
            </div>
          
          </div>

          {/* --- قسم الفورم (البيانات) --- */}
          <div className="flex flex-col justify-center p-8 md:p-12 md:w-1/2 w-full text-start">
            <h1 className="text-zinc-900 dark:text-white text-3xl font-bold mb-2 tracking-tight">
              {t("welcome")}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-10 leading-relaxed">
              {t("tagline")}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
              <div className="space-y-1">
                <input
                  type="email"
                  placeholder={t("email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-5 py-4 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0E766E] w-full transition-all"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-5 py-4 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0E766E] w-full transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 ${isRTL ? 'left-4' : 'right-4'} flex items-center text-zinc-400 hover:text-[#0E766E] transition-colors`}
                >
                  {showPassword ? <EyeIcon size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              <div className="flex justify-end">
                <LocalizedLink
                  href="/auth/resetPass"
                  className="text-sm text-zinc-500 hover:text-[#0E766E] hover:underline transition-colors"
                >
                  {t("forgot")}
                </LocalizedLink>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#0E766E] text-white rounded-2xl py-4 font-bold text-lg hover:bg-[#0c625b] active:scale-[0.98] transition-all shadow-lg shadow-teal-900/20 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                   <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("loading")}
                   </div>
                ) : t("login")}
              </button>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-3 rounded-xl">
                  <p className="text-red-600 dark:text-red-400 text-sm text-center font-medium">{error}</p>
                </div>
              )}
            </form>

            <div className="mt-8 flex justify-center items-center gap-2 text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">{t("no_account")}</span>
              <LocalizedLink
                href="/auth/signUp"
                className="text-[#0E766E] font-bold hover:underline"
              >
                {t("signup")}
              </LocalizedLink>
            </div>
          </div>
        </div>
      </main>
    </GuestPage>
  );
}