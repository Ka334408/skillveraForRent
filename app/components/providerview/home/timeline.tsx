"use client";

import { useLocale, useTranslations } from "next-intl";
import { UserPlus, UserCheck, LayoutGrid, MessageSquare, Wallet } from "lucide-react";

export default function HowItWorks() {
  const locale = useLocale();
  const t = useTranslations("HowItWorks");
  const isRTL = locale === "ar";

  const steps = [
    {
      id: 1,
      icon: <UserPlus size={40} className="text-white" />,
      title: t("step1Title"),
      desc: t("step1Desc"),
      position: "left",
    },
    {
      id: 2,
      icon: <UserCheck size={40} className="text-white" />,
      title: t("step2Title"),
      desc: t("step2Desc"),
      position: "right",
    },
    {
      id: 3,
      icon: <LayoutGrid size={40} className="text-white" />,
      title: t("step3Title"),
      desc: t("step3Desc"),
      position: "left",
    },
    {
      id: 4,
      icon: <MessageSquare size={40} className="text-white" />,
      title: t("step4Title"),
      desc: t("step4Desc"),
      position: "right",
    },
    {
      id: 5,
      icon: <Wallet size={40} className="text-white" />,
      title: t("step5Title"),
      desc: t("step5Desc"),
      position: "left",
    },
  ];

  return (
    <section className="w-full bg-white py-20 px-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
            {t("mainTitle")}
          </h2>
          <div className="w-24 h-1.5 bg-[#0E766E] mx-auto rounded-full" />
          <p className="text-gray-500 font-bold text-sm md:text-base">
            {t("subTitle")}
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Vertical Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1.5 bg-[#0E766E] rounded-full hidden md:block" />

          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`relative flex flex-col md:flex-row items-center w-full ${
                  step.position === "right" ? "md:flex-row-reverse" : ""
                } md:mb-16`}
              >
                {/* Content Side */}
                <div className="w-full md:w-1/2 flex justify-center md:justify-end px-4 md:px-12 text-center md:text-start">
                  <div className={`space-y-2 ${step.position === "right" ? "md:text-start" : "md:text-end"}`}>
                    <h3 className="text-lg md:text-xl font-black text-gray-900">{step.title}</h3>
                    <p className="text-xs md:text-sm text-gray-500 font-bold leading-relaxed max-w-[250px] mx-auto md:mx-0">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Center Circle Indicator */}
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-4 border-[#0E766E] rounded-full z-20 hidden md:block" />

                {/* Icon Box Side */}
                <div className={`w-full md:w-1/2 flex justify-center md:justify-start px-4 md:px-12 mt-6 md:mt-0`}>
                  <div className="w-32 h-32 md:w-40 md:h-28 bg-[#0E766E] rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-[#0E766E]/20 transition-transform hover:scale-105">
                    {step.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}