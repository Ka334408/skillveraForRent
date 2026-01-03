"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import GuestPage from "@/app/components/protectedpages/guestPage";
import axiosInstance from "@/lib/axiosInstance";
import { useUserStore } from "@/app/store/userStore";
import { CheckCircle2, MailOpen, RefreshCw } from "lucide-react";

export default function VerifyAccount() {
  const t = useTranslations("verifyAccount");
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "ar";
  
  const { verificationEmail } = useUserStore();

  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

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

    if (!verificationEmail) {
      setError(t("error_no_email"));
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post(
        "/authentication/verify-account",
        { email: verificationEmail, code: verificationCode },
        { withCredentials: true } 
      );
      router.push("/auth/login");
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
      setCode(["", "", "", ""]);
      inputsRef.current[0]?.focus();
    } catch (err: any) {
      setError(err.response?.data?.message || t("error_resend"));
    } finally {
      setResending(false);
    }
  };

  return (
    <GuestPage>
      <main 
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-screen flex items-center justify-center px-4 bg-zinc-100 dark:bg-[#0a0a0a] transition-colors"
      >
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl p-8 md:p-12 max-w-md w-full text-center border dark:border-zinc-800 relative overflow-hidden">
          
          {/* أيقونة البريد */}
          <div className="w-20 h-20 bg-teal-50 dark:bg-teal-900/20 rounded-3xl flex items-center justify-center mb-8 mx-auto">
            <MailOpen size={40} className="text-[#0E766E]" />
          </div>

          <h1 className="text-3xl font-black mb-3 text-zinc-900 dark:text-white tracking-tight">
            {t("title")}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-10 leading-relaxed">
            {t("subtitle")} <br />
            <span className="text-zinc-900 dark:text-zinc-200 font-bold">{verificationEmail}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center gap-3 md:gap-4" dir="ltr">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  inputMode="numeric"
                  ref={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-14 h-16 md:w-16 md:h-20 text-center text-2xl font-black border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:border-[#0E766E] focus:ring-4 focus:ring-teal-500/10 bg-zinc-50 dark:bg-zinc-800 text-[#0E766E] outline-none transition-all"
                />
              ))}
            </div>

            <div className="space-y-3">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl text-red-500 text-sm font-medium animate-shake">
                  {error}
                </div>
              )}
              {message && (
                <div className="p-3 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl text-green-600 dark:text-green-400 text-sm font-medium">
                  {message}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || code.some(d => d === "")}
              className="w-full bg-[#0E766E] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#0c625b] active:scale-[0.98] transition-all shadow-lg shadow-teal-900/20 disabled:opacity-50 disabled:grayscale"
            >
              {loading ? t("verifying") : t("verify_btn")}
            </button>
          </form>

          <div className="mt-10">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {t("did_not_receive")}{" "}
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-[#0E766E] font-bold hover:underline disabled:opacity-50 inline-flex items-center gap-1 group"
              >
                <RefreshCw size={14} className={`${resending ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                {resending ? t("resending") : t("resend_btn")}
              </button>
            </p>
          </div>
        </div>
      </main>
    </GuestPage>
  );
}