"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import GuestPage from "@/app/components/protectedpages/guestPage";
import axiosInstance from "@/lib/axiosInstance";
import { useUserStore } from "@/app/store/userStore";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";

export default function ResetPassword() {
  const t = useTranslations("resetPassWords");
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "ar";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setResetEmail = useUserStore((state) => state.setResetEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axiosInstance.post(
        "/authentication/reset-password/request",
        { email }
      );
      setResetEmail(email);
      router.push("/auth/varCode");
    } catch (err: any) {
      setError(err.response?.data?.message || t("error_msg"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestPage>
      <main 
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-screen bg-zinc-100 flex items-center justify-center px-4 dark:bg-[#0a0a0a] transition-colors"
      >
        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl min-h-[550px] flex flex-col md:flex-row overflow-hidden dark:bg-zinc-900 border dark:border-zinc-800">
          
          {/* الجانب البصري - الصورة */}
          <div className="md:w-2/5 bg-zinc-50 dark:bg-zinc-800/50 flex flex-col items-center justify-center p-12 relative overflow-hidden">
            <div className="absolute top-[-10%] start-[-10%] w-40 h-40 bg-[#0E766E]/5 rounded-full blur-3xl" />
            
            <div className="relative z-10 w-full max-w-[200px] aspect-square bg-white dark:bg-zinc-800 rounded-3xl shadow-xl flex items-center justify-center mb-6 border border-zinc-100 dark:border-zinc-700">
               <Mail size={80} className="text-[#0E766E] animate-pulse" />
            </div>
            
            <div className="relative z-10 text-center">
              <h3 className="text-zinc-800 dark:text-zinc-200 font-bold text-lg mb-2">{t("secure_title")}</h3>
              <p className="text-zinc-500 text-xs px-4">{t("secure_desc")}</p>
            </div>
          </div>

          {/* الجانب العملي - الفورم */}
          <div className="flex flex-col justify-center p-8 md:p-16 md:w-3/5 w-full text-start">
            <h1 className="text-zinc-900 dark:text-white text-3xl font-black mb-3 tracking-tight">
              {t("reset")}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-10 leading-relaxed">
              {t("associated")}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1">
                  {t("email_label")}
                </label>
                <input
                  type="email"
                  placeholder={t("email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-5 py-4 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0E766E] w-full transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#0E766E] text-white rounded-2xl py-4 font-bold text-lg hover:bg-[#0c625b] active:scale-[0.98] transition-all shadow-lg shadow-teal-900/20 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("sending")}
                  </div>
                ) : t("send")}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl">
                <p className="text-red-500 text-sm text-center font-medium">{error}</p>
              </div>
            )}

            <div className="mt-10 flex justify-center">
              <Link 
                href="/auth/login" 
                className="group flex items-center gap-2 text-zinc-500 hover:text-[#0E766E] font-bold text-sm transition-colors"
              >
                {isRTL ? <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /> : <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />}
                {t("goBack")}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </GuestPage>
  );
}