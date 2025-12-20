"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import GuestPage from "@/app/components/protectedpages/guestPage";
import { CheckCircle, AlertCircle, EyeIcon, EyeOff, User, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import { useProviderStore } from "@/app/store/providerStore";

export default function SignUp() {
  const t = useTranslations("signup");
  const locale = useLocale();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const setSignupData = useProviderStore((s: any) => s.setSignupData);
  const setVerificationEmail = useProviderStore((s: any) => s.setVerificationEmail);

  const rules = [
    { id: 1, label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { id: 2, label: "Contains uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { id: 3, label: "Contains lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { id: 4, label: "Contains a number", test: (p: string) => /[0-9]/.test(p) },
    { id: 5, label: "Contains a special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ];

  const handleSignup = () => {
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setPhoneError("Please enter a valid phone number");
      return;
    }
    setPhoneError("");

    const providerData = { name, email, phone: `+${phone}`, password };
    setSignupData(providerData);
    setVerificationEmail(email);
    router.push("providerview/providerType");
  };

  const isFormValid = name.trim() !== "" && email.trim() !== "" && phoneError === "" && rules.every(r => r.test(password));

  return (
    <GuestPage>
      <main
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="min-h-screen bg-[#F3F4F6] dark:bg-[#0a0a0a] flex items-center justify-center p-4"
      >
        <div className="bg-white dark:bg-[#111] rounded-[2.5rem] shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden border border-white/20">
          
          {/* --- Left Side: Aesthetic Info Panel --- */}
          <div className="md:w-5/12 bg-[#0E766E] p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-black/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                <ShieldCheck className="text-white" size={28} />
              </div>
              <h1 className="text-3xl font-black leading-tight mb-2">{t("title")}</h1>
              <h2 className="text-xl font-medium text-emerald-100 opacity-90">{t("subtitle")}</h2>
            </div>

            <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <p className="text-sm font-medium mb-4 italic opacity-80">
                &quot;Joining this platform was the best decision for my business growth.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-400/40 border border-white/30" />
                <span className="text-xs font-bold uppercase tracking-wider">Verified Provider</span>
              </div>
            </div>
          </div>

          {/* --- Right Side: Form Content --- */}
          <div className="md:w-7/12 w-full p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-black">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5" autoComplete="off">
              
              {/* Name field */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-4">{t("full_name")}</label>
                <div className="relative group">
                  <User className="absolute left-5 rtl:right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0E766E] transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl py-3.5 pl-14 pr-5 rtl:pr-14 rtl:pl-5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0E766E]/50 focus:border-[#0E766E] transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email field */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-4">{t("email")}</label>
                <div className="relative group">
                  <Mail className="absolute left-5 rtl:right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0E766E] transition-colors" size={18} />
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl py-3.5 pl-14 pr-5 rtl:pr-14 rtl:pl-5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0E766E]/50 focus:border-[#0E766E] transition-all"
                    required
                  />
                </div>
              </div>

              {/* Phone field */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-4">Phone Number</label>
                <div className="phone-input-container">
                  <PhoneInput
                    country={"eg"}
                    value={phone}
                    onChange={(value) => {
                      setPhone(value);
                      if (value.length < 10) setPhoneError("Invalid number");
                      else setPhoneError("");
                    }}
                    inputProps={{ name: "phone", required: true }}
                    containerClass="!w-full shadow-none"
                    inputClass="!w-full !h-[50px] !bg-gray-50 dark:!bg-[#1a1a1a] !border-gray-200 dark:!border-white/10 !rounded-2xl !text-gray-900 dark:!text-white focus:!ring-2 focus:!ring-[#0E766E]/50 !transition-all"
                    buttonClass="!bg-transparent !border-r dark:!border-white/10 !rounded-l-2xl rtl:!rounded-r-2xl rtl:!rounded-l-none rtl:!border-l rtl:!border-r-0"
                  />
                </div>
                {phoneError && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-4">{phoneError}</p>}
              </div>

              {/* Password field */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-4">{t("password")}</label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setShowPasswordRules(true)}
                    autoComplete="new-password"
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl py-3.5 px-6 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0E766E]/50 focus:border-[#0E766E] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-5 rtl:left-5 rtl:right-auto -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <EyeIcon size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Password Rules */}
              {showPasswordRules && (
                <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-5 border border-gray-100 dark:border-white/5 space-y-2">
                  <p className="text-[11px] font-black uppercase text-gray-400 mb-2 tracking-widest">Security Checklist</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {rules.map((rule) => {
                      const isValid = rule.test(password);
                      return (
                        <div key={rule.id} className={`flex items-center gap-2 text-xs font-medium ${isValid ? "text-emerald-600" : "text-gray-400"}`}>
                          {isValid ? <CheckCircle size={14} /> : <AlertCircle size={14} className="opacity-50" />}
                          <span>{rule.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Signup button */}
              <button
                type="button"
                onClick={handleSignup}
                disabled={!isFormValid}
                className={`w-full rounded-2xl py-4 font-black text-lg transition-all transform active:scale-[0.98] shadow-xl ${
                  isFormValid 
                  ? "bg-[#0E766E] text-white hover:bg-[#0A5D57] shadow-[#0E766E]/20" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                }`}
              >
                {t("signup")}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm font-medium text-gray-500">
                {t("have_account")}{" "}
                <Link href="/proLogin" className="text-[#0E766E] font-black hover:underline underline-offset-4">
                  {t("login")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </GuestPage>
  );
}