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
      console.error(err);
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
    <div className="w-full px-2 md:px-4 py-4">
      {/* Responsive Header */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">{t("title")}</h1>
          <p className="text-gray-500 text-xs md:text-sm">Manage your saved facilities</p>
        </div>
        <div className="text-xs font-bold text-[#0E766E] bg-teal-50 px-3 py-1 rounded-full w-fit">
          {totalData} Items Saved
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-16 flex flex-col items-center text-center px-4">
          <Heart size={40} className="text-gray-200 mb-4" />
          <p className="text-gray-600 font-medium mb-6">{t("emptyMessage")}</p>
          <Link href="/userview/allFacilities" className="bg-[#0E766E] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#095F59] transition-all w-full md:w-auto">
            {t("exploreButton")}
          </Link>
        </div>
      ) : (
        <div className="w-full">
          {/* TABLE - Visible on Desktop */}
          <table className="w-full border-separate border-spacing-y-4 hidden md:table">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-widest">
                <th className="px-6 py-2 font-medium text-left">Facility</th>
                <th className="px-6 py-2 font-medium text-left">Details</th>
                <th className="px-6 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((fav, index) => (
                <DesktopRow key={index} fav={fav} locale={locale} />
              ))}
            </tbody>
          </table>

          {/* CARDS - Visible on Mobile */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {favorites.map((fav, index) => (
              <MobileCard key={index} fav={fav} locale={locale} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-10">
            <div className="flex items-center gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-3 rounded-xl border bg-white disabled:opacity-30"><ChevronLeft size={18} /></button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl text-xs font-bold ${page === i + 1 ? "bg-[#0E766E] text-white" : "bg-white text-gray-400 border"}`}>{i + 1}</button>
                ))}
              </div>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-3 rounded-xl border bg-white disabled:opacity-30"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// SUB-COMPONENT: Desktop Table Row
const DesktopRow = ({ fav, locale }: any) => {
  const facility = fav.facility;
  const cover = facility?.cover ? `/${locale}/api/media?media=${facility.cover}` : null;
  return (
    <tr className="bg-white shadow-sm hover:shadow-md transition-shadow group">
      <td className="px-6 py-4 rounded-l-2xl border-y border-l border-gray-50">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
            {cover && <Image src={cover} alt="img" fill className="object-cover" />}
          </div>
          <span className="font-bold text-gray-800">{facility?.name?.en}</span>
        </div>
      </td>
      <td className="px-6 py-4 border-y border-gray-50">
        <p className="text-gray-500 text-xs line-clamp-2 max-w-xs">{facility?.description?.en || facility?.overview?.en}</p>
      </td>
      <td className="px-6 py-4 rounded-r-2xl border-y border-r border-gray-50 text-right">
        <Link href={`/userview/allFacilities/${facility?.id}`} className="inline-flex items-center gap-2 bg-[#0E766E] text-white px-5 py-2 rounded-xl text-xs font-bold">
          Rent Now <ExternalLink size={12} />
        </Link>
      </td>
    </tr>
  );
};

// SUB-COMPONENT: Mobile Card (The magic for small screens)
const MobileCard = ({ fav, locale }: any) => {
  const facility = fav.facility;
  const cover = facility?.cover ? `/${locale}/api/media?media=${facility.cover}` : null;
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {cover && <Image src={cover} alt="img" fill className="object-cover" />}
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="font-bold text-gray-800 text-sm">{facility?.name?.en}</h3>
          <p className="text-gray-400 text-[10px] mt-1 uppercase font-bold tracking-tight">ID: #{facility?.id}</p>
        </div>
      </div>
      <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed">
        {facility?.description?.en || facility?.overview?.en}
      </p>
      <div className="flex gap-2 mt-2">
        <Link href={`/userview/allFacilities/${facility?.id}`} className="flex-1 bg-[#0E766E] text-white text-center py-3 rounded-xl text-xs font-bold">
          Rent Now
        </Link>
        <button className="p-3 bg-red-50 text-red-500 rounded-xl">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};