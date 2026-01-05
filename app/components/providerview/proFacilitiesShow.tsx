"use client";

import { useEffect, useState, useCallback, KeyboardEvent } from "react";
import { Filter, Search, Plus, Building2, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { useLocale, useTranslations } from "next-intl";

export default function MyFacilities() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"name" | "id" | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  const locale = useLocale();
  const t = useTranslations("MyFacilities");
  const isRTL = locale === "ar";
  const router = useRouter();

  const fetchFacilities = useCallback(async (searchValue: string, filterBy: "name" | "id" | null) => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string | number> = {};
      const isNumber = /^\d+$/.test(searchValue);

      if (searchValue) {
        if (filterBy === "id" || (filterBy === null && isNumber)) {
          params.id = Number(searchValue);
        } else {
          params.search = searchValue;
        }
      }

      const res = await axiosInstance.get(`/provider-facility?limit=10`, {
        params,
        withCredentials: true,
      });

      setFacilities(res.data?.data?.data || []);
    } catch (err: any) {
      setError(t("errorLoad"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchFacilities(search, filter);
  }, [fetchFacilities]);

  const handleApply = () => {
    fetchFacilities(search, filter);
    setShowFilter(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleApply();
  };

  // دالة مساعدة لتحديد لون الحالة
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500/20 text-green-700 border-green-500/30";
      case "PENDING":
        return "bg-orange-500/20 text-orange-700 border-orange-500/30";
      default:
        return "bg-red-500/20 text-red-700 border-red-500/30";
    }
  };

  return (
    <section className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm w-full my-6 min-h-[500px]" dir={isRTL ? "rtl" : "ltr"}>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Building2 className="text-[#0E766E] w-8 h-8" />
            {t("title")}
          </h2>
          <p className="text-gray-400 text-sm font-bold mt-1 opacity-80 uppercase tracking-widest">
            {facilities.length} {t("totalFacilities")}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Search Bar */}
          <div className="flex relative items-center group">
            <div className={`absolute ${isRTL ? 'right-4' : 'left-4'} text-gray-400 group-focus-within:text-[#0E766E] transition-colors`}>
              <Search className="w-4 h-4" />
            </div>
            <input
              type={filter === 'id' ? 'number' : 'text'}
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`border-none bg-gray-50 rounded-2xl ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 text-sm w-full md:w-64 focus:ring-4 focus:ring-teal-500/5 focus:bg-white transition-all font-bold outline-none shadow-inner`}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm font-black hover:bg-gray-50 transition shadow-sm"
            >
              <Filter className="w-4 h-4 text-[#0E766E]" />
              {filter ? t(filter) : t("filter")}
            </button>

            {showFilter && (
              <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 border border-gray-50 rounded-2xl shadow-2xl bg-white p-2 z-50 w-40 animate-in fade-in slide-in-from-top-2`}>
                <button
                  onClick={() => { setFilter("name"); setShowFilter(false); }}
                  className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-4 py-2.5 rounded-xl text-xs font-black transition ${filter === 'name' ? 'bg-teal-50 text-[#0E766E]' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                  {t("name")}
                </button>
                <button
                  onClick={() => { setFilter("id"); setShowFilter(false); }}
                  className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-4 py-2.5 rounded-xl text-xs font-black transition ${filter === 'id' ? 'bg-teal-50 text-[#0E766E]' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                  {t("id")}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => router.push(`/${locale}/providerview/dashBoardHome/myFacilities/addNewFacility`)}
            className="bg-[#0E766E] text-white px-6 py-3 rounded-2xl hover:bg-[#0c635d] transition shadow-lg shadow-teal-900/10 text-sm font-black flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {t("addNew")}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="w-10 h-10 text-[#0E766E] animate-spin" />
          <p className="text-gray-400 font-bold animate-pulse">{t("loading")}</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center h-48">
          <p className="text-red-500 bg-red-50 px-6 py-4 rounded-2xl border border-red-100 font-black text-sm">{error}</p>
        </div>
      )}

      {/* Facilities Grid */}
      {!loading && facilities.length > 0 ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {facilities.map((facility) => (
            <div
              key={facility.id}
              onClick={() => router.push(`/${locale}/providerview/dashBoardHome/myFacilities/${facility.id}`)}
              className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-teal-900/5 hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                {/* Badges Overlay */}
                <div className="absolute top-4 inset-x-4 flex justify-between items-start z-10">
                  <span className="bg-black/30 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">
                    ID: {facility.id}
                  </span>
                  
                  {/* Status Badge */}
                  <span className={`backdrop-blur-md text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border shadow-sm transition-colors ${getStatusStyles(facility.status)}`}>
                    {facility.status === "APPROVED" 
                      ? t("active") 
                      : facility.status === "PENDING" 
                      ? t("pending") 
                      : t("inactive")}
                  </span>
                </div>

                {facility.cover ? (
                  <img
                    src={facility.cover.startsWith("http") ? facility.cover : `/api/media?media=${facility.cover}`}
                    alt={facility.name[locale as 'en' | 'ar']}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-teal-50">
                    <Building2 className="w-12 h-12 text-[#0E766E] opacity-20" />
                  </div>
                )}
              </div>

              {/* Content Container */}
              <div className="p-6">
                <h3 className="font-black text-lg text-gray-900 line-clamp-1 mb-2 group-hover:text-[#0E766E] transition-colors">
                  {facility.name[locale as 'en' | 'ar']}
                </h3>
                
                <p className="text-gray-400 text-xs font-medium line-clamp-2 h-8 leading-relaxed">
                  {facility.description?.[locale as 'en' | 'ar'] || t("noDescription")}
                </p>
                
                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-black text-[#0E766E]">{facility.price || 0}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{t("currency")}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#0E766E] group-hover:text-white transition-all">
                    <ArrowRight size={14} className={isRTL ? "rotate-180" : ""} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Empty State */}
      {!loading && facilities.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-gray-100 rounded-[3rem] bg-gray-50/50 mt-8 group transition-colors hover:border-teal-200">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
             <Building2 className="text-[#0E766E] w-10 h-10 opacity-40" />
          </div>
          <p className="text-gray-500 text-lg font-black mb-6">{t("noFacilities")}</p>
          <button
            onClick={() => router.push(`/${locale}/providerview/dashBoardHome/myFacilities/addNewFacility`)}
            className="bg-[#0E766E] text-white px-10 py-4 rounded-2xl hover:bg-[#0c635d] transition shadow-xl shadow-teal-900/10 font-black text-sm"
          >
            <Plus className="inline w-5 h-5 ltr:mr-2 rtl:ml-2" />
            {t("createFirst")}
          </button>
        </div>
      )}
    </section>
  );
}