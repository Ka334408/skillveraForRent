"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { CheckCircle2, MapPin } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useFacilityStore } from "@/app/store/facilityStore";

// استدعاء مكونات الخريطة ديناميكياً
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

export default function FacilityMapSection() {
  const t = useTranslations("facilityMap");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const facility = useFacilityStore((state: any) => state.facility);
  const [customIcon, setCustomIcon] = useState<any>(null);

  // إعداد الأيقونة المضيئة (نفس ستايل الصفحة السابقة)
  useEffect(() => {
    import("leaflet").then((L) => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: #0E766E;" class="marker-blob"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });
      setCustomIcon(icon);
    });
  }, []);

  if (!facility) return null;

  // تأكد من وجود الإحداثيات، وإلا استخدم إحداثيات افتراضية
  const lat = facility.location?.lat || 24.7136;
  const lng = facility.location?.lng || 46.6753;
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
    <div className="py-16 border-t border-gray-100 dark:border-zinc-800" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-[#0E766E] p-2.5 rounded-2xl shadow-lg shadow-teal-900/20">
          <MapPin className="text-white" size={22} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            {t("title")}
          </h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Location & Amenities</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
        
        {/* الخريطة بنفس ستايل الحواف والظل */}
        <div className="h-[450px] w-full rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-0 relative bg-zinc-100">
          {customIcon && (
            <MapContainer 
              center={[lat, lng]} 
              zoom={15} 
              scrollWheelZoom={false} 
              className="h-full w-full"
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lng]} icon={customIcon}>
                <Popup>
                  <div className="text-center font-black text-[#0E766E] p-1">
                    {facility.name?.[locale] || facility.name?.en || facility.name}
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          )}
          
          {/* الـ Badge الصغير فوق الخريطة */}
          <div className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} z-[500] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-sm flex items-center gap-2`}>
            <div className="w-2 h-2 rounded-full bg-[#0E766E] animate-pulse" />
            <span className="text-[10px] font-black text-zinc-600 dark:text-zinc-300 uppercase tracking-widest">Live Location</span>
          </div>
        </div>

        {/* جانب المميزات */}
        <div className="flex flex-col justify-between py-2">
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#0E766E] mb-6">
                {t("info")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featuresToDisplay.map((f: string, i: number) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-4 bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 p-5 rounded-[1.5rem] shadow-sm hover:border-[#0E766E]/30 transition-all group"
                  >
                    <div className="bg-[#0E766E]/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="text-[#0E766E] w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* عنوان المرفق أسفل المميزات */}
          <div className="mt-8 p-6 bg-zinc-50 dark:bg-zinc-900/80 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 flex items-start gap-4">
             <div className="bg-white dark:bg-zinc-800 p-3 rounded-2xl shadow-sm">
                <MapPin className="text-[#0E766E]" size={20} />
             </div>
             <div>
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{t("addressLabel")}</p>
               <p className="text-sm text-gray-600 dark:text-gray-300 font-bold leading-relaxed">
                 {address}
               </p>
             </div>
          </div>
        </div>
      </div>

      {/* الـ Styles الخاصة بالماركر والأنيميشن */}
      <style jsx global>{`
        .marker-blob {
          width: 20px; height: 20px; border-radius: 50%;
          border: 4px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          cursor: pointer; animation: pulse-marker 2s infinite;
        }
        @keyframes pulse-marker {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(14, 118, 110, 0.6); }
          70% { transform: scale(1.2); box-shadow: 0 0 0 12px rgba(14, 118, 110, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(14, 118, 110, 0); }
        }
        .leaflet-container { border-radius: 2rem; background: #f8fafc !important; }
        .leaflet-popup-content-wrapper { border-radius: 1rem; padding: 5px; }
      `}</style>
    </div>
  );
}