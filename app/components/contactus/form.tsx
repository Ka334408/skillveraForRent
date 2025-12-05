"use client";

import { useTranslations } from "next-intl";
import { FaWhatsapp } from "react-icons/fa";

export default function ContactFormSection() {
  const t = useTranslations("contact");

  return (
    <section className="py-12 px-6 container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white border-2 border-[#0E766E]  text-[#0E766E] p-6 rounded-2xl shadow-md">
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder={t("fullName")}
            className="px-4 py-2 border-2 border-[#0E766E] rounded-xl text-black"
          />
          <input
            type="email"
            placeholder={t("email")}
            className="px-4 py-2 border-2 border-[#0E766E] rounded-xl  text-black"
          />
          <textarea
            placeholder={t("message")}
            className="px-4 py-2 border-2 border-[#0E766E] rounded-xl text-black"
            rows={3}
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="w-4 h-4" />
            {t("agree")}
          </label>
          <button
            type="submit"
            className="bg-[#0E766E] text-white font-semibold rounded-lg py-2 hover:bg-[#034843] transition"
          >
            {t("contactUs")}
          </button>
        </form>
      </div>

      <div className="bg-[#0E766E] border-2 border-[#0E766E] rounded-2xl flex flex-col items-center justify-center p-6">
        <FaWhatsapp className="text-white text-7xl mt-5 " />
        <button className=" bg-white mt-4 border border-[#0E766E] px-4 py-2 rounded-lg font-semibold text-[#0E766E] hover:bg-[#0E766E] hover:text-white transition">
          {t("directChat")}
        </button>
      </div>
    </section>
  );
}