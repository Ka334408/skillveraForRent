"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { CheckCircle2, MapPin } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useFacilityStore } from "@/app/store/facilityStore";

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function FacilityMapSection() {
  const t = useTranslations("facilityMap");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const facility = useFacilityStore((state: any) => state.facility);

  if (!facility) return null;

  const { lat, lng } = facility.location;
  const address = facility.address || (isRTL ? "موقع غير معروف" : "Unknown Location");

  const defaultFeatures = [
    t("features.support"),
    t("features.accessibility"),
    t("features.safety"),
    t("features.quality")
  ];

  const featuresToDisplay = facility.features && facility.features.length > 0 
    ? facility.features 
    : defaultFeatures;

  return (
    <div className="py-10 border-t border-gray-100 dark:border-zinc-800" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="text-[#0E766E]" size={20} />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {t("title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="h-[350px] w-full rounded-[2rem] overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm z-0">
          <MapContainer 
            center={[lat, lng]} 
            zoom={14} 
            scrollWheelZoom={false} 
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]} icon={customIcon}>
              <Popup>
                <div className="text-center font-bold text-[#0E766E]">
                  {facility.name?.[locale] || facility.name?.en}
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
              {t("info")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {featuresToDisplay.map((f: string, i: number) => (
                <div 
                  key={i} 
                  className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-gray-50 dark:border-zinc-800 p-4 rounded-2xl shadow-sm transition-hover hover:border-[#0E766E]/30"
                >
                  <div className="bg-[#0E766E]/10 p-1.5 rounded-full">
                    <CheckCircle2 className="text-[#0E766E] w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-5 bg-teal-50/50 dark:bg-teal-900/10 rounded-2xl border border-teal-100/50 dark:border-teal-900/20">
             <p className="text-xs text-[#0E766E] font-medium leading-relaxed">
               <span className="font-bold block mb-1">{t("addressLabel")}:</span>
               {address}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}