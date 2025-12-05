"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { useUserStore } from "@/app/store/userStore";

export default function ReservationSteps() {
  const router = useRouter();
  const { token } = useUserStore();  

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // ===== تحقق من تسجيل الدخول =====
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
  }, [token]);

  const handleLoginRedirect = () => {
    router.push("/auth/signUp");
  };

  // =======================
  // 🧾 Payment Form State
  // =======================
  const [form, setForm] = useState({
    cardNumber: "",
    expiration: "",
    cvv: "",
    street: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    country: "Egypt",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // =======================
  // ✅ Validation Function
  // =======================
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!/^\d{16}$/.test(form.cardNumber.replace(/\s/g, "")))
      newErrors.cardNumber = "Please enter a valid 16-digit card number.";

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiration))
      newErrors.expiration = "Expiration must be in MM/YY format.";

    if (!/^\d{3,4}$/.test(form.cvv))
      newErrors.cvv = "Please enter a valid 3- or 4-digit CVV.";

    if (!form.street.trim()) newErrors.street = "Street address is required.";
    if (!form.city.trim()) newErrors.city = "City is required.";
    if (!form.state.trim()) newErrors.state = "State is required.";
    if (!form.zip.trim()) newErrors.zip = "ZIP code is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =======================
  // 🧩 Handle Submit
  // =======================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setSuccessMsg("✅ Payment info saved successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        setShowPaymentModal(false);
      }, 1500);
    } else {
      setSuccessMsg("");
    }
  };

  return (
    <div className="space-y-6">
      {/* العنوان */}
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
          <span className="text-sm font-medium">
            ✅ You’re logged in successfully
          </span>
        )}
      </div>

      {/* الخطوة 2 */}
      <div className="bg-[#0E766E] text-white rounded-lg p-4 flex justify-between items-center">
        <p>2. Add payment method</p>

        {isLoggedIn && (
          <button
            onClick={() => setShowPaymentModal(true)}
            className="bg-white text-[#0E766E] px-4 py-1 rounded-md font-medium"
          >
            Continue
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
            {/* زر الإغلاق */}
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ✕
            </button>

            {/* العنوان */}
            <div className=" items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Add a payment method
              </h2>
              <div className="flex gap-2 text-3xl text-[#0E766E]">
                <FaCcVisa />
                <FaCcMastercard />
              </div>
            </div>

            {/* فورم الدفع */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* ... نفس الفورم الموجود في كودك ... */}
              <button
                type="submit"
                className="w-full mt-4 bg-[#0E766E] text-white py-2 rounded-md font-medium hover:bg-[#095F59]"
              >
                Next
              </button>

              {successMsg && (
                <p className="text-green-600 text-center mt-3">{successMsg}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}