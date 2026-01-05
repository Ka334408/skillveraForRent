"use client";

import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ComposedChart,
  Bar,
  Line,
} from "recharts";
import { Bus, ShoppingBag, CreditCard } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useLocale, useTranslations } from "next-intl";

export default function CurrentMonthRevenue() {
  const [revenueData, setRevenueData] = useState<{ name: string, value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const locale = useLocale();
  const t = useTranslations("CurrentMonthRevenue");
  const isRTL = locale === "ar";

  // أسماء الأشهر للتحويل بناءً على اللغة
  const monthNames = [
    t("months.jan"), t("months.feb"), t("months.mar"), t("months.apr"),
    t("months.may"), t("months.jun"), t("months.jul"), t("months.aug"),
    t("months.sep"), t("months.oct"), t("months.nov"), t("months.dec")
  ];

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axiosInstance.get("/provider/revenue-per-month-chart");
        const data = res.data?.data || [];

        const chartData = data.map((item: any) => ({
          name: monthNames[item.month - 1] || "Unknown",
          value: item.totalRevenue,
        }));

        setRevenueData(chartData);
      } catch (err) {
        console.error("Failed to fetch revenue:", err);
        setRevenueData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [locale]); // تحديث عند تغيير اللغة

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5" dir={isRTL ? "rtl" : "ltr"}>
      {/* Card 1 - Calendar */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold">27 {t("months.may")}</h2>
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-start gap-2">
            <span className={`w-1 h-5 bg-[#0E766E] rounded ${isRTL ? 'ml-1' : ''}`} />
            <div>
              <p className="text-sm font-medium">{t("calendar.endDate")} #1222</p>
              <p className="text-xs text-gray-500" dir="ltr">01:00 PM – 02:00 PM</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className={`w-1 h-5 bg-[#0E766E] rounded ${isRTL ? 'ml-1' : ''}`} />
            <div>
              <p className="text-sm font-medium">{t("calendar.startDate")} #122</p>
              <p className="text-xs text-gray-500" dir="ltr">02:00 PM – 03:00 PM</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className={`w-1 h-5 bg-[#0E766E] rounded ${isRTL ? 'ml-1' : ''}`} />
            <div>
              <p className="text-sm font-medium">{t("calendar.endDate")} #122</p>
              <p className="text-xs text-gray-500" dir="ltr">03:00 PM – 04:00 PM</p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-[#0E766E] font-medium cursor-pointer">
          {t("calendar.openCalendar")}
        </p>
      </div>

      {/* Card 2 - Actions */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">{t("actions.title")}</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Bus className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium">{t("actions.transport")}</p>
              <p className="text-xs text-gray-500">22 {t("months.sep")} 2020</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium">{t("actions.grocery")}</p>
              <p className="text-xs text-gray-500">18 {t("months.sep")} 2020</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium">{t("actions.transport")}</p>
              <p className="text-xs text-gray-500">22 {t("months.sep")} 2020</p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-[#0E766E] font-medium cursor-pointer">
          {t("actions.viewAll")} {isRTL ? "←" : "→"}
        </p>
      </div>

      {/* Card 3 - Revenue Chart */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-sm text-gray-500">{t("revenue.title")}</h2>
        {loading ? (
          <p className="mt-2 text-gray-500">{t("loading")}</p>
        ) : (
          <>
            <p className="text-2xl font-bold mt-1">
              {revenueData.reduce((sum, item) => sum + item.value, 0).toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')} {t("currency")}
            </p>
            <p className="text-green-500 text-sm font-medium">{t("revenue.onTrack")}</p>
            <div className="mt-6 h-40">
              <ResponsiveContainer width="100%" height={150}>
                <ComposedChart data={revenueData}>
                  <XAxis 
                    dataKey="name" 
                    reversed={isRTL} 
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis orientation={isRTL ? "right" : "left"} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0E766E" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="value" stroke="#FF7F50" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}