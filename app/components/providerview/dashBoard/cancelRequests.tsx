"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  User, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  X
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function CancellationRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal State
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequests = async (currentPage: number) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/provider-reservation/cancellation-requests", {
        params: { limit: 10, page: currentPage },
      });
      setRequests(data?.data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(page);
  }, [page]);

  const openApproveModal = (req: any) => {
    setSelectedReq(req);
    // Optional: Default the refund amount to the total reservation amount
    setRefundAmount(req.totalAmount || 0); 
    setShowRefundModal(true);
  };

  const handleProcessRefund = async () => {
    if (refundAmount < 0) {
      toast.error("Refund amount cannot be negative");
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.post(`/provider-reservation/${selectedReq.id}/process-refund`, {
        refundStatus: "APPROVED", // Automatically set to APPROVED on confirm
        refundAmount: Number(refundAmount)
      });
      
      toast.success("Refund processed and approved successfully");
      setShowRefundModal(false);
      fetchRequests(page);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to process refund");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Cancellation Requests</h1>
        <p className="text-gray-500 text-sm">Review user cancellations and process refunds</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0E766E]" size={40} /></div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed p-20 text-center text-gray-400">
           No pending requests found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-gray-400 text-xs uppercase font-bold">
                <th className="px-6 py-2 text-left">User</th>
                <th className="px-6 py-2 text-left">Reason</th>
                <th className="px-6 py-2 text-center">Amount Paid</th>
                <th className="px-6 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <td className="px-6 py-5 rounded-l-3xl border-y border-l border-gray-50">
                    <p className="font-bold text-gray-800">{req.user?.name || "User"}</p>
                    <p className="text-[10px] text-[#0E766E] font-medium">{req.facility?.name?.en}</p>
                  </td>
                  <td className="px-6 py-5 border-y border-gray-50">
                    <p className="text-xs text-gray-500 italic truncate max-w-[200px]">
                      {req.cancellationReason || "No reason"}
                    </p>
                  </td>
                  <td className="px-6 py-5 border-y border-gray-50 text-center font-bold">
                    {req.totalAmount} <span className="text-[10px] text-gray-400">SAR</span>
                  </td>
                  <td className="px-6 py-5 rounded-r-3xl border-y border-r border-gray-50 text-right">
                    <button
                      onClick={() => openApproveModal(req)}
                      className="bg-[#0E766E] text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-[#0a5e57] transition-all"
                    >
                      Approve & Refund
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* APPROVE & REFUND MODAL */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[200] p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-800">Process Refund</h3>
              <button onClick={() => setShowRefundModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-6 p-4 bg-teal-50 rounded-2xl">
                <div>
                  <p className="text-[10px] uppercase font-bold text-teal-600">User Paid</p>
                  <p className="text-lg font-black text-gray-800">{selectedReq?.totalAmount} SAR</p>
                </div>
              </div>

              <label className="block text-sm font-bold text-gray-700 mb-2">Refund Amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-[#0E766E] focus:bg-white rounded-2xl py-4 px-5 outline-none transition-all font-bold text-lg"
                  placeholder="0.00"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">SAR</span>
              </div>
              <p className="mt-2 text-[11px] text-gray-400 italic">
                The status will be updated to <span className="text-green-600 font-bold">APPROVED</span> upon confirmation.
              </p>
            </div>

            <div className="p-6 bg-gray-50 flex gap-3">
              <button
                onClick={() => setShowRefundModal(false)}
                className="flex-1 py-3 font-bold text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessRefund}
                disabled={isSubmitting}
                className="flex-[2] bg-[#0E766E] text-white py-4 rounded-2xl font-bold shadow-lg shadow-teal-100 hover:bg-[#0a5e57] disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Confirm & Approve"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}