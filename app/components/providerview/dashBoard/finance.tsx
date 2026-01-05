"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axiosInstance";
import * as XLSX from "xlsx";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { 
  Wallet, TrendingUp, Calendar, 
  Loader2, History, CreditCard, FileSpreadsheet 
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function ProviderFinancePage() {
  const locale = useLocale();
  const t = useTranslations("Finance"); // استخدام سياق Finance
  const isRTL = locale === "ar";
  
  const [loading, setLoading] = useState(true);
  const [revenueStats, setRevenueStats] = useState([]);
  const [balance, setBalance] = useState(0);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setLoading(true);
        const [balRes, resRes, chartRes] = await Promise.all([
          api.get("/provider/balance"),
          api.get("/provider/recent-reservations"),
          api.get("/provider/revenue-per-month-chart")
        ]);

        setBalance(balRes.data?.data?.balance || 0);
        setReservations(Array.isArray(resRes.data?.data) ? resRes.data.data : []);

        const monthNames = isRTL 
          ? ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
          : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const formattedChartData = (chartRes.data?.data || []).map((item: any) => ({
          name: monthNames[item.month - 1] || `M${item.month}`,
          revenue: item.totalRevenue
        }));
        setRevenueStats(formattedChartData);
      } catch (error) {
        console.error("Finance Page Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFinanceData();
  }, [isRTL]);

  const handleExportExcel = () => {
    if (reservations.length === 0) return;

    // استخدام الترجمات داخل ملف الاكسل أيضاً
    const dataToExport = reservations.map((res: any) => ({
      [t("idLabel")]: res.id,
      [t("facilityLabel")]: isRTL ? res.facility?.name?.ar : res.facility?.name?.en,
      [t("dateLabel")]: new Date(res.createdAt).toLocaleDateString(isRTL ? "ar-EG" : "en-US"),
      [t("totalLabel")]: res.totalAmount,
      [t("profitLabel")]: res.providerRevenue,
      [t("statusLabel")]: res.status,
      [t("currencyLabel")]: res.paymentCurrency || "N/A"
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t("excelSheetName"));
    XLSX.writeFile(workbook, `Finance_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#FAFBFF]">
      <Loader2 className="animate-spin text-[#0E766E] mb-4" size={48} />
      <p className="text-gray-400 font-bold tracking-widest animate-pulse">{t("loading")}</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FDFDFF] p-6 md:p-12" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">{t("title")}</h1>
          <p className="text-gray-500 font-medium mt-2 italic">{t("subtitle")}</p>
        </div>
        <button 
          onClick={handleExportExcel}
          className="group flex items-center gap-3 bg-[#0E766E] text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-[#0E766E]/20 hover:bg-[#0A5D57] transition-all active:scale-95"
        >
          <FileSpreadsheet size={20} className="group-hover:rotate-12 transition-transform" />
          {t("exportBtn")}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Chart */}
          <section className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-gray-800">{t("chartTitle")}</h3>
              <div className="bg-emerald-50 text-[#0E766E] px-4 py-1.5 rounded-xl text-xs font-black">2026</div>
            </div>
            <div className="h-[350px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueStats}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0E766E" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#0E766E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 600}} />
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold'}} />
                  <Area type="monotone" dataKey="revenue" stroke="#0E766E" strokeWidth={4} fillOpacity={1} fill="url(#chartGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Balance Card */}
          <div className="bg-gradient-to-r from-[#0E766E] to-[#0A5D57] rounded-[3rem] p-10 text-white relative shadow-2xl shadow-[#0E766E]/30">
            <div className="relative z-10">
              <p className="text-white/70 font-bold mb-2 text-sm">{t("totalBalance")}</p>
              <h2 className="text-6xl font-black tracking-tighter mb-8 tabular-nums">
                ${balance.toLocaleString()}
              </h2>
              <div className="flex gap-4">
                <button className="bg-white text-[#0E766E] px-10 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-transform active:scale-95">
                  {t("withdrawBtn")}
                </button>
                <div className="hidden sm:flex items-center gap-2 bg-black/10 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <TrendingUp size={16} className="text-emerald-400" />
                  <span className="text-xs font-bold">{t("comparisonText", { percent: "+12%" })}</span>
                </div>
              </div>
            </div>
            <Wallet size={160} className="absolute -right-8 -bottom-8 opacity-10 rotate-12" />
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-gray-900">{t("recentActivity")}</h3>
              <History size={24} className="text-gray-200" />
            </div>

            <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[700px]">
              {reservations.length > 0 ? (
                reservations.map((res: any) => (
                  <div key={res.id} className="p-5 rounded-[2rem] bg-[#F8FAFC] border border-gray-50 hover:bg-white hover:border-emerald-100 hover:shadow-lg transition-all group">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#0E766E] group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <CreditCard size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ID: #{res.id}</p>
                          <h4 className="font-black text-[13px] text-gray-800 truncate leading-none">
                            {isRTL ? res.facility?.name?.ar : res.facility?.name?.en}
                          </h4>
                        </div>
                      </div>
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${
                        res.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {res.status}
                      </span>
                    </div>
                    <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                       <div className="text-gray-400 font-bold text-[11px] flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(res.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] text-gray-300 font-bold leading-none">{t("netProfit")}</p>
                          <p className="text-xl font-black text-emerald-600 mt-1 tracking-tighter">+${res.providerRevenue}</p>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 opacity-50 italic">
                   <p>{t("noData")}</p>
                </div>
              )}
            </div>
            <div className="mt-8 p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
               <p className="text-xs font-bold text-[#0E766E] leading-relaxed">{t("updateNote")}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}