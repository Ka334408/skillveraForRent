"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <section 
      className="bg-[#0E766E] text-white py-12 md:py-20 px-6 rounded-b-[40px] md:rounded-b-[80px]" 
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-12">
        
        {/* 1. قسم النص: يظهر في الأعلى في الموبايل وعلى الجانب في الديسك توب */}
        <div className={`w-full md:w-1/2 space-y-6 ${isRTL ? "text-right" : "text-left"}`}>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
            {t("title")}
          </h1>
          <p className="text-base md:text-xl opacity-90 font-medium max-w-lg leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* 2. قسم شبكة الصور */}
        <div className="w-full md:w-1/2">
          
          {/* تصميم الموبايل: صورة واحدة عريضة أو شبكة بسيطة */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            <div className="relative w-full h-60 rounded-3xl overflow-hidden shadow-xl border-4 border-white/10">
              <Image
                src="/contact3.png"
                alt="Contact Mobile"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* تصميم التابلت والديسك توب: المتداخل (2+1) */}
          <div className="hidden md:grid grid-cols-2 gap-4 h-[400px]">
            {/* العمود المزدوج */}
            <div className="flex flex-col gap-4 h-full">
              <div className="relative w-full h-1/2 rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.03] transition-transform duration-500 border border-white/10">
                <Image
                  src="/contact3.png"
                  alt="Contact 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-full h-1/2 rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.03] transition-transform duration-500 border border-white/10">
                <Image
                  src="/contact2.png"
                  alt="Contact 2"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* الصورة الطولية الكبيرة */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.03] transition-transform duration-500 border border-white/10">
              <Image
                src="/contact1.png"
                alt="Contact 3"
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}