"use client";

import { useEffect, useState, useCallback, KeyboardEvent } from "react";
import { Filter, Search, Plus, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

// Define the primary color for reusability
const PRIMARY_COLOR = "#0E766E";

interface Facility {
  id: number;
  name: { en: string; ar: string };
  cover?: string | null;
  description?: { en: string; ar: string } | null;
  price?: number | null;
}

export default function MyFacilities() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  // 🚀 Initializing filter to null for clearer search state
  const [filter, setFilter] = useState<"name" | "id" | null>(null); 
  const [showFilter, setShowFilter] = useState(false);

  const router = useRouter();

  // 🚀 Memoized function to fetch facilities
  const fetchFacilities = useCallback(async (searchValue: string, filterBy: "name" | "id" | null) => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string | number> = {};
      
      const isNumber = /^\d+$/.test(searchValue);
      
      // Determine how to apply search based on the filter setting
      if (searchValue) {
        if (filterBy === "id" || (filterBy === null && isNumber)) {
            // Priority given to ID if explicitly filtered or if the input is purely numeric
            params.id = Number(searchValue);
            params.search = ""; // Ensure search parameter is not mixed up if using ID
        } else {
            // Default to search by name/general search
            params.search = searchValue;
            params.id = "";
        }
      }

      const res = await axiosInstance.get(`/provider-facility?limit=${4}`, {
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
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchFacilities(search, filter);
  }, [fetchFacilities]);


  // 🚀 Function to handle applying search/filter
  const handleApply = () => {
    fetchFacilities(search, filter);
    setShowFilter(false); // Close filter dropdown after applying
  };

  // 🚀 Function to handle search input key press (Enter)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleApply();
    }
  };

  // 🚀 Function to handle click and navigation
  const handleFacilityClick = (facilityId: number) => {
    router.push(`/providerview/dashBoardHome/myFacilities/${facilityId}`);
  };

  return (
    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full my-6 min-h-[400px]">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 border-b pb-4">
        <h2 className="text-3xl font-extrabold text-gray-900">My Facilities</h2>

        <div className="flex gap-3 items-center flex-wrap">
          
          {/* Search Input and Apply Button */}
          <div className="flex relative">
            <input
              type={filter === 'id' ? 'number' : 'text'}
              placeholder={`Search by ${filter || 'name'}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border rounded-l-lg px-4 py-2.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              aria-label={`Search facility by ${filter || 'name'}`}
            />
            <button
              onClick={handleApply}
              className={`bg-gray-800 text-white px-4 py-2.5 rounded-r-lg hover:bg-gray-700 transition text-sm flex items-center gap-1`}
              aria-label="Apply search filter"
            >
                <Search className="w-4 h-4" />
                Apply
            </button>
          </div>
          
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2.5 text-sm hover:bg-gray-100 transition text-gray-700"
              aria-expanded={showFilter}
              aria-controls="filter-menu"
            >
              <Filter className="w-4 h-4 text-teal-600" />
              <span className="font-medium">{filter ? filter.charAt(0).toUpperCase() + filter.slice(1) : 'Filter'}</span>
            </button>

            {showFilter && (
              <div id="filter-menu" className="absolute right-0 top-full mt-2 border border-gray-200 rounded-lg shadow-xl bg-white p-2 z-50 w-32">
                <button
                    onClick={() => { setFilter("name"); setShowFilter(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${filter === 'name' ? 'bg-teal-100 text-teal-800 font-semibold' : 'hover:bg-gray-100'}`}
                >
                    Name
                </button>
                <button
                    onClick={() => { setFilter("id"); setShowFilter(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${filter === 'id' ? 'bg-teal-100 text-teal-800 font-semibold' : 'hover:bg-gray-100'}`}
                >
                    ID
                </button>
              </div>
            )}
          </div>

          {/* Add New Facility Button */}
          <button
            onClick={() => router.push("/providerview/dashBoardHome/myFacilities/addNewFacility")}
            className={`bg-teal-600 text-white px-4 py-2.5 rounded-lg hover:bg-teal-700 transition text-sm font-semibold flex items-center gap-2`}
          >
             <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-48">
          <p className="text-xl text-gray-500 animate-pulse">Loading facilities...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center justify-center h-48">
          <p className="text-red-600 bg-red-100 p-4 rounded-lg border border-red-300 font-medium">{error}</p>
        </div>
      )}

      {/* Facilities Grid */}
      {!loading && facilities.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {facilities.map((facility) => (
            // 🚀 The facility card is now clickable
            <div
              key={facility.id}
              onClick={() => handleFacilityClick(facility.id)}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden 
                         cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-teal-400"
            >
              
              {/* Image and ID */}
              <div className="h-40 bg-gray-200 flex items-center justify-center relative">
                {/* ID Badge */}
                <span className="absolute top-2 left-2 bg-black bg-opacity-40 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">
                    ID: {facility.id}
                </span>

                {facility.cover ? (
                  <img
                    src={
                      facility.cover.startsWith("http")
                        ? facility.cover
                        : `/api/media?media=${facility.cover}`
                    }
                    alt={facility.name.en}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 font-semibold">{facility.name.en}</span>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col justify-between h-[120px]"> 
                <h3 className="font-extrabold text-lg text-gray-900 line-clamp-1">{facility.name.en}</h3>
                
                {/* Description - Safely accessing .en */}
                {facility.description && (
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {facility.description.en || (typeof facility.description === 'string' ? facility.description : 'No detailed description.')}
                  </p>
                )}
                
                {/* Price Badge */}
                {facility.price !== null && facility.price !== undefined && (
                  <p className="text-sm font-bold mt-2 flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-teal-600" />
                    <span className="text-teal-600 text-base">{facility.price}</span> SR
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* No Facilities */}
      {!loading && facilities.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 mt-8">
          <p className="text-gray-600 text-xl font-medium mb-4">You haven&apos;t added any facilities yet.</p>
          <button
            onClick={() => router.push("/providerview/dashBoardHome/myFacilities/addNewFacility")}
            className="bg-teal-600 text-white px-8 py-3 rounded-xl hover:bg-teal-700 transition shadow-md font-semibold"
          >
            <Plus className="inline w-5 h-5 mr-2" />
            Create Your First Facility
          </button>
        </div>
      )}

      {/* View All (Simplified, since this component likely views all by default) */}
      {facilities.length > 0 && search && (
        <div className="mt-6 text-center border-t pt-4">
          <button
            className="text-gray-500 font-medium hover:text-teal-600 transition"
            onClick={() => {
                setSearch("");
                setFilter(null);
                fetchFacilities("", null); // Reset and fetch all
            }}
          >
            Clear Search and View All Facilities
          </button>
        </div>
      )}
    </section>
  );
}