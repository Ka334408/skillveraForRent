"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaDownload, FaTimes, FaCreditCard } from "react-icons/fa";
import { useUserStore } from "@/app/store/userStore";
import axiosInstance from "@/lib/axiosInstance";
import jsPDF from "jspdf";
import { Loader2, ShieldCheck, FileText, Lock, Calendar } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import toast, { Toaster } from "react-hot-toast";

export default function ReservationSteps() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("ReservationSteps");
  const isRTL = locale === "ar";
  const { token } = useUserStore();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentURL, setPaymentURL] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleDownloadPDF = () => {
    if (!reservationData) return;
    const doc = new jsPDF();
    const { id, start, end, price, username, name } = reservationData;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("INVOICE", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`ID: ${id}`, 20, 40);
    doc.text(`User: ${username}`, 20, 50);
    doc.text(`Facility: ${name[locale as 'en' | 'ar'] || name.en}`, 20, 60);
    doc.text(`Period: ${start} - ${end}`, 20, 70);
    doc.text(`Total Amount: ${price} SAR`, 20, 80);
    
    doc.save(`invoice_${id}.pdf`);
    toast.success(t("downloadSuccess"));
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
      <Toaster 
        position="bottom-center" 
        toastOptions={{
          style: {
            borderRadius: '1.5rem',
            background: '#18181b',
            color: '#fff',
            padding: '16px',
            fontWeight: 'bold'
          }
        }} 
      />

      <div className="text-start space-y-2 px-2">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          {t("title")}
        </h1>
        <p className="text-sm text-gray-500 font-medium">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 max-w-3xl">
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

      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[100] p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300" dir={isRTL ? "rtl" : "ltr"}>
            <div className="relative p-8 pb-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-start">
              <div className="text-start">
                <div className="w-12 h-12 bg-[#0E766E] rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-[#0E766E]/20">
                  <ShieldCheck size={28} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">{t("invoiceTitle")}</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">REF: #{reservationData.id}</p>
              </div>
              <button onClick={() => setShowInvoiceModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-zinc-800 text-gray-400 hover:text-red-500 transition-colors"><FaTimes /></button>
            </div>

            <div className="p-8 space-y-6 text-start">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{t("facilityName")}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{reservationData.name[locale as 'en' | 'ar'] || reservationData.name.en}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{t("userName")}</p>
                  <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{reservationData.username}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-700 flex items-center justify-center text-[#0E766E]"><Calendar size={16} /></div>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t("checkPeriod")}</span>
                    </div>
                    <span className="text-sm font-black text-gray-900 dark:text-white tracking-tighter">{reservationData.start} — {reservationData.end}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-gray-900 dark:bg-white rounded-[2rem] text-white dark:text-gray-900 shadow-xl">
                <div>
                  <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">{t("totalDue")}</p>
                  <p className="text-xs opacity-60">{t("inclusiveTax")}</p>
                </div>
                <div className="text-right flex items-baseline gap-2">
                  <span className="text-4xl font-black">{reservationData.price}</span>
                  <span className="text-sm font-bold opacity-70">{t("currency")}</span>
                </div>
              </div>

              <button onClick={handleDownloadPDF} className="w-full bg-red-500 text-white py-5 rounded-[1.5rem] shadow-lg shadow-red-500/20 hover:bg-red-600 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 font-black text-lg">
                <FaDownload /> <span>{t("downloadPdf")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-[200] p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] w-full max-w-4xl h-[90vh] relative shadow-2xl overflow-hidden flex flex-col border border-white/20">
            <div className="p-5 flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-10">
              <div className="flex items-center gap-3 text-emerald-600">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center"><Lock size={18} /></div>
                <span className="font-black text-sm uppercase tracking-tighter">{t("secureGateway")}</span>
              </div>
              <button onClick={() => { setShowPaymentModal(false); setPaymentURL(""); }} className="group flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-zinc-800 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-xl transition-all font-bold text-sm">
                <span>{t("close")}</span>
                <FaTimes />
              </button>
            </div>
            <div className="flex-1 bg-gray-50 relative">
              <iframe src={paymentURL} className="w-full h-full border-0" allow="payment" title="Payment Gateway" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}