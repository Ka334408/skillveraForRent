"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { 
  Loader2, 
  X
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useLocale, useTranslations } from "next-intl";

export default function CancellationRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const locale = useLocale();
  const t = useTranslations("CancellationRequests");
  const isRTL = locale === "ar";

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  const fetchRequests = async (currentPage: number) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/provider-reservation/cancellation-requests", {
        params: { limit: 10, page: currentPage },
      });
      setRequests(data?.data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      toast.error(t("messages.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(page);
  }, [page]);

  const openApproveModal = (req: any) => {
    setSelectedReq(req);
    setRefundAmount(req.totalAmount || 0); 
    setShowRefundModal(true);
  };

  const handleProcessRefund = async () => {
    if (refundAmount < 0) {
      toast.error(t("messages.negativeAmount"));
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.post(`/provider-reservation/${selectedReq.id}/process-refund`, {
        refundStatus: "APPROVED",
        refundAmount: Number(refundAmount)
      });
      
      toast.success(t("messages.success"));
      setShowRefundModal(false);
      fetchRequests(page);
    } catch (err: any) {
      toast.error(err.response?.data?.message || t("messages.processError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 py-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
        <p className="text-gray-500 text-sm">{t("subtitle")}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0E766E]" size={40} /></div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed p-20 text-center text-gray-400">
           {t("noRequests")}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-gray-400 text-xs uppercase font-bold">
                <th className={`px-6 py-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t("table.user")}</th>
                <th className={`px-6 py-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t("table.reason")}</th>
                <th className="px-6 py-2 text-center">{t("table.amountPaid")}</th>
                <th className={`px-6 py-2 ${isRTL ? 'text-left' : 'text-right'}`}>{t("table.action")}</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <td className={`px-6 py-5 border-y border-gray-50 ${isRTL ? 'rounded-r-3xl border-r' : 'rounded-l-3xl border-l'}`}>
                    <p className="font-bold text-gray-800">{req.user?.name || t("table.user")}</p>
                    <p className="text-[10px] text-[#0E766E] font-medium">{req.facility?.name?.[locale] || req.facility?.name?.en}</p>
                  </td>
                  <td className="px-6 py-5 border-y border-gray-50">
                    <p className="text-xs text-gray-500 italic truncate max-w-[200px]">
                      {req.cancellationReason || t("table.noReason")}
                    </p>
                  </td>
                  <td className="px-6 py-5 border-y border-gray-50 text-center font-bold">
                    {formatCurrency(req.totalAmount)}
                  </td>
                  <td className={`px-6 py-5 border-y border-gray-50 ${isRTL ? 'rounded-l-3xl border-l text-left' : 'rounded-r-3xl border-r text-right'}`}>
                    <button
                      onClick={() => openApproveModal(req)}
                      className="bg-[#0E766E] text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-[#0a5e57] transition-all"
                    >
                      {t("buttons.approveRefund")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showRefundModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[200] p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-800">{t("modal.title")}</h3>
              <button onClick={() => setShowRefundModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-6 p-4 bg-teal-50 rounded-2xl">
                <div>
                  <p className="text-[10px] uppercase font-bold text-teal-600">{t("modal.userPaid")}</p>
                  <p className="text-lg font-black text-gray-800">{formatCurrency(selectedReq?.totalAmount)}</p>
                </div>
              </div>

              <label className="block text-sm font-bold text-gray-700 mb-2">{t("modal.refundAmount")}</label>
              <div className="relative">
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className={`w-full bg-gray-50 border-2 border-transparent focus:border-[#0E766E] focus:bg-white rounded-2xl py-4 px-5 outline-none transition-all font-bold text-lg ${isRTL ? 'pl-12' : 'pr-12'}`}
                  placeholder="0.00"
                />
                <span className={`absolute top-1/2 -translate-y-1/2 font-bold text-gray-400 ${isRTL ? 'left-5' : 'right-5'}`}>
                  SAR
                </span>
              </div>
              <p className="mt-2 text-[11px] text-gray-400 italic" dangerouslySetInnerHTML={{ __html: t("modal.statusNote") }} />
            </div>

            <div className="p-6 bg-gray-50 flex gap-3">
              <button
                onClick={() => setShowRefundModal(false)}
                className="flex-1 py-3 font-bold text-gray-400 hover:text-gray-600 transition-colors"
              >
                {t("buttons.cancel")}
              </button>
              <button
                onClick={handleProcessRefund}
                disabled={isSubmitting}
                className="flex-[2] bg-[#0E766E] text-white py-4 rounded-2xl font-bold shadow-lg shadow-teal-100 hover:bg-[#0a5e57] disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : t("buttons.confirmApprove")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}