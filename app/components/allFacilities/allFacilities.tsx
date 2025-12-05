"use client";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axiosInstance from "@/lib/axiosInstance";
import { useTranslations } from "next-intl";
import { locale } from "moment-timezone";

// ----------------- Types -----------------
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
  favorites?: any[];
}

// ----------------- Marker Icon -----------------
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ----------------- Map Updater -----------------
function MapUpdater({ facilities }: { facilities: Facility[] }) {
  const map = useMap();

  useEffect(() => {
    if (facilities.length > 0) {
      const bounds = L.latLngBounds(
        facilities.map((f) => [f.lat ?? 24.7136, f.lng ?? 46.6753] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [facilities, map]);

  return null;
}

// ----------------- Main Component -----------------
export default function FacilitiesSection() {
  const t = useTranslations();
  const [categories, setCategories] = useState<Category[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [categoryFilter, setCategoryFilter] = useState<number | "all">("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  const limit = 4;

  // ----------------- Fetch Categories -----------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/category/categories");
        const data: Category[] = res.data?.data.map((c: any) => ({
          id: c.id ?? c._id,
          name: c.name,
        }));
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // ----------------- Fetch Facilities -----------------
  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const params: any = { page: currentPage, limit };

      if (categoryFilter !== "all") params.categoryId = categoryFilter;
      if (locationFilter) params.location = locationFilter;
      if (priceFilter) params.maxPrice = priceFilter;

      const res = await axiosInstance.get("/guest-facility", { params });
      const data: any[] = res.data?.data ?? [];
      const total = res.data?.totalPages ?? 1;

      const parsed: Facility[] = data.map((f) => ({
        id: f.id,
        name: f.name?.en ?? "No name",
        description: f.description?.en ?? f.overview?.en ?? "",
        location: f.address ?? "Unknown",
        price: Number(f.price) || 0,
        category: f.category?.name?.en ?? "Unknown",
        cover: f.cover ? `/api/media?media=${f.cover}` : undefined,
        lat: f.addressLatLong ? Number(f.addressLatLong.split(",")[0]) : 24.7136,
        lng: f.addressLatLong ? Number(f.addressLatLong.split(",")[1]) : 46.6753,
        favorites: f.favorites ?? [],
      }));

      setFacilities(parsed);
      console.log("parsed is : " +parsed);
      setTotalPages(total);
    } catch (err) {
      console.error("Failed to fetch facilities:", err);
      setFacilities([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFacilities();
  }, [currentPage, categoryFilter, locationFilter, priceFilter]);

  // ----------------- Pagination -----------------
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // ----------------- Facility Card -----------------
  const FacilityCard = ({ facility }: { facility: Facility }) => (
    <div
      className="flex flex-col sm:flex-row items-stretch bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition w-full h-auto sm:h-40 cursor-pointer"
      onClick={() => window.location.href = `/userview/allFacilities/${facility.id}`}
    >
      <div className="w-full sm:w-40 h-40 sm:h-full bg-gray-200 flex-shrink-0">
        {facility.cover ? (
          <img src={facility.cover} alt={facility.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-lg">{facility.name}</h3>
          <p className="text-gray-500 text-sm line-clamp-2">{facility.description}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-600">{facility.location}</span>
          <span className="sm:font-semibold bg-[#0E766E] text-white px-3 py-1 rounded-lg text-sm">
            {facility.price} R
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border rounded px-3 py-2"
          onChange={(e) => { setCategoryFilter(e.target.value === "all" ? "all" : Number(e.target.value)); setCurrentPage(1); }}
          value={categoryFilter}
        >
          <option value="all">{t("filters.category")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name.en}</option>
          ))}
        </select>


      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cards */}
        <div className="lg:w-[55%] flex flex-col gap-4 items-center">
          {loading ? (
            <div className="py-10 text-lg font-semibold">Loading</div>
          ) : facilities.length === 0 ? (
            <div className="py-10 text-lg text-gray-500">{t("noFacilities")}</div>
          ) : (
            facilities.map((f) => <FacilityCard key={f.id} facility={f} />)
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-4 gap-2 mb-16 items-center flex-wrap">
            <button onClick={handlePrev} disabled={currentPage === 1} className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
              {t("pagination.prev")}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage === page ? "bg-[#0E766E] text-white" : "bg-gray-200 text-gray-700"}`}>
                {page}
              </button>
            ))}
            <button onClick={handleNext} disabled={currentPage === totalPages} className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
              {t("pagination.next")}
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="lg:w-[50%] w-full h-[400px] lg:h-[690px] mb-10 shadow-2xl shadow-gray-400">
          <MapContainer center={[24.7136, 46.6753]} zoom={12} scrollWheelZoom={false} className="h-full w-full rounded-xl shadow">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapUpdater facilities={facilities} />
            {facilities.map((f) => (
              <Marker key={f.id} position={[f.lat ?? 24.7136, f.lng ?? 46.6753]} icon={markerIcon}>
                <Popup>
                  <b>{f.name}</b>
                  <br />
                  {f.location}
                  <br />
                  {t("facility.priceUnit", { price: f.price })}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}