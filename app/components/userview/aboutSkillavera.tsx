"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AboutSection() {
  const t = useTranslations("aboutus");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router=useRouter();

  return (
    <section className="py-16 bg-white dark:bg-[#0a0a0a] transition-colors overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          
          {/* الجانب الأيسر: الصورة (Logo with City Background) */}
          <div 
            className="w-full lg:w-1/2"
            data-aos={isRTL ? "fade-left" : "fade-right"}
          >
            <div className="relative group">
              {/* إطار الصورة بتصميم عصري */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0E766E] to-emerald-400 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              
              <div className="relative bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-200 dark:border-white/5">
                <Image
                  src="/logo.png" // تأكد من وضع صورة اللوجو والخلفية هنا
                  alt="KV Rent"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* الجانب الأيمن: النص المحاط ببرواز (Border Box) */}
          <div 
            className="w-full lg:w-1/2 relative"
            data-aos={isRTL ? "fade-right" : "fade-left"}
          >
            {/* البرواز التصميمي حول النص كما في الصورة */}
            <div className={`absolute -inset-4 border-2 border-[#0E766E]/20 rounded-3xl pointer-events-none hidden md:block ${isRTL ? "border-r-0 rounded-r-none" : "border-l-0 rounded-l-none"}`}></div>

            <div className={`relative space-y-8 ${isRTL ? "text-right pr-4 md:pr-10" : "text-left pl-4 md:pl-10"}`}>
              <p className="text-xl md:text-2xl font-bold text-zinc-800 dark:text-zinc-200 leading-[1.8] md:leading-[2]">
                {t("description")}
              </p>

              <div className={`pt-4 flex ${isRTL ? "justify-start" : "justify-end"}`}>
                <button
                onClick={()=>router.push("/userview/aboutUs")}
                className="group relative px-8 py-3 bg-[#0E766E] text-white rounded-xl font-bold shadow-lg shadow-[#0E766E]/20 overflow-hidden transition-all hover:pr-12 active:scale-95">
                  <span className="relative z-10">{t("more")}</span>
                  <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 ${isRTL ? "left-4" : "right-4"}`}>
                    {isRTL ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                  </div>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}