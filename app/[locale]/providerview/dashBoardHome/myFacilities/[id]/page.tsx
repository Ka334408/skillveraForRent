"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { useLocale, useTranslations } from "next-intl";

import {
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    Tooltip,
    CartesianGrid,
    YAxis,
} from "recharts";

import { FaUsers, FaMoneyBillWave, FaStar, FaInfoCircle } from 'react-icons/fa';
import Topbar from "@/app/components/providerview/topBar";

// Custom Tooltip Component with Localization
const CustomTooltip = ({ active, payload, label, currency }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-md">
                <p className="text-gray-500 text-sm">{label}</p>
                <p className="font-bold text-teal-600">{`${payload[0].value.toFixed(2)} ${currency}`}</p>
            </div>
        );
    }
    return null;
};

// Enhanced Star Rating Component
const StarRating = ({ rate }: { rate: number }) => {
    const fullStars = Math.floor(rate);
    const hasHalfStar = rate % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex text-yellow-500 space-x-0.5" dir="ltr">
            {[...Array(fullStars)].map((_, i) => (
                <FaStar key={`full-${i}`} className="w-4 h-4" />
            ))}
            {hasHalfStar && <FaStar key="half" className="w-4 h-4" />}
            {[...Array(emptyStars)].map((_, i) => (
                <FaStar key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
            ))}
        </div>
    );
};

