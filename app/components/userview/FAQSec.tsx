"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FAQSection() {
  const t = useTranslations("FAQ");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = t.raw("items") as { question: string; answer: string }[];

  return (
    <section className="py-20 dark:bg-[#0a0a0a] transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Title Section */}
        <div className="text-center mb-12 space-y-3">
          <span className="text-[#0E766E] font-bold text-sm uppercase tracking-[0.2em]">
            {t("title")}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white">
            {t("subtitle")}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto text-sm md:text-base">
            {t("description")}
          </p>
        </div>

        {/* FAQ Grid - Two Columns on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`group border rounded-[1.5rem] transition-all duration-500 h-fit ${
                  isOpen 
                    ? "border-[#0E766E]/40 dark:bg-zinc-900/50 shadow-sm" 
                    : "border-gray-500 dark:border-white/5 hover:border-zinc-200 dark:hover:border-white/10"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-5 text-start gap-4"
                >
                  <span className={`font-bold text-sm md:text-base transition-colors duration-300 ${
                    isOpen ? "text-[#0E766E]" : "text-zinc-800 dark:text-zinc-200"
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`shrink-0 p-1.5 rounded-full transition-all duration-500 ${
                    isOpen ? "rotate-180 bg-[#0E766E] text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                  }`}>
                    <ChevronDown size={16} />
                  </div>
                </button>

                {/* Animated Answer */}
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-5 pb-5 text-zinc-600 dark:text-zinc-400 text-xs md:text-sm leading-relaxed border-t border-zinc-100 dark:border-white/5 pt-4">
                    {faq.answer}
                    <div className="mt-3 inline-flex items-center gap-1 text-[#0E766E] font-bold cursor-pointer hover:opacity-80 transition-opacity">
                      {t("readMore")}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-[#0E766E] hover:bg-[#0a5d56] text-white rounded-2xl font-bold shadow-lg shadow-[#0E766E]/20 transition-all hover:-translate-y-1 active:scale-95">
            {t("cta")}
          </button>
        </div>
      </div>
    </section>
  );
}