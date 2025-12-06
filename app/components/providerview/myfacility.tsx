"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

type Facility = {
  id: number;
  name: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "RENTED";
  cover?: string | null;
  description?: string | null;
};

const statusColor = (s: Facility["status"]): string =>
  s === "PENDING"
    ? "text-yellow-500"
    : s === "REJECTED"
    ? "text-red-500"
    : s === "RENTED"
    ? "text-[#0E766E]"
    : "text-green-600";

export default function FacilitiesPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "active">("pending");
  const [facilitiesData, setFacilitiesData] = useState<{
    pending: Facility[];
    active: Facility[];
  }>({ pending: [], active: [] });
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/provider-facility", { withCredentials: true });
        const allFacilities: Facility[] = res.data?.data?.data || [];

        const pending: Facility[] = [];
        const active: Facility[] = [];

        allFacilities.forEach((f) => {
          if (f.status === "PENDING") pending.push(f);
          else if (f.status === "APPROVED") active.push(f);
        });

        setFacilitiesData({ pending, active });
      } catch (err) {
        console.error("Failed to fetch facilities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  const facilities = facilitiesData[activeTab];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#0E766E] mb-3">My Facilities</h2>

        {/* Tabs under title */}
        <div className="flex items-center gap-3">
          {(["pending", "active"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md font-medium transition ${
                activeTab === tab
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}

          <button
            onClick={() =>
              router.push("/providerview/dashBoardHome/myFacilities/addNewFacility")
            }
            className="ml-2 px-3 py-2 rounded-md bg-white border border-gray-200 hover:bg-gray-50"
            aria-label="Add facility"
          >
            +
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 animate-pulse">Loading facilities...</p>
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {facilities.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded shadow">
              No facilities in <strong>{activeTab}</strong>
            </div>
          ) : (
            facilities.map((f) => (
              <article
                key={f.id}
                className="bg-white rounded-lg shadow p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className={`text-sm font-semibold ${statusColor(f.status)}`}>
                      {f.status}
                    </div>
                    <div className="text-xs text-gray-400">#{f.id}</div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">⋯</button>
                </div>

                <div className="w-full h-36 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                  {f.cover ? (
                    <img
                      src={
                        f.cover.startsWith("http")
                          ? f.cover
                          : `/api/media?media=${f.cover}`
                      }
                      alt={f.name}
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://via.placeholder.com/600x360?text=No+Image")
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">There is no photo</span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-800">{f.name.en}</h3>
                {f.description && (
                  <p className="text-sm text-gray-500 grow">{f.description.en}</p>
                )}
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}