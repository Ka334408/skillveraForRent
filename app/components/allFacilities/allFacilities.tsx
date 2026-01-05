"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axiosInstance from "@/lib/axiosInstance";
import { useTranslations, useLocale } from "next-intl";
import { 
  ChevronDown, 
  LayoutGrid, 
  Star, 
  MapPin, 
  Inbox, 
  ImageOff, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

interface Category {
  id: number;
  name: { en: string; ar?: string };
}

interface Facility {
  id: number;
  name: string;
  description?: string;
  location?: string;
  price: number;
  category: string;
  cover?: string;
  lat?: number;
  lng?: number;
  rate: number;
}

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapUpdater({ facilities }: { facilities: Facility[] }) {
  const map = useMap();
  useEffect(() => {
    if (facilities.length > 0) {
      const validPoints = facilities.filter(f => f.lat && f.lng);
      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints.map((f) => [f.lat!, f.lng!] as [number, number]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [facilities, map]);
  return null;
}

export default function FacilitiesSection() {
  const t = useTranslations("Facilities");
  const locale = useLocale();
  const isRTL = locale === "ar";
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<number | "all">("all");
  const [categoryDisplayName, setCategoryDisplayName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const limit = 4;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/category/categories");
        const data = res.data?.data.map((c: any) => ({
          id: c.id ?? c._id,
          name: c.name,
        }));
        setCategories(data);
      } catch (err) { console.error(err); }
    };
    fetchCategories();
  }, []);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const params: any = { page: currentPage, limit };
      if (categoryFilter !== "all") params.categoryId = categoryFilter;

      const res = await axiosInstance.get("/guest-facility", { params });
      const data: any[] = res.data?.data ?? [];
      const total = res.data?.totalPages ?? 1;

      const parsed: Facility[] = data.map((f) => ({
        id: f.id,
        name: isRTL ? (f.name?.ar || f.name?.en) : (f.name?.en || "No name"),
        description: isRTL ? (f.description?.ar || f.description?.en || "") : (f.description?.en || ""),
        location: f.address ?? (isRTL ? "موقع غير معروف" : "Unknown"),
        price: Number(f.price) || 0,
        category: isRTL ? (f.category?.name?.ar || f.category?.name?.en) : (f.category?.name?.en),
        cover: f.cover ? `/api/media?media=${f.cover}` : undefined,
        lat: f.addressLatLong ? Number(f.addressLatLong.split(",")[0]) : 24.7136,
        lng: f.addressLatLong ? Number(f.addressLatLong.split(",")[1]) : 46.6753,
        rate: f.rate || 0
      }));

      setFacilities(parsed);
      setTotalPages(total);
    } catch (err) {
      setFacilities([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFacilities();
  }, [currentPage, categoryFilter]);

  const handleSelectCategory = (id: number | "all", name: string) => {
    setCategoryFilter(id);
    setCategoryDisplayName(name);
    setCurrentPage(1);
    setIsDropdownOpen(false);
  };

  const FacilityCard = ({ facility }: { facility: Facility }) => (
    <div
      className="flex flex-col sm:flex-row items-stretch bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-md transition-all w-full cursor-pointer relative group"
      onClick={() => window.location.href = `/userview/allFacilities/${facility.id}`}
    >
      <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} z-10 bg-white/90 dark:bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm`}>
        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{facility.rate}</span>
      </div>

      <div className="w-full sm:w-48 h-48 sm:h-auto min-h-[192px] flex-shrink-0 overflow-hidden bg-gray-50 dark:bg-zinc-800">
        {facility.cover ? (
          <img 
            src={facility.cover} 
            alt={facility.name} 
            className="w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 dark:text-zinc-600 gap-2">
            <ImageOff className="w-8 h-8" />
          </div>
        )}
      </div>

      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight line-clamp-1">{facility.name}</h3>
          <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">{facility.description}</p>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1 text-gray-400">
            <MapPin className="w-3 h-3 text-[#0E766E]" />
            <span className="text-[11px] font-medium truncate max-w-[140px]">{facility.location}</span>
          </div>
          <span className="font-black bg-[#0E766E] text-white px-4 py-1.5 rounded-xl text-sm">
            {facility.price} <span className="text-[10px] font-normal mx-0.5">{t("currency")}</span>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12" dir={isRTL ? "rtl" : "ltr"}>
      <div className="relative mb-10  w-full max-w-xs" ref={dropdownRef}>
        <p className={`text-[10px] font-black text-[#0E766E] uppercase tracking-widest mb-2 ${isRTL ? 'mr-1' : 'ml-1'}`}>
          {t("filter_label")}
        </p>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full bg-white dark:bg-zinc-900 border-2 border-[#0E766E] rounded-2xl px-5 py-3 flex items-center justify-between shadow-sm"
        >
          <span className={`text-sm font-semibold ${categoryDisplayName ? "text-gray-800 dark:text-white" : "text-gray-400"}`}>
            {categoryDisplayName || t("select_category")}
          </span>
          <ChevronDown className={`w-4 h-4 text-[#0E766E] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-[110%] left-0 w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl py-2 z-[70]">
            <div 
              onClick={() => handleSelectCategory("all", t("all_categories"))}
              className="px-4 py-3 hover:bg-teal-50 dark:hover:bg-teal-900/20 flex items-center gap-3 cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4 text-[#0E766E]" />
              <span className="text-sm font-bold">{t("all_categories")}</span>
            </div>
            {categories.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id, isRTL ? (cat.name?.ar || cat.name?.en) : cat.name?.en)}
                className="px-4 py-3 hover:bg-teal-50 dark:hover:bg-teal-900/20 flex items-center gap-3 cursor-pointer"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                <span className="text-sm font-medium">{isRTL ? (cat.name?.ar || cat.name?.en) : cat.name?.en}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-[55%] flex flex-col gap-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-[#0E766E] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : facilities.length === 0 ? (
            <div className="py-24 text-center border-2 border-dashed border-gray-100 rounded-[32px]">
               <Inbox className="w-16 h-16 text-gray-200 mx-auto mb-4" />
               <h3 className="font-bold text-gray-800">{t("no_results")}</h3>
            </div>
          ) : (
            facilities.map((f) => <FacilityCard key={f.id} facility={f} />)
          )}

          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 mt-10">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl bg-white border border-gray-100 disabled:opacity-30 shadow-sm"
                >
                  {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button 
                      key={page} 
                      onClick={() => setCurrentPage(page)} 
                      className={`w-11 h-11 rounded-xl font-black text-sm transition-all ${
                        currentPage === page ? "bg-[#0E766E] text-white shadow-md shadow-teal-900/20" : "bg-white border text-gray-500"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl bg-white border border-gray-100 disabled:opacity-30 shadow-sm"
                >
                  {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {t("page_info", { current: currentPage, total: totalPages })}
              </p>
            </div>
          )}
        </div>

        <div className="lg:w-[45%] w-full h-[500px] lg:h-[750px] sticky top-8 rounded-[32px] overflow-hidden shadow-2xl z-10 border border-gray-100 dark:border-zinc-800">
          <MapContainer center={[24.7136, 46.6753]} zoom={12} scrollWheelZoom={false} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapUpdater facilities={facilities} />
            {facilities.map((f) => (
              <Marker key={f.id} position={[f.lat ?? 24.7136, f.lng ?? 46.6753]} icon={markerIcon}>
                <Popup>
                  <div className={`p-1 min-w-[120px] ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                    <p className="font-bold text-[#0E766E] text-sm mb-1">{f.name}</p>
                    <div className="flex items-center justify-between border-t pt-2 mt-2">
                       <span className="font-black text-xs">{f.price} {t("currency")}</span>
                       <div className="flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-[10px] font-bold">{f.rate}</span>
                       </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}