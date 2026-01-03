"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl"; // تم إضافة useLocale
import axiosInstance from "@/lib/axiosInstance";
import { Loader2, Calendar, Star, XCircle, ChevronLeft, ChevronRight, Clock, Send } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";

type TabType = "UPCOMING" | "PAST";

export default function Reservations() {
  const t = useTranslations("Myreservations");
  const locale = useLocale();
  const isRTL = locale === "ar";
  
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>("UPCOMING");

  const [showPopup, setShowPopup] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [rate, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [isSubmitingCancel, setIsSubmitingCancel] = useState(false);

  const fetchReservations = async (currentPage: number) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/user-reservation", {
        params: { limit: 10, page: currentPage },
      });
      setReservations(data?.data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
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

  const openCancelModal = (id: string) => {
    setCancellingId(id);
    setShowCancelPopup(true);
  };

  const confirmCancellation = async () => {
    if (!cancelReason.trim()) {
      toast.error(t("cancelReasonRequired"));
      return;
    }
    setIsSubmitingCancel(true);
    try {
      await axiosInstance.post(`/user-reservation/${cancellingId}/cancel`, { reason: cancelReason });
      toast.success(t("cancelSuccess"));
      setShowCancelPopup(false);
      setCancelReason("");
      fetchReservations(page);
    } catch (err: any) {
      toast.error(err.response?.data?.message || t("cancelError"));
    } finally {
      setIsSubmitingCancel(false);
    }
  };

  const submitRating = async () => {
    try {
      await axiosInstance.post(`/user-rate/rate-reservation/${selectedReservation.id}`, { rate, comment });
      toast.success(t("rateSuccess"));
      setShowPopup(false);
      setRating(0);
      setComment("");
      fetchReservations(page);
    } catch (err: any) {
      toast.error(err.response?.data?.message || t("rateError"));
    }
  };

  return (
    <div className="w-full px-2 md:px-4 py-4" dir={isRTL ? "rtl" : "ltr"}>
      {/* HEADER & TABS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div className={isRTL ? "text-right" : "text-left"}>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">{t("mainTitle")}</h1>
          <p className="text-gray-500 text-xs md:text-sm font-medium italic">{t("subTitle")}</p>
        </div>

        <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full lg:w-auto">
          <button
            onClick={() => { setActiveTab("UPCOMING"); setPage(1); }}
            className={`flex-1 lg:flex-none px-4 md:px-8 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${activeTab === "UPCOMING" ? "bg-white text-[#0E766E] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t("tabUpcoming")}
          </button>
          <button
            onClick={() => { setActiveTab("PAST"); setPage(1); }}
            className={`flex-1 lg:flex-none px-4 md:px-8 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${activeTab === "PAST" ? "bg-white text-[#0E766E] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t("tabPast")}
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
          <p className="text-gray-500 font-medium italic">{t("noReservations")}</p>
        </div>
      ) : (
        <>
          {/* DESKTOP VIEW */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-gray-400 text-[10px] md:text-xs uppercase tracking-widest font-bold">
                  <th className={`px-6 py-2 ${isRTL ? "text-right" : "text-left"}`}>{t("colFacility")}</th>
                  <th className={`px-6 py-2 ${isRTL ? "text-right" : "text-left"}`}>{t("colDates")}</th>
                  <th className="px-6 py-2 text-center">{t("colAmount")}</th>
                  <th className="px-6 py-2 text-center">{t("colStatus")}</th>
                  <th className={`px-6 py-2 ${isRTL ? "text-right" : "text-right"}`}>{t("colAction")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((r) => (
                  <tr key={r.id} className="bg-white shadow-sm hover:shadow-md transition-shadow group">
                    <td className={`px-6 py-5 border-y border-gray-50 ${isRTL ? "rounded-r-3xl border-r" : "rounded-l-3xl border-l"}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                          {r.facility.cover ? (
                            <Image src={`/api/media?media=${r.facility.cover}`} alt="cover" width={48} height={48} className="object-cover w-full h-full" />
                          ) : (
                            <span className="text-[#0E766E] font-bold text-lg">{r.facility?.name?.[locale] || r.facility?.name?.en?.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm truncate max-w-[150px]">{r.facility?.name?.[locale] || r.facility?.name?.en}</p>
                          <p className="text-[10px] text-gray-400 font-mono">#{r.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 border-y border-gray-50">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                          <Calendar size={12} className="text-[#0E766E]" />
                          {new Date(r.startDate).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-GB')}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          <Clock size={12} />
                          {t("ends")}: {new Date(r.endDate).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-GB')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 border-y border-gray-50 text-center">
                      <span className="font-bold text-gray-800">{r.totalAmount}</span>
                      <span className={`text-[10px] text-gray-400 ${isRTL ? "mr-1" : "ml-1"}`}>{t("currency")}</span>
                    </td>
                    <td className="px-6 py-5 border-y border-gray-50 text-center">
                      <StatusBadge status={r.status} t={t} />
                    </td>
                    <td className={`px-6 py-5 border-y border-gray-50 ${isRTL ? "rounded-l-3xl border-l text-left" : "rounded-r-3xl border-r text-right"}`}>
                      <div className={`flex items-center ${isRTL ? "justify-start" : "justify-end"}`}>
                        {activeTab === "PAST" ? (
                          <button onClick={() => { setSelectedReservation(r); setShowPopup(true); }} className="group relative overflow-hidden flex items-center justify-center gap-2 bg-[#0E766E] text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition-all hover:pr-8 active:scale-95 shadow-lg shadow-teal-100">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            <span>{t("btnRate")}</span>
                          </button>
                        ) : (
                          <button disabled={r.status === 'CANCELLED'} onClick={() => openCancelModal(r.id)} className="flex items-center justify-center gap-2 bg-white text-red-500 border border-red-100 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all hover:bg-red-50 hover:border-red-500 active:scale-95 disabled:opacity-30">
                            <XCircle size={14} />
                            <span>{t("btnCancel")}</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW (نفس التعديلات لتدعم RTL) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredReservations.map((r) => (
              <div key={r.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#0E766E] font-bold">
                      {r.facility?.name?.[locale]?.charAt(0) || "F"}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">{r.facility?.name?.[locale] || r.facility?.name?.en}</h3>
                      <p className="text-[10px] text-gray-400 uppercase tracking-tight">{t("colId")}: {r.id}</p>
                    </div>
                  </div>
                  <StatusBadge status={r.status} t={t} />
                </div>
                <div className="grid grid-cols-2 gap-2 py-3 border-y border-gray-50 border-dashed">
                  <div className={`flex flex-col gap-1 ${isRTL ? "text-right" : "text-left"}`}>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">{t("colDates")}</span>
                    <span className="text-xs font-semibold text-gray-700">{new Date(r.startDate).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-GB')}</span>
                  </div>
                  <div className={`flex flex-col gap-1 ${isRTL ? "text-left" : "text-right"}`}>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">{t("colAmount")}</span>
                    <span className="text-xs font-bold text-[#0E766E]">{r.totalAmount} {t("currency")}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {activeTab === "PAST" ? (
                    <button onClick={() => { setSelectedReservation(r); setShowPopup(true); }} className="mobile-btn-rate flex-1 py-3 bg-[#0E766E] text-white rounded-xl text-xs font-bold">{t("btnRate")}</button>
                  ) : (
                    <button disabled={r.status === 'CANCELLED'} onClick={() => openCancelModal(r.id)} className="mobile-btn-cancel flex-1 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold disabled:opacity-30">{t("btnCancel")}</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="pag-btn">
                {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t("page")} {page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="pag-btn">
                {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>
          )}
        </>
      )}

      {/* CANCELLATION MODAL */}
      {showCancelPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-end md:items-center z-[110] p-0 md:p-4">
          <div className="bg-white w-full max-w-md p-6 md:p-8 rounded-t-[32px] md:rounded-3xl shadow-2xl">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6 md:hidden"></div>
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                <XCircle size={32} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center">{t("cancelTitle")}</h2>
              <p className="text-gray-500 text-xs md:text-sm text-center mt-2 px-6">{t("cancelSub")}</p>
            </div>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className={`w-full border-none bg-gray-50 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all ${isRTL ? "text-right" : "text-left"}`}
              placeholder={t("cancelPlaceholder")}
              rows={4}
            />
            <div className="flex flex-col md:flex-row gap-3 mt-8">
              <button className="order-2 md:order-1 flex-1 py-3 text-gray-400 font-bold hover:bg-gray-50 rounded-2xl transition-all" onClick={() => { setShowCancelPopup(false); setCancelReason(""); }}>{t("btnBack")}</button>
              <button disabled={!cancelReason.trim() || isSubmitingCancel} className="order-1 md:order-2 flex-[2] py-4 bg-red-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50" onClick={confirmCancellation}>
                {isSubmitingCancel ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} className={isRTL ? "rotate-180" : ""} /> {t("btnConfirm")}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RATING MODAL */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-end md:items-center z-[100] p-0 md:p-4">
          <div className="bg-white w-full max-w-md p-6 md:p-8 rounded-t-[32px] md:rounded-3xl shadow-2xl">
            <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 text-center">{t("rateTitle")}</h2>
            <div className="flex justify-center gap-2 mb-8" dir="ltr">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className={`text-4xl ${star <= rate ? "text-yellow-400" : "text-gray-100"}`}>★</button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={`w-full bg-gray-50 rounded-2xl p-4 text-sm outline-none ${isRTL ? "text-right" : "text-left"}`}
              placeholder={t("ratePlaceholder")}
              rows={4}
            />
            <div className="flex gap-3 mt-8">
              <button className="flex-1 py-3 text-gray-400 font-bold" onClick={() => setShowPopup(false)}>{t("btnLater")}</button>
              <button disabled={rate === 0} className="flex-[2] py-4 bg-[#0E766E] text-white rounded-2xl font-bold disabled:opacity-50" onClick={submitRating}>{t("btnSubmit")}</button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" containerStyle={{ zIndex: 9999 }} />
      <style jsx>{`
        .pag-btn { @apply p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-20 transition-all shadow-sm; }
      `}</style>
    </div>
  );
}

// StatusBadge Component with Translation Support
const StatusBadge = ({ status, t }: { status: string; t: any }) => {
  const styles: Record<string, string> = {
    APPROVED: "bg-green-50 text-green-600 border-green-100",
    PENDING: "bg-amber-50 text-amber-600 border-amber-100",
    FAILED: "bg-red-50 text-red-600 border-red-100",
    FAILD: "bg-red-50 text-red-600 border-red-100",
    CANCELLED: "bg-gray-100 text-gray-500 border-gray-200",
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-tight ${styles[status] || "bg-gray-50 text-gray-500"}`}>
      {t(`status_${status}`) || status}
    </span>
  );
};