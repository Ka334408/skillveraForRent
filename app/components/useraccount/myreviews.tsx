"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import  axiosInstance  from "@/lib/axiosInstance"; // تأكد إن المسار صح

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const t = useTranslations("reviews");

  const fetchReviews = async (page: number) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/user-review", {
        params: { limit: 10, page },
      });

      setReviews(data?.data || []);
      setTotalPages(data?.totalPages || 1);
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
                  <th className="p-3">{t("review")}</th>
                  <th className="p-3">{t("date")}</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r, index) => (
                  <tr key={index} className="border-b text-sm hover:bg-gray-50">
                    <td className="p-3">{r.text}</td>
                    <td className="p-3">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg ${
                page === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#0E766E] text-white hover:bg-[#095F59]"
              }`}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg ${
                page === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#0E766E] text-white hover:bg-[#095F59]"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}