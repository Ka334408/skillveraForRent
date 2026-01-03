"use client";

import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, Settings, Share2 } from "lucide-react";

export default function WhyChooseUs() {
  const t = useTranslations("about");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const features = [
    {
      id: "standards",
      icon: <CheckCircle2 size={40} strokeWidth={1.5} />,
      title: t("feature1Title"),
      desc: t("feature1Desc"),
    },
    {
      id: "support",
      icon: <Settings size={40} strokeWidth={1.5} />,
      title: t("feature2Title"),
      desc: t("feature2Desc"),
    },
    {
      id: "flexibility",
      icon: <Share2 size={40} strokeWidth={1.5} />,
      title: t("feature3Title"),
      desc: t("feature3Desc"),
    },
  ];

  return (
    <section className="py-20 bg-gray-50/50" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-6">
        {/* العناوين الرئيسية */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-[#0E766E] font-bold text-xl md:text-2xl uppercase tracking-[0.2em]">
            {t("whyChooseUsLabel")}
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-[#4a1d1d]">
            {t("mainHeadline")}
          </h3>
        </div>

        {/* شبكة البطاقات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="bg-white border-2 border-[#0E766E] rounded-[40px] p-10 flex flex-col items-center text-center group hover:bg-[#0E766E] transition-all duration-500"
            >
              {/* الأيقونة */}
              <div className="mb-6 text-black group-hover:text-white transition-colors duration-500">
                {feature.icon}
              </div>
              
              {/* العنوان */}
              <h4 className="text-2xl font-bold mb-4 text-black group-hover:text-white transition-colors duration-500">
                {feature.title}
              </h4>
              
              {/* الوصف */}
              <p className="text-gray-600 text-lg leading-relaxed group-hover:text-teal-50 transition-colors duration-500">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}