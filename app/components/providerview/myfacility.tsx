"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { useLocale, useTranslations } from "next-intl";

// 🚀 Imports for Icons
import { FaPlus, FaClock, FaCheckCircle, FaTimes, FaHome } from "react-icons/fa";

// 🚀 Renamed the primary teal color for clarity
const PRIMARY_COLOR = "#0E766E"; 

type Facility = {
  id: number;
  name: { en: string; ar: string };
  status: "PENDING" | "APPROVED" | "REJECTED" | "RENTED";
  cover?: string | null;
  description?: { en: string; ar: string } | null;
};

export default function FacilitiesPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "active" | "rejected">("active");
  const [facilitiesData, setFacilitiesData] = useState<{
    pending: Facility[];
    active: Facility[];
    rejected: Facility[];
  }>({ pending: [], active: [], rejected: [] });
  const [loading, setLoading] = useState(true);

  const locale = useLocale();
  const t = useTranslations("FacilitiesPage");
  const isRTL = locale === "ar";
  const router = useRouter();

  // 🚀 Status Logic for Icons and Text
  const statusInfo = (s: Facility["status"]): { color: string, icon: JSX.Element, text: string } => {
    switch (s) {
      case "PENDING":
        return { color: "text-yellow-500 bg-yellow-100", icon: <FaClock />, text: t("status.pending") };
      case "REJECTED":
        return { color: "text-red-600 bg-red-100", icon: <FaTimes />, text: t("status.rejected") };
      case "RENTED":
        return { color: "text-blue-600 bg-blue-100", icon: <FaHome />, text: t("status.rented") };
      case "APPROVED":
      default:
        return { color: "text-green-600 bg-green-100", icon: <FaCheckCircle />, text: t("status.active") };
    }
  };

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/provider-facility"); 
        const allFacilities: Facility[] = res.data?.data?.data || [];

        const pending: Facility[] = [];
        const active: Facility[] = [];
        const rejected: Facility[] = [];

        allFacilities.forEach((f) => {
          if (f.status === "PENDING" || f.status === "RENTED") {
            pending.push(f);
          } else if (f.status === "APPROVED") {
            active.push(f);
          } else if (f.status === "REJECTED") {
            rejected.push(f);
          }
        });

        setFacilitiesData({ pending, active, rejected });
      } catch (err) {
        console.error("Failed to fetch facilities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  const facilities = facilitiesData[activeTab];

  const handleFacilityClick = (facilityId: number) => {
    router.push(`/${locale}/providerview/dashBoardHome/myFacilities/${facilityId}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="mb-8 border-b pb-4">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">{t("pageTitle")}</h2>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Tabs */}
          {(["active", "pending", "rejected"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-md flex items-center gap-2 ${
                activeTab === tab
                  ? `bg-[#0E766E] text-white shadow-lg`
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              {tab === "active" && <FaCheckCircle />}
              {tab === "pending" && <FaClock />}
              {tab === "rejected" && <FaTimes />}
              {t(`tabs.${tab}`)} ({facilitiesData[tab].length})
            </button>
          ))}

          {/* Add New Facility Button */}
          <button
            onClick={() =>
              router.push(`/${locale}/providerview/dashBoardHome/myFacilities/addNewFacility`)
            }
            className={`${isRTL ? 'mr-auto' : 'ml-auto'} px-4 py-2.5 rounded-full bg-white border-2 border-dashed border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition flex items-center gap-2`}
          >
            <FaPlus className="w-4 h-4" />
            <span>{t("addNewBtn")}</span>
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 animate-pulse">{t("loading")}</p>
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {facilities.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-xl shadow-lg border border-gray-200">
              <p className="text-2xl font-semibold text-gray-700">{t("noData.title")}</p>
              <p className="text-gray-500 mt-2">
                {t("noData.desc")} <strong>{t(`tabs.${activeTab}`)}</strong>.
              </p>
            </div>
          ) : (
            facilities.map((f) => {
                const info = statusInfo(f.status);

                return (
                    <article
                        key={f.id}
                        className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden 
                                   hover:shadow-2xl hover:border-teal-400 transition-all duration-300 cursor-pointer"
                        onClick={() => handleFacilityClick(f.id)}
                    >
                        <div className="w-full h-40 bg-gray-200 overflow-hidden flex items-center justify-center relative">
                            <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow ${info.color}`}>
                                {info.icon}
                                {info.text}
                            </div>
                            
                            {f.cover ? (
                                <img
                                    src={f.cover.startsWith("http") ? f.cover : `/api/media?media=${f.cover}`}
                                    alt={f.name[locale as 'en' | 'ar']}
                                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/600x400/0E766E/FFFFFF?text=Facility")}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                            ) : (
                                <span className="text-gray-500 text-sm">{t("noPhoto")}</span>
                            )}
                        </div>

                        <div className="p-4 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-extrabold text-gray-900 leading-tight">
                                  {f.name[locale as 'en' | 'ar']}
                                </h3>
                                <div className="text-xs text-gray-400 font-medium">#{f.id}</div>
                            </div>
                            
                            <p className="text-sm text-gray-600 line-clamp-2 grow">
                                {f.description?.[locale as 'en' | 'ar'] || t("noDescription")}
                            </p>
                        </div>
                    </article>
                );
            })
          )}
        </div>
      )}
    </div>
  );
}