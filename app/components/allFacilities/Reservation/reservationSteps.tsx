"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { useUserStore } from "@/app/store/userStore";
import axiosInstance from "@/lib/axiosInstance"; // تأكد المسار

export default function ReservationSteps() {
  const router = useRouter();
  const { token } = useUserStore();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentURL, setPaymentURL] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [reservationData, setReservationData] = useState<any>(null);

  // ===== تحقق من تسجيل الدخول =====
  useEffect(() => {
    if (token) setIsLoggedIn(true);
  }, [token]);

  // ===== جلب بيانات الحجز من localStorage =====
  useEffect(() => {
    const stored = localStorage.getItem("reservationData");
    if (stored) {
      setReservationData(JSON.parse(stored));
    } else {
      router.push("/userview/allFacilities");
    }
  }, [router]);

  const handleLoginRedirect = () => router.push("/auth/signUp");

  // =======================
  // 💳 Handle Payment Continue (axiosInstance)
  // =======================
  const handlePaymentContinue = async () => {
    if (!isLoggedIn || !reservationData) return;

    try {
      setLoading(true);

      const { id, start, end } = reservationData;

      const { data } = await axiosInstance.post(
        `/user-facility/${id}/reserve`,
        {
          startDate: start,
          endDate: end,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data.data);
      if (data.data.paymentUrl) {
        setPaymentURL(data.data.paymentUrl);
        setShowPaymentModal(true);
      } else {
        alert("Payment URL not returned!");
      }
    } catch (err) {
      console.error(err);
      alert("Error while reserving.");
    } finally {
      setLoading(false);
    }
  };

  if (!reservationData) return <p>Loading reservation data...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
        Reservation
      </h1>

      {/* الخطوة 1 */}
      <div className="bg-[#0E766E] text-white rounded-lg p-4 flex justify-between items-center">
        <p>1. You need to log in or sign up first</p>
        {!isLoggedIn ? (
          <button
            onClick={handleLoginRedirect}
            className="bg-white text-[#0E766E] px-4 py-1 rounded-md font-medium"
          >
            Continue
          </button>
        ) : (
          <span className="text-sm font-medium">✅ You’re logged in successfully</span>
        )}
      </div>

      {/* الخطوة 2 */}
      <div className="bg-[#0E766E] text-white rounded-lg p-4 flex justify-between items-center">
        <p>2. Add payment method</p>
        {isLoggedIn && (
          <button
            onClick={handlePaymentContinue}
            className="bg-white text-[#0E766E] px-4 py-1 rounded-md font-medium"
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue"}
          </button>
        )}
      </div>

      {/* الخطوة 3 */}
      <div className="bg-[#0E766E] text-white rounded-lg p-4">
        <p>3. Review your request</p>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto p-6 relative shadow-lg">
            <button
              onClick={() => { setShowPaymentModal(false); setPaymentURL(""); }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ✕
            </button>

            {!paymentURL ? (
              <div className="text-center py-20">
                {loading ? "Loading payment..." : "Preparing payment..."}
              </div>
            ) : (
              <iframe
                src={paymentURL}
                className="w-full h-[500px] rounded-lg border"
                title="Payment"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}