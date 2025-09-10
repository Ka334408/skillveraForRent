"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

const logos = [
  "/trusted.jpg",
  "/trusted.jpg",
  "/trusted.jpg",
  "/trusted.jpg",
  "/trusted.jpg",
];

export default function TrustedSection() {
  const t = useTranslations("trusted");
  const locale = useLocale();

  return (
    <section className="py-12 bg-gray-50 overflow-hidden">
      <h2 className="text-center text-lg md:text-xl font-semibold mb-8">
        {t("trustedBy")} <span className="text-blue-600">{t("enterprices")}</span>{" "}
        {t("inSaudi")}
      </h2>

      {/* Container */}
      <div className="relative w-full overflow-hidden">
        {/* Track */}
        <div
          className={`flex w-max hover:[animation-play-state:paused] ${
            locale === "ar" ? "animate-marquee-rtl" : "animate-marquee-ltr"
          }`}
        >
          {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center mx-8 flex-shrink-0"
            >
              <Image
                src={logo}
                alt={`logo-${index}`}
                width={100}
                height={50}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}