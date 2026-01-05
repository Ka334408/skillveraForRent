"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { useLocale, useTranslations } from "next-intl";

interface RevenueData {
  month: number;
  totalRevenue: number;
}

export default function RevenueChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const locale = useLocale();
  const t = useTranslations("RevenueChart");
  const isRTL = locale === "ar";

  // قائمة الأشهر مترجمة
  const months = [
    { name: t("months.jan"), month: 1 },
    { name: t("months.feb"), month: 2 },
    { name: t("months.mar"), month: 3 },
    { name: t("months.apr"), month: 4 },
    { name: t("months.may"), month: 5 },
    { name: t("months.jun"), month: 6 },
    { name: t("months.jul"), month: 7 },
    { name: t("months.aug"), month: 8 },
    { name: t("months.sep"), month: 9 },
    { name: t("months.oct"), month: 10 },
    { name: t("months.nov"), month: 11 },
    { name: t("months.dec"), month: 12 },
  ];

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axiosInstance.get<{
          message: string;
          data: RevenueData[];
        }>("/provider/revenue-per-month-chart");

        const apiData = res.data.data;

        const chartData = months.map((m) => {
          const found = apiData.find((d) => d.month === m.month);
          return { name: m.name, value: found ? found.totalRevenue : 0 };
        });

        setData(chartData);
        setTotalRevenue(chartData.reduce((acc, curr) => acc + curr.value, 0));
      } catch (err) {
        console.error("Failed to fetch revenue:", err);
        const emptyData = months.map((m) => ({ name: m.name, value: 0 }));
        setData(emptyData);
        setTotalRevenue(0);
      }
    };

    fetchRevenue();
  }, [locale]); // إعادة الجلب عند تغيير اللغة لتحديث أسماء الأشهر

  return (
    <div className="bg-white rounded-2xl shadow p-6 flex-1" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-700">{t("title")}</h2>
          <p className="text-2xl font-bold text-gray-900">
            {totalRevenue.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')} {t("currency")}
          </p>
        </div>
      </div>

      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          {/* تم إضافة layout="horizontal" وعكس الترتيب في الـ RTL يتم تلقائياً بواسطة Recharts عند استخدام dir */}
          <BarChart data={data}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fontWeight: 500 }}
              reversed={isRTL} // عكس اتجاه المحور في حالة اللغة العربية
            />
            <YAxis hide reversed={isRTL} />
            <Tooltip 
              cursor={{ fill: "transparent" }} 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={totalRevenue > 100 ? "#0E766E" : "#dbeafe"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}