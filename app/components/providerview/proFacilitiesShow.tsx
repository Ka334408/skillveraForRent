"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import FacilityCard from "../mainComponents/profacilityCard";

const facilities = [
  { id: 1222, name: "Sports Center", image: "/stadium.jpg" },
  { id: 1223, name: "Library", image: "/school.jpg" },
  { id: 1224, name: "house", image: "/herosec.png" },
  { id: 1225, name: "Swimming Pool", image: "/hotal.jpg" },
];

export default function MyFacilities() {
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const filteredFacilities = facilities.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toString().includes(search)
  );

  return (
    <section className="bg-gray-100 p-6 rounded-xl shadow w-full my-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h2 className="text-xl font-bold text-gray-800">My Facilities</h2>

        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm hover:bg-gray-200 transition"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>

          {showFilter && (
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="absolute right-0 mt-2 border rounded-lg px-3 py-2 text-sm w-56 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      </div>

      {/* Responsive Layout */}
      {/* ✅ موبايل → تحت بعض (list) */}
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:hidden">
  {filteredFacilities.map((facility) => (
    <FacilityCard
      key={facility.id}
      id={facility.id}
      name={facility.name}
      image={facility.image}
    />
  ))}
</div>

{/* ✅ Tablet & Desktop → Grid */}
<div className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {filteredFacilities.map((facility) => (
    <FacilityCard
      key={facility.id}
      id={facility.id}
      name={facility.name}
      image={facility.image}
    />
  ))}
</div>

      {/* View All */}
      <div className="mt-4 text-right">
        <button className="text-blue-600 font-semibold hover:underline">
          View all →
        </button>
      </div>
    </section>
  );
}