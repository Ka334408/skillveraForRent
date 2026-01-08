"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Star, DollarSign } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface Reservation {
  id: number;
  updatedAt: string;
  facilityId: number;
  facility: {
    id: number;
    name: { en: string; ar: string }; // تحديث لدعم اللغتين
    rate: number;
  };
  rate: number | null;
}

interface FacilityRating {
  id: number;
  name: string;
  rate: number;
  reservationId: number;
}

export default function FinancialSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratedFacilities, setRatedFacilities] = useState<FacilityRating[]>([]);

  const locale = useLocale();
  const t = useTranslations("FinancialSection");
  const isRTL = locale === "ar";

  useEffect(() => {
    const fetchRatedFacilities = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosInstance.get("/provider/recent-reservations", {
          withCredentials: true,
          params: { limit: 50 }
        });

        const data: Reservation[] = res.data?.data || [];

        const ratedReservations = data.filter(r =>
          r.facility && r.facility.rate !== undefined && r.facility.rate !== null && r.facility.rate > 0
        );

        const processedRatings: FacilityRating[] = ratedReservations.map(r => ({
          id: r.facility.id,
          name: r.facility.name[locale as 'en' | 'ar'] || r.facility.name.en, // اختيار الاسم بناءً على اللغة
          rate: r.facility.rate,
          reservationId: r.id,
        }));

        const facilityMap = new Map<number, FacilityRating>();
        for (const item of processedRatings) {
          if (!facilityMap.has(item.id)) {
            facilityMap.set(item.id, item);
          }
        }

        setRatedFacilities(Array.from(facilityMap.values()).slice(0, 10));

      } catch (err: any) {
        setError(t("errorMsg"));
      } finally {
        setLoading(false);
      }
    };

    fetchRatedFacilities();
  }, [locale, t]);

  const StarRating = ({ rate }: { rate: number }) => {
    const fullStars = Math.round(rate);
    const stars = Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < fullStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
    return <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-0.5' : 'space-x-0.5'}`}>{stars}</div>;
  };

  const FeedbackContent = () => {
    if (loading) return <div className="text-center text-gray-500 py-4">{t("loading")}</div>;
    if (error) return <div className="text-center text-red-600 font-medium py-4">{error}</div>;
    if (ratedFacilities.length === 0) return <div className="text-center text-gray-500 py-4">{t("noRatings")}</div>;

    return (
      <div className="space-y-4 max-h-[150px] overflow-y-auto pr-2">
        {ratedFacilities.map((item) => (
          <div key={item.id} className="flex flex-col border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
            <div className="flex items-center justify-between">
              <span className="bg-[#0E766E] text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                ID: {item.id}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-md font-extrabold text-teal-700">{item.rate.toFixed(1)}</span>
                <StarRating rate={item.rate} />
              </div>
            </div>
            <span className="text-gray-700 text-sm mt-1 font-semibold line-clamp-1">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="w-full bg-gray-50 py-12 px-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

        {/* Left side */}
        <div className="space-y-6">
          <h2 className="text-4xl font-extrabold text-[#0E766E] leading-snug">
            {t("mainTitle")}
          </h2>
          <p className="text-lg text-gray-600">
            {t("description")}
          </p>
          <button className="px-8 py-3 bg-[#0E766E] text-white font-semibold rounded-xl shadow-lg hover:bg-[#075d55] transition transform hover:scale-[1.02]">
           <img src="/real.svg" alt="Finance Icon" className="inline w-5 h-5 rtl:ml-4 ltr:mr-4 -mt-1" />
            {t("buttonText")}
          </button>
        </div>

        {/* Middle */}
        <div className="flex justify-center">
          <div className="relative w-72 h-44 group cursor-pointer">
            <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#0E766E] to-indigo-400 rounded-xl shadow-2xl transform transition-transform duration-500 ${isRTL ? '-rotate-6 group-hover:rotate-3 group-hover:-translate-x-2' : 'rotate-6 group-hover:-rotate-3 group-hover:translate-x-2'}`}></div>
            <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-2xl flex flex-col justify-center px-6 text-white font-semibold transform transition-transform duration-500 ${isRTL ? 'group-hover:-rotate-6 group-hover:translate-x-2' : 'group-hover:rotate-6 group-hover:-translate-x-2'}`}>
              <span className="text-lg font-bold">{t("cardTitle")}</span>
              <span className="text-2xl tracking-widest mt-2" dir="ltr">XXXX XXXX XXXX 7812</span>
              <div className="flex justify-between text-sm mt-4 font-medium">
                <span>{t("balanceLabel")}: $XX,XXX</span>
                <span>{t("expiryLabel")}: 05/24</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="bg-white rounded-xl shadow-xl p-6 space-y-4 border-t-4 border-[#0E766E] min-h-[250px] flex flex-col justify-start">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
            {t("ratingHeader")} <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          </h3>
          <FeedbackContent />
        </div>
      </div>
    </section>
  );
}