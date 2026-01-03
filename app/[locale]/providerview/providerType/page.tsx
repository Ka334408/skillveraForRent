"use client";

import { useState } from "react";
import { User, Users, Building2, Briefcase, CheckCircle2, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import api from "@/lib/axiosInstance";
import { useProviderStore } from "@/app/store/providerStore";

export default function SelectPlanPage() {
  const t = useTranslations("plans");
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "ar";

  const [selected, setSelected] = useState("INDIVIDUAL");
  const [loading, setLoading] = useState(false);

  const signupData = useProviderStore((s: any) => s.signupData);
  const setVerificationEmail = useProviderStore((s: any) => s.setVerificationEmail);

  const plans = [
    { id: "INDIVIDUAL", label: t("individual.title"), desc: t("individual.desc"), icon: User },
    { id: "TEAM", label: t("team.title"), desc: t("team.desc"), icon: Users },
    { id: "ORGANIZATION", label: t("org.title"), desc: t("org.desc"), icon: Building2 },
    { id: "ENTERPRISE", label: t("enterprise.title"), desc: t("enterprise.desc"), icon: Briefcase },
  ];

  const handleSubmit = async () => {
    if (!signupData) {
      alert(t("error_missing_data"));
      router.push(`/${locale}/signup`);
      return;
    }

    try {
      setLoading(true);
      const payload = { ...signupData, type: selected };
      await api.post("/authentication/register/provider", payload);

      setVerificationEmail(signupData.email);
      // تصحيح الخطأ الإملائي في كلمة emai -> email
      localStorage.setItem("email", signupData.email);

      router.push(`/${locale}/proVerifyAccount`);
    } catch (err: any) {
      console.error("Signup Error:", err);
      alert(err.response?.data?.message || t("error_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#FAFBFF] dark:bg-[#050505] flex items-center justify-center p-6 transition-colors duration-500">
      <div className="w-full max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#0E766E]/10 text-[#0E766E] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-[#0E766E]/20 animate-fade-in">
            {t("step_badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
            {t("hero_title")}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed text-lg">
            {t("hero_subtitle")}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isActive = selected === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={`group relative flex flex-col items-center p-8 rounded-[3rem] border-2 transition-all duration-500 ${
                  isActive
                    ? "border-[#0E766E] bg-white dark:bg-zinc-900 shadow-[0_30px_60px_-15px_rgba(14,118,110,0.25)] -translate-y-3"
                    : "border-zinc-100 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-white/20 hover:-translate-y-1"
                }`}
              >
                {/* Active Indicator Dot */}
                {isActive && (
                  <div className="absolute top-6 right-6 text-[#0E766E] animate-bounce">
                    <CheckCircle2 size={28} fill="currentColor" className="text-white bg-[#0E766E] rounded-full" />
                  </div>
                )}

                {/* Icon Container */}
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 transition-all duration-500 shadow-inner ${
                  isActive 
                    ? "bg-[#0E766E] text-white rotate-[360deg]" 
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700"
                }`}>
                  <Icon size={36} strokeWidth={isActive ? 2.5 : 1.5} />
                </div>

                <h3 className={`text-xl font-black mb-3 transition-colors ${
                  isActive ? "text-[#0E766E]" : "text-zinc-800 dark:text-zinc-200"
                }`}>
                  {plan.label}
                </h3>
                
                <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 text-center leading-relaxed">
                  {plan.desc}
                </p>

                {/* Decoration */}
                <div className={`absolute bottom-6 w-12 h-1.5 rounded-full transition-all duration-500 ${
                  isActive ? "bg-[#0E766E] w-24 opacity-100" : "bg-zinc-100 dark:bg-zinc-800 opacity-0"
                }`} />
              </button>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="flex flex-col items-center gap-8">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="group relative flex items-center gap-4 px-16 py-5 rounded-[2rem] bg-[#0E766E] text-white font-black text-xl hover:bg-[#0A5D57] transition-all transform active:scale-95 shadow-[0_20px_40px_-10px_rgba(14,118,110,0.4)] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={28} />
            ) : (
              <>
                <span className="relative z-10">{t("confirm_btn")}</span>
                <div className={`relative z-10 transition-transform duration-300 ${isRTL ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`}>
                   {isRTL ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
                </div>
              </>
            )}
            {/* Glossy effect */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover:animate-shine" />
          </button>
          
          <div className="flex items-center gap-2">
             <div className="h-px w-8 bg-zinc-200 dark:bg-zinc-800" />
             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
               {t("secure_footer")}
             </p>
             <div className="h-px w-8 bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    </main>
  );
}