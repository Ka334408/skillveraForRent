"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { CheckCircle2 } from "lucide-react";

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png", // صورة في public/
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function FacilityMapSection({
  lat,
  lng,
  features,
  location,
}: {
  lat: number;
  lng: number;
  features?: string[];
  location:string;
}) {
  return (
    <div><p className="font-bold mb-5">{"This Facility is : "}{location}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      {/* الماب */}
      <div className="h-80 w-full rounded-xl overflow-hidden">
        <MapContainer
          center={[lat, lng]}
          zoom={14}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]} icon={customIcon}>
            <Popup>
              Facility location <br /> ({lat.toFixed(3)}, {lng.toFixed(3)})
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* الـ features */}
      <div >
        <h3 className="font-bold text-lg mb-4">
          Facility Information & Features
        </h3>
        <ul className="space-y-3">
          {features && features.length > 0 ? (
            features.map((f, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-lg shadow-sm"
              >
                <CheckCircle2 className="text-green-600 w-5 h-5" />
                <span>{f}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No features added yet.</p>
          )}
        </ul>
      </div>
    </div>
    </div>
  );
}