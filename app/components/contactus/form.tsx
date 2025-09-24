"use client";

import { useTranslations } from "next-intl";
import { FaWhatsapp } from "react-icons/fa";

export default function ContactFormSection() {
  const t = useTranslations("contact");

  return (
    <section className="py-12 px-6 container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* الفورم */}
      <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-md">
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder={t("fullName")}
            className="px-4 py-2 rounded-lg text-black"
          />
          <input
            type="email"
            placeholder={t("email")}
            className="px-4 py-2 rounded-lg text-black"
          />
          <textarea
            placeholder={t("message")}
            className="px-4 py-2 rounded-lg text-black"
            rows={3}
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="w-4 h-4" />
            {t("agree")}
          </label>
          <button
            type="submit"
            className="bg-white text-blue-600 font-semibold rounded-lg py-2 hover:bg-gray-100 transition"
          >
            {t("contactUs")}
          </button>
        </form>
      </div>

      {/* واتساب */}
      <div className="border-2 border-blue-600 rounded-2xl flex flex-col items-center justify-center p-6">
        <FaWhatsapp className="text-green-500 text-5xl mb-4" />
        <button className="border border-blue-600 px-4 py-2 rounded-lg font-semibold text-blue-600 hover:bg-blue-600 hover:text-white transition">
          {t("directChat")}
        </button>
      </div>
    </section>
  );
}