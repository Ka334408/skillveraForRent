"use client";

import { useLocale, useTranslations } from "next-intl";
import { Target, BarChart3, ShieldCheck } from "lucide-react";

export default function FeaturesSection() {
  const locale = useLocale();
  const t = useTranslations("FeaturesSection");
  const isRTL = locale === "ar";

  const features = [
    {
      id: 1,
      icon: <Target size={40} className="text-black" />,
      title: t("marketingTitle"),
      desc: t("marketingDesc"),
    },
    {
      id: 2,
      icon: <BarChart3 size={40} className="text-black" />,
      title: t("managementTitle"),
      desc: t("managementDesc"),
    },
    {
      id: 3,
      icon: <ShieldCheck size={40} className="text-black" />,
      title: t("rightsTitle"),
      desc: t("rightsDesc"),
    },
  ];

  return (
    <section 
      className="w-full bg-[#0E766E] py-16 px-6 rounded-br-[80px] md:rounded-br-[150px]" 
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Main Title */}
        <h2 className="text-center text-xl md:text-3xl font-black text-white leading-tight">
          {t("mainTitle")}
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="flex flex-col items-center space-y-6">
              
              {/* White Card */}
              <div className="w-full bg-gray-50 rounded-[2.5rem] p-10 flex flex-col items-center text-center shadow-lg transition-transform hover:-translate-y-2 duration-300 min-h-[280px] justify-center">
                <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm">
                  {feature.icon}
                </div>
                <p className="text-sm md:text-base font-bold text-gray-800 leading-relaxed max-w-[200px]">
                  {feature.desc}
                </p>
              </div>

              {/* Bottom Label (Outside Card) */}
              <h3 className="text-white font-black text-lg md:text-xl">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}