export default function FacilityDashboard() {
    const locale = useLocale();
    const t = useTranslations("FacilityDashboard");
    const isRTL = locale === "ar";

    const params = useParams();
    const facilityId = params.id;

    const [facility, setFacility] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [averageRate, setAverageRate] = useState(0);

    useEffect(() => {
        if (!facilityId) {
            setError(t("errors.missingId"));
            setLoading(false);
            return;
        }

        axiosInstance
            .get(`/provider-facility/${facilityId}`)
            .then((res) => {
                const data = res.data.data;
                setFacility(data);
                setError(null);

                if (data.feedbacks && data.feedbacks.length > 0) {
                    const totalRate = data.feedbacks.reduce((sum: number, fb: any) => sum + fb.rate, 0);
                    setAverageRate(totalRate / data.feedbacks.length);
                } else {
                    setAverageRate(0);
                }
            })
            .catch((err) => {
                console.error("API Error:", err);
                setError(t("errors.fetchFailed"));
            })
            .finally(() => setLoading(false));
    }, [facilityId, locale]);

    if (error) return (
        <div className="p-8 text-lg font-medium text-red-700 bg-red-50 rounded-lg border border-red-300" dir={isRTL ? "rtl" : "ltr"}>
            ❌ {t("errors.title")}: {error}
        </div>
    );

    if (loading) return <div className="p-8 text-lg font-medium text-teal-700" dir={isRTL ? "rtl" : "ltr"}>{t("loading")}</div>;

    if (!facility) return <div className="p-8 text-lg font-medium text-red-500" dir={isRTL ? "rtl" : "ltr"}>{t("errors.noData")}</div>;

    // Revenue Logic
    const baseRevenue = facility.revenue / 7;
    const days = [t("days.sun"), t("days.mon"), t("days.tue"), t("days.wed"), t("days.thu"), t("days.fri"), t("days.sat")];
    const weeklyRevenue = days.map((day, index) => {
        const multipliers = [0.95, 1.1, 0.8, 1.05, 1.2, 1.4, 1.5];
        return { name: day, value: baseRevenue * multipliers[index] };
    });

    const chartTotal = weeklyRevenue.reduce((sum, day) => sum + day.value, 0);
    const scalingFactor = facility.revenue / (chartTotal || 1);
    const adjustedWeeklyRevenue = weeklyRevenue.map(day => ({
        ...day,
        value: day.value * scalingFactor,
    }));

    return (
        <div>
            <Topbar />

            <div className="min-h-screen flex bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
                <main className="flex-1 p-4 md:p-8">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                            {facility.name[locale as 'en' | 'ar'] || facility.name.en}
                        </h1>
                        <p className="text-md text-teal-600 mt-1 font-medium">{t("facilityId")}: {facility.id}</p>
                    </div>

                    <hr className="border-t border-gray-200" />

                    {/* Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
                        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-teal-600 transition-transform hover:scale-[1.02]">
                            <div className="flex justify-between items-center">
                                <FaUsers className="w-8 h-8 text-teal-600 opacity-70" />
                                <p className="text-sm font-semibold text-gray-500 uppercase">{t("metrics.activeUsers")}</p>
                            </div>
                            <p className="font-extrabold text-4xl text-gray-900 mt-2">
                                {(facility.activeUsers?.length || 0).toLocaleString(locale)}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{t("metrics.activeUsersSub")}</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-teal-600 transition-transform hover:scale-[1.02]">
                            <div className="flex justify-between items-center">
                                <FaMoneyBillWave className="w-8 h-8 text-teal-600 opacity-70" />
                                <p className="text-sm font-semibold text-gray-500 uppercase">{t("metrics.revenue")}</p>
                            </div>
                            <p className="font-extrabold text-4xl text-gray-900 mt-2">
                                {facility.revenue.toLocaleString(locale)} {t("currency")}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{t("metrics.revenueSub")}</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-teal-600 transition-transform hover:scale-[1.02]">
                            <div className="flex justify-between items-center">
                                <FaStar className="w-8 h-8 text-teal-600 opacity-70" />
                                <p className="text-sm font-semibold text-gray-500 uppercase">{t("metrics.rating")}</p>
                            </div>
                            <p className="font-extrabold text-4xl text-gray-900 mt-2">{averageRate.toFixed(1)} / 5</p>
                            <p className="text-xs text-gray-400 mt-1">{t("metrics.ratingSub", { count: facility.feedbacks.length })}</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-teal-600 transition-transform hover:scale-[1.02]">
                            <div className="flex justify-between items-center">
                                <FaInfoCircle className="w-8 h-8 text-teal-600 opacity-70" />
                                <p className="text-sm font-semibold text-gray-500 uppercase">{t("metrics.price")}</p>
                            </div>
                            <p className="font-extrabold text-4xl text-gray-900 mt-2">
                                {facility.price.toLocaleString(locale)} {t("currency")}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{t("metrics.priceSub")}</p>
                        </div>
                    </div>

                    <hr className="border-t border-gray-200" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                        {/* Revenue Chart */}
                        <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-lg">
                            <h2 className="font-extrabold text-xl text-gray-800 mb-6 border-b pb-2">{t("charts.revenueTitle")}</h2>
                            <div className="w-full h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={adjustedWeeklyRevenue} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="5 5" stroke="#f0f0f0" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            reversed={isRTL}
                                        />
                                        <YAxis orientation={isRTL ? "left" : "right"} stroke="#aaa" />
                                        <Tooltip content={<CustomTooltip currency={t("currency")} />} />
                                        <Bar dataKey="value" fill="#0f7564" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Feedback Section */}
                        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-lg">
                            <h2 className="font-extrabold text-xl text-gray-800 mb-6 border-b pb-2">{t("feedbacks.title")}</h2>
                            {facility.feedbacks.length === 0 ? (
                                <div className="text-gray-500 text-base py-4 text-center border-2 border-dashed border-gray-200 rounded-lg">
                                    <p>{t("feedbacks.empty")}</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">
                                    {facility.feedbacks.slice(0, 5).map((fb: any) => (
                                        <div key={fb.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-gray-800 font-bold">{fb.user?.name || t("feedbacks.anonymous")}</p>
                                                <StarRating rate={fb.rate} />
                                            </div>
                                            <p className="text-sm italic text-gray-700 leading-relaxed">
                                                {t("feedbacks.commentPrefix")}: {fb.comment}
                                            </p>
                                        </div>
                                    ))}
                                    {facility.feedbacks.length > 5 && (
                                        <p className="text-center text-sm text-teal-600 mt-2 cursor-pointer hover:underline">
                                            {t("feedbacks.viewAll", { count: facility.feedbacks.length })}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Facility Info Details */}
                        <div className="lg:col-span-12 bg-white p-6 rounded-2xl shadow-lg">
                            <h2 className="font-extrabold text-xl text-gray-800 mb-4 border-b pb-2">{t("details.title")}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-base text-gray-700">
                                <div className={`border-${isRTL ? 'r' : 'l'}-4 border-teal-500 ${isRTL ? 'pr' : 'pl'}-3`}>
                                    <p className="font-bold text-gray-800">{t("details.price")}</p>
                                    <p>{facility.price.toLocaleString(locale)} {t("currency")}</p>
                                </div>
                                <div className={`border-${isRTL ? 'r' : 'l'}-4 border-teal-500 ${isRTL ? 'pr' : 'pl'}-3`}>
                                    <p className="font-bold text-gray-800">{t("details.overallRate")}</p>
                                    <p>{facility.rate} / 5</p>
                                </div>
                                <div className={`border-${isRTL ? 'r' : 'l'}-4 border-teal-500 ${isRTL ? 'pr' : 'pl'}-3`}>
                                    <p className="font-bold text-gray-800">{t("details.status")}</p>
                                    <p className={`font-semibold ${facility.status === "ACTIVE"
                                            ? "text-green-600"
                                            : facility.status === "PENDING"
                                                ? "text-orange-500"
                                                : "text-red-500"
                                        }`}>
                                        {facility.status === "ACTIVER"
                                            ? t("details.active")
                                            : facility.status === "PENDING"
                                                ? t("details.pending")
                                                : t("details.inactive")}
                                    </p>
                                </div>
                                <div className="md:col-span-4 border-t pt-4 mt-4">
                                    <p className="font-bold text-gray-800 mb-2">{t("details.description")}</p>
                                    <p className="text-gray-600 leading-relaxed italic">
                                        {facility.description?.[locale as 'en' | 'ar'] || t("details.noDesc")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}