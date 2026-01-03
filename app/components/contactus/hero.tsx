"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <section 
      className="bg-[#0E766E] text-white py-16 px-6 rounded-b-[40px] md:rounded-b-[80px]" 
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* النص التعريفي */}
        <div className={`md:w-1/2 ${isRTL ? "text-right" : "text-left"}`}>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg md:text-xl opacity-90 font-medium max-w-lg">
            {t("subtitle")}
          </p>
        </div>

        {/* شبكة الصور */}
        <div className="w-full md:w-1/2">
          {/* موبايل: صور تحت بعض */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative w-full h-48 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/herosec.png"
                  alt={`Contact ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* تابلت وديكستوب: تصميم متداخل (2+1) */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {/* العمود المزدوج (صورتين صغيرتين) */}
            <div className="flex flex-col gap-4">
              <div className="relative w-full h-44 md:h-48 rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300">
                <Image
                  src="/contact3.png"
                  alt="Contact 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-full h-44 md:h-48 rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300">
                <Image
                  src="/contact2.png"
                  alt="Contact 2"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* الصورة الطولية الكبيرة */}
            <div className="relative w-full h-full min-h-[380px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300">
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