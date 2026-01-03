"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { ShieldCheck, Layers, Award, BarChart3 } from "lucide-react"; // أيقونات مناسبة للمعاني

export default function Benefits() {
  const t = useTranslations("about");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const benefitsData = [
    {
      id: "quality",
      icon: <ShieldCheck className="text-[#0E766E]" size={28} />,
      title: t("benefit1Title"),
      desc: t("benefit1Desc"),
    },
    {
      id: "system",
      icon: <Layers className="text-[#0E766E]" size={28} />,
      title: t("benefit2Title"),
      desc: t("benefit2Desc"),
    },
    {
      id: "experience",
      icon: <Award className="text-[#0E766E]" size={28} />,
      title: t("benefit3Title"),
      desc: t("benefit3Desc"),
    },
    {
      id: "plan",
      icon: <BarChart3 className="text-[#0E766E]" size={28} />,
      title: t("benefit4Title"),
      desc: t("benefit4Desc"),
    },
  ];

  return (
    <section 
      className="container mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* الصورة الجانبية بتصميم عصري */}
      <div className="w-full lg:w-1/3 relative group">
        <div className={`absolute -inset-4 bg-teal-50 rounded-[2rem] transform ${isRTL ? "rotate-3" : "-rotate-3"} group-hover:rotate-0 transition-transform duration-500`}></div>
        <div className="relative h-[450px] w-full rounded-[2rem] overflow-hidden shadow-2xl">
          <Image
            src="/about1.png"
            alt="ScavaRent Benefits"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>

      {/* شبكة المميزات (Benefits Grid) */}
      <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
        {benefitsData.map((item) => (
          <div 
            key={item.id} 
            className={`flex flex-col gap-4 p-6 bg-white rounded-2xl border-b-4 border-transparent hover:border-[#0E766E] hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 ${isRTL ? "text-right" : "text-left"}`}
          >
            <div className={`w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center`}>
              {item.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}