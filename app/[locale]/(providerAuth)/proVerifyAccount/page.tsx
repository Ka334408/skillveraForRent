"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import GuestPage from "@/app/components/protectedpages/guestPage";
import axiosInstance from "@/lib/axiosInstance";
import { useProviderStore } from "@/app/store/providerStore";
import { ShieldCheck, Mail, ArrowLeft, ArrowRight, RefreshCcw, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function VerifyAccount() {
  const t = useTranslations("Proverify");
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "ar";

  const verificationEmail = useProviderStore((s: any) => s.verificationEmail);

  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
   const signupUrl = `/${locale}/providerRegistration`;

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 3) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const verificationCode = code.join("");
    if (verificationCode.length < 4) {
      setError(t("error_incomplete"));
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post(
        "/authentication/verify-account",
        { email: verificationEmail, code: verificationCode },
        { withCredentials: true }
      );
      router.push(`/${locale}/proLogin`);
    } catch (err: any) {
      setError(err.response?.data?.message || t("error_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setMessage(null);
    setResending(true);
    try {
      await axiosInstance.post(
        "/authentication/request-verification",
        { email: verificationEmail },
        { withCredentials: true }
      );
      setMessage(t("resend_success"));
    } catch (err: any) {
      setError(err.response?.data?.message || t("error_resend"));
    } finally {
      setResending(false);
    }
  };

  return (
    <GuestPage>
      <main dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-zinc-50 dark:bg-[#050505] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden border border-zinc-200 dark:border-white/5 min-h-[550px]">
          
          {/* الجانب الأيسر - لوحة المعلومات */}
          <div className="md:w-5/12 bg-[#0E766E] p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-emerald-400/20 rounded-full blur-[60px]" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                <ShieldCheck size={28} />
              </div>
              <h1 className="text-3xl font-black leading-tight mb-4 tracking-tight">{t("hero_title")}</h1>
              <p className="text-sm text-emerald-50/80 leading-relaxed font-medium">{t("hero_desc")}</p>
            </div>

            <div className="relative z-10 bg-black/10 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Mail size={16} className="text-emerald-300" />
              </div>
              <span className="text-xs font-bold truncate max-w-full opacity-90">{verificationEmail || "email@example.com"}</span>
            </div>
          </div>

          {/* الجانب الأيمن - حقول التحقق (توسيط كامل) */}
          <div className="md:w-7/12 w-full p-8 lg:p-12 flex flex-col justify-center items-center bg-white dark:bg-zinc-950">
            <div className="mb-10 text-center w-full max-w-[360px]">
              <h2 className="text-2xl font-black text-zinc-800 dark:text-white mb-2">{t("form_title")}</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">{t("form_subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-[360px] space-y-8">
              {/* توسيط الأرقام الأربعة */}
              <div className="flex justify-center gap-3 sm:gap-4" dir="ltr">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (inputsRef.current[index] = el)}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-14 h-16 sm:w-16 sm:h-20 text-center text-3xl font-black border-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded-2xl focus:border-[#0E766E] focus:ring-4 focus:ring-[#0E766E]/10 outline-none transition-all dark:text-white shadow-sm"
                  />
                ))}
              </div>

              <div className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 text-rose-500 bg-rose-50 dark:bg-rose-500/10 p-4 rounded-xl text-xs font-bold border border-rose-100 dark:border-rose-500/20 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {message && (
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-xl text-xs font-bold border border-emerald-100 dark:border-emerald-500/20 animate-in fade-in slide-in-from-top-1">
                    <CheckCircle size={14} className="shrink-0" />
                    <span>{message}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || code.includes("")}
                  className={`w-full rounded-2xl py-4 font-black text-lg transition-all transform active:scale-[0.98] shadow-xl flex items-center justify-center gap-3 ${
                    !code.includes("") && !loading
                      ? "bg-[#0E766E] text-white hover:bg-[#0A5D57] shadow-emerald-900/20"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : t("verify_btn")}
                </button>
              </div>
            </form>

            <div className="mt-12 w-full max-w-[360px] flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-zinc-100 dark:border-zinc-800 pt-8">
              <button
                onClick={handleResend}
                disabled={resending}
                className="group flex items-center gap-2 text-sm font-black text-[#0E766E] hover:text-[#0A5D57] transition-colors disabled:opacity-50"
              >
                <RefreshCcw size={16} className={`${resending ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
                {resending ? t("resending") : t("resend_link")}
              </button>

              <Link href={signupUrl} className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                {isRTL ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                {t("back_to_signup")}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </GuestPage>
  );
}