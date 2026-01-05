"use client";

import { useLocale, useTranslations } from "next-intl";

export default function WhyChooseUs() {
  const locale = useLocale();
  const t = useTranslations("WhyChooseUs");
  const isRTL = locale === "ar";

  const cards = [
    {
      id: 1,
      title: t("supportTitle"),
      desc: t("supportDesc"),
      extra: "24/7",
    },
    {
      id: 2,
      title: t("displayTitle"),
      desc: t("displayDesc"),
    },
    {
      id: 3,
      title: t("profitTitle"),
      desc: t("profitDesc"),
    },
  ];

  return (
    <section 
      className="w-full bg-[#0E766E] py-20 px-6 rounded-tl-[80px] md:rounded-tl-[120px]" 
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Section Title */}
        <h2 className="text-center text-2xl md:text-4xl font-black text-white">
          {t("mainTitle")}
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div 
              key={card.id} 
              className="bg-transparent border-2 border-white/40 rounded-[2.5rem] p-10 flex flex-col items-center text-center space-y-4 hover:bg-white/5 transition-colors duration-300"
            >
              <h3 className="text-xl md:text-2xl font-black text-white">
                {card.title}
              </h3>
              
              <div className="space-y-2">
                <p className="text-sm md:text-lg text-white/90 font-bold leading-relaxed">
                  {card.desc}
                </p>
                {card.extra && (
                  <p className="text-lg font-black text-white">{card.extra}</p>
                )}
                <p className="text-sm md:text-lg text-white/90 font-bold">
                  {t("responseSpeed")}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}