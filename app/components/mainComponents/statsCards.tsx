"use client";

import { useEffect, useState } from "react";
import { Users, BarChart3, TrendingUp, TrendingDown, Target, Loader2 } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import axiosInstance from "@/lib/axiosInstance";
import { useLocale, useTranslations } from "next-intl";

export default function StatsCards() {
  const [balance, setBalance] = useState<string | number>("...");
  const [balanceLoading, setBalanceLoading] = useState(true);
  
  const locale = useLocale();
  const t = useTranslations("StatsCards");
  const isRTL = locale === "ar";

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axiosInstance.get("/provider/balance");
        const amount = res.data?.data?.balance || res.data?.balance || 0;
        
        setBalance(new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
          style: 'currency',
          currency: 'SAR',
        }).format(amount));
      } catch (err) {
        console.error("Balance fetch error:", err);
        setBalance("SAR 0.00");
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchBalance();
  }, [locale]);

  const statsData = [
    {
      id: 1,
      title: t("newClients"),
      value: "321",
      change: "+12.5%",
      trend: "up",
      icon: Users, 
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      stroke: "#2563eb",
      chartData: [{ value: 20 }, { value: 40 }, { value: 30 }, { value: 50 }, { value: 70 }, { value: 60 }],
    },
    {
      id: 2,
      title: t("accountBalance"),
      value: balance,
      change: t("live"),
      trend: "up",
      icon: "/real.svg", 
      iconColor: "text-teal-600",
      bgColor: "bg-teal-500",
      stroke: "#0e766e",
      chartData: [{ value: 10 }, { value: 20 }, { value: 15 }, { value: 40 }, { value: 35 }, { value: 50 }],
      isLoading: balanceLoading
    },
    {
      id: 3,
      title: t("activeUsers"),
      value: "1.2k",
      change: "-2.4%",
      trend: "down",
      icon: Target,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
      stroke: "#9333ea",
      chartData: [{ value: 15 }, { value: 25 }, { value: 20 }, { value: 30 }, { value: 50 }, { value: 40 }],
    },
    {
      id: 4,
      title: t("conversions"),
      value: "8.5%",
      change: "+4.1%",
      trend: "up",
      icon: BarChart3,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50",
      stroke: "#ea580c",
      chartData: [{ value: 5 }, { value: 15 }, { value: 10 }, { value: 20 }, { value: 18 }, { value: 25 }],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full py-4" dir={isRTL ? "rtl" : "ltr"}>
      {statsData.map((item) => {
        const IconComponent = item.icon;
        const isImage = typeof IconComponent === "string";

        return (
          <div
            key={item.id}
            className="relative bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${item.bgColor} flex items-center justify-center rounded-2xl transition-transform group-hover:scale-110 duration-300 p-2.5`}>
                {isImage ? (
                  <img src={IconComponent} alt="icon" className="w-full h-full object-cover" />
                ) : (
                  <IconComponent className={`${item.iconColor} w-5 h-5`} />
                )}
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
                {item.isLoading ? (
                  <Loader2 className="animate-spin text-gray-300 w-5 h-5 mb-1" />
                ) : (
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">
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