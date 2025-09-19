"use client";
import { useEffect, useState } from "react";

interface Reservation {
  id: string;
  name: string;
  date: string;
}

export default function PastReservation() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // نداء للـ API
        const res = await fetch("/api/past-reservations"); 
        const data = await res.json();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-6">Past reservation</h1>

      {reservations.length === 0 ? (
        // الحالة الفاضية
        <div className="flex flex-col items-center justify-center text-center mt-20">
          <div className="w-16 h-16 border-2 border-blue-400 rounded-full flex items-center justify-center mb-4">
            <span className="text-blue-500 text-2xl">☹</span>
          </div>
          <p className="text-gray-600 max-w-sm mb-4">
            You’ll find your past reservations here after you’ve taken your first Rent on Skava
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Rent Now
          </button>
        </div>
      ) : (
        // جدول الحجوزات
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id} className="border-t">
                  <td className="px-6 py-3">{res.name}</td>
                  <td className="px-6 py-3">{res.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}