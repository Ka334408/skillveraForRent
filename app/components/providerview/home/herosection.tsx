"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router= useRouter();
  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden rounded-br-[200px]">

      <Image
        src="/Home.png"
        alt="Modern home in the countryside"
        fill
        className="object-cover"
        priority
      />

      


      <div
        className="
          relative z-10 flex w-full px-6 md:px-24 
          flex-col md:flex-row items-center md:items-start 
          justify-between text-center md:text-left
          gap-10 md:gap-0
        "
      >
        <div className="text-[#12796f] md:mb-72 md:ml-20 mb-10 ">
          <h2 className="text-3xl md:text-5xl font-semibold leading-snug">
            Small living, <br className="hidden md:block" /> supersized.
          </h2>
        </div>

        <div className="flex flex-col items-center md:items-end space-y-4 mt-20">
          <h2 className="text-2xl md:text-5xl font-semibold text-[#32beb2]">
            List Your Facility <br className="hidden md:block" /> with skava now.
          </h2>
          <button
          onClick={()=>router.push("/providerRegistration")}
            className="
              inline-flex items-center gap-2 
              bg-white border border-gray-300 rounded-full 
              px-5 py-2 font-medium 
              hover:bg-gray-100 transition
            "
          >
            Register Now <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}