"use client";

import { useTranslations, useLocale } from "next-intl";
import { MessageSquare, Send, Check } from "lucide-react";

export default function ContactSection() {
  const t = useTranslations("contactUs");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    // تقليل py-20 إلى py-12 لتقليل المساحة الرأسية للسكشن
    <section className="py-12 dark:bg-[#0a0a0a] transition-colors" dir={isRTL ? "rtl" : "ltr"}>
      {/* تصغير الحاوية من max-w-6xl إلى max-w-5xl */}
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header Section - تقليل الهوامش السفلى mb-16 إلى mb-10 */}
        <div className={`flex flex-col mb-10 space-y-3 ${isRTL ? "text-right" : "text-left"} md:text-center`}>
          <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
            {t("mainTitle") || "Contact Our Team"}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-xl md:mx-auto leading-relaxed text-xs md:text-sm">
            {t("description") || "Contact us via whatsapp or email message for more information and support."}
          </p>
        </div>

        {/* Contact Cards Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Left Card: Form - تقليل الـ padding من p-12 إلى p-8 */}
          <div className="bg-[#117a72] rounded-[2rem] p-6 md:p-9 shadow-xl shadow-[#117a72]/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Send size={80} className={isRTL ? "-rotate-45" : "rotate-45"} />
            </div>

            <form className="relative z-10 space-y-4">
              <div className="space-y-1">
                <input 
                  type="text" 
                  placeholder={t("fullName") || "Full Name"} 
                  className={`w-full bg-transparent border-2 border-white/20 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/50 focus:border-white focus:outline-none transition-all ${isRTL ? "text-right" : "text-left"}`}
                />
              </div>
              <div className="space-y-1">
                <input 
                  type="email" 
                  placeholder={t("email") || "Email"} 
                  className={`w-full bg-transparent border-2 border-white/20 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/50 focus:border-white focus:outline-none transition-all ${isRTL ? "text-right" : "text-left"}`}
                />
              </div>
              <div className="space-y-1">
                <textarea 
                  placeholder={t("message") || "Your message"} 
                  rows={2}
                  className={`w-full bg-transparent border-2 border-white/20 rounded-[1.5rem] px-5 py-3 text-sm text-white placeholder:text-white/50 focus:border-white focus:outline-none transition-all resize-none ${isRTL ? "text-right" : "text-left"}`}
                />
              </div>

              <div className="flex items-start gap-3 px-1 pt-1">
                <div className="relative flex items-center h-5">
                    <input 
                        type="checkbox" 
                        id="agree" 
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-white/30 transition-all checked:bg-white"
                    />
                    <Check className="absolute h-3 w-3 text-[#117a72] opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity" />
                </div>
                <label htmlFor="agree" className="text-white/70 text-[11px] md:text-xs cursor-pointer select-none leading-snug">
                  {t("terms") || "I agree to the Terms of Service and Privacy Policy."}
                </label>
              </div>

              <div className={`pt-2 ${isRTL ? "text-right" : "text-left"}`}>
                <button className="px-10 py-3 bg-white text-[#117a72] rounded-full text-sm font-bold hover:bg-[#0a5d56] hover:text-white transition-all duration-300 shadow-lg active:scale-95">
                  {t("sendButton") || "Contact Us"}
                </button>
              </div>
            </form>
          </div>

          {/* Right Card: Direct Chat - تقليل padding وصورة الـ SVG */}
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] p-6 md:p-9 flex flex-col items-center justify-between text-center border border-zinc-200 dark:border-white/5">
            <div className="flex-grow flex items-center justify-center py-4">
              {/* تصغير حجم الـ SVG من w-72 إلى w-48 */}
              <div className="w-40 h-40 md:w-48 md:h-48">
                 <svg viewBox="0 0 24 24" className="w-full h-full text-[#117a72] opacity-80" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <path d="M8 9h8"></path>
                    <path d="M8 13h6"></path>
                 </svg>
              </div>
            </div>

            <div className="w-full space-y-3">
                <p className="text-zinc-500 text-xs font-medium">
                    {t("chatSubtext") || "Prefer real-time conversation?"}
                </p>
                <button className="w-full max-w-[260px] mx-auto py-3 border-2 border-[#117a72] text-[#117a72] rounded-xl text-sm font-black hover:bg-[#117a72] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group">
                    <MessageSquare size={18} className="group-hover:animate-bounce" />
                    {t("chatButton") || "Direct chat"}
                </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}