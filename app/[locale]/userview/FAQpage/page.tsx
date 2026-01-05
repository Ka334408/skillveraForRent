"use client";

import Header from "@/app/components/header";
import FaqHeader from "@/app/components/userview/faqHeader";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

export default function FaqPage() {
  const locale = useLocale();
  const t = useTranslations("FaqPage");
  const isRTL = locale === "ar";

  const faqData = {
    Rent: [
      { q: t("rentQ1"), a: t("rentA1") },
      { q: t("rentQ2"), a: t("rentA2") },
      { q: t("rentQ3"), a: t("rentA3") },
      { q: t("rentQ4"), a: t("rentA4") },
    ],
    Host: [
      { q: t("hostQ1"), a: t("hostA1") },
      { q: t("hostQ2"), a: t("hostA2") },
    ],
    Payment: [
      { q: t("paymentQ1"), a: t("paymentA1") },
      { q: t("paymentQ2"), a: t("paymentA2") },
    ],
    Policies: [
      { q: t("policiesQ1"), a: t("policiesA1") },
      { q: t("policiesQ2"), a: t("policiesA2") },
    ],
  };

  const [activeTab, setActiveTab] = useState<keyof typeof faqData>("Rent");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-gray-50">
      <Header loginLink="/auth/login" signupLink="/auth/signUp" />

      <FaqHeader title={t("mainTitle")} subtitle={t("mainSubtitle")} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 border-b border-gray-200">
          {Object.keys(faqData).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as keyof typeof faqData);
                setOpenIndex(0);
              }}
              className={`pb-4 text-sm md:text-lg font-bold transition-all relative ${
                activeTab === tab
                  ? "text-[#0E766E]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t(`tabs.${tab}`)}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0E766E] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-10 space-y-4 max-w-3xl mx-auto">
          {faqData[activeTab].map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-start"
              >
                <span className={`font-bold transition-colors ${openIndex === idx ? "text-[#0E766E]" : "text-gray-700"}`}>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`transition-transform duration-300 ${
                    openIndex === idx ? "rotate-180 text-[#0E766E]" : "text-gray-400"
                  }`}
                  size={20}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === idx ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-5 pt-0 text-gray-500 text-sm leading-relaxed border-t border-gray-50">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}