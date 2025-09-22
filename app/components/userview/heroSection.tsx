"use client";

import Image from "next/image";
import heroImage from "../../../public/herosec.png";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section
      className="bg-[#2C70E2] rounded-bl-[60px] md:rounded-bl-[100px] text-white 
                 py-10 sm:py-14 md:py-20 px-4 sm:px-8 md:px-16 
                 flex flex-col md:flex-row items-center justify-between gap-10 overflow-x-hidden"
    >
      {/* Left side slogan */}
      <div className="flex-1 text-center md:text-start">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
                     font-bold mb-4 leading-snug dark:text-[#0a0a0a]"
          data-aos="fade-right"
          data-aos-duration="3000"
        >
          {t("slogan")}
        </h1>

        <div className="flex justify-center md:justify-start">
          <button
            className="mt-4 px-5 sm:px-6 py-2.5 sm:py-3 
                       border-2 border-white rounded-full font-medium
                       hover:bg-white hover:text-blue-600 transition
                       dark:text-[#0a0a0a] dark:border-black dark:hover:bg-blue-600"
            data-aos="fade-right"
            data-aos-duration="3000"
          >
            {t("explore")}
          </button>
        </div>
      </div>

      {/* Right side image */}
      <div className="flex-1 flex justify-center md:justify-end">
        <Image
          src={heroImage}
          alt="Hero image"
          priority
          className="w-[250px] sm:w-[350px] md:w-[450px] lg:w-[500px] h-auto 
                     rounded-2xl shadow-lg"
          data-aos="fade-left"
          data-aos-duration="3000"
        />
      </div>
    </section>
  );
}