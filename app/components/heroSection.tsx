"use client";

import Image from "next/image";
import heroImage from "../../public/herosec.jpg";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section className="bg-[#2C70E2] rounded-bl-[100px] text-white py-12 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between gap-10">
      {/* Left side slogan */}
      <div className="flex-1 text-center md:text-start">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {t("slogan")}
        </h1>
        <div className="flex justify-center md:justify-start">
          <button className="mt-4 px-6 py-3 border-2 border-white rounded-full hover:bg-white hover:text-blue-600 transition">
            {t("explore")}
          </button>
        </div>
      </div>

      {/* Right side image */}
      <div className="flex-1">
        <Image
          src={heroImage}
          alt="Hero image"
          width={500}
          height={350}
          className="rounded-2xl shadow-lg"
        />
      </div>
    </section>
  );
}