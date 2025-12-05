"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import  axiosInstance  from "@/lib/axiosInstance"; // تأكد إن المسار صح

export default function Reservations() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);

  const t = useTranslations("reservations");

  const fetchReservations = async (page: number) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/api/user-reservation", {
        params: { limit: 10, page },
      });
      setReservations(data?.data || []);
      setTotalPages(data?.totalPages || 1);
      setTotalData(data?.totalData || 0);
    } catch (err) {
      console.error(err);
      setReservations([]);
      setTotalPages(1);
      setTotalData(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations(page);
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

      {reservations.length === 0 ? (
        <div className="flex flex-col justify-center items-center text-center py-12">
          <div className="text-[#0E766E] text-5xl mb-4">📅</div>
          <p className="text-gray-600 mb-4">{t("emptyMessage")}</p>
          <button className="bg-[#0E766E] text-white px-6 py-2 rounded-lg hover:bg-[#095F59]">
            {t("rentNow")}
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-sm text-gray-600">
                  <th className="p-3">{t("name")}</th>
                  <th className="p-3">{t("date")}</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r, index) => (
                  <tr key={index} className="border-b text-sm hover:bg-gray-50">
                    <td className="p-3">{r.name}</td>
                    <td className="p-3">
                      {new Date(r.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Circles لو العدد أكبر من 10 */}
          {totalData > 10 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition ${
                    page === num
                      ? "bg-[#0E766E] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}