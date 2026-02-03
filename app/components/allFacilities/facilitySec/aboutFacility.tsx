"use client";

import { useTranslations, useLocale } from "next-intl";
import { ShieldAlert, ScrollText, ChevronRight } from "lucide-react";
import { useFacilityStore } from "@/app/store/facilityStore";

export default function ThingsToKnow() {
  const t = useTranslations("thingsToKnow");
  const locale = useLocale();
  const isRTL = locale === "ar";
  
  const facility = useFacilityStore((state: any) => state.facility);

  const rules = Array.isArray(facility?.rules) 
    ? facility.rules 
    : facility?.rules?.split('\n') || []; // fallback لو كانت نص بأسطر جديدة

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
          
          {/* Facility Rules - القوانين من الداتا */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600">
                <ShieldAlert size={24} />
              </div>
              <h3 className="font-bold text-2xl text-gray-900 dark:text-white">
                {t("rulesTitle")}
              </h3>
            </div>
            
            <ul className="grid grid-cols-1 gap-4">
              {rules.length > 0 ? (
                rules.map((rule: string, i: number) => (
                  <li
                    key={i}
                    className="group bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:border-[#0E766E]/30 rounded-2xl p-5 flex items-start gap-4 transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="w-2 h-2 bg-[#0E766E] rounded-full mt-2 flex-shrink-0 group-hover:scale-150 transition-transform"></div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                      {rule}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-gray-400 italic text-sm px-4">
                  {isRTL ? "لا توجد قوانين محددة حالياً" : "No specific rules defined."}
                </p>
              )}
            </ul>
          </div>

          {/* Facility Policies - السياسات من الداتا */}
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
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
              
              <div className="relative z-10">
                <p className="text-lg leading-loose opacity-90 font-medium whitespace-pre-wrap">
                  {/* عرض السياسة من الداتا أو رسالة افتراضية */}
                  {facility?.policy || (isRTL ? "يرجى الالتزام بسياسات الحجز والإلغاء المتبعة لدى المنشأة." : "Please adhere to the booking and cancellation policies of the facility.")}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}