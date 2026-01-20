"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FaWhatsapp } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useUserStore } from "@/app/store/userStore";
import toast, { Toaster } from "react-hot-toast"; // استيراد التوست

export default function ContactFormSection() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const isRTL = locale === "ar";
  
  const { user } = useUserStore();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post("/user-contact-us", formData);
      
      toast.success(isRTL ? "تم إرسال رسالتك بنجاح!" : "Message sent successfully!", {
        style: {
          borderRadius: '15px',
          background: '#333',
          color: '#fff',
        },
      });

      setFormData((prev) => ({ ...prev, message: "", phone: "" })); 
    } catch (error) {
      toast.error(isRTL ? "حدث خطأ أثناء الإرسال" : "Error sending message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      className="py-16 px-6 container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10" 
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-white border-2 border-gray-100 p-8 rounded-[32px] shadow-xl shadow-gray-100/50">
        <div className={`mb-6 ${isRTL ? "text-right" : "text-left"}`}>
          <h2 className="text-2xl font-bold text-gray-800">{t("formTitle")}</h2>
          <p className="text-gray-500 text-sm mt-1">{t("formSubTitle")}</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
              {t("fullNameLabel")}
            </label>
            <input
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
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
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder={t("email")}
              className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent focus:border-[#0E766E] focus:bg-white rounded-2xl text-black transition-all outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
              {isRTL ? "رقم الهاتف" : "Phone Number"}
            </label>
            <input
              required
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="tel"
              placeholder="+966"
              className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent focus:border-[#0E766E] focus:bg-white rounded-2xl text-black transition-all outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
              {t("messageLabel")}
            </label>
            <textarea
              required
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t("message")}
              className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent focus:border-[#0E766E] focus:bg-white rounded-2xl text-black transition-all outline-none resize-none"
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-[#0E766E] text-white font-bold rounded-2xl py-4 mt-2 hover:bg-[#034843] shadow-lg transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t("sendButton")}
          </button>
        </form>
      </div>

      <div className="bg-[#0E766E] rounded-[32px] flex flex-col items-center justify-center p-12 text-center shadow-2xl">
        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6">
          <FaWhatsapp className="text-white text-6xl animate-pulse" />
        </div>
        <h3 className="text-white text-2xl font-bold mb-2">{t("whatsappTitle")}</h3>
        <p className="text-teal-50/80 text-sm max-w-xs mb-8">{t("whatsappDesc")}</p>
        <button 
         onClick={() => window.open('https://wa.me/966546223099', '_blank')}
        className="w-full md:w-auto bg-white px-10 py-4 rounded-2xl font-bold text-[#0E766E] hover:bg-teal-50 transition-all shadow-xl">
          {t("directChat")}
        </button>
      </div>
    </section>
  );
}