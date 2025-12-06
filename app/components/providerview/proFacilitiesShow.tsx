"use client";

import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

interface Facility {
  id: number;
  name: string;
  cover?: string | null;
  description?: string | null;
  price?: number | null;
}

export default function MyFacilities() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"name" | "id">("name");

  const [showFilter, setShowFilter] = useState(false);

  const router = useRouter();

  const fetchFacilities = async (searchValue = "", filterBy: "name" | "id" = "name") => {
    try {
      setLoading(true);
      // 🔹 لو searchValue رقم → نبحث بالـ id، وإلا بالـ name
      const isNumber = /^\d+$/.test(searchValue);
      const params: Record<string, string | number> = {};
      if (searchValue) {
        if (isNumber) params.id = Number(searchValue);
        else params.search = searchValue;
      }

      const res = await axiosInstance.get("/provider-facility", {
        params,
        withCredentials: true,
      });

      let facilitiesArray = res.data?.data?.data || [];
      if (!Array.isArray(facilitiesArray)) facilitiesArray = [];
      setFacilities(facilitiesArray);
    } catch (err: any) {
      console.error("Failed to fetch facilities:", err);
      setError(err?.response?.data?.message || "Failed to load facilities");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleApply = () => {
    fetchFacilities(search, filter);
  };

  return (
    <section className="bg-gray-100 p-6 rounded-xl shadow w-full my-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
        <h2 className="text-xl font-bold text-gray-800">My Facilities</h2>

        <div className="flex gap-2 items-center flex-wrap">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-[#0E766E]"
          />

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-1 border rounded-lg px-3 py-2 text-sm hover:bg-gray-200 transition"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>

            {showFilter && (
              <div className="absolute right-0 mt-2 border rounded-lg shadow-lg bg-white p-2 z-50 w-32">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as "name" | "id")}
                  className="w-full border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E766E]"
                >
                  <option value="name">Name</option>
                  <option value="id">ID</option>
                </select>
              </div>
            )}
          </div>

          <button
            onClick={handleApply}
            className="bg-[#0E766E] text-white px-4 py-2 rounded-lg hover:bg-[#0c625b] transition text-sm"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500 animate-pulse">Loading facilities...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center justify-center h-32">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Facilities Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {!loading &&
          facilities.map((facility) => (
            <div
              key={facility.id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                {facility.cover ? (
                  <img
                    src={
                      facility.cover.startsWith("http")
                        ? facility.cover
                        : `/api/media?media=${facility.cover}`
                    }
                    alt={facility.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">{facility.name.en}</span>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-800">{facility.name.en}</h3>
                {facility.description && (
                  <p className="text-gray-500 text-sm mt-1">{facility.description.en}</p>
                )}
                {facility.price && (
                  <p className="text-[#0E766E] font-semibold mt-2">${facility.price}</p>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* View All */}
      <div className="mt-4 text-right">
        <button
          className="text-[#0E766E] font-semibold hover:underline"
          onClick={() => router.push("/providerview/dashBoardHome/myFacilities")}
        >
          View all →
        </button>
      </div>
    </section>
  );
}