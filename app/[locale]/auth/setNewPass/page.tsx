"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import GuestPage from "@/app/components/protectedpages/guestPage";
import axiosInstance from "@/lib/axiosInstance";
import { useUserStore } from "@/app/store/userStore";
import { Eye, EyeOff, AlertCircle, CheckCircle, ShieldCheck, Loader2 } from "lucide-react";

export default function ResetPassword() {
  const t = useTranslations("resetPasswordWords");
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "ar";

  const { resetEmail } = useUserStore();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPasswordRules, setShowPasswordRules] = useState(false);

  // قواعد التحقق من كلمة المرور
  const rules = [
    { id: 1, label: t("rule_length"), test: (p: string) => p.length >= 8 },
    { id: 2, label: t("rule_upper"), test: (p: string) => /[A-Z]/.test(p) },
    { id: 3, label: t("rule_lower"), test: (p: string) => /[a-z]/.test(p) },
    { id: 4, label: t("rule_number"), test: (p: string) => /[0-9]/.test(p) },
    { id: 5, label: t("rule_special"), test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ];

  // --- منطق تفعيل/تعطيل الزر ---
  const isAllRulesValid = rules.every(rule => rule.test(password));
  const isPasswordMatch = password.length > 0 && password === confirmPassword;
  const canSubmit = isAllRulesValid && isPasswordMatch && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return; // حماية إضافية

    setError(null);
    setSuccess(null);

    try {
      setLoading(true);
      const token = localStorage.getItem("resetToken");

      if (!resetEmail || !token) {
        setError(t("missing_info"));
        return;
      }

      await axiosInstance.post("/authentication/reset-password", {
        email: resetEmail,
        token,
        password,
      });

      localStorage.removeItem("resetToken");
      setSuccess(t("success"));
      setTimeout(() => router.push(`/${locale}/auth/login`), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || t("error_reset"));
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
        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl min-h-[550px] flex flex-col items-center justify-center p-8 md:p-12 dark:bg-zinc-900 border dark:border-zinc-800 relative overflow-hidden">
          
          {/* أيقونة جمالية في الخلفية */}
          <div className={`absolute top-10 ${isRTL ? 'left-10' : 'right-10'} opacity-5 dark:opacity-10 rotate-12`}>
            <ShieldCheck size={180} className="text-[#0E766E]" />
          </div>

          <div className="relative z-10 w-full flex flex-col items-center">
            <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/20 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck size={32} className="text-[#0E766E]" />
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-center mb-3 text-zinc-900 dark:text-white tracking-tight">
              {t("title")}
            </h1>
            <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 mb-10 max-w-sm leading-relaxed">
              {t("subtitle")}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-5 w-full max-w-md">
              
              {/* كلمة المرور الجديدة */}
              <div className="relative w-full">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder={t("new_password")}
                  value={password}
                  onFocus={() => setShowPasswordRules(true)}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-5 py-4 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0E766E] w-full transition-all ${isRTL ? 'pl-12' : 'pr-12'}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className={`absolute inset-y-0 ${isRTL ? 'left-4' : 'right-4'} flex items-center text-zinc-400 hover:text-[#0E766E] transition-colors`}
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* قواعد كلمة المرور تفاعلية */}
              {showPasswordRules && (
                <div className="bg-zinc-50 dark:bg-zinc-800/80 rounded-2xl p-5 text-xs space-y-3 border border-zinc-100 dark:border-zinc-700 animate-in fade-in zoom-in-95 duration-300">
                  <p className="font-bold text-zinc-700 dark:text-zinc-300 mb-1">{t("must_include")}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {rules.map((rule) => {
                      const isValid = rule.test(password);
                      return (
                        <div key={rule.id} className="flex items-center gap-2 transition-colors duration-300">
                          {isValid ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <AlertCircle size={16} className="text-zinc-300 dark:text-zinc-600" />
                          )}
                          <span className={isValid ? "text-green-600 font-medium" : "text-zinc-500"}>
                            {rule.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* تأكيد كلمة المرور */}
              <div className="relative w-full">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder={t("confirm_password")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-5 py-4 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0E766E] w-full transition-all ${isRTL ? 'pl-12' : 'pr-12'}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className={`absolute inset-y-0 ${isRTL ? 'left-4' : 'right-4'} flex items-center text-zinc-400 hover:text-[#0E766E] transition-colors`}
                >
                  {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* زر الحفظ (الذي يتم تعطيله وبهاؤه) */}
              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg mt-4 flex items-center justify-center gap-3
                  ${canSubmit 
                    ? "bg-[#0E766E] text-white hover:bg-[#0c625b] active:scale-[0.98] shadow-teal-900/20" 
                    : "bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed opacity-60 shadow-none"
                  }`}
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : t("button")}
              </button>

              {/* الرسائل التنبيهية */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-medium animate-shake">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}
              {success && (
                <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-2xl flex items-center gap-3 text-green-600 dark:text-green-400 text-sm font-medium">
                  <CheckCircle size={18} />
                  {success}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </GuestPage>
  );
}