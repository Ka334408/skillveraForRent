"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Quote, Star, MessageSquare, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import axiosInstance from "@/lib/axiosInstance";

interface Rate {
  id: number;
  rate: number;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    image: string | null;
  };
}

export default function ReviewsSlider() {
  const { id } = useParams();
  const locale = useLocale();
  const t = useTranslations("Reviews");
  const isRTL = locale === "ar";

  const [reviews, setReviews] = useState<Rate[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // جلب بيانات المرفق مباشرة باستخدام المعرف من الرابط
        const res = await axiosInstance.get(`/guest-facility/${id}`);
        // استخراج التقييمات من مسار data.rates بناءً على الـ Response الخاص بك
        setReviews(res.data.data?.rates || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReviews();
  }, [id]);

  const nextReview = () => setCurrent((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);

  // 1. حالة التحميل (Loading State)
  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-[#0E766E]">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  // 2. حالة عدم وجود تقييمات (Redesigned Empty State)
  if (reviews.length === 0) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-sm mx-auto relative group">
          {/* تأثير ضبابي خلفي */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E766E]/10 to-transparent blur-3xl -z-10 transform group-hover:scale-110 transition-transform duration-500"></div>
          
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[2.5rem] p-10 text-center shadow-sm relative overflow-hidden">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-[#0E766E]/5 rounded-full animate-ping"></div>
              <div className="relative bg-gradient-to-b from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 w-20 h-20 rounded-full flex items-center justify-center border border-gray-100 dark:border-zinc-700 shadow-inner">
                <MessageSquare className="text-[#0E766E] opacity-40" size={32} strokeWidth={1.5} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-gray-900 dark:text-white font-black text-xl tracking-tight">
                {t("noReviewsTitle")}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed px-4">
                {t("noReviewsDesc")}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 dark:border-zinc-800/50">
              <div className="flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-gray-200 dark:text-zinc-800" fill="currentColor" />
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-[0.2em] font-bold">
                {t("guest")} Experience
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentRate = reviews[current];

  // 3. عرض التقييمات (Main Slider)
  return (
    <section className="relative py-16 overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-xl mx-auto px-4 relative flex flex-col items-center">
        
        {/* أيقونة الاقتباس الخلفية */}
        <Quote
          className={`absolute text-[#0E766E]/5 w-32 h-32 md:w-48 md:h-48 -top-10 ${isRTL ? "right-4" : "left-4"} z-0`}
          fill="currentColor"
        />

        {/* الكارت المصغر والمتجاوب */}
        <div className="bg-white dark:bg-zinc-900 shadow-xl shadow-[#0E766E]/5 rounded-[2.5rem] w-full max-w-[400px] p-6 md:p-10 relative z-30 border border-gray-50 dark:border-zinc-800 transition-all">
          
          <div className="flex flex-col items-center mb-5">
            {/* صورة المستخدم */}
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-[#0E766E]/10 mb-3 shadow-inner bg-gray-50 flex items-center justify-center">
              {currentRate.user.image ? (
                <img 
                  src={`/api/media?media=${currentRate.user.image}`} 
                  alt={currentRate.user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-black text-[#0E766E] opacity-30">
                  {currentRate.user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            {/* النجوم */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className={i < currentRate.rate ? "text-amber-400 fill-amber-400" : "text-gray-100 dark:text-zinc-800"} 
                />
              ))}
            </div>
          </div>

          {/* نص التقييم */}
          <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg font-medium mb-8 leading-relaxed italic min-h-[80px] flex items-center justify-center text-center">
            "{currentRate.comment}"
          </p>
          
          <div className="mb-8 text-center">
            <h4 className="text-[#0E766E] font-black text-sm md:text-base uppercase tracking-wider">
              {currentRate.user.name}
            </h4>
            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
              {new Date(currentRate.createdAt).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* أزرار التنقل والتحكم */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={prevReview}
              className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 text-[#0E766E] hover:bg-[#0E766E] hover:text-white transition-all active:scale-90"
              aria-label="Previous review"
            >
              {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            
            {/* نقاط التنقل السريع */}
            <div className="flex gap-1.5 flex-wrap justify-center">
               {reviews.slice(0, 6).map((_, idx) => ( 
                 <button 
                   key={idx} 
                   onClick={() => setCurrent(idx)}
                   className={`h-1.5 rounded-full transition-all duration-300 ${idx === current ? "w-4 bg-[#0E766E]" : "w-1.5 bg-gray-200 dark:bg-zinc-700"}`}
                 />
               ))}
            </div>

            <button
              onClick={nextReview}
              className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 text-[#0E766E] hover:bg-[#0E766E] hover:text-white transition-all active:scale-90"
              aria-label="Next review"
            >
              {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}