"use client";

import { useState } from "react";
import { User, Users, Building2, Briefcase, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import api from "@/lib/axiosInstance";
import { useProviderStore } from "@/app/store/providerStore";

const plans = [
  {
    id: "INDIVIDUAL",
    label: "Individual",
    description: "Up to 1 facility",
    icon: User,
    color: "from-blue-500/10 to-blue-600/5",
  },
  {
    id: "TEAM",
    label: "Team",
    description: "Up to 5 facilities",
    icon: Users,
    color: "from-emerald-500/10 to-emerald-600/5",
  },
  {
    id: "ORGANIZATION",
    label: "Organization",
    description: "Up to 10 facilities",
    icon: Building2,
    color: "from-purple-500/10 to-purple-600/5",
  },
  {
    id: "ENTERPRISE",
    label: "Enterprise",
    description: "10+ facilities",
    icon: Briefcase,
    color: "from-amber-500/10 to-amber-600/5",
  },
];

export default function SelectPlanPage() {
  const [selected, setSelected] = useState("INDIVIDUAL");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const signupData = useProviderStore((s: any) => s.signupData);
  const setVerificationEmail = useProviderStore((s: any) => s.setVerificationEmail);
  const verificationEmail = useProviderStore((s: any) => s.verificationEmail);

  const handleSubmit = async () => {
    if (!signupData) {
      alert("Signup data missing. Please signup first.");
      return;
    }

    try {
      setLoading(true);
      const payload = { ...signupData, type: selected };
      const res = await api.post("/authentication/register/provider", payload);

      setVerificationEmail(signupData.email);
      localStorage.setItem("emai", verificationEmail);

      router.push(`/${locale}/proVerifyAccount`);
    } catch (err: any) {
      console.error("Signup Error:", err);
      alert(err.response?.data?.message || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFBFF] dark:bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Select Your Business Scale
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium max-w-lg mx-auto leading-relaxed">
            Choose the subscription tier that best fits your facility management needs. 
            You can upgrade your plan at any time.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isActive = selected === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={`group relative flex flex-col items-center p-8 rounded-[2.5rem] border-2 transition-all duration-300 transform ${
                  isActive
                    ? "border-[#0E766E] bg-white dark:bg-[#111] shadow-2xl shadow-[#0E766E]/10 -translate-y-2"
                    : "border-gray-100 dark:border-white/5 bg-white dark:bg-[#111] hover:border-gray-300 dark:hover:border-white/20 hover:-translate-y-1"
                }`}
              >
                {/* Checkmark Badge */}
                {isActive && (
                  <div className="absolute top-5 right-5 text-[#0E766E] animate-in zoom-in duration-300">
                    <CheckCircle2 size={24} fill="currentColor" className="text-white bg-[#0E766E] rounded-full" />
                  </div>
                )}

                {/* Icon Container */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                  isActive ? "bg-[#0E766E] text-white" : "bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:text-gray-600"
                }`}>
                  <Icon size={32} strokeWidth={isActive ? 2.5 : 2} />
                </div>

                <h3 className={`text-xl font-black mb-2 transition-colors ${
                  isActive ? "text-[#0E766E]" : "text-gray-800 dark:text-gray-200"
                }`}>
                  {plan.label}
                </h3>
                
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500 text-center">
                  {plan.description}
                </p>

                {/* Selection Indicator Bar */}
                <div className={`absolute bottom-0 left-10 right-10 h-1 rounded-t-full transition-all duration-300 ${
                  isActive ? "bg-[#0E766E] opacity-100" : "bg-transparent opacity-0"
                }`} />
              </button>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="group flex items-center gap-3 px-12 py-4 rounded-2xl bg-[#0E766E] text-white font-black text-lg hover:bg-[#0A5D57] transition-all transform active:scale-95 shadow-xl shadow-[#0E766E]/30 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                Confirm Selection
                <CheckCircle2 size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Step 2 of 3 • Secure Registration
          </p>
        </div>
      </div>
    </main>
  );
}