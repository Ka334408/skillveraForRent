"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ExternalLink, Star, MapPin, ChevronDown, Inbox, LayoutGrid } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";

export default function SearchSection() {
  const [place, setPlace] = useState("");
  const [category, setCategory] = useState(""); 
  const [categoryName, setCategoryName] = useState(""); 
  const [categories, setCategories] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const t = useTranslations("Search");
  const locale = useLocale();
  const isRTL = locale === "ar";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/category/categories");
        setCategories(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (place.trim() || category) {
        setLoading(true);
        setHasSearched(true);
        try {
          const params = { search: place, categoryId: category || undefined };
          const res = await axiosInstance.get("/guest-facility", { params });
          const data = res.data?.data || res.data || [];
          setResults(Array.isArray(data) ? data : []);
        } catch (error) {
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [place, category]);

  const handleSelectCategory = (id: string, name: string) => {
    setCategory(id);
    setCategoryName(name);
    setIsOpen(false);
  };

  return (
    <div 
      className="dark:bg-black transition-colors" 
      dir={isRTL ? "rtl" : "ltr"}
    >
      <section className="w-[95%] md:w-[85%] lg:w-[75%] mx-auto pt-8 pb-12">

        {/* --- SEARCH BAR --- */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center dark:bg-zinc-900 border-2 border-[#0E766E] rounded-[24px] md:rounded-full shadow-xl relative">

          {/* Facility Name Input */}
          <div className="flex-[1.5] px-6 py-4 flex flex-col justify-center relative border-b md:border-b-0 md:border-e border-gray-100 dark:border-zinc-800">
            <p className="text-[10px] font-black text-[#0E766E] uppercase tracking-widest mb-1 text-center">
              {t("place")}
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={t("placeholderWhere")} // Add this to your JSON files
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="text-center w-full bg-transparent text-sm font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* CUSTOM CATEGORY DROPDOWN */}
          <div className="flex-1 px-6 py-4 flex flex-col justify-center relative cursor-pointer" ref={dropdownRef}>
            <p className="text-[10px] font-black text-[#0E766E] uppercase tracking-widest mb-1">
              {t("category")}
            </p>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between w-full text-sm font-medium text-gray-800 dark:text-gray-100"
            >
              <span className={categoryName ? "opacity-100" : "opacity-40"}>
                {categoryName || t("allCategories")}
              </span>
              <ChevronDown className={`w-4 h-4 text-[#0E766E] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Floating Menu */}
            {isOpen && (
              <div className="absolute top-[110%] start-0 w-full md:w-[250px] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-200 z-[100]">
                <div
                  onClick={() => handleSelectCategory("", t("allCategories"))}
                  className="px-4 py-3 hover:bg-teal-50 dark:hover:bg-teal-900/20 flex items-center gap-3 transition-colors"
                >
                  <LayoutGrid className="w-4 h-4 text-[#0E766E]" />
                  <span className="text-sm">{t("allCategories")}</span>
                </div>
                <div className="h-[1px] bg-gray-100 dark:bg-zinc-800 my-1 mx-2" />
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id, isRTL ? (cat.name?.ar || cat.name?.en) : cat.name?.en)}
                    className="px-4 py-3 hover:bg-teal-50 dark:hover:bg-teal-900/20 flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-2 h-2 rounded-full bg-gray-200 group-hover:bg-[#0E766E] transition-colors" />
                    <span className="text-sm">{isRTL ? (cat.name?.ar || cat.name?.en) : cat.name?.en}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="p-2 flex items-center justify-center">
            <button className="w-full md:w-auto bg-[#0E766E] hover:bg-[#0c635d] text-white px-8 py-3 md:py-4 rounded-[18px] md:rounded-full flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-teal-900/20">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span className="md:hidden font-bold">{t("searchNow")}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* --- RESULTS TABLE --- */}
        {hasSearched && !loading && (
          <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
              {results.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-start border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 dark:bg-zinc-800/30 text-[#0E766E] border-b dark:border-zinc-800">
                        <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-start">
                          {t("facilityDetails")}
                        </th>
                        <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-center">
                          {t("pricing")}
                        </th>
                        <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-center">
                          {t("rating")}
                        </th>
                        <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-end">
                          {t("view")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
                      {results.map((item) => (
                        <tr key={item.id} className="hover:bg-teal-50/20 dark:hover:bg-teal-900/5 transition-colors group">
                          <td className="px-8 py-5 text-start">
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                                <img
                                  src={item.cover ? `/${locale}/api/media?media=${item.cover}` : "/placeholder.png"}
                                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                  alt=""
                                />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 dark:text-white leading-tight">
                                  {isRTL ? (item.name?.ar || item.name?.en) : item.name?.en}
                                </h4>
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[#0E766E]" /> 
                                  {item.location || t("availableNow")}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <span className="text-lg font-black text-[#0E766E]">{item.price}</span>
                            <span className="text-[10px] font-bold text-gray-400 ms-1 uppercase">
                              {t("currencyDay")}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <div className="inline-flex items-center gap-1.5 bg-yellow-400/10 text-yellow-600 dark:text-yellow-500 px-3 py-1.5 rounded-full font-bold text-sm">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              {item.rate || "5.0"}
                            </div>
                          </td>
                          <td className="px-8 py-5 text-end">
                            <Link href={`/${locale}/userview/allFacilities/${item.id}`}>
                              <button className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-2.5 rounded-xl text-[#0E766E] hover:bg-[#0E766E] hover:text-white hover:border-[#0E766E] transition-all shadow-sm">
                                <ExternalLink className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-24 flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                    <Inbox className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("noFacilities")}
                  </h3>
                  <p className="text-gray-500 text-sm mt-2">
                    {t("adjustFilters")}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}