"use client";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { logos } from "../../constants/content";

export default function TrustedSection() {
  const t = useTranslations("trusted");
  const locale = useLocale();

  return (
    <section className="py-10 bg-[#f3f4f4] dark:bg-[#0a0a0a] overflow-hidden">
      {/* عنوان بسيط ومرتب */}
      <h2 className="text-center text-base md:text-lg font-bold mb-8 text-zinc-800 dark:text-zinc-200">
        {t("trustedBy")} <span className="text-[#0E766E]">{t("enterprices")}</span> {t("inSaudi")}
      </h2>

      {/* Container مع تأثير تلاشي بسيط جداً عند الحواف */}
      <div className="relative w-full group">
        {/* التلاشي الجانبي */}
        <div className="absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-[#f3f4f4] dark:from-[#0a0a0a] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-[#f3f4f4] dark:from-[#0a0a0a] to-transparent pointer-events-none" />

        {/* شريط اللوجوهات */}
        <div
          className={`flex w-max gap-12 items-center py-2 ${
            locale === "ar" ? "animate-marquee-rtl" : "animate-marquee-ltr"
          } hover:[animation-play-state:paused]`}
        >
          {[...logos, ...logos, ...logos].map((logo, index) => (
            <div key={index} className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300">
              <Image
                src={logo}
                alt={`logo-${index}`}
                width={110}
                height={50}
                className="h-7 md:h-9 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee-ltr {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes marquee-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(33.33%); }
        }
        .animate-marquee-ltr { animation: marquee-ltr 25s linear infinite; }
        .animate-marquee-rtl { animation: marquee-rtl 25s linear infinite; }
      `}</style>
    </section>
  );
}