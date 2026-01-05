"use client";

import Image from "next/image";
import { Star, Calendar, ShieldCheck, Edit3, Loader2, ImageOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export default function ReservationCard() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("ReservationCard"); // تأكد من إضافة هذا القسم في ملفات الترجمة
  const isRTL = locale === "ar";
  const [reservation, setReservation] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("reservationData");
    if (stored) {
      setReservation(JSON.parse(stored));
    } else {
      router.push(`/${locale}/userview/allFacilities`);
    }
  }, [router, locale]);

  if (!reservation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[#0E766E]">
        <Loader2 className="animate-spin mb-4" size={40} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl shadow-[#0E766E]/5 p-6 md:p-8 w-full max-w-lg mx-auto border border-gray-50 dark:border-zinc-800" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* القسم العلوي: صورة ومعلومات المكان */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-3xl overflow-hidden shadow-lg flex-shrink-0 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
          {reservation.image ? (
            <Image 
              src={`${reservation.image}`} 
              alt={reservation.name[locale as 'en' | 'ar'] || reservation.name.en} 
              fill 
              className="object-cover" 
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <ImageOff size={32} strokeWidth={1.5} />
              <span className="text-[10px] mt-1 font-bold uppercase">{t("noPhoto")}</span>
            </div>
          )}
        </div>

        <div className="text-center sm:text-start pt-2">
          <span className="bg-[#0E766E]/10 text-[#0E766E] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-2 inline-block">
            {reservation.username || t("guest")}
          </span>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-2">
            {/* اختيار الاسم بناءً على اللغة */}
            {reservation.name[locale as 'en' | 'ar'] || reservation.name.en}
          </h2>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <div className="flex text-amber-400">
              <Star size={16} fill="currentColor" />
            </div>
            <span className="text-sm font-bold text-gray-500">5.0</span>
            <span className="text-xs text-gray-400">(120 {t("reviews")})</span>
          </div>
        </div>
      </div>

      {/* تفاصيل التواريخ */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 transition-all">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t("checkIn")}</p>
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
            <Calendar size={16} className="text-[#0E766E]" />
            <span className="text-sm">{reservation.start}</span>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 transition-all">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t("checkOut")}</p>
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
            <Calendar size={16} className="text-[#0E766E]" />
            <span className="text-sm">{reservation.end}</span>
          </div>
        </div>
      </div>

      {/* سياسة الإلغاء */}
      <div className="mt-6 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm mb-1">
          <ShieldCheck size={18} />
          <span>{t("freeCancellation")}</span>
        </div>
        <p className="text-[11px] text-emerald-600/80 dark:text-emerald-500/80 leading-relaxed">
          {t("cancelNotice")} <strong>20/11/2025</strong>. 
          <button className="underline mx-1 font-semibold">{t("viewPolicy")}</button>
        </p>
      </div>

      {/* تفاصيل السعر وزر التعديل */}
      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t("totalPayment")}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-[#0E766E]">{reservation.price}</span>
              <span className="text-xs font-bold text-gray-500 uppercase">{t("currency")}</span>
            </div>
          </div>
          
          <button
            onClick={() => router.push(`/${locale}/userview/allFacilities/${reservation.id}`)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-zinc-800 text-white rounded-2xl text-sm font-bold hover:bg-[#0E766E] transition-all active:scale-95 shadow-lg"
          >
            <Edit3 size={16} />
            <span>{t("change")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}