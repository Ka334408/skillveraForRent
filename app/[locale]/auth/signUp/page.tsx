"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import GuestPage from "@/app/components/protectedpages/guestPage";
import api from "@/lib/axiosInstance";
import { CheckCircle, AlertCircle, EyeIcon, EyeOff } from "lucide-react";
import { useUserStore } from "@/app/store/userStore";

export default function SignUp() {
  const t = useTranslations("signup");
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "ar";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const rules = [
    { id: 1, label: t("rule_length"), test: (p: string) => p.length >= 8 },
    { id: 2, label: t("rule_upper"), test: (p: string) => /[A-Z]/.test(p) },
    { id: 3, label: t("rule_lower"), test: (p: string) => /[a-z]/.test(p) },
    { id: 4, label: t("rule_number"), test: (p: string) => /[0-9]/.test(p) },
    { id: 5, label: t("rule_special"), test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post("/authentication/register", {
        name,
        email,
        phone: `+${phone}`,
        password,
      });

      await api.post("/authentication/request-verification", { email });
      useUserStore.getState().setVerificationEmail(email);
      router.push(`/${locale}/auth/verifyAccount`);
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
        className="min-h-screen bg-zinc-100 flex items-center justify-center px-4 py-10 dark:bg-[#0a0a0a] transition-colors"
      >
        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl min-h-[650px] flex flex-col md:flex-row overflow-hidden dark:bg-zinc-900 border dark:border-zinc-800">
          
          {/* الجانب الأيسر - الفورم */}
          <div className="flex flex-col justify-center p-8 md:p-14 md:w-1/2 w-full text-start">
            <h1 className="text-[#0E766E] text-4xl font-black mb-2 tracking-tight">
              {t("title")}
            </h1>
            <h2 className="text-zinc-800 dark:text-zinc-200 text-xl font-bold mb-8">
              {t("subtitle")}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder={t("full_name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-5 py-4 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0E766E] w-full transition-all"
                required
              />

              <input
                type="email"
                placeholder={t("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-5 py-4 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0E766E] w-full transition-all"
                required
              />

              {/* حقل رقم الهاتف المطور */}
              <div className="relative phone-input-container" dir="ltr"> 
                {/* ملاحظة: حقل الهاتف يفضل دائماً أن يظل ltr لمنع تداخل الأرقام */}
                <PhoneInput
                  country={"eg"}
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  placeholder={t("phone_placeholder")}
                  specialLabel=""
                  inputClass="!w-full !h-[58px] !rounded-2xl !text-zinc-800 !bg-zinc-50 dark:!bg-zinc-800/50 !border-zinc-200 dark:!border-zinc-700 focus:!ring-2 focus:!ring-[#0E766E]"
                  buttonClass="!rounded-l-2xl !bg-zinc-50 dark:!bg-zinc-800/50 !border-zinc-200 dark:!border-zinc-700"
                  dropdownClass="dark:!bg-zinc-800 dark:!text-white"
                />
              </div>

              {/* كلمة المرور */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowPasswordRules(true)}
                  className={`bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-5 py-4 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0E766E] w-full transition-all ${isRTL ? 'pl-12' : 'pr-12'}`}
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

              {/* قواعد كلمة المرور */}
              {showPasswordRules && (
                <div className="bg-zinc-50 dark:bg-zinc-800/80 rounded-2xl p-4 text-xs space-y-2 border border-zinc-100 dark:border-zinc-700 animate-in fade-in slide-in-from-top-2">
                  <p className="font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                    {t("password_must_include")}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {rules.map((rule) => {
                      const isValid = rule.test(password);
                      return (
                        <div key={rule.id} className={`flex items-center gap-2 ${isValid ? "text-green-600" : "text-zinc-400"}`}>
                          {isValid ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                          <span>{rule.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || password.trim() === ""}
                className="bg-[#0E766E] text-white rounded-2xl py-4 font-bold text-lg hover:bg-[#0c625b] active:scale-[0.98] transition-all shadow-lg shadow-teal-900/20 disabled:bg-zinc-300 disabled:dark:bg-zinc-800"
              >
                {loading ? t("signing_up") : t("signup_btn")}
              </button>
            </form>

            {error && (
              <p className="text-red-500 text-sm text-center mt-4 font-medium">{error}</p>
            )}

            <p className="mt-8 text-sm text-zinc-500 text-center">
              {t("have_account")}{" "}
              <Link href={`/${locale}/auth/login`} className="text-[#0E766E] font-bold hover:underline">
                {t("login_link")}
              </Link>
            </p>
          </div>

          {/* الجانب الأيمن - الصورة */}
          <div className="md:w-1/2 relative bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center p-8">
            <div className="absolute inset-0 opacity-20 dark:opacity-10 bg-[url('/pattern.png')] bg-repeat" />
            <img 
              src="/signup.png" 
              alt="Signup illustration" 
              className="relative z-10 w-full max-w-md drop-shadow-2xl hover:scale-105 transition-transform duration-700" 
            />
            {/* في حال عدم توفر صورة حالياً، سيظهر هذا كخلفية جمالية */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
          </div>
        </div>
      </main>
    </GuestPage>
  );
}