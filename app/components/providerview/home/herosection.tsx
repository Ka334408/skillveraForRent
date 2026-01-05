"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";


export default function HeroHostSection() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("HostHero");
  const isRTL = locale === "ar";

  return (
    <section 
      className="relative w-full bg-white dark:bg-zinc-950 py-12 px-6 overflow-hidden" 
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
       

        {/* Right Side: Refined Content */}
        <div className="text-center lg:text-start space-y-6">
          <div className="space-y-3">
            {/* Brand Title (Small Font Version) */}
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <div className="w-3 h-3 bg-[#0E766E] rounded-full" />
              <h2 className="text-4xl md:text-5xl font-black text-[#0E766E] tracking-tight">
                {t("brandName")}
              </h2>
            </div>
            
            {/* Main Title (Reduced Size) */}
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white leading-snug">
              {t("mainTitle")}
            </h1>
            
            {/* Subtitle (Refined) */}
            <p className="text-lg md:text-xl font-bold text-[#0E766E]/70">
              {t("subTitle")}
            </p>
          </div>

          {/* Buttons (More compact) */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-4">
            <button 
            onClick={()=>{router.push("/userview/aboutUs")}}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0E766E] text-white rounded-xl font-bold text-base shadow-lg shadow-[#0E766E]/20 hover:bg-[#0b5c56] transition-all active:scale-95">
              {t("learnMore")}
            </button>
            <button
            onClick={()=>{router.push("/providerRegistration")}}
            className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 rounded-xl font-bold text-base shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all active:scale-95">
              {t("registerNow")}
            </button>
          </div>
        </div>
         {/* Left Side: Single Optimized Image */}
        <div className="relative group">
          {/* Decorative background element */}
          <div className="absolute -inset-4 bg-[#0E766E]/5 rounded-[3rem] rotate-3 transition-transform group-hover:rotate-0 duration-500" />
          
          <div className="relative w-full aspect-[4/3] md:aspect-square max-w-[500px] mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800">
            {/* Greenish Overlay to match the style */}
            <div className="absolute inset-0 bg-[#0E766E]/20 mix-blend-multiply z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E766E]/40 to-transparent z-10" />
            
            <img 
              src="/signup.png" 
              alt="Host Facility" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {/* Floating badge (Optional - like the dot in the original) */}
          <div className="absolute -bottom-4 -right-4 bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-xl z-20 hidden md:block border border-gray-100 dark:border-zinc-700">
            <div className="w-8 h-8 bg-[#0E766E] rounded-full flex items-center justify-center text-white animate-bounce">
              <span className="text-xs">★</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}