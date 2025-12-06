"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import axiosInstance from "@/lib/axiosInstance";

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);

  const t = useTranslations("reviews");

  const fetchReviews = async (page: number) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/user-rate", {
        params: { limit: 10, page },
      });

      setReviews(data?.data || []);
      setTotalPages(data?.totalPages || 1);
      setTotalData(data?.totalData || 0);
    } catch (err) {
      console.error(err);
      setReviews([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <p className="text-gray-500">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-6 w-full">
      <h1 className="text-xl font-bold mb-6">{t("title")}</h1>

      {reviews.length === 0 ? (
        <div className="flex flex-col justify-center items-center text-center py-12">
          <div className="text-[#0E766E] text-5xl mb-4">💬</div>
          <p className="text-gray-600 mb-4">{t("emptyMessage")}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-sm text-gray-600">
                  <th className="p-3">Facility</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Comment</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {reviews.map((r, index) => (
                  <tr
                    key={index}
                    className="border-b text-sm hover:bg-gray-50"
                  >
                    {/* Facility: Image + Name */}
                    <td className="p-3 flex items-center gap-3">
                      {r.facility?.cover && (
                        <img
                          src={`/api/media?media=${r.facility.cover}`}
                          alt={r.facility?.name?.en || "Facility"}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                      )}
                      <span>{r.facility?.name?.en || "-"}</span>
                    </td>

                    {/* Rate */}
                    <td className="p-3">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-xl ${star <= r.rate ? "text-yellow-400" : "text-gray-300"
                              }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Comment */}
                    <td className="p-3">{r.comment || "-"}</td>

                    {/* Date */}
                    <td className="p-3">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalData > 10 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition ${page === num
                      ? "bg-[#0E766E] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                  >
                    {num}
                  </button>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}