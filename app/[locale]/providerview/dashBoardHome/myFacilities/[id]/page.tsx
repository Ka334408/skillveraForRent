"use client";

import { useEffect, useState } from "react";
// 🚀 UPDATED: Import useParams from next/navigation
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

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


// Custom Tooltip Component for better chart experience
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-md">
                <p className="text-gray-500 text-sm">{label}</p>
                <p className="font-bold text-teal-600">{`${payload[0].value.toFixed(2)} SR`}</p>
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
        <div className="flex text-yellow-500 space-x-0.5">
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
    const router = useRouter();

    // 🚀 NEW: Get parameters from the URL
    const params = useParams();
    // Assuming the dynamic route is structured as /providerview/dashBoardHome/myFacilities/[facilityId]
    const facilityId = params.id ;

    const [facility, setFacility] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Added a secondary state for the average rate calculation
    const [averageRate, setAverageRate] = useState(0);

    useEffect(() => {
        // 🚀 UPDATED: Check for facilityId before fetching
        if (!facilityId) {
            setError("Facility ID is missing from the URL.");
            setLoading(false);
            return;
        }

        axiosInstance
            // 🚀 UPDATED: Use facilityId from URL in the API call
            .get(`/provider-facility/${facilityId}`)
            .then((res) => {
                const data = res.data.data;
                setFacility(data);
                setError(null); // Clear any previous errors

                // Calculate average rate
                if (data.feedbacks && data.feedbacks.length > 0) {
                    const totalRate = data.feedbacks.reduce((sum: number, fb: any) => sum + fb.rate, 0);
                    setAverageRate(totalRate / data.feedbacks.length);
                } else {
                    setAverageRate(0);
                }
            })
            .catch((err) => {
                console.error("API Fetch Error:", err);
                setError(`Failed to fetch data for Facility ID: ${facilityId}. Check console for details.`);
            })
            .finally(() => setLoading(false));
    }, [facilityId]); // 🚀 UPDATED: facilityId is now the dependency

    if (error) return (
        <div className="p-8 text-lg font-medium text-red-700 bg-red-50 rounded-lg border border-red-300">
            ❌ Data Error: {error}
        </div>
    );

    if (loading) return <div className="p-8 text-lg font-medium text-teal-700">Loading Dashboard Data...</div>;

    if (!facility) return <div className="p-8 text-lg font-medium text-red-500">No facility data found.</div>;

    // ---------------------
    // Revenue dummy chart (logic remains the same)
    // ---------------------
    const baseRevenue = facility.revenue / 7;
    const weeklyRevenue = [
        { name: "Sun", value: baseRevenue * 0.95 },
        { name: "Mon", value: baseRevenue * 1.1 },
        { name: "Tue", value: baseRevenue * 0.8 },
        { name: "Wed", value: baseRevenue * 1.05 },
        { name: "Thu", value: baseRevenue * 1.2 },
        { name: "Fri", value: baseRevenue * 1.4 },
        { name: "Sat", value: baseRevenue * 1.5 },
    ];
    const chartTotal = weeklyRevenue.reduce((sum, day) => sum + day.value, 0);
    const scalingFactor = facility.revenue / chartTotal;
    const adjustedWeeklyRevenue = weeklyRevenue.map(day => ({
        ...day,
        value: day.value * scalingFactor,
    }));

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Main */}
            <main className="flex-1 p-4 md:p-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                        {facility.name.en}
                    </h1>
                    <p className="text-md text-teal-600 mt-1 font-medium">Facility ID: {facility.id}</p>
                </div>

                <hr className="border-t border-gray-200" />

                {/* Enhanced Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
                    {/* Metric Card: Active users */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-teal-600 transition-transform hover:scale-[1.02]">
                        <div className="flex justify-between items-center">
                            <FaUsers className="w-8 h-8 text-teal-600 opacity-70" />
                            <p className="text-sm font-semibold text-gray-500 uppercase">Active Users</p>
                        </div>
                        <p className="font-extrabold text-4xl text-gray-900 mt-2">{facility.activeUsers?.length || 0}</p>
                        <p className="text-xs text-gray-400 mt-1">Currently engaging</p>
                    </div>

                    {/* Metric Card: Revenue */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-teal-600 transition-transform hover:scale-[1.02]">
                        <div className="flex justify-between items-center">
                            <FaMoneyBillWave className="w-8 h-8 text-teal-600 opacity-70" />
                            <p className="text-sm font-semibold text-gray-500 uppercase">Total Revenue</p>
                        </div>
                        <p className="font-extrabold text-4xl text-gray-900 mt-2">{facility.revenue} SR</p>
                        <p className="text-xs text-gray-400 mt-1">All-time earnings</p>
                    </div>

                    {/* Metric Card: Average Rating (NEW) */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-teal-600 transition-transform hover:scale-[1.02]">
                        <div className="flex justify-between items-center">
                            <FaStar className="w-8 h-8 text-teal-600 opacity-70" />
                            <p className="text-sm font-semibold text-gray-500 uppercase">Average Rating</p>
                        </div>
                        <p className="font-extrabold text-4xl text-gray-900 mt-2">{averageRate.toFixed(1)} / 5</p>
                        <p className="text-xs text-gray-400 mt-1">Based on {facility.feedbacks.length} reviews</p>
                    </div>

                    {/* Metric Card: Price Per Session (NEW) */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-teal-600 transition-transform hover:scale-[1.02]">
                        <div className="flex justify-between items-center">
                            <FaInfoCircle className="w-8 h-8 text-teal-600 opacity-70" />
                            <p className="text-sm font-semibold text-gray-500 uppercase">Current Price</p>
                        </div>
                        <p className="font-extrabold text-4xl text-gray-900 mt-2">{facility.price} SR</p>
                        <p className="text-xs text-gray-400 mt-1">Per session/unit</p>
                    </div>

                </div>

                <hr className="border-t border-gray-200" />


                {/* GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">

                    {/* Enhanced Revenue Chart */}
                    <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="font-extrabold text-xl text-gray-800 mb-6 border-b pb-2">Weekly Revenue Trend</h2>

                        <div className="w-full h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={adjustedWeeklyRevenue} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="5 5" stroke="#f0f0f0" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} padding={{ left: 10, right: 10 }} />
                                    <YAxis orientation="right" stroke="#aaa" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        dataKey="value"
                                        fill="#0f7564"
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Enhanced Feedback Section */}
                    <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="font-extrabold text-xl text-gray-800 mb-6 border-b pb-2">Customer Feedbacks</h2>

                        {facility.feedbacks.length === 0 ? (
                            <div className="text-gray-500 text-base py-4 text-center border-2 border-dashed border-gray-200 rounded-lg">
                                <p>No recent feedbacks available.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2"> {/* Added max-height for scrolling */}
                                {facility.feedbacks.slice(0, 5).map((fb: any) => ( // Show only top 5 reviews for dashboard
                                    <div key={fb.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-gray-800 font-bold">{fb.user?.name || "Anonymous"}</p>
                                            <StarRating rate={fb.rate} />
                                        </div>
                                        <p className="text-sm italic text-gray-700 leading-relaxed">"{fb.comment}"</p>
                                    </div>
                                ))}
                                {facility.feedbacks.length > 5 && (
                                    <p className="text-center text-sm text-teal-600 mt-2 cursor-pointer hover:underline">
                                        View All {facility.feedbacks.length} Feedbacks
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Facility Info - Prominent and Detailed */}
                    <div className="lg:col-span-12 bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="font-extrabold text-xl text-gray-800 mb-4 border-b pb-2">Facility Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-base text-gray-700">
                            {/* Detail 1: Price */}
                            <div className="border-l-4 border-teal-500 pl-3">
                                <p className="font-bold text-gray-800">Price</p>
                                <p>{facility.price} SR</p>
                            </div>
                            {/* Detail 2: Overall Rate */}
                            <div className="border-l-4 border-teal-500 pl-3">
                                <p className="font-bold text-gray-800">Overall Rate</p>
                                <p>{facility.rate} / 5</p>
                            </div>
                            {/* Detail 3: Status */}
                            <div className="border-l-4 border-teal-500 pl-3">
                                <p className="font-bold text-gray-800">Active Status</p>
                                <p className={`${facility.isActive ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}`}>
                                    {facility.isActive ? "Online" : "Offline"}
                                </p>
                            </div>
                            {/* Detail 4: Description */}
                            <div className="md:col-span-4 border-t pt-4 mt-4">
                                <p className="font-bold text-gray-800 mb-2">Description</p>
                                <p className="text-gray-600 leading-relaxed italic">{
                                    typeof facility.description === 'object' && facility.description !== null && 'en' in facility.description 
                                          ? facility.description.en 
                                          : typeof facility.description === 'string' && facility.description.length > 0
                                          ? facility.description
                                          : "No description available."}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}