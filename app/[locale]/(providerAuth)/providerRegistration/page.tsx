"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import GuestPage from "@/app/components/protectedpages/guestPage";
import { CheckCircle, AlertCircle, EyeIcon, EyeOff, User, Mail, ShieldCheck, Sparkles, Phone } from "lucide-react";
import { useProviderStore } from "@/app/store/providerStore";

export default function SignUp() {
  const t = useTranslations("providerSignup");
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "ar";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const { setSignupData, setVerificationEmail } = useProviderStore() as any;

  const rules = [
    { id: 1, label: t("rules.min"), test: (p: string) => p.length >= 8 },
    { id: 2, label: t("rules.upper"), test: (p: string) => /[A-Z]/.test(p) },
    { id: 3, label: t("rules.number"), test: (p: string) => /[0-9]/.test(p) },
    { id: 4, label: t("rules.special"), test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ];

  const handleSignup = () => {
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setPhoneError(t("errors.phone"));
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
      <style jsx global>{`
        .react-tel-input .form-control {
          width: 100% !important; height: 48px !important; background: transparent !important;
          border: none !important; color: inherit !important; padding-left: 50px !important;
        }
        .react-tel-input .flag-dropdown { background: transparent !important; border: none !important; z-index: 50 !important; }
        .react-tel-input .country-list { 
            background: #fff !important; border-radius: 12px !important; color: #000 !important;
            width: 280px !important; z-index: 9999 !important; /* التأكد من ظهور القائمة فوق كل شيء */
        }
        .dark .react-tel-input .country-list { background: #1a1a1a !important; color: #fff !important; border: 1px solid #333 !important; }
        .react-tel-input .selected-flag:hover { background: transparent !important; }
      `}</style>

      <main dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-zinc-50 dark:bg-[#050505] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-950 rounded-[2rem] shadow-xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden border border-zinc-200 dark:border-white/5 min-h-[600px]">
          
          {/* الجانب الأيسر - تم تصغير الـ Padding والخطوط */}
          <div className="md:w-5/12 bg-[#0E766E] p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-emerald-400/20 rounded-full blur-[60px]" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 mb-6">
                <Sparkles size={14} className="text-emerald-300" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{t("badge")}</span>
              </div>
              <h1 className="text-3xl font-black leading-tight mb-4 tracking-tight">{t("hero_title")}</h1>
              <p className="text-sm text-emerald-50/80 leading-relaxed max-w-xs">{t("hero_desc")}</p>
            </div>

            <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
              <p className="text-xs font-medium italic mb-4 opacity-90">&quot;{t("testimonial.text")}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/30 border border-white/20" />
                <div>
                  <p className="text-xs font-bold">{t("testimonial.author")}</p>
                  <p className="text-[9px] uppercase opacity-60">{t("testimonial.role")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* الجانب الأيمن - تم تقليل المسافات */}
          <div className="md:w-7/12 w-full p-8 lg:p-12 flex flex-col justify-center bg-white dark:bg-zinc-950">
            <div className="mb-6">
              <h2 className="text-xl font-black text-zinc-800 dark:text-white mb-1">{t("form_title")}</h2>
              <p className="text-zinc-500 text-xs font-medium">{t("form_subtitle")}</p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              {/* الاسم */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-400 px-1">{t("fields.name")}</label>
                <div className="relative group">
                  <User className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#0E766E]`} size={16} />
                  <input
                    type="text" placeholder="Ahmad Ali" value={name} onChange={(e) => setName(e.target.value)}
                    className={`w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 ${isRTL ? 'pr-12' : 'pl-12'} text-sm focus:border-[#0E766E] outline-none transition-all dark:text-white`}
                  />
                </div>
              </div>

              {/* البريد */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-400 px-1">{t("fields.email")}</label>
                <div className="relative group">
                  <Mail className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#0E766E]`} size={16} />
                  <input
                    type="email" placeholder="ahmad@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 ${isRTL ? 'pr-12' : 'pl-12'} text-sm focus:border-[#0E766E] outline-none transition-all dark:text-white`}
                  />
                </div>
              </div>

              {/* الهاتف - تم تبسيط الحاوية لضمان عمل الدروب داون */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-400 px-1">{t("fields.phone")}</label>
                <div className="relative" dir="ltr">
                  <div className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus-within:border-[#0E766E] transition-all">
                    <PhoneInput
                      country={"eg"} value={phone}
                      onChange={(val) => { setPhone(val); setPhoneError(val.length < 10 ? t("errors.phone") : ""); }}
                    />
                  </div>
                </div>
                {phoneError && <p className="text-rose-500 text-[9px] font-bold px-1">{phoneError}</p>}
              </div>

              {/* كلمة المرور */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-400 px-1">{t("fields.password")}</label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setShowPasswordRules(true)}
                    className={`w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 px-5 text-sm focus:border-[#0E766E] outline-none transition-all dark:text-white`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-zinc-400`}>
                    {showPassword ? <EyeOff size={16} /> : <EyeIcon size={16} />}
                  </button>
                </div>
              </div>

              {/* شروط الأمان - مصغرة */}
              {showPasswordRules && (
                <div className="grid grid-cols-2 gap-2 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  {rules.map((rule) => (
                    <div key={rule.id} className={`flex items-center gap-1.5 text-[9px] font-bold ${rule.test(password) ? "text-emerald-600" : "text-zinc-400"}`}>
                      {rule.test(password) ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                      {rule.label}
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button" onClick={handleSignup} disabled={!isFormValid}
                className={`w-full rounded-xl py-3.5 font-black text-base transition-all transform active:scale-[0.98] mt-2 ${
                  isFormValid ? "bg-[#0E766E] text-white shadow-lg shadow-emerald-900/20 hover:bg-[#0A5D57]" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                }`}
              >
                {t("submit_btn")}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs font-medium text-zinc-500">
                {t("footer_text")}{" "}
                <Link href="/proLogin" className="text-[#0E766E] font-black hover:underline">{t("footer_link")}</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </GuestPage>
  );
}