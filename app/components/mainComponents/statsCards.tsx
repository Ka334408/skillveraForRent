"use client";

import { useEffect, useState } from "react";
import { Home, CalendarCheck, Wallet, BarChart3, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import axiosInstance from "@/lib/axiosInstance";
import { useLocale, useTranslations } from "next-intl";

export default function StatsCards() {
  const [stats, setStats] = useState({
    balance: "0",
    facilitiesCount: "0",
    reservationsCount: "0",
  });
  const [loading, setLoading] = useState(true);
  
  const locale = useLocale();
  const t = useTranslations("StatsCards");
  const isRTL = locale === "ar";

  useEffect(() => {
    const fetchAllStats = async () => {
  setLoading(true);
  try {
    const [balanceRes, facilitiesRes, reservationsRes] = await Promise.all([
      axiosInstance.get("/provider/balance"),
      axiosInstance.get("/provider-facility"),
      axiosInstance.get("/provider/recent-reservations")
    ]);

    // 1. معالجة الرصيد
    const balanceAmount = balanceRes.data?.data?.balance || balanceRes.data?.balance || 0;
    const formattedBalance = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
    }).format(balanceAmount);

    // 2. معالجة المرافق (بناءً على الريسبونس اللي بعته)
    // المسار هو res.data.data.total
    const facilitiesTotal = facilitiesRes.data?.data?.total || 0;

    // 3. معالجة الحجوزات الأخيرة (استخدام طول المصفوفة)
    const reservationsArray = reservationsRes.data?.data || [];
    const reservationsCount = Array.isArray(reservationsArray) ? reservationsArray.length : 0;

    setStats({
      balance: formattedBalance,
      facilitiesCount: facilitiesTotal.toString(), // هيعرض رقم 6
      reservationsCount: reservationsCount.toString(),
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
  } finally {
    setLoading(false);
  }
};

    fetchAllStats();
  }, [locale]);

  const statsData = [
    {
      id: 1,
      title: t("totalFacilities") || "Total Facilities", // تأكد من إضافة المفتاح في الـ JSON
      value: stats.facilitiesCount,
      change: "+2", 
      trend: "up",
      icon: Home, 
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      stroke: "#2563eb",
      chartData: [{ value: 10 }, { value: 15 }, { value: 12 }, { value: 20 }, { value: 25 }],
    },
    {
      id: 2,
      title: t("accountBalance"),
      value: stats.balance,
      change: t("live"),
      trend: "up",
      icon: Wallet, 
      iconColor: "text-teal-600",
      bgColor: "bg-teal-50",
      stroke: "#0e766e",
      chartData: [{ value: 10 }, { value: 20 }, { value: 15 }, { value: 40 }, { value: 35 }, { value: 50 }],
    },
    {
      id: 3,
      title: t("recentReservations") || "Recent Reservations",
      value: stats.reservationsCount,
      change: "New",
      trend: "up",
      icon: CalendarCheck,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
      stroke: "#9333ea",
      chartData: [{ value: 5 }, { value: 10 }, { value: 8 }, { value: 15 }, { value: 20 }],
    },
    
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full py-4" dir={isRTL ? "rtl" : "ltr"}>
      {statsData.map((item) => {
        const IconComponent = item.icon;

        return (
          <div
            key={item.id}
            className="relative bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${item.bgColor} flex items-center justify-center rounded-2xl transition-transform group-hover:scale-110 duration-300 p-2.5`}>
                <IconComponent className={`${item.iconColor} w-5 h-5`} />
              </div>
              
              <div className={`w-16 h-8 opacity-60 group-hover:opacity-100 transition-opacity ${isRTL ? 'scale-x-[-1]' : ''}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={item.chartData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={item.stroke}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                {item.title}
              </p>
              <div className="flex items-baseline gap-2">
                {loading ? (
                  <Loader2 className="animate-spin text-gray-300 w-5 h-5 mb-1" />
                ) : (
                  <h3 className="text-xl font-black text-gray-900 tracking-tight break-all">
                    {item.value}
                  </h3>
                )}
                <div className={`flex items-center text-[10px] font-bold ${
                  item.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {item.trend === 'up' ? <TrendingUp size={10} className={isRTL ? "ml-1" : "mr-1"}/> : <TrendingDown size={10} className={isRTL ? "ml-1" : "mr-1"}/>}
                  <span dir="ltr">{item.change}</span>
                </div>
              </div>
            </div>

            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity ${item.bgColor}`} />
          </div>
        );
      })}
    </div>
  );
}