"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";

interface Reservation {
  id: number;
  providerRevenue: number;
  updatedAt: string;
  facility: {
    id: number;
    name: {en :string,ar:string};
    cover?: string | null;
  };
}

export default function AccountBalanceCard() {
  const [balance, setBalance] = useState<number>(0);
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch balance
        const balanceRes = await axiosInstance.get("/provider/balance");
        setBalance(balanceRes.data?.data?.balance ?? 0);

        // 2️⃣ Fetch recent reservations
        const reservationsRes = await axiosInstance.get("/provider/recent-reservations");
        let reservations: Reservation[] = reservationsRes.data?.data || [];

        // 3️⃣ Sort by updatedAt descending and take top 3
        reservations.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setRecentReservations(reservations.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
<div>
      {/* Account Balance Card */}
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="bg-[#0E766E] text-white rounded-2xl p-4 flex justify-between items-start">
          <div>
            <p className="text-sm opacity-80">Account Balance</p>
            <h2 className="text-2xl font-bold">
              {loading ? "Loading..." : balance.toLocaleString()} SR
            </h2>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className="w-12 h-6 rounded-full border border-white opacity-70 flex items-center justify-center">
              ~
            </span>
          </div>
        </div>

      {/* Recent Reservations Card */}
      <div className="bg-white rounded-2xl  p-4 mt-2">
        <p className="text-gray-500 text-sm mb-3">Recent Reservations</p>
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : recentReservations.length === 0 ? (
          <p className="text-gray-400 text-sm">No recent reservations</p>
        ) : (
          <ul className="space-y-3">
            {recentReservations.map((res) => (
              <li key={res.id} className="flex items-center justify-between gap-3">
                {/* Cover + Info */}
                <div className="flex items-center gap-3">
                  {res.facility.cover ? (
                    <img
                      src={res.facility.cover.startsWith("http") ? res.facility.cover : `/api/media?media=${res.facility.cover}`}
                      alt={res.facility.name.en}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      N/A
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-gray-400"># {res.id}</p>
                    <p className="text-sm font-semibold">{res.facility.name.en}</p>
                    
                  </div>
                </div>

                {/* Revenue */}
                <div className="text-green-600 font-semibold">
                 + {res.providerRevenue.toLocaleString()} SR
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </div>
  );
}