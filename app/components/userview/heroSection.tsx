"use client";

import Image from "next/image";
import { Users, RefreshCw, CreditCard, Sparkles } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <section 
      dir={isRTL ? "rtl" : "ltr"}
      className="relative bg-[#f8f9f9] dark:bg-zinc-950 pt-16 pb-32 overflow-hidden rounded-bl-[60px] md:rounded-bl-[120px] border-b border-zinc-200 dark:border-white/5"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-6 text-center">
        <div 
          className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-4 py-2 rounded-full mb-8"
          data-aos="fade-down"
        >
          <Sparkles size={14} className="text-[#0E766E]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0E766E]">
            {isRTL ? "مرحباً بك في سكافا رينت" : "Welcome to Scava Rent"}
          </span>
        </div>

        <h1 
          className="mx-auto max-w-4xl text-3xl md:text-5xl font-bold text-[#0E766E] dark:text-emerald-400 mb-16 leading-[1.3] md:leading-[1.2] tracking-tight"
          data-aos="zoom-in"
        >
          {t("title")}
        </h1>

        <div className="relative inline-block mt-8 group" data-aos="fade-up" data-aos-delay="200">
          
          {/* الـ Image Container */}
          <div className="relative z-10 rounded-[2.5rem] p-2 bg-white dark:bg-zinc-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-zinc-200 dark:border-white/10 transition-transform duration-700 group-hover:scale-[1.02]">
            <Image
              src="/homehero.svg"
              alt="Modern Building"
              width={1000}
              height={600}
              priority
              className="rounded-[2rem] object-cover"
            />
          </div>

          {/* Floating Badges - مخفية افتراضياً وتظهر عند الـ Hover */}
          
          {/* Badge 1: Easy Process */}
          <div className="absolute -top-6 -left-4 md:-left-12 z-20 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-white/10 px-5 py-3 flex items-center gap-3 
              opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 animate-bounce-slow">
            <div className="bg-emerald-100 dark:bg-emerald-500/20 p-2 rounded-xl text-[#0E766E]">
              <RefreshCw size={18} />
            </div>
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{t("easy_process")}</span>
          </div>

          {/* Badge 2: Providers Count */}
          <div className="absolute top-1/4 -right-4 md:-right-16 z-20 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-white/10 px-5 py-3 flex items-center gap-3 
              opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-200 animate-float">
            <div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-xl text-blue-600">
              <Users size={18} />
            </div>
            <div className="text-right">
              <p className="text-base font-bold text-zinc-900 dark:text-white leading-none">1,260</p>
              <p className="text-[9px] font-medium text-zinc-500 uppercase tracking-tighter">{t("providers")}</p>
            </div>
          </div>

          {/* Badge 3: Payment */}
          <div className="absolute -bottom-8 right-10 md:right-20 z-20 bg-zinc-900 dark:bg-[#0E766E] rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-3 text-white
              opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-300">
            <CreditCard size={20} />
            <span className="text-sm font-bold tracking-tight">{t("pay_easily")}</span>
          </div>

        </div>
      </div>

      {/* Tailwind Custom Animations */}
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(8px); }
        }
        .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }
        .animate-float { animation: float 5s infinite ease-in-out; }
      `}</style>
    </section>
  );
}