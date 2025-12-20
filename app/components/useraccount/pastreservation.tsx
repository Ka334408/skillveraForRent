"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import axiosInstance from "@/lib/axiosInstance";
import { Loader2, Calendar, Star, XCircle, ChevronLeft, ChevronRight, Clock, CreditCard } from "lucide-react";
import { toast } from "react-hot-toast";

type TabType = "UPCOMING" | "PAST";

export default function Reservations() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>("UPCOMING");

  // Rating Popup State
  const [showPopup, setShowPopup] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [rate, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const t = useTranslations("reservations");

  const fetchReservations = async (currentPage: number) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/user-reservation", {
        params: { limit: 10, page: currentPage },
      });
      setReservations(data?.data || []);
      setTotalPages(data?.totalPages || 1);
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

  const filteredReservations = useMemo(() => {
    const now = new Date();
    return reservations.filter((r) => {
      const endDate = new Date(r.endDate);
      return activeTab === "PAST" ? endDate < now : endDate >= now;
    });
  }, [reservations, activeTab]);

  const handleCancel = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      await axiosInstance.patch(`/user-reservation/cancel/${id}`);
      toast.success("Reservation cancelled");
      fetchReservations(page);
    } catch (err) {
      toast.error("Failed to cancel reservation");
    }
  };

  const submitRating = async () => {
    try {
      await axiosInstance.post(`/user-rate/rate-reservation/${selectedReservation.id}`, { rate, comment });
      toast.success("Rating submitted!");
      setShowPopup(false);
      setRating(0);
      setComment("");
      fetchReservations(page);
    } catch (err) {
      toast.error("Error submitting rating");
    }
  };

  return (
    <div className="w-full px-2 md:px-4 py-4">
      {/* HEADER & TABS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">{t("title")}</h1>
          <p className="text-gray-500 text-xs md:text-sm">Manage your facility bookings</p>
        </div>

        <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full lg:w-auto">
          <button
            onClick={() => { setActiveTab("UPCOMING"); setPage(1); }}
            className={`flex-1 lg:flex-none px-4 md:px-8 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${activeTab === "UPCOMING" ? "bg-white text-[#0E766E] shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
          >
            My Reservations
          </button>
          <button
            onClick={() => { setActiveTab("PAST"); setPage(1); }}
            className={`flex-1 lg:flex-none px-4 md:px-8 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${activeTab === "PAST" ? "bg-white text-[#0E766E] shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
          >
            Past History
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#0E766E]">
          <Loader2 className="animate-spin mb-2" size={32} />
          <p className="animate-pulse font-medium">{t("loading")}</p>
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-16 flex flex-col items-center px-4 text-center">
          <Calendar size={48} className="text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium italic">No {activeTab.toLowerCase()} reservations found.</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW (Visible md and up) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-gray-400 text-[10px] md:text-xs uppercase tracking-widest font-bold">
                  <th className="px-6 py-2 text-left">Facility</th>
                  <th className="px-6 py-2 text-left">Booking Dates</th>
                  <th className="px-6 py-2 text-center">Amount</th>
                  <th className="px-6 py-2 text-center">Status</th>
                  <th className="px-6 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((r) => (
                  <tr key={r.id} className="bg-white shadow-sm hover:shadow-md transition-shadow group">
                    <td className="px-6 py-5 rounded-l-3xl border-y border-l border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-[#0E766E] font-bold text-lg">
                          {r.facility?.name?.en?.charAt(0) || "F"}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm truncate max-w-[150px]">
                            {r.facility?.name?.en || "Facility"}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono">#{r.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 border-y border-gray-50">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                          <Calendar size={12} className="text-[#0E766E]" />
                          {new Date(r.startDate).toLocaleDateString("en-GB")}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          <Clock size={12} />
                          Ends: {new Date(r.endDate).toLocaleDateString("en-GB")}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 border-y border-gray-50 text-center">
                      <span className="font-bold text-gray-800">{r.totalAmount}</span>
                      <span className="text-[10px] text-gray-400 ml-1">EGP</span>
                    </td>
                    <td className="px-6 py-5 border-y border-gray-50 text-center">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-6 py-5 rounded-r-3xl border-y border-r border-gray-50 text-right">
                      <div className="flex justify-end items-center">
                        {activeTab === "PAST" ? (
                          <button
                            onClick={() => { setSelectedReservation(r); setShowPopup(true); }}
                            className="group relative overflow-hidden flex items-center justify-center gap-2 bg-[#0E766E] text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition-all hover:pr-8 active:scale-95 shadow-lg shadow-teal-100"
                          >
                            {/* Animated Icon */}
                            <Star size={14} className="fill-yellow-400 text-yellow-400 transition-transform group-hover:rotate-[20deg]" />
                            <span>Rate Visit</span>

                            {/* Hidden Arrow that appears on hover */}
                            <span className="absolute right-2 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0 translate-x-4">
                              →
                            </span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleCancel(r.id)}
                            className="flex items-center justify-center gap-2 bg-white text-red-500 border border-red-100 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-95 shadow-sm"
                          >
                            <XCircle size={14} className="transition-transform group-hover:scale-110" />
                            <span>Cancel</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE LIST VIEW (Visible on small screens) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredReservations.map((r) => (
              <div key={r.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#0E766E] font-bold">
                      {r.facility?.name?.en?.charAt(0) || "F"}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">{r.facility?.name?.en}</h3>
                      <p className="text-[10px] text-gray-400 uppercase tracking-tight">ID: {r.id}</p>
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 py-3 border-y border-gray-50 border-dashed">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Start Date</span>
                    <span className="text-xs font-semibold text-gray-700">{new Date(r.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Total Amount</span>
                    <span className="text-xs font-bold text-[#0E766E]">{r.totalAmount} EGP</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {activeTab === "PAST" ? (
                    <button onClick={() => { setSelectedReservation(r); setShowPopup(true); }} className="mobile-btn-rate">
                      Rate this Experience
                    </button>
                  ) : (
                    <button onClick={() => handleCancel(r.id)} className="mobile-btn-cancel">
                      Cancel Reservation
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="pag-btn"><ChevronLeft size={18} /></button>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Page {page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="pag-btn"><ChevronRight size={18} /></button>
            </div>
          )}
        </>
      )}

      {/* RATING POPUP (MODAL) - Redesigned for mobile as well */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-end md:items-center z-[100] p-0 md:p-4">
          <div className="bg-white w-full max-w-md p-6 md:p-8 rounded-t-[32px] md:rounded-3xl shadow-2xl animate-in slide-in-from-bottom md:zoom-in duration-300">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6 md:hidden"></div>
            <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 text-center">Share your Feedback</h2>
            <p className="text-gray-500 text-xs md:text-sm text-center mb-6 px-4">How was your stay at {selectedReservation?.facility?.name?.en}?</p>

            <div className="flex justify-center gap-2 md:gap-3 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-4xl md:text-5xl transition-all hover:scale-110 active:scale-90 ${star <= rate ? "text-yellow-400 scale-105" : "text-gray-100"}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border-none bg-gray-50 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#0E766E] outline-none transition-all"
              placeholder="What did you like or dislike?..."
              rows={4}
            />

            <div className="flex flex-col md:flex-row gap-3 mt-8">
              <button
                className="order-2 md:order-1 flex-1 py-3 text-gray-400 font-bold hover:bg-gray-50 rounded-2xl transition-all"
                onClick={() => setShowPopup(false)}
              >
                Maybe Later
              </button>
              <button
                disabled={rate === 0}
                className="order-1 md:order-2 flex-[2] py-4 bg-[#0E766E] text-white rounded-2xl font-bold shadow-lg shadow-teal-100 hover:bg-[#095F59] disabled:opacity-50 transition-all"
                onClick={submitRating}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tailwind Specific Scoped Styles for common classes */}
      <style jsx>{`
        .btn-rate { @apply flex items-center gap-2 ml-auto bg-teal-50 text-[#0E766E] px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#0E766E] hover:text-white transition-all shadow-sm; }
        .btn-cancel { @apply flex items-center gap-2 ml-auto bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm; }
        .mobile-btn-rate { @apply flex-1 py-3 bg-[#0E766E] text-white rounded-xl text-xs font-bold shadow-md shadow-teal-50 text-center; }
        .mobile-btn-cancel { @apply flex-1 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold text-center; }
        .pag-btn { @apply p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-20 transition-all shadow-sm; }
      `}</style>
    </div>
  );
}

// Sub-component for Status Badge to reduce repetition
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    APPROVED: "bg-green-50 text-green-600 border-green-100",
    PENDING: "bg-amber-50 text-amber-600 border-amber-100",
    CANCELLED: "bg-red-50 text-red-600 border-red-100",
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-tight ${styles[status] || "bg-gray-50 text-gray-500"}`}>
      {status}
    </span>
  );
};