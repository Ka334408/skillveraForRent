"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Star, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

export default function RatingCard() {
  const { id } = useParams();
  const t = useTranslations("rating");
  const [rating, setRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/guest-facility/${id}`);
        // الوصول للقيمة "rate" من الـ Response الذي أرسلته سابقاً
        setRating(res.data.data?.rate || 0);
      } catch (err) {
        console.error("Error fetching rating:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRating();
  }, [id]);

  return (
    <div className="my-10 rounded-[2rem] p-8 text-center shadow-2xl shadow-[#0E766E]/5 bg-white dark:bg-zinc-900 border border-gray-50 dark:border-zinc-800 transition-all hover:scale-[1.02]">
      {loading ? (
        <div className="py-6 flex justify-center">
          <Loader2 className="animate-spin text-[#0E766E]" size={24} />
        </div>
      ) : (
        <>
          {/* عرض النجوم بناءً على الرقم */}
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={
                  i < Math.floor(rating || 0)
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-200 dark:text-zinc-700"
                }
              />
            ))}
          </div>

          <div className="flex flex-col items-center">
            <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              {rating?.toFixed(2)}
            </span>
            
            <div className="h-1.5 w-12 bg-[#0E766E] rounded-full my-4 opacity-20"></div>

            <h3 className="text-[#0E766E] font-bold text-lg">
              {t("title")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed max-w-[200px] mx-auto">
              {t("description")}
            </p>
          </div>
        </>
      )}
    </div>
  );
}