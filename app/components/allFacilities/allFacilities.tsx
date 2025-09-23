"use client";
import { useState, useEffect } from "react";
import FacilityCard from "../mainComponents/allcards";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useTranslations } from "next-intl";

// 🎯 أيقونة الماركر
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 🖼 صور لكل كاتيجوري
const categoryImages: Record<string, string> = {
  Sports: "/stadium.jpg",
  Education: "/school.jpg",
  Health: "/hotal.jpg"
};

// داتا تجريبية
 const facilitiesData = Array.from({ length: 100 }, (_, i) => {
  const category = i % 3 === 0 ? "Sports" : i % 3 === 1 ? "Education" : "Health";

  return {
    id: i + 1,
    name: `Facility ${i + 1}`,
    description: `Description for facility ${i + 1}, lorem ipsum dolor sit amet.`,
    location: i % 2 === 0 ? "Riyadh" : "Jeddah",
    price: 400 + (i % 5) * 100,
    category,
    image:
      categoryImages[category] ||
      `https://picsum.photos/200/150?random=${i}`,
    lat: 24.7136 + i * 0.01,
    lng: 46.6753 + i * 0.01,
  };
});

// 🔹 كومبوننت تحدث الماب على حسب الكروت
function MapUpdater({ facilities }: { facilities: typeof facilitiesData }) {
  const map = useMap();

  useEffect(() => {
    if (facilities.length > 0) {
      const bounds = L.latLngBounds(
        facilities.map((f) => [f.lat, f.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [facilities, map]);

  return null;
}

export default function FacilitiesSection() {
  const t = useTranslations(); // 👈 الترجمة
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [selectedFacility, setSelectedFacility] = useState<number | null>(null);

  const itemsPerPage = 4;

  // فلترة الداتا
  const filteredFacilities = facilitiesData.filter((f) => {
    return (
      (categoryFilter ? f.category === categoryFilter : true) &&
      (locationFilter ? f.location === locationFilter : true) &&
      (priceFilter ? f.price <= Number(priceFilter) : true)
    );
  });

  const totalPages = Math.ceil(filteredFacilities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFacilities = filteredFacilities.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSelectedFacility(null);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSelectedFacility(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* الفلاتر */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border rounded px-3 py-2"
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">{t("filters.category")}</option>
          <option value="Sports">{t("filters.sports")}</option>
          <option value="Education">{t("filters.education")}</option>
          <option value="Health">{t("filters.health")}</option>
        </select>

        <select
          className="border rounded px-3 py-2"
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="">{t("filters.location")}</option>
          <option value="Riyadh">{t("filters.riyadh")}</option>
          <option value="Jeddah">{t("filters.jeddah")}</option>
        </select>

        <select
          className="border rounded px-3 py-2"
          onChange={(e) => setPriceFilter(e.target.value)}
        >
          <option value="">{t("filters.maxPrice")}</option>
          <option value="500">500</option>
          <option value="600">600</option>
          <option value="700">700</option>
          <option value="800">800</option>
        </select>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* الكروت */}
        <div className="lg:w-[55%] flex flex-col gap-4 items-center">
          {currentFacilities.map((facility) => (
            <div
              key={facility.id}
              className={`w-full lg:w-[90%] cursor-pointer ${
                selectedFacility === facility.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => window.location.href=`/userview/allFacilities/${facility.id}`}
            >
              <FacilityCard {...facility} />
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-center mt-4 gap-2 mb-16 items-center flex-wrap">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              {t("pagination.prev")}
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages > 6) {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return true;
                  }
                  return false;
                }
                return true;
              })
              .map((page, index, arr) => {
                const prevPage = arr[index - 1];
                return (
                  <div key={page} className="flex">
                    {prevPage && page - prevPage > 1 && (
                      <span className="px-2">...</span>
                    )}
                    <button
                      onClick={() => {
                        setCurrentPage(page);
                        setSelectedFacility(null);
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                );
              })}

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              {t("pagination.next")}
            </button>
          </div>
        </div>

        {/* الماب */}
        <div className="lg:w-[50%] w-full h-[400px] lg:h-[690px] mb-10 -z-10 shadow-2xl shadow-gray-400">
          <MapContainer
            center={[24.7136, 46.6753]}
            zoom={12}
            scrollWheelZoom={false}
            className="h-full w-full rounded-xl shadow"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <MapUpdater facilities={currentFacilities} />

            {currentFacilities.map((facility) => (
              <Marker
                key={facility.id}
                position={[facility.lat, facility.lng]}
                icon={markerIcon}
              >
                <Popup>
                  <b>{facility.name}</b>
                  <br />
                  {facility.location}
                  <br />
                  {t("facility.priceUnit", { price: facility.price })}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}