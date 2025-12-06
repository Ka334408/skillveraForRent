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

// قائمة الأشهر
const months = [
  { name: "Jan", month: 1 },
  { name: "Feb", month: 2 },
  { name: "Mar", month: 3 },
  { name: "Apr", month: 4 },
  { name: "May", month: 5 },
  { name: "Jun", month: 6 },
  { name: "Jul", month: 7 },
  { name: "Aug", month: 8 },
  { name: "Sep", month: 9 },
  { name: "Oct", month: 10 },
  { name: "Nov", month: 11 },
  { name: "Dec", month: 12 },
];

interface RevenueData {
  month: number;
  totalRevenue: number;
}

export default function RevenueChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axiosInstance.get<{
          message: string;
          data: RevenueData[];
        }>("/provider/revenue-per-month-chart");

        const apiData = res.data.data;

        // دمج البيانات مع الأشهر لضمان ظهور كل الأشهر
        const chartData = months.map((m) => {
          const found = apiData.find((d) => d.month === m.month);
          return { name: m.name, value: found ? found.totalRevenue : 0 };
        });

        setData(chartData);

        const total = chartData.reduce((acc, curr) => acc + curr.value, 0);
        setTotalRevenue(total);
      } catch (err) {
        console.error("Failed to fetch revenue:", err);
        // إذا فشلنا في الجلب نملأ الأشهر بالـ 0
        const emptyData = months.map((m) => ({ name: m.name, value: 0 }));
        setData(emptyData);
        setTotalRevenue(0);
      }
    };

    fetchRevenue();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-6 flex-1">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Revenue</h2>
        <p className="  text-2xl font-bold">{totalRevenue.toLocaleString()} SR</p>
        </div>
      </div>

      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip cursor={{ fill: "" }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={totalRevenue>100 ? "#0E766E" : "#dbeafe"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}