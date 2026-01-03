"use client";

import { useLocale, useTranslations } from "next-intl";
import { Quote } from "lucide-react";

export default function Story() {
  const t = useTranslations("about");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <section 
      className="py-20 bg-teal-50/30 relative overflow-hidden" 
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* أيقونة اقتباس كبيرة في الخلفية للجمالية */}
      <Quote 
        className={`absolute opacity-[0.05] text-[#0E766E] ${isRTL ? "right-10 rotate-180" : "left-10"}`} 
        size={180} 
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* عنوان السكشن */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0E766E] mb-8 relative inline-block">
            {t("storyTitle")}
            <span className="absolute bottom-[-10px] left-1/4 right-1/4 h-1.5 bg-teal-200 rounded-full"></span>
          </h2>

          {/* نص القصة */}
          <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-teal-100/50 relative">
            {/* أيقونة اقتباس صغيرة علوية */}
            <Quote 
              className="text-teal-200 mb-6 mx-auto" 
              size={40} 
            />
            
            <p className="text-lg md:text-2xl text-gray-700 leading-[2] font-medium italic">
              {t("storyText")}
            </p>

            <div className="mt-8 flex justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-200"></span>
              <span className="w-12 h-2 rounded-full bg-[#0E766E]"></span>
              <span className="w-2 h-2 rounded-full bg-teal-200"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}