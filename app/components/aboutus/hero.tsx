"use client";

import { useLocale, useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("about");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <section 
      className="bg-[#0E766E] text-white py-20 md:py-32 px-6 rounded-b-[50px] md:rounded-b-[100px] relative overflow-hidden" 
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* لمسة ديكور خفيفة في الخلفية (دوائر شفافة) */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-[0.03] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-black opacity-[0.05] rounded-full translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            <span className="w-2 h-2 bg-teal-300 rounded-full animate-pulse"></span>
            <span className="text-xs md:text-sm font-bold tracking-widest uppercase">
              {t("badge")}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-6xl font-extrabold leading-tight">
            {t("title")}
          </h1>

          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-2xl opacity-90 leading-[1.8] font-medium text-teal-50">
              {t("description")}
            </p>
          </div>

          {/* خط جمالي بسيط تحت النص */}
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-teal-300 to-transparent opacity-50 mt-4"></div>
        </div>
      </div>
    </section>
  );
}