"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaDownload, FaTimes, FaCreditCard } from "react-icons/fa";
import { useUserStore } from "@/app/store/userStore";
import axiosInstance from "@/lib/axiosInstance";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Loader2, ShieldCheck, FileText, Lock, Calendar } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import toast, { Toaster } from "react-hot-toast";

export default function ReservationSteps() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("ReservationSteps");
  const isRTL = locale === "ar";
  const { token } = useUserStore();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentURL, setPaymentURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  const [reservationData, setReservationData] = useState<{
    id: string;
    start: string;
    end: string;
    price: string | number;
    username: string;
    name: { en: string; ar: string };
  } | null>(null);

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    if (token) setIsLoggedIn(true);
  }, [token]);

  useEffect(() => {
    const stored = localStorage.getItem("reservationData");
    if (stored) setReservationData(JSON.parse(stored));
    else router.push(`/${locale}/userview/allFacilities`);
  }, [router, locale]);

  const handleLoginRedirect = () => router.push(`/${locale}/auth/signUp`);

  const handlePaymentContinue = async () => {
    if (!isLoggedIn || !reservationData) return;
    try {
      setLoading(true);
      const { id, start, end } = reservationData;
      const { data } = await axiosInstance.post(
        `/user-facility/${id}/reserve`,
        { startDate: start, endDate: end },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.data.paymentUrl) {
        setPaymentURL(data.data.paymentUrl);
        setShowPaymentModal(true);
        setPaymentInitiated(true);
      } else {
        toast.error(t("paymentError"));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("reserveError"));
    } finally {
      setLoading(false);
    }
  };

  // --- دالة التحميل المعدلة لتصغير الخط في الـ PDF ---
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    
    try {
      setPdfLoading(true);
      const element = invoiceRef.current;
      
      // نقوم بتصغير حجم الخط مؤقتاً قبل التقاط الصورة
      const originalStyle = element.style.transform;
      element.style.transform = "scale(0.85)"; // تصغير المحتوى بنسبة 15%
      element.style.transformOrigin = "top center";

      const canvas = await html2canvas(element, {
        scale: 4, // رفع الجودة لتعويض التصغير
        useCORS: true, 
        backgroundColor: "#ffffff",
      });

      // إعادة التنسيق الأصلي للمودال بعد التصوير
      element.style.transform = originalStyle;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      // توسيط الصورة وتصغير حجمها قليلاً داخل الصفحة
      const margin = 10;
      const finalWidth = pdfWidth - (margin * 2);
      const finalHeight = (canvas.height * finalWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", margin, margin, finalWidth, finalHeight);
      pdf.save(`SKV-Invoice-${reservationData?.id}.pdf`);
      
      toast.success(t("downloadSuccess"));
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  if (!reservationData) {
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto text-[#0E766E]" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 py-6" dir={isRTL ? "rtl" : "ltr"}>
      <Toaster position="bottom-center" />

      {/* Steps List */}
      <div className="grid gap-4 max-w-3xl mx-auto px-4">
        {/* Step 1 */}
        <div className={`border transition-all rounded-[2rem] p-6 flex justify-between items-center ${isLoggedIn ? 'bg-white border-gray-100 shadow-sm' : 'bg-[#0E766E] text-white border-[#0E766E]'}`}>
          <div className="flex items-center gap-4 text-start">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${isLoggedIn ? 'bg-[#0E766E]/10 text-[#0E766E]' : 'bg-white/20 text-white'}`}>1</div>
            <div>
              <p className="font-black leading-tight">{t("step1Title")}</p>
              <p className="text-xs opacity-70">{t("step1Desc")}</p>
            </div>
          </div>
          {!isLoggedIn ? (
            <button onClick={handleLoginRedirect} className="bg-white text-[#0E766E] px-6 py-2 rounded-xl font-bold text-sm shadow-md">{t("loginBtn")}</button>
          ) : (
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500 text-white"><FaCheck /></div>
          )}
        </div>

        {/* Step 2 */}
        <div className={`border transition-all rounded-[2rem] p-6 flex justify-between items-center ${isLoggedIn && !paymentInitiated ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-white border-gray-100 opacity-80'}`}>
          <div className="flex items-center gap-4 text-start">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${isLoggedIn && !paymentInitiated ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
            <div>
              <p className={`font-black leading-tight ${isLoggedIn && !paymentInitiated ? 'text-white' : 'text-gray-900'}`}>{t("step2Title")}</p>
              <p className={`text-xs opacity-70 ${isLoggedIn && !paymentInitiated ? 'text-emerald-50' : 'text-gray-500'}`}>{t("step2Desc")}</p>
            </div>
          </div>
          {isLoggedIn && (
            paymentInitiated ? (
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500 text-white"><FaCheck /></div>
            ) : (
              <button onClick={handlePaymentContinue} disabled={loading} className="bg-white text-emerald-600 px-6 py-2 rounded-xl font-bold text-sm shadow-md flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={14} /> : <FaCreditCard size={14} />}
                <span>{loading ? t("processing") : t("paymentBtn")}</span>
              </button>
            )
          )}
        </div>

        {/* Step 3 */}
        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4 text-start">
            <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center font-black">3</div>
            <div>
              <p className="font-black text-gray-900 leading-tight">{t("step3Title")}</p>
              <p className="text-xs text-gray-500">{t("step3Desc")}</p>
            </div>
          </div>
          <button onClick={() => setShowInvoiceModal(true)} className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-[#0E766E] transition-all">
            <FileText size={16} />
            <span>{t("reviewBtn")}</span>
          </button>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[100] p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
            
            <div ref={invoiceRef} className="bg-white p-8 space-y-6 text-start">
              <div className="flex justify-between items-start border-b pb-6 border-gray-100">
                <div>
                  <div className="w-12 h-12 bg-[#0E766E] rounded-2xl flex items-center justify-center text-white mb-4">
                    <ShieldCheck size={28} />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 leading-tight tracking-tighter">INVOICE</h2>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">REF: #{reservationData.id}</p>
                </div>
                <div className="text-right">
                   <p className="text-sm font-bold text-[#0E766E]">SKV RENT</p>
                   <p className="text-[10px] text-gray-400 font-medium">Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Customer</p>
                  <p className="text-md font-bold text-gray-900 leading-tight">{reservationData.username}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Facility</p>
                  <p className="text-md font-bold text-gray-900 leading-tight">
                    {reservationData.name.en} <br/>
                    <span className="text-[12px] opacity-60 font-medium">{reservationData.name.ar}</span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#0E766E] border border-gray-100 shadow-sm"><Calendar size={14} /></div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase">Booking Period</span>
                  </div>
                  <span className="text-[12px] font-black text-gray-900 tracking-tight">{reservationData.start} — {reservationData.end}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-zinc-900 rounded-[1.5rem] text-white shadow-xl shadow-zinc-200">
                <div>
                  <p className="text-[9px] font-black opacity-60 uppercase tracking-widest">Total Due</p>
                  <p className="text-[10px] opacity-40">Inclusive of VAT</p>
                </div>
                <div className="text-right flex items-baseline gap-2">
                  <span className="text-3xl font-black">{reservationData.price}</span>
                  <span className="text-xs font-bold opacity-60">SAR / ر.س</span>
                </div>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="p-8 pt-2 flex gap-3">
              <button 
                onClick={handleDownloadPDF} 
                disabled={pdfLoading}
                className="flex-1 bg-red-500 text-white py-4 rounded-[1.2rem] shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center gap-3 font-bold text-md disabled:opacity-50"
              >
                {pdfLoading ? <Loader2 className="animate-spin" /> : <FaDownload />}
                <span>{pdfLoading ? "Generating..." : "Download PDF"}</span>
              </button>
              <button onClick={() => setShowInvoiceModal(false)} className="w-14 h-14 flex items-center justify-center rounded-[1.2rem] bg-gray-100 text-gray-400 hover:text-red-500 transition-colors">
                <FaTimes size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateway Iframe */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-[200] p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] w-full max-w-4xl h-[90vh] relative shadow-2xl overflow-hidden flex flex-col border border-white/20">
            <div className="p-5 flex justify-between items-center border-b border-gray-100 bg-white dark:bg-zinc-900 z-10">
              <div className="flex items-center gap-3 text-emerald-600">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center"><Lock size={18} /></div>
                <span className="font-black text-sm uppercase tracking-tighter">{t("secureGateway")}</span>
              </div>
              <button onClick={() => { setShowPaymentModal(false); setPaymentURL(""); }} className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-500 hover:text-red-600 rounded-xl transition-all font-bold text-sm">
                <span>{t("close")}</span>
                <FaTimes />
              </button>
            </div>
            <div className="flex-1 bg-gray-50">
              <iframe src={paymentURL} className="w-full h-full border-0" allow="payment" title="Payment Gateway" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}