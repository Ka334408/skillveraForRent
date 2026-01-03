"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import axiosInstance from "@/lib/axiosInstance";
import { Star, Map as MapIcon, ChevronRight, X, Navigation, LocateFixed } from "lucide-react";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });

export default function LiveMap() {
  const t = useTranslations("map");
  const locale = useLocale();
  const isRTL = locale === "ar";
  
  const [places, setPlaces] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number]>([30.0444, 31.2357]);
  const [icons, setIcons] = useState<{ user: any; place: any } | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  useEffect(() => {
    import("leaflet").then((L) => {
      const createIcon = (color: string, isUser = false) => L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color};" class="${isUser ? 'user-blob' : 'marker-blob'}"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      setIcons({
        user: createIcon("#3b82f6", true),
        place: createIcon("#0E766E")
      });
    });
  }, []);

  const fetchNearest = async (lat: number, lng: number) => {
    try {
      const { data } = await axiosInstance.get("/guest-facility/nearest", {
        params: { latLong: `${lat},${lng}`, limit: 8 },
      });
      const results = (data?.data || []).map((f: any) => ({
        id: f.id,
        name: isRTL ? f.name?.ar : f.name?.en,
        lat: parseFloat(f.address_lat_long?.split(",")[0]),
        lng: parseFloat(f.address_lat_long?.split(",")[1]),
        cover: f.cover,
        price: f.price,
        rate: f.rate || 4.5
      })).filter((p: any) => !isNaN(p.lat));
      setPlaces(results);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
        fetchNearest(latitude, longitude);
      },
      () => fetchNearest(30.0444, 31.2357)
    );
  }, [locale]);

  if (!icons) return null;

  return (
    <section className="py-16 px-4 md:px-8 dark:bg-zinc-950 transition-colors duration-500">
      <div className="max-w-[1200px] mx-auto">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#0E766E] font-bold text-sm tracking-widest uppercase">
              <LocateFixed size={18} />
              <span>{t("live_view") || "Discovery Mode"}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white leading-tight">
              {t("title") || "Explore Facilities Nearby"}
            </h2>
          </div>
          <div className="hidden md:block text-end">
             <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-xs text-sm">
                {t("subtitle") || "Find the best rated places around you on the live interactive map."}
             </p>
          </div>
        </div>

        {/* --- Map Container --- */}
        <div className="relative h-[450px] md:h-[550px] w-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-white dark:border-zinc-900 transition-all">
          
          <MapContainer
            center={userLocation}
            zoom={13}
            className="h-full w-full z-0"
            zoomControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            <Marker position={userLocation} icon={icons.user} />

            {places.map((p) => (
              <Marker 
                key={p.id} 
                position={[p.lat, p.lng]} 
                icon={icons.place}
                eventHandlers={{ click: () => setSelectedPlace(p) }}
              />
            ))}
          </MapContainer>

          {/* --- Floating Overlay (Glassmorphism) --- */}
          <div className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} z-[500] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg px-4 py-3 rounded-2xl border border-white/20 shadow-lg flex items-center gap-3`}>
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[11px] font-black text-zinc-700 dark:text-zinc-200 uppercase tracking-wider">
               {places.length} Places Found
             </span>
          </div>

          {/* --- Interactive Selected Card --- */}
          {selectedPlace && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[92%] max-w-[380px] animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-3 shadow-2xl border border-zinc-100 dark:border-white/5 relative">
                <button 
                  onClick={() => setSelectedPlace(null)}
                  className="absolute -top-2 -right-2 bg-white dark:bg-zinc-800 p-1.5 rounded-full shadow-md border border-zinc-100 dark:border-zinc-700 hover:scale-110 transition-transform"
                >
                  <X size={14} className="text-zinc-500" />
                </button>

                <div className="flex gap-4 items-center">
                  <div className="relative w-20 h-20 shrink-0 rounded-[1.2rem] overflow-hidden">
                    <img 
                      src={`/api/media?media=${selectedPlace.cover}`} 
                      className="object-cover w-full h-full" 
                      alt={selectedPlace.name} 
                    />
                  </div>
                  
                  <div className="flex-grow pr-2">
                    <h4 className="font-bold text-zinc-800 dark:text-white text-base line-clamp-1">{selectedPlace.name}</h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-bold text-zinc-400">{selectedPlace.rate} Rating</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[#0E766E] font-black text-lg">${selectedPlace.price}<span className="text-[9px] text-zinc-400 font-medium">/day</span></span>
                      
                      <Link href={`/userview/allFacilities/${selectedPlace.id}`}>
                        <button className="bg-[#0E766E] text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-[#0a5d56] transition-colors">
                          Details
                          <ChevronRight size={14} className={isRTL ? 'rotate-180' : ''} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .marker-blob, .user-blob {
          width: 18px; height: 18px; border-radius: 50%;
          border: 3px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          cursor: pointer; transition: transform 0.3s ease;
        }
        .marker-blob { animation: pulse-marker 2s infinite; }
        .user-blob { 
          border-color: #3b82f6; 
          animation: pulse-user 2s infinite;
        }
        
        @keyframes pulse-marker {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(14, 118, 110, 0.5); }
          70% { transform: scale(1.2); box-shadow: 0 0 0 10px rgba(14, 118, 110, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(14, 118, 110, 0); }
        }
        @keyframes pulse-user {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
          70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .leaflet-container { border-radius: 2.5rem; background: #f8fafc !important; }
      `}</style>
    </section>
  );
}