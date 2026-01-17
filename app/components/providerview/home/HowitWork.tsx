"use client";

import { useLocale, useTranslations } from "next-intl";

export default function GallerySection() {
  const locale = useLocale();
  const t = useTranslations("GallerySection");
  const isRTL = locale === "ar";

  return (
    <section 
      className="w-full bg-white dark:bg-zinc-950 py-16 px-6" 
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-10">
        
        {/* Top Text Content */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">
            {t("mainTitle")}
          </h2>
          <p className="text-lg md:text-xl font-bold text-[#0E766E]">
            {t("subTitle")}
          </p>
        </div>

        {/* The Gallery Image (Single Image containing all 6 photos) */}
        <div className="relative w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl group">
          {/* Subtle Green Overlay on the whole image */}
          <div className="absolute inset-0 bg-[#0E766E]/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
          
          <img 
            src="/pro3sec.svg" // ضع هنا الصورة الواحدة التي تجمع الـ 6 صور
            alt="Our Facilities Grid" 
            className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
          />

          {/* Optional: Branding watermark overlay if needed */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
             <h2 className="text-8xl font-black text-[#0E766E] rotate-12">SKAFARENT</h2>
          </div>
        </div>

       

      </div>
    </section>
  );
}