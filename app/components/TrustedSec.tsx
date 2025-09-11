"use client";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { logos } from "../constants/content";

export default function TrustedSection() {
  const t = useTranslations("trusted");
  const locale = useLocale();

  return (
    <section
      className="py-8 sm:py-12 bg-gray-50 overflow-hidden dark:bg-[#0a0a0a]"
      data-aos="fade-right"
      data-aos-duration="2000"
    >
      {/* Title */}
      <h2
        className="text-center text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-6 sm:mb-8 dark:text-white px-4"
        data-aos="fade-right"
        data-aos-duration="2500"
      >
        {t("trustedBy")}{" "}
        <span className="text-blue-600">{t("enterprices")}</span>{" "}
        {t("inSaudi")}
      </h2>

      {/* Container */}
      <div
        className="relative w-full overflow-hidden"
        data-aos="zoom-in"
        data-aos-duration="3000"
      >
        {/* Track */}
        <div
          className={`flex w-100vw hover:[animation-play-state:paused] ${
            locale === "ar" ? "animate-marquee-rtl" : "animate-marquee-ltr"
          }`}
        >
          {[...logos, ...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-shrink-0 gap-6 sm:gap-12 px-4"
            >
              <Image
                src={logo}
                alt={`logo-${index}`}
                width={120}
                height={0}
                className="object-contain w-[70px] sm:w-[100px] md:w-[120px] h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}