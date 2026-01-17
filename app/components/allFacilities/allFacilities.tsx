"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import axiosInstance from "@/lib/axiosInstance";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useMap } from "react-leaflet";

import { 
  ChevronDown, 
  LayoutGrid, 
  Star, 
  MapPin, 
  Inbox, 
  ImageOff, 
  ChevronLeft, 
  ChevronRight,
  X 
} from "lucide-react";
import { useRouter } from "next/navigation";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
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

function MapUpdater({ facilities }: { facilities: Facility[] }) {
  const map = useMap();
  useEffect(() => {
    if (facilities.length > 0) {
      const validPoints = facilities.filter(f => f.lat && f.lng);
      if (validPoints.length > 0) {
        import("leaflet").then((L) => {
          const bounds = L.latLngBounds(validPoints.map((f) => [f.lat!, f.lng!] as [number, number]));
          map.fitBounds(bounds, { padding: [70, 70] });
        });
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
  const router = useRouter();
  
  const [icons, setIcons] = useState<{ place: any } | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Facility | null>(null);

  const limit = 4;

  useEffect(() => {
    import("leaflet").then((L) => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: #0E766E;" class="marker-blob"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      setIcons({ place: icon });
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // جلب التصنيفات
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
        cover: f.cover, 
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
      className="flex flex-col sm:flex-row items-stretch bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-md transition-all w-full cursor-pointer relative group"
      onClick={() => router.push(`/${locale}/userview/allFacilities/${facility.id}`)}
    >
      <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-10 bg-white/90 dark:bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm`}>
        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
        <span className="text-xs font-black text-gray-800 dark:text-gray-200">{facility.rate}</span>
      </div>

      <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden bg-gray-50 dark:bg-zinc-800">
        {facility.cover ? (
          <img 
            src={`/api/media?media=${facility.cover}`} 
            alt={facility.name} 
            className="w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 dark:text-zinc-600 gap-2">
            <ImageOff className="w-8 h-8" />
          </div>
        )}
      </div>

      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight line-clamp-1">{facility.name}</h3>
          <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">{facility.description}</p>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1.5 text-gray-400">
            <MapPin className="w-3.5 h-3.5 text-[#0E766E]" />
            <span className="text-[11px] font-bold truncate max-w-[140px] uppercase tracking-tight">{facility.location}</span>
          </div>
          <span className="font-black bg-[#0E766E] text-white px-5 py-2 rounded-2xl text-sm shadow-sm">
            {facility.price} <span className="text-[10px] font-normal mx-0.5">{t("currency")}</span>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12" dir={isRTL ? "rtl" : "ltr"}>
      
      <div className="relative mb-12 w-full max-w-xs" ref={dropdownRef}>
        <p className={`text-[10px] font-black text-[#0E766E] uppercase tracking-[0.2em] mb-3 ${isRTL ? 'mr-1' : 'ml-1'}`}>
          {t("filter_label")}
        </p>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-[1.5rem] px-6 py-4 flex items-center justify-between shadow-sm hover:border-[#0E766E] transition-colors"
        >
          <span className={`text-sm font-bold ${categoryDisplayName ? "text-gray-800 dark:text-white" : "text-gray-400"}`}>
            {categoryDisplayName || t("select_category")}
          </span>
          <ChevronDown className={`w-4 h-4 text-[#0E766E] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-[115%] left-0 w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[1.5rem] shadow-2xl py-3 z-[70] animate-in fade-in slide-in-from-top-2">
            <div 
              onClick={() => handleSelectCategory("all", t("all_categories"))}
              className="px-5 py-3.5 hover:bg-teal-50 dark:hover:bg-teal-900/20 flex items-center gap-3 cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4 text-[#0E766E]" />
              <span className="text-sm font-black">{t("all_categories")}</span>
            </div>
            {categories.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id, isRTL ? (cat.name?.ar || cat.name?.en) : cat.name?.en)}
                className="px-5 py-3.5 hover:bg-teal-50 dark:hover:bg-teal-900/20 flex items-center gap-3 cursor-pointer"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                <span className="text-sm font-bold">{isRTL ? (cat.name?.ar || cat.name?.en) : cat.name?.en}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-[55%] flex flex-col gap-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-[#0E766E] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : facilities.length === 0 ? (
            <div className="py-24 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[32px]">
               <Inbox className="w-16 h-16 text-zinc-200 mx-auto mb-4" />
               <h3 className="font-bold text-zinc-500">{t("no_results")}</h3>
            </div>
          ) : (
            facilities.map((f) => <FacilityCard key={f.id} facility={f} />)
          )}

          {/* الترقيم (Pagination) */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 mt-12">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                  disabled={currentPage === 1}
                  className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 disabled:opacity-20 shadow-sm"
                >
                  {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button 
                      key={page} 
                      onClick={() => setCurrentPage(page)} 
                      className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${
                        currentPage === page ? "bg-[#0E766E] text-white shadow-lg shadow-teal-900/20" : "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-gray-500"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                  disabled={currentPage === totalPages}
                  className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 disabled:opacity-20 shadow-sm"
                >
                  {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* العمود الأيمن: الخريطة التفاعلية */}
        <div className="lg:w-[45%] w-full h-[550px] lg:h-[750px] sticky top-8 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-10 border-4 border-white dark:border-zinc-900 bg-zinc-100">
          {icons && (
            <MapContainer center={[24.7136, 46.6753]} zoom={12} scrollWheelZoom={false} className="h-full w-full" zoomControl={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapUpdater facilities={facilities} />
              
              {facilities.map((f) => (
                <Marker 
                  key={f.id} 
                  position={[f.lat ?? 24.7136, f.lng ?? 46.6753]} 
                  icon={icons.place}
                  eventHandlers={{ click: () => setSelectedPlace(f) }}
                />
              ))}

              {/* طبقة المعلومات الطافية */}
              <div className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} z-[500] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg px-4 py-3 rounded-2xl border border-white/20 shadow-lg flex items-center gap-3`}>
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[11px] font-black text-zinc-700 dark:text-zinc-200 uppercase tracking-wider">
                   {facilities.length} {t("map_label") || "Discoveries"}
                 </span>
              </div>

              {/* كارت المرفق المختار على الخريطة */}
              {selectedPlace && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-[360px] animate-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-3 shadow-2xl border border-zinc-100 dark:border-white/5 relative">
                    <button 
                      onClick={() => setSelectedPlace(null)}
                      className="absolute -top-2 -right-2 bg-white dark:bg-zinc-800 p-1.5 rounded-full shadow-md border border-zinc-100 dark:border-zinc-700 hover:scale-110 transition-transform"
                    >
                      <X size={14} className="text-zinc-500" />
                    </button>

                    <div className="flex gap-4 items-center">
                      <div className="relative w-20 h-20 shrink-0 rounded-[1.5rem] overflow-hidden bg-zinc-100">
                        <img 
                          src={`/api/media?media=${selectedPlace.cover}`} 
                          className="object-cover w-full h-full" 
                          alt={selectedPlace.name} 
                        />
                      </div>
                      
                      <div className="flex-grow pr-2">
                        <h4 className="font-black text-zinc-800 dark:text-white text-sm line-clamp-1">{selectedPlace.name}</h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star size={10} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-[10px] font-bold text-zinc-400">{selectedPlace.rate}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[#0E766E] font-black text-sm">{selectedPlace.price} {t("currency")}</span>
                          <Link href={`/${locale}/userview/allFacilities/${selectedPlace.id}`}>
                            <button className="bg-[#0E766E] text-white px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 hover:bg-[#0a5d56]">
                              {t("details") || "Details"}
                              <ChevronRight size={12} className={isRTL ? 'rotate-180' : ''} />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </MapContainer>
          )}
        </div>
      </div>

      <style jsx global>{`
        .marker-blob {
          width: 18px; height: 18px; border-radius: 50%;
          border: 3px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          cursor: pointer; transition: transform 0.3s ease;
          animation: pulse-marker 2s infinite;
        }
        @keyframes pulse-marker {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(14, 118, 110, 0.5); }
          70% { transform: scale(1.2); box-shadow: 0 0 0 10px rgba(14, 118, 110, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(14, 118, 110, 0); }
        }
        .leaflet-container { border-radius: 2.5rem; background: #f8fafc !important; }
      `}</style>
    </div>
  );
}