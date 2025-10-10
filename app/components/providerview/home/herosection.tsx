"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden rounded-br-[200px]">
      {/* 🖼 الخلفية */}
      <Image
        src="/Home.png" // غيّر المسار حسب صورتك
        alt="Modern home in the countryside"
        fill
        className="object-cover"
        priority
      />

      

      {/* 💬 المحتوى */}
      <div
        className="
          relative z-10 flex w-full px-6 md:px-24 
          flex-col md:flex-row items-center md:items-start 
          justify-between text-center md:text-left
          gap-10 md:gap-0
        "
      >
        {/* النص الشمال */}
        <div className="text-black md:mt-16">
          <h2 className="text-3xl md:text-5xl font-semibold leading-snug">
            Small living, <br className="hidden md:block" /> supersized.
          </h2>
        </div>

        {/* النص اليمين */}
        <div className="flex flex-col items-center md:items-end space-y-4">
          <h2 className="text-2xl md:text-5xl font-semibold">
            List Your Facility <br className="hidden md:block" /> with skava now.
          </h2>
          <button
            className="
              inline-flex items-center gap-2 
              bg-white border border-gray-300 rounded-full 
              px-5 py-2 font-medium 
              hover:bg-gray-100 transition
            "
          >
            Learn more <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}