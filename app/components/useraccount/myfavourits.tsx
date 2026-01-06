"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import axiosInstance from "@/lib/axiosInstance";
import { Loader2, Heart, ExternalLink, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);

  const t = useTranslations("favorites");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const fetchFavorites = async (currentPage: number) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/user-favorite", {
        params: { limit: 10, page: currentPage },
      });
      setFavorites(data?.data || []);
      setTotalPages(data?.totalPages || 1);
      setTotalData(data?.totalData || 0);
    } catch (err) {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFavorites(page); }, [page]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center py-20 text-[#0E766E]">
      <Loader2 className="animate-spin mb-2" size={32} />
      <p className="animate-pulse font-medium">{t("loading")}</p>
    </div>
  );

  return (
    <div className="w-full px-2 md:px-4 py-4" dir={isRTL ? "rtl" : "ltr"}>
      {/* Responsive Header */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className={isRTL ? "text-right" : "text-left"}>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">{t("title")}</h1>
          <p className="text-gray-500 text-xs md:text-sm">{t("subTitle")}</p>
        </div>
        <div className="text-xs font-bold text-[#0E766E] bg-teal-50 px-3 py-1 rounded-full w-fit">
          {totalData} {t("itemsCount")}
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-16 flex flex-col items-center text-center px-4">
          <Heart size={40} className="text-gray-200 mb-4" />
          <p className="text-gray-600 font-medium mb-6">{t("emptyMessage")}</p>
          <Link href={`/${locale}/userview/allFacilities`} className="bg-[#0E766E] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#095F59] transition-all w-full md:w-auto">
            {t("exploreButton")}
          </Link>
        </div>
      ) : (
        <div className="w-full">
          {/* TABLE - Desktop */}
          <table className="w-full border-separate border-spacing-y-4 hidden md:table">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-widest">
                <th className={`px-6 py-2 font-medium ${isRTL ? "text-right" : "text-left"}`}>{t("colFacility")}</th>
                <th className={`px-6 py-2 font-medium ${isRTL ? "text-right" : "text-left"}`}>{t("colDetails")}</th>
                <th className={`px-6 py-2 font-medium ${isRTL ? "text-left" : "text-right"}`}>{t("colActions")}</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((fav, index) => (
                <DesktopRow key={index} fav={fav} locale={locale} isRTL={isRTL} t={t} />
              ))}
            </tbody>
          </table>

          {/* CARDS - Mobile */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {favorites.map((fav, index) => (
              <MobileCard key={index} fav={fav} locale={locale} isRTL={isRTL} t={t} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10" dir="ltr">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-3 rounded-xl border bg-white disabled:opacity-30">
                {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${page === i + 1 ? "bg-[#0E766E] text-white shadow-lg shadow-teal-100" : "bg-white text-gray-400 border hover:bg-gray-50"}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-3 rounded-xl border bg-white disabled:opacity-30">
                {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const DesktopRow = ({ fav, locale, isRTL, t }: any) => {
  const facility = fav.facility;
  const cover = facility?.cover ? `/api/media?media=${facility.cover}` : null;
  return (
    <tr className="bg-white shadow-sm hover:shadow-md transition-shadow group">
      <td className={`px-6 py-4 border-y border-gray-50 ${isRTL ? "rounded-r-2xl border-r" : "rounded-l-2xl border-l"}`}>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            {cover && <Image src={cover} alt="img" fill className="object-cover" />}
          </div>
          <span className="font-bold text-gray-800 text-sm">{facility?.name?.[locale] || facility?.name?.en}</span>
        </div>
      </td>
      <td className="px-6 py-4 border-y border-gray-50">
        <p className={`text-gray-500 text-xs line-clamp-2 max-w-xs leading-relaxed ${isRTL ? "text-right" : "text-left"}`}>
          {facility?.description?.[locale] || facility?.overview?.[locale] || facility?.description?.en}
        </p>
      </td>
      <td className={`px-6 py-4 border-y border-gray-50 ${isRTL ? "rounded-l-2xl border-l text-left" : "rounded-r-2xl border-r text-right"}`}>
        <Link href={`/${locale}/userview/allFacilities/${facility?.id}`} className="inline-flex items-center gap-2 bg-[#0E766E] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#095F59] transition-colors">
          {t("rentButton")} <ExternalLink size={12} className={isRTL ? "rotate-180" : ""} />
        </Link>
      </td>
    </tr>
  );
};

const MobileCard = ({ fav, locale, isRTL, t }: any) => {
  const facility = fav.facility;
  const cover = facility?.cover ? `/api/media?media=${facility.cover}` : null;
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {cover && <Image src={cover} alt="img" fill className="object-cover" />}
        </div>
        <div className={`flex flex-col justify-center ${isRTL ? "text-right" : "text-left"}`}>
          <h3 className="font-bold text-gray-800 text-sm">{facility?.name?.[locale] || facility?.name?.en}</h3>
          <p className="text-gray-400 text-[10px] mt-1 uppercase font-bold tracking-tight">{t("colId")}: #{facility?.id}</p>
        </div>
      </div>
      <p className={`text-gray-500 text-xs line-clamp-3 leading-relaxed ${isRTL ? "text-right" : "text-left"}`}>
        {facility?.description?.[locale] || facility?.overview?.[locale] || facility?.description?.en}
      </p>
      <div className="flex gap-2 mt-2">
        <Link href={`/${locale}/userview/allFacilities/${facility?.id}`} className="flex-1 bg-[#0E766E] text-white text-center py-3 rounded-xl text-xs font-bold">
          {t("rentButton")}
        </Link>
        <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};