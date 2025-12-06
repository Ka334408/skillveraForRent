"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaDownload, FaTimes, FaCreditCard } from "react-icons/fa";
import { useUserStore } from "@/app/store/userStore";
import axiosInstance from "@/lib/axiosInstance";
import jsPDF from "jspdf";

export default function ReservationSteps() {
  const router = useRouter();
  const { token } = useUserStore();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentURL, setPaymentURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false); 

  // 🚀 UPDATED: Added facilityName to the reservationData type
  const [reservationData, setReservationData] = useState<{
    id: string;
    start: string;
    end: string;
    price: string | number;
    username: string;
    name?: string; // Assume facilityName is now part of the data
  } | null>(null);
  
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    if (token) setIsLoggedIn(true);
  }, [token]);

  useEffect(() => {
    const stored = localStorage.getItem("reservationData");
    if (stored) setReservationData(JSON.parse(stored));
    else router.push("/userview/allFacilities");
  }, [router]);

  const handleLoginRedirect = () => router.push("/auth/signUp");

  const handlePaymentContinue = async () => {
    if (!isLoggedIn || !reservationData) return;

    try {
      setLoading(true);

      const { id, start, end } = reservationData;

      const { data } = await axiosInstance.post(
        `/user-facility/${id}/reserve`,
        { startDate: start, endDate: end },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.data.paymentUrl) {
        setPaymentURL(data.data.paymentUrl);
        setShowPaymentModal(true);
        setPaymentInitiated(true); 
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

  /**
   * 🚀 UPDATED: Redesigned PDF download logic to include Facility Name and User Name
   */
  const handleDownloadPDF = () => {
    if (!reservationData) return;
    const doc = new jsPDF();
    const { id, start, end, price, username, name } = reservationData;
    let y = 20;
    const lineSpacing = 10;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- Header ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("INVOICE", pageWidth / 2, y, { align: "center" });
    y += lineSpacing * 2;

    // --- Separator Line ---
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += lineSpacing;

    // --- Details Section (Top Left) ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Reservation ID: " + id, margin, y);
    y += lineSpacing * 0.7;
    doc.text("Date Generated: " + new Date().toLocaleDateString(), margin, y);
    y += lineSpacing * 2;

    // --- Billing Info (Top Right) ---
    const rightAlignX = pageWidth - margin;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Billed To:", rightAlignX, y, { align: "right" });
    y += lineSpacing;
    doc.setFont("helvetica", "normal");
    // Display User Name in the Billed To section
    doc.text(username ?? "N/A", rightAlignX, y, { align: "right" }); 
    y += lineSpacing;

    // Reset Y position for item details below the billing info
    y = y > 90 ? y : 90;

    // --- Item Details Table Header (Simulated) ---
    doc.setLineWidth(0.2);
    doc.setFillColor(230, 230, 230); // Light gray background for header
    doc.rect(margin, y, pageWidth - margin * 2, lineSpacing, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10); // Smaller font for header labels
    doc.setTextColor(50, 50, 50); // Darker text for header
    doc.text("Facility & User", margin + 5, y + 7); // Combined Facility & User
    doc.text("Period", pageWidth / 2, y + 7, { align: "center" });
    doc.text("Amount (R)", rightAlignX - 5, y + 7, { align: "right" });
    y += lineSpacing;

    // --- Item Details Row ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11); // Slightly larger font for content
    doc.setTextColor(0, 0, 0); // Black text for content
    
    // Line 1: Facility Name
    doc.setFont("helvetica", "bold");
    doc.text(name ?? "Facility Reservation", margin + 5, y + 5);
    
    // Line 2: User Name
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`User: ${username ?? "N/A"}`, margin + 5, y + 10);

    // Period and Amount (centered vertically)
    doc.setFontSize(11);
    doc.text(`${start} to ${end}`, pageWidth / 2, y + 7, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.text(`${price ?? "N/A"}`, rightAlignX - 5, y + 7, { align: "right" });
    
    y += lineSpacing * 2; // Extra space after item to account for two lines of text

    // --- Total Summary ---
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 + 10, y, rightAlignX, y); // Line above total
    y += lineSpacing * 0.5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("TOTAL:", pageWidth / 2 + 20, y, { align: "left" });
    doc.text(`${price ?? "N/A"} R`, rightAlignX - 5, y, { align: "right" });
    y += lineSpacing * 2;

    // --- Footer ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for your reservation.", pageWidth / 2, y, { align: "center" });

    doc.save(`invoice_${id}.pdf`);
  };

  if (!reservationData) return <p>Loading reservation data...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
        Reservation Process
      </h1>
      
      <hr className="border-t border-gray-200" />

      {/* Step 1: User Authentication */}
      <div className="bg-[#0E766E] text-white rounded-xl p-5 flex justify-between items-center shadow-lg">
        <p className="text-lg font-semibold">1. You must log in </p>
        {!isLoggedIn ? (
          <button
            onClick={handleLoginRedirect}
            className="bg-white text-[#0E766E] px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-md"
          >
            Sign Up / Log In
          </button>
        ) : (
          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white">
            <FaCheck className="text-[#0E766E] text-xl" />
          </span>
        )}
      </div>

      {/* Step 2: Proceed to Payment */}
      <div className={`rounded-xl p-5 flex justify-between items-center shadow-lg transition-all duration-300 ${isLoggedIn ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
        <p className="text-lg font-semibold">2. Proceed to Payment</p>
        {isLoggedIn && (
            paymentInitiated ? (
                <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white">
                    <FaCheck className="text-green-600 text-xl" />
                </span>
            ) : (
                <button
                    onClick={handlePaymentContinue}
                    className="bg-white text-green-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-md flex items-center space-x-2"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <FaCreditCard />
                            <span>Continue to Payment</span>
                        </>
                    )}
                </button>
            )
        )}
      </div>

      {/* Step 3: Review Reservation Details */}
      <div className="bg-[#0E766E] text-white rounded-xl p-5 flex justify-between items-center shadow-lg">
        <p className="text-lg font-semibold">3. Review Reservation Details</p>
        <button
          onClick={() => setShowInvoiceModal(true)}
          className="bg-white text-[#0E766E] px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-md"
        >
          Review Request
        </button>
      </div>

      <hr className="border-t border-gray-200" />

      {/* Payment Modal (unchanged) */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden p-6 relative shadow-2xl transform transition-all">
            <button
              onClick={() => { setShowPaymentModal(false); setPaymentURL(""); }}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition text-xl p-1"
              aria-label="Close payment modal"
            >
              <FaTimes />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Complete Payment</h2>

            {!paymentURL ? (
              <div className="text-center py-20 text-gray-600">
                <p className="animate-pulse">{loading ? "Loading payment gateway..." : "Preparing payment..."}</p>
              </div>
            ) : (
              // The iframe is the payment gateway, keep it
              <iframe
                src={paymentURL}
                className="w-full h-[600px] rounded-lg border-2 border-gray-200"
                title="Payment"
                allow="payment"
              />
            )}
          </div>
        </div>
      )}

      {/* 🚀 Invoice Modal (JSX) - UPDATED to show Facility Name */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl transform transition-all duration-300">
            <button
              onClick={() => setShowInvoiceModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition text-xl p-1"
              aria-label="Close invoice modal"
            >
              <FaTimes />
            </button>

            <header className="border-b pb-4 mb-6">
              <h2 className="text-3xl font-extrabold text-[#0E766E] text-center">Reservation Invoice</h2>
              <p className="text-center text-sm text-gray-500 mt-1">Generated: {new Date().toLocaleDateString()}</p>
            </header>

            {/* Billing Info */}
            <div className="flex justify-between items-start mb-6 border-b pb-4">
                <div>
                    <h3 className="text-md font-bold text-gray-700 uppercase tracking-wider">Facility</h3>
                    <p className="text-gray-600 mt-1 font-medium">{reservationData.name ?? "N/A"}</p>
                </div>
                <div className="text-right">
                    <h3 className="text-md font-bold text-gray-700 uppercase tracking-wider">Invoice No.</h3>
                    <p className="text-gray-600 mt-1">{reservationData.id}</p>
                </div>
            </div>

            {/* Item Details Table (Modern Flex/Grid Layout) */}
            <div className="bg-gray-50 p-4 rounded-lg">
              {/* Table Header */}
              <div className="grid grid-cols-3 gap-4 font-bold text-sm text-gray-700 border-b border-gray-200 pb-2 mb-2">
                <span className="col-span-1">Details</span>
                <span className="col-span-1 text-center">Dates</span>
                <span className="col-span-1 text-right">Amount</span>
              </div>
              
              {/* Table Row */}
              <div className="grid grid-cols-3 gap-4 text-md text-gray-800 py-2">
                <div className="col-span-1">
                    <p className="font-semibold">{reservationData.name ?? "Facility Reservation"}</p>
                    <p className="text-xs text-gray-500">User: {reservationData.username ?? "N/A"}</p>
                </div>
                <span className="col-span-1 text-center text-sm">
                    {reservationData.start} to {reservationData.end}
                </span>
                <span className="col-span-1 text-right font-medium">
                  {reservationData.price ?? "N/A"} R
                </span>
              </div>
            </div>

            {/* Total Summary */}
            <div className="flex justify-end mt-6">
              <div className="w-full max-w-xs p-4 text-black rounded-lg shadow-xl">
                <div className="flex justify-between text-lg font-bold">
                  <span>TOTAL DUE</span>
                  <span>{reservationData.price ?? "N/A"} R</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200 text-center">
                <button
                    onClick={handleDownloadPDF}
                    className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-600 transition flex items-center justify-center mx-auto space-x-2 font-semibold"
                >
                    <FaDownload />
                    <span>Download PDF Invoice</span>
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}