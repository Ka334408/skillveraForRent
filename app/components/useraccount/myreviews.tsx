"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import axiosInstance from "@/lib/axiosInstance";
import { Loader2, MessageSquare, Star, ChevronLeft, ChevronRight, Calendar, User } from "lucide-react";

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);

  const t = useTranslations("reviews");

  const fetchReviews = async (currentPage: number) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/user-rate", {
        params: { limit: 10, page: currentPage },
      });
      setReviews(data?.data || []);
      setTotalPages(data?.totalPages || 1);
      setTotalData(data?.totalData || 0);
    } catch (err) {
      console.error(err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-[#0E766E]">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p className="animate-pulse font-medium">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-2 md:px-4 py-4">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">{t("title")}</h1>
        <p className="text-gray-500 text-xs md:text-sm">Everything you&apos;ve shared about your visits</p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 flex flex-col items-center text-center px-4">
          <MessageSquare size={48} className="text-gray-200 mb-4" />
          <p className="text-gray-600 font-medium">{t("emptyMessage")}</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-4">
              <thead>
                <tr className="text-gray-400 text-sm uppercase tracking-wider">
                  <th className="px-6 py-2 font-medium text-left">Facility</th>
                  <th className="px-6 py-2 font-medium text-left">Rating & Feedback</th>
                  <th className="px-6 py-2 font-medium text-right">Posted On</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r, index) => (
                  <tr key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow group">
                    <td className="px-6 py-5 rounded-l-2xl border-y border-l border-gray-50">
                      <div className="flex items-center gap-4">
                        <FacilityAvatar facility={r.facility} />
                        <div>
                          <p className="font-bold text-gray-800 text-sm">
                            {r.facility?.name?.en || r.facility?.name?.ar || "Facility"}
                          </p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-tight">Verified Stay</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 border-y border-gray-50">
                      <div className="flex flex-col gap-1.5">
                        <StarRating rate={r.rate} />
                        <p className="text-gray-600 text-sm leading-relaxed max-w-md italic">
                          &quot;{r.comment || "No written feedback provided."}&quot;
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 rounded-r-2xl border-y border-r border-gray-50 text-right">
                      <DateDisplay date={r.createdAt} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {reviews.map((r, index) => (
              <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FacilityAvatar facility={r.facility} />
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{r.facility?.name?.en || "Facility"}</p>
                      <DateDisplay date={r.createdAt} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <StarRating rate={r.rate} />
                  <p className="text-gray-600 text-sm leading-relaxed italic bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                    &quot;{r.comment || "No written feedback provided."}&quot;
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* RESPONSIVE PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 md:gap-4 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2.5 md:p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              
              <div className="flex gap-1.5 md:gap-2">
                {/* Logic to show limited pages on very small screens could be added here */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-xl text-xs md:text-sm font-bold transition-all ${
                      page === num
                        ? "bg-[#0E766E] text-white shadow-lg shadow-teal-100"
                        : "text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2.5 md:p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** * UI REUSABLE SUB-COMPONENTS 
 * To keep the main return block clean and manageable
 */

const StarRating = ({ rate }: { rate: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={14}
        md-size={16}
        fill={star <= rate ? "#facc15" : "transparent"}
        className={star <= rate ? "text-yellow-400" : "text-gray-200"}
      />
    ))}
  </div>
);

const DateDisplay = ({ date }: { date: string }) => (
  <div className="flex items-center md:justify-end gap-2 text-gray-400 text-[11px] md:text-xs font-medium">
    <Calendar size={13} />
    {new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}
  </div>
);

const FacilityAvatar = ({ facility }: { facility: any }) => (
  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
    {facility?.cover ? (
      <img
        src={`/api/media?media=${facility.cover}`}
        alt="Cover"
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-[#0E766E] font-bold bg-teal-50 text-sm md:text-base">
        {facility?.name?.en?.charAt(0) || "F"}
      </div>
    )}
  </div>
);