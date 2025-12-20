"use client";

import { useState } from "react";
import { User, Users, Building2, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import api from "@/lib/axiosInstance";
import { useProviderStore } from "@/app/store/providerStore";

const plans = [
  {
    id: "INDIVIDUAL",
    label: "Individual",
    description: "can add up to 1 facility",
    icon: User,
  },
  {
    id: "TEAM",
    label: "Team",
    description: "can add up to 5 facility",
    icon: Users,
  },
  {
    id: "ORGANIZATION",
    label: "Organization",
    description: "can add up to 10 facility",
    icon: Building2,
  },
  {
    id: "ENTERPRISE",
    label: "Enterprise",
    description: "more than 10 facilities",
    icon: Briefcase,
  },
];

export default function SelectPlanPage() {
  const [selected, setSelected] = useState("INDIVIDUAL");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  // جلب البيانات من store
  const signupData = useProviderStore((s:any) => s.signupData);
  const setVerificationEmail = useProviderStore((s:any) => s.setVerificationEmail);
    const verificationEmail = useProviderStore((s:any) => s.verificationEmail);

  const handleSubmit = async () => {
    if (!signupData) {
      alert("Signup data missing. Please signup first.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...signupData,
        type: selected,
      };

      const res = await api.post("/authentication/register/provider", payload);

      console.log("Signup success:", res.data);
      

      // حفظ الايميل في store لاستخدامه في VerifyAccount
      setVerificationEmail(signupData.email);
      localStorage.setItem("emai",verificationEmail)

      router.push(`/${locale}/proVerifyAccount`);
    } catch (err: any) {
      console.error("Signup Error:", err);
      alert(err.response?.data?.message || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-4xl text-center">
        <h1 className="text-2xl font-bold mb-2">Choose Your subscribe</h1>
        <p className="text-gray-500 mb-10">
          choose your subscription to go to Provider Dashboard.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isActive = selected === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 p-6 h-40 transition
                  ${
                    isActive
                      ? "border-[#0E766E] text-[#0E766E] bg-blue-50"
                      : "border-gray-200 text-gray-400 bg-gray-50"
                  }
                `}
              >
                <Icon className="w-8 h-8 mb-3" />
                <span className="font-semibold text-lg">{plan.label}</span>
                <span className="text-sm">{plan.description}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-8 py-2 rounded-full bg-white border-2 border-[#0E766E] text-[#0E766E] font-semibold hover:bg-blue-50 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Let’s go"}
        </button>
      </div>
    </div>
  );
}