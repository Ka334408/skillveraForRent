"use client";

import { useTranslations, useLocale } from "next-intl";
import { ShieldAlert, ScrollText, ChevronRight } from "lucide-react";

export default function ThingsToKnow() {
  const t = useTranslations("thingsToKnow");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const rules: string[] = t.raw("rules");

  return (
    <section className="py-20 px-4 border-t border-gray-100 dark:border-zinc-800" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto">
        {/* Title Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-[#0E766E] mb-4">
            {t("title")}
          </h2>
          <div className="h-1.5 w-20 bg-[#0E766E] rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Facility Rules - قائمة القوانين */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600">
                <ShieldAlert size={24} />
              </div>
              <h3 className="font-bold text-2xl text-gray-900 dark:text-white">
                {t("rulesTitle")}
              </h3>
            </div>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {rules.map((rule, i) => (
                <li
                  key={i}
                  className="group bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:border-[#0E766E]/30 rounded-2xl p-5 flex items-start gap-4 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="w-2 h-2 bg-[#0E766E] rounded-full mt-2 flex-shrink-0 group-hover:scale-150 transition-transform"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                    {rule}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Facility Policies - السياسات */}
          <div className="h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-[#0E766E]">
                <ScrollText size={24} />
              </div>
              <h3 className="font-bold text-2xl text-gray-900 dark:text-white">
                {t("policiesTitle")}
              </h3>
            </div>

            <div className="bg-gradient-to-br from-[#0E766E] to-[#095f55] text-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-teal-900/20 relative overflow-hidden group">
              {/* Decorative Circle */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
              
              <div className="relative z-10">
                <p className="text-lg leading-loose opacity-90 font-medium">
                  {t("policies")}
                </p>
                
                <button className="mt-8 flex items-center gap-2 text-white font-black hover:gap-4 transition-all group/btn">
                  <span className="border-b-2 border-white/50 group-hover/btn:border-white">
                    {t("showMore")}
                  </span>
                  <ChevronRight className={`${isRTL ? "rotate-180" : ""} w-5 h-5`} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}