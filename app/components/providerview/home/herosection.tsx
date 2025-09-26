"use client"
import { useLocale } from "next-intl";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeroSection() {
const router =useRouter();
const locale =useLocale();

  return (
    <section className="bg-blue-600 text-white py-16 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between rounded-tr-[70px] gap-8">
      {/* النص */}
      <div className="max-w-xl text-center md:text-left">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          List <br />
          <span className="text-blue-200">Your Facility</span>
          <br /> with skava now
        </h1>
        <button className="mt-8 px-8 py-3 text-lg border rounded-full hover:bg-white hover:text-blue-600 transition"
        onClick={()=>router.push(`/providerview/providerRegisteration`)}>
          Register Now
        </button>
      </div>

      {/* الصورة */}
      <div className="flex-shrink-0">
        <Image
          src="/herosec.png"
          alt="hero"
          width={500}
          height={350}
          className="rounded-xl border-2 border-transparent hover:border-blue-500 hover:scale-105 transition"
        />
      </div>
    </section>
  );
}