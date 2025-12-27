"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import axiosInstance from "@/lib/axiosInstance";

// Dynamic imports to prevent SSR errors
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

export default function LiveMap() {
  const t = useTranslations("map");
  const [places, setPlaces] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number]>([
    30.0444, 31.2357, // Default Cairo
  ]);
  const [icons, setIcons] = useState<{ user: any; place: any } | null>(null);

  // 1. Initialize Leaflet Icons
  useEffect(() => {
    import("leaflet").then((L) => {
      setIcons({
        user: new L.Icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png",
          iconSize: [38, 38],
          iconAnchor: [19, 38],
        }),
        place: new L.Icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
          iconSize: [38, 38],
          iconAnchor: [19, 38],
        }),
      });
    });
  }, []);

  // 2. Fetch Nearest Facilities
  const fetchNearestFacilities = async (lat: number, lng: number) => {
    try {
      const latLongString = `${lat},${lng}`;

      const { data } = await axiosInstance.get("/guest-facility/nearest", {
        params: {
          latLong: latLongString,
          limit: 4,
        },
      });

      // Parsing the specific response structure provided
      const results = (data?.data || []).map((f: any) => {
        let finalLat = null;
        let finalLng = null;

        // Split "30.1341759,31.3655983" string into separate numbers
        if (f.address_lat_long && typeof f.address_lat_long === "string") {
          const [latStr, lngStr] = f.address_lat_long.split(",");
          finalLat = parseFloat(latStr);
          finalLng = parseFloat(lngStr);
        }

        return {
          id: f.id,
          name: f.name?.en || "Facility",
          lat: finalLat,
          lng: finalLng,
          cover: f.cover,
        };
      }).filter((p: any) => p.lat !== null && p.lng !== null); // Remove any with invalid coordinates

      setPlaces(results);
    } catch (error) {
      console.error("Error fetching nearest facilities:", error);
    }
  };

  // 3. Get User Geolocation
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation([latitude, longitude]);
          fetchNearestFacilities(latitude, longitude);
        },
        () => {
          console.warn("Geolocation denied. Using default location.");
          fetchNearestFacilities(30.0444, 31.2357);
        }
      );
    } else {
      fetchNearestFacilities(30.0444, 31.2357);
    }
  }, []);

  if (!icons) return <div className="text-center py-20 font-bold text-[#0E766E]">Loading Map Configuration...</div>;

  return (
    <div className="bg-[#f3f4f4]">
      <section className="px-6 py-12 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-black">
          {t("title")}
        </h2>
        <p className="text-gray-600 mb-6 font-medium">
          {t("subtitle")}
        </p>

        <div className="w-full h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white relative z-10">
          <MapContainer
            key={`${userLocation[0]}-${userLocation[1]}`} // Re-centers map when location updates
            center={userLocation}
            zoom={13}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User Marker - Safe check for numbers */}
            {typeof userLocation[0] === 'number' && (
               <Marker position={userLocation} icon={icons.user}>
                 <Popup>You are here!</Popup>
               </Marker>
            )}

            {/* Nearest Facility Markers */}
            {places.map((p) => {
              // Final safety check to prevent "undefined" error in Leaflet
              if (!p.lat || !p.lng) return null;

              return (
                <Marker key={p.id} position={[p.lat, p.lng]} icon={icons.place}>
                  <Popup>
                    <div className="text-center min-w-[150px] p-1">
                      {p.cover && (
                        <img 
                          src={`/api/media?media=${p.cover}`} 
                          alt={p.name} 
                          className="w-full h-20 object-cover rounded-lg mb-2"
                        />
                      )}
                      <p className="font-bold text-gray-800 mb-2">{p.name}</p>
                      <Link
                        href={`/userview/allFacilities/${p.id}`}
                        className="text-black px-4 py-2 rounded-xl text-xs font-bold block no-underline hover:bg-[#095f59] transition-all"
                      >
                        View Facility
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </section>

      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 1.5rem;
          padding: 4px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .leaflet-container {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}