"use client";

import { useState } from "react";
import { User, Users, Building2, Briefcase, CheckCircle2, Loader2, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import api from "@/lib/axiosInstance";
import { useProviderStore } from "@/app/store/providerStore";
import toast, { Toaster } from "react-hot-toast";
import LocaleSwitcher from "@/app/components/local-switcher";

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
      toast.error(t("error_missing_data"));
      setTimeout(() => {
        router.push(`/${locale}/providerRegistration`)
      }, 3000);
      return;
    }

    try {
      setLoading(true);
      const payload = { ...signupData, type: selected };
      await api.post("/authentication/register/provider", payload);

      setVerificationEmail(signupData.email);
      localStorage.setItem("email", signupData.email);

      toast.success(t("success_message") || "Success!"); 
      router.push(`/${locale}/proVerifyAccount`);
    } catch (err: any) {
      console.error("Signup Error:", err);
      toast.error(err.response?.data?.message || t("error_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#FAFBFF] dark:bg-[#050505] flex flex-col items-center justify-start md:justify-center p-4 md:p-6 transition-colors duration-500 relative overflow-x-hidden">
      
      <Toaster position="top-center" reverseOrder={false} />

      <div className={`absolute top-4 md:top-8 ${isRTL ? 'right-4 md:right-10' : 'left-4 md:left-10'} z-50`}>
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-[#0E766E] transition-all active:scale-95 shadow-sm"
        >
          {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          <span className="text-xs md:text-sm font-bold">{t("back_btn") || "Back"}</span>
        </button>
      </div>

      <div className={`absolute top-4 md:top-8 ${isRTL ? 'left-4 md:left-10' : 'right-4 md:right-10'} z-50`}>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl md:rounded-2xl shadow-sm overflow-hidden active:scale-95 transition-all">
          <LocaleSwitcher />
        </div>
      </div>

      <div className="w-full max-w-6xl mt-24 md:mt-0">
        <div className="text-center mb-10 md:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#0E766E]/10 text-[#0E766E] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-[#0E766E]/20">
            <span className="w-2 h-2 rounded-full bg-[#0E766E] animate-pulse" />
            {t("step_badge")}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
            {t("hero_title")}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed text-base md:text-lg">
            {t("hero_subtitle")}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isActive = selected === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={`group relative flex flex-col items-center p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border-2 transition-all duration-500 ${
                  isActive
                    ? "border-[#0E766E] bg-white dark:bg-zinc-900 shadow-xl md:shadow-[0_30px_60px_-15px_rgba(14,118,110,0.25)] md:-translate-y-3"
                    : "border-zinc-100 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-white/20"
                }`}
              >
                {isActive && (
                  <div className="absolute top-4 right-4 md:top-6 md:right-6 text-[#0E766E] animate-bounce">
                    <CheckCircle2 size={24} fill="currentColor" className="text-white bg-[#0E766E] rounded-full md:w-7 md:h-7" />
                  </div>
                )}

                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] flex items-center justify-center mb-6 transition-all duration-500 shadow-inner ${
                  isActive ? "bg-[#0E766E] text-white rotate-[360deg]" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                }`}>
                  <Icon size={28} className="md:w-9 md:h-9" strokeWidth={isActive ? 2.5 : 1.5} />
                </div>

                <h3 className={`text-lg md:text-xl font-black mb-2 transition-colors ${isActive ? "text-[#0E766E]" : "text-zinc-800 dark:text-zinc-200"}`}>
                  {plan.label}
                </h3>
                <p className="text-xs md:text-sm font-bold text-zinc-400 dark:text-zinc-500 text-center leading-relaxed">
                  {plan.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* --- Footer Action Section --- */}
        <div className="flex flex-col items-center gap-6 pb-12">    

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="group relative flex items-center gap-4 px-12 py-4 md:px-20 md:py-5 rounded-2xl md:rounded-[2rem] bg-[#0E766E] text-white font-black text-lg md:text-xl hover:bg-[#0A5D57] transition-all transform active:scale-95 shadow-[0_20px_40px_-10px_rgba(14,118,110,0.3)] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden w-full md:w-auto justify-center"
          >
            {loading ? <Loader2 className="animate-spin" size={28} /> : (
              <>
                <span className="relative z-10">{t("confirm_btn")}</span>
                <div className={`relative z-10 transition-transform duration-300 ${isRTL ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`}>
                   {isRTL ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
                </div>
              </>
            )}
          </button>

          {/* Secure Footer Text */}
          <div className="flex items-center gap-3 opacity-50">
            <ShieldCheck size={14} className="text-zinc-400" />
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
              {t("secure_footer")}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}