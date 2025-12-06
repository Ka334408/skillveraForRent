"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Star, DollarSign } from "lucide-react";

// Define the data structure based on the actual API response
interface Reservation {
  id: number;
  updatedAt: string;
  facilityId: number;
  facility: {
    id: number;
    name: { en: string };
    rate: number;
  };
  rate: number | null;
}

// Define the structure for the processed Facility data
interface FacilityRating {
  id: number;
  name: string;
  rate: number;
  reservationId: number;
}

export default function FinancialSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratedFacilities, setRatedFacilities] = useState<FacilityRating[]>([]);

  // Function to fetch and process data
  useEffect(() => {
    const fetchRatedFacilities = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch recent reservations (We fetch a large batch to try and capture all rated facilities)
        const res = await axiosInstance.get("/provider/recent-reservations", {
          withCredentials: true,
          params: {
            limit: 50, // Increase limit to retrieve more data
            // 🛑 REMOVED: No sorting parameter is passed to the API
          }
        });

        const data: Reservation[] = res.data?.data || [];

        // 1. Filter and Process: Extract the rating from the nested facility object
        const ratedReservations = data.filter(r =>
          // Ensure facility object exists and it has a positive rate
          r.facility && r.facility.rate !== undefined && r.facility.rate !== null && r.facility.rate > 0
        );

        const processedRatings: FacilityRating[] = ratedReservations.map(r => ({
          id: r.facility.id,
          name: r.facility.name.en,
          rate: r.facility.rate,
          reservationId: r.id,
        }));

        // 2. Aggregate and Deduplicate: Store the single rating found for each unique facility ID.
        // We use the most recent reservation to grab the rating for each facility ID.
        const facilityMap = new Map<number, FacilityRating>();

        // Because the API response is likely sorted by update time (most recent first), 
        // using the Map automatically keeps the latest rating/reservation entry found for each facility.
        for (const item of processedRatings) {
          if (!facilityMap.has(item.id)) {
            facilityMap.set(item.id, item);
          }
        }

        let uniqueRatedFacilities = Array.from(facilityMap.values());

        // 🛑 REMOVED: Client-side sorting by rate is removed.
        // The list is implicitly ordered by the last time a reservation appeared in the API response.

        // 4. Display up to the first 10 facilities
        setRatedFacilities(uniqueRatedFacilities.slice(0, 10));

      } catch (err: any) {
        console.error("API Error:", err);
        setError(err?.response?.data?.message || "Failed to load rated facilities.");
      } finally {
        setLoading(false);
      }
    };

    fetchRatedFacilities();
  }, []);

  // --- Helper Components ---

  /**
   * Renders a star rating based on the rate value.
   * @param rate The rating (e.g., 1.5, 4, 5)
   */
  const StarRating = ({ rate }: { rate: number }) => {
    // Round the rate to the nearest integer for display
    const fullStars = Math.round(rate);
    const stars = Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < fullStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
    return <div className="flex items-center space-x-0.5">{stars}</div>;
  };

  // Content for the Right Section
  const FeedbackContent = () => {
    if (loading) {
      return <div className="text-center text-gray-500 py-4">Loading rated facilities...</div>;
    }
    if (error) {
      return <div className="text-center text-red-600 font-medium py-4">{error}</div>;
    }
    if (ratedFacilities.length === 0) {
      return <div className="text-center text-gray-500 py-4">No rated facilities found in recent reservations list.</div>;
    }

    return (
      <div className="space-y-4 max-h-[150px] overflow-y-auto pr-2"> {/* Added scroll bar */}
        {ratedFacilities.map((item) => (
          <div key={item.id} className="flex flex-col border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
            <div className="flex items-center justify-between">
              <span className="bg-[#0E766E] text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                ID: {item.id}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-md font-extrabold text-teal-700">{item.rate.toFixed(1)}</span>
                <StarRating rate={item.rate} />
              </div>
            </div>
            <span className="text-gray-700 text-sm mt-1 font-semibold line-clamp-1">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // --- Main Component Render ---
  return (
    <section className="w-full bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

        {/* Left side - text and Call to Action */}
        <div className="space-y-6">
          <h2 className="text-4xl font-extrabold text-[#0E766E] leading-snug">
            Reach financial goals faster 💰
          </h2>
          <p className="text-lg text-gray-600">
            Monitor revenue, simplify transactions, and manage provider finances efficiently.
          </p>
          <button className="px-8 py-3 bg-[#0E766E] text-white font-semibold rounded-xl shadow-lg hover:bg-[#075d55] transition transform hover:scale-[1.02]">
            <DollarSign className="inline w-5 h-5 mr-2" />
            Update Financial Info
          </button>
        </div>

        {/* Middle - card with hover animation */}
        <div className="flex justify-center">
          <div className="relative w-72 h-44 group cursor-pointer">
            {/* Card 1 */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#0E766E] to-indigo-400 rounded-xl shadow-2xl transform rotate-6 transition-transform duration-500 group-hover:-rotate-3 group-hover:translate-x-2"></div>

            {/* Card 2 - Mock Credit Card */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-2xl flex flex-col justify-center px-6 text-white font-semibold transform transition-transform duration-500 group-hover:rotate-6 group-hover:-translate-x-2">
              <span className="text-lg font-bold">Financial Overview</span>
              <span className="text-2xl tracking-widest mt-2">
                XXXX XXXX XXXX 7812
              </span>
              <div className="flex justify-between text-sm mt-4 font-medium">
                <span>Total Balance: $XX,XXX</span>
                <span>Valid Thru: 05/24</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Feedback and Rating (All Rated Facilities) */}
        <div className="bg-white rounded-xl shadow-xl p-6 space-y-4 border-t-4 border-[#0E766E] min-h-[250px] flex flex-col justify-start">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
            All Rated Facilities <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          </h3>

          <FeedbackContent />
        </div>
      </div>
    </section>
  );
}