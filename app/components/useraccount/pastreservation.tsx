"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import axiosInstance from "@/lib/axiosInstance";

export default function Reservations() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);

  // Rating Popup
  const [showPopup, setShowPopup] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [rate, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const t = useTranslations("reservations");

  // Fetch reservations with pagination
  const fetchReservations = async (page: number) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/user-reservation", {
        params: { limit: 10, page },
      });

      setReservations(data?.data || []);
      setTotalPages(data?.totalPages || 1);
      setTotalData(data?.totalData || 0);
    } catch (err) {
      console.error(err);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations(page);
  }, [page]);

  // Open rating popup
  const openRatePopup = (r: any) => {
    setSelectedReservation(r);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setRating(0);
    setComment("");
  };

  // Submit rating
  const submitRating = async () => {
    if (!selectedReservation) return;

    try {
      await axiosInstance.post(
        `/user-rate/rate-reservation/${selectedReservation.id}`,
        { rate, comment }
      );

      // Optionally: refresh the table
      fetchReservations(page);

      closePopup();
    } catch (err) {
      console.error("Error rating reservation:", err);
    }
  };

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
          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-sm text-gray-600">
                  <th className="p-3">Facility ID</th>
                  <th className="p-3">Facility Name</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Rate</th>
                </tr>
              </thead>

              <tbody>
                {reservations.map((r, index) => {
                  const statusColors: any = {
                    PENDING: "bg-yellow-200 text-yellow-900",
                    APPROVED: "bg-green-200 text-green-900",
                    REJECTED: "bg-red-200 text-red-900",
                  };

                  return (
                    <tr
                      key={index}
                      className="border-b text-sm hover:bg-gray-50"
                    >
                      <td className="p-3">{r.facilityId}</td>
                      <td className="p-3">
                        {r.facility?.name?.ar || r.facility?.name?.en || "-"}
                      </td>
                      <td className="p-3">{r.totalAmount} EGP</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[r.status]
                            }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => openRatePopup(r)}
                          className="text-[#0E766E] underline font-medium hover:text-[#095F59]"
                        >
                          Rate Now
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
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

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Rate Facility
            </h2>

            {/* Stars */}
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-2xl cursor-pointer ${star <= rate
                    ? "text-yellow-400"
                    : "text-gray-300"
                    }`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              placeholder="Write your comment..."
              rows={4}
            />

            {/* Buttons */}
            <div className="flex justify-end mt-4 gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={closePopup}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-[#0E766E] text-white rounded-lg hover:bg-[#095F59]"
                onClick={submitRating}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}