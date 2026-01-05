"use client";

import { useLocale, useTranslations } from "next-intl";

export default function PartnerSection() {
  const locale = useLocale();
  const t = useTranslations("PartnerSection");
  const isRTL = locale === "ar";

  return (
    <section 
      className="w-full bg-white dark:bg-zinc-950 py-12 px-6" 
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        
        {/* Left Side: Overlapping Images */}
        <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
          
          {/* Layer 1: The Logo (Base Image) */}
          <div className="relative w-full h-full z-10 flex items-center justify-center">
            <img 
              src="/logo.png"
              alt="Logo Base" 
              className="w-full h-full object-contain"
            />
            
            {/* Layer 2: The Inner Image (Positioned inside the logo) */}
            <div className="absolute inset-0 flex items-center justify-center p-[12%]"> 
              
              <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
                {/* Green Overlay */}
                <div className="absolute inset-0 bg-[#0E766E]/30 mix-blend-multiply z-20" />
                <img 
                  src="/partener.png" 
                  alt="Partnership" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Decorative background shadow */}
          <div className="absolute top-4 -left-4 w-full h-full bg-gray-50 dark:bg-zinc-900 rounded-[3rem] -z-10" />
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 space-y-5 text-center lg:text-start">
          <div className="space-y-4">
            {/* Main Description (Smaller font size) */}
            <h2 className="text-lg md:text-2xl font-black text-gray-900 dark:text-white leading-relaxed tracking-tight">
              {t("mainDescription")}
            </h2>
            
            {/* Footer Note (Small and subtle) */}
            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
               <p className="text-[#0E766E] font-bold text-xs md:text-sm opacity-80 leading-relaxed">
                 {t("footerNote")}
               </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}