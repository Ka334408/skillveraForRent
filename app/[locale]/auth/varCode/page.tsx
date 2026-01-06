"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import GuestPage from "@/app/components/protectedpages/guestPage";
import axiosInstance from "@/lib/axiosInstance";
import { useUserStore } from "@/app/store/userStore";
import { ArrowLeft, ArrowRight, MessageSquareCode, RefreshCw } from "lucide-react";

export default function VerifyCode() {
  const t = useTranslations("verify");
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "ar";

  const { resetEmail } = useUserStore();

  const [code, setCode] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < code.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length < 4) {
      setError(t("error_full_code"));
      return;
    }
    if (!resetEmail) {
      setError(t("error_no_email"));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.post("/authentication/reset-password/validate-otp", {
        email: resetEmail,
        code: verificationCode,
      });

      const token = res.data?.data?.token;
      if (!token) throw new Error("Token missing");

      localStorage.setItem("resetToken", token);
      router.push(`/${locale}/auth/setNewPass`);
    } catch (err: any) {
      setError(err.response?.data?.message || t("error_invalid"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      setError(null);
      await axiosInstance.post("/authentication/reset-password/request", { email: resetEmail });
      setTimer(30);
      setCode(["", "", "", ""]);
      inputsRef.current[0]?.focus();
    } catch (err: any) {
      setError(t("error_resend"));
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
        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg flex flex-col items-center p-8 md:p-12 dark:bg-zinc-900 border dark:border-zinc-800">
          
          {/* زر الرجوع */}
          <button
            onClick={() => router.push("/auth/resetPass")}
            className="self-start flex items-center gap-2 text-zinc-500 hover:text-[#0E766E] transition-colors font-bold text-sm mb-8 group"
          >
            {isRTL ? <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /> : <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />}
            {t("back")}
          </button>

          <div className="w-20 h-20 bg-teal-50 dark:bg-teal-900/20 rounded-3xl flex items-center justify-center mb-6">
            <MessageSquareCode size={40} className="text-[#0E766E]" />
          </div>

          <h1 className="text-3xl font-black mb-3 text-zinc-900 dark:text-white tracking-tight text-center">
            {t("title")}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-10 text-center max-w-[280px] leading-relaxed">
            {t("subtitle")} <span className="text-zinc-900 dark:text-zinc-200 font-semibold">{resetEmail}</span>
          </p>

          {/* مربعات الكود */}
          <div className="flex gap-3 md:gap-4 mb-10" dir="ltr">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                value={digit}
                maxLength={1}
                inputMode="numeric"
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-14 h-16 md:w-16 md:h-20 text-center border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl text-2xl font-black text-[#0E766E] bg-zinc-50 dark:bg-zinc-800 focus:border-[#0E766E] focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || code.some(d => d === "")}
            className="w-full bg-[#0E766E] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#0c625b] active:scale-[0.98] transition-all shadow-lg shadow-teal-900/20 disabled:opacity-50 disabled:grayscale mb-6"
          >
            {loading ? t("verifying") : t("verifyBtn")}
          </button>

          {/* إعادة الإرسال */}
          <div className="flex flex-col items-center gap-2">
            {timer > 0 ? (
              <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                <span>{t("resend_text")}</span>
                <span className="text-[#0E766E] tabular-nums font-bold">
                  {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                </span>
              </div>
            ) : (
              <button
                onClick={handleResend}
                disabled={loading}
                className="flex items-center gap-2 text-[#0E766E] font-bold text-sm hover:underline group"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
                {t("resendBtn")}
              </button>
            )}
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}
        </div>
      </main>
    </GuestPage>
  );
}