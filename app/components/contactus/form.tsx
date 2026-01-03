"use client";

import { useLocale, useTranslations } from "next-intl";
import { FaWhatsapp } from "react-icons/fa";

export default function ContactFormSection() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <section 
      className="py-16 px-6 container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10" 
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* قسم النموذج (Form Side) */}
      <div className="bg-white border-2 border-gray-100 p-8 rounded-[32px] shadow-xl shadow-gray-100/50">
        <div className={`mb-6 ${isRTL ? "text-right" : "text-left"}`}>
          <h2 className="text-2xl font-bold text-gray-800">{t("formTitle")}</h2>
          <p className="text-gray-500 text-sm mt-1">{t("formSubTitle")}</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
              {t("fullNameLabel")}
            </label>
            <input
              type="text"
              placeholder={t("fullName")}
              className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent focus:border-[#0E766E] focus:bg-white rounded-2xl text-black transition-all outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
              {t("emailLabel")}
            </label>
            <input
              type="email"
              placeholder={t("email")}
              className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent focus:border-[#0E766E] focus:bg-white rounded-2xl text-black transition-all outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
              {t("messageLabel")}
            </label>
            <textarea
              placeholder={t("message")}
              className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent focus:border-[#0E766E] focus:bg-white rounded-2xl text-black transition-all outline-none resize-none"
              rows={4}
            />
          </div>

          <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer group mt-2">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded-lg border-2 border-gray-200 text-[#0E766E] focus:ring-[#0E766E]" 
            />
            <span className="group-hover:text-gray-800 transition-colors">
              {t("agree")}
            </span>
          </label>

          <button
            type="submit"
            className="bg-[#0E766E] text-white font-bold rounded-2xl py-4 mt-2 hover:bg-[#034843] shadow-lg shadow-teal-100 hover:shadow-teal-200 transition-all active:scale-[0.98]"
          >
            {t("sendButton")}
          </button>
        </form>
      </div>

      {/* قسم التواصل المباشر (WhatsApp Side) */}
      <div className="bg-[#0E766E] rounded-[32px] flex flex-col items-center justify-center p-12 text-center shadow-2xl shadow-teal-900/20">
        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6">
          <FaWhatsapp className="text-white text-6xl animate-pulse" />
        </div>
        
        <h3 className="text-white text-2xl font-bold mb-2">{t("whatsappTitle")}</h3>
        <p className="text-teal-50/80 text-sm max-w-xs mb-8">
          {t("whatsappDesc")}
        </p>
        
        <button className="w-full md:w-auto bg-white px-10 py-4 rounded-2xl font-bold text-[#0E766E] hover:bg-teal-50 transition-all shadow-xl active:scale-[0.98]">
          {t("directChat")}
        </button>
      </div>
    </section>
  );
}