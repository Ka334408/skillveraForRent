"use client";

import { useState, useEffect } from "react";
import { DateRange, Range } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useLocale, useTranslations } from "next-intl";
import { useFacilityStore } from "@/app/store/facilityStore";
import axiosInstance from "@/lib/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import { useUserStore } from "@/app/store/userStore";

export default function FacilityCalendar() {
  const locale = useLocale();
  const t = useTranslations("FacilityCalendar");

  const facility = useFacilityStore((state) => state.facility);
  const {user} = useUserStore();

  const [isMobile, setIsMobile] = useState(false);
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate();

    const paddedMonth = String(month).padStart(2, '0');
    const paddedDay = String(day).padStart(2, '0');

    return `${year}-${paddedMonth}-${paddedDay}`;
};

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [range, setRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  if (!facility) return <p className="py-10 text-center">Loading...</p>;

  const start = range.startDate!;
  const end = range.endDate!;

  const bookedDates: string[] = []; // لو عايز تجيبها من API أو store لاحقًا

  const booked = bookedDates.map((d) => new Date(d).toDateString());

  let availableDays = 0;
  if (start && end) {
    const days: Date[] = [];
    let current = new Date(start);
    while (current <= end) {
      if (!booked.includes(current.toDateString())) {
        days.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    availableDays = days.length;
  }

  const totalPrice = availableDays * facility.price;

  const handleRentNow = async () => {
    if (!facility) return;
    const formattedStartDate = formatLocalDate(start);
    const formattedEndDate = formatLocalDate(end);

    try {
      // call API check availability
      const res = await axiosInstance.get(
        `/guest-facility/${facility.id}/check-availability`,
        {
          params:{startDate: start.toISOString().split("T")[0],
          endDate: end.toISOString().split("T")[0],}
        }
      );
        
      const isAvailable = res.data.data?.isAvailable; // assuming API returns { available: boolean }

      if (isAvailable) {
        toast.success("Available");
        const reservationData = {
          id: facility.id,
          name: facility.name,
          image: facility.coverImage,
          price: totalPrice,
          start: formattedStartDate,
          end: formattedEndDate,
          username : user?.name,
        };
        localStorage.setItem("reservationData", JSON.stringify(reservationData));
        window.location.href = `/${locale}/userview/allFacilities/reservation`;
      } else {
        toast.error("Not Availabel");
      }
    } catch (err) {
      console.error(err);
      toast.error("Not Availabel");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white shadow-md rounded-xl py-6 w-full">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 rtl:mr-5 ml-5">{t("selectCheckIn")}</h3>
          <div className={`${isMobile ? "flex flex-col" : ""}`}>
            <DateRange
              editableDateInputs
              onChange={(item) => setRange(item.selection)}
              moveRangeOnFirstSelection={false}
              ranges={[range]}
              months={2}
              direction={isMobile ? "vertical" : "horizontal"}
              showDateDisplay={false}
              minDate={new Date()}
              disabledDates={booked.map((d) => new Date(d))}
              rangeColors={["#0E766E"]}
            />
          </div>

          <button
            onClick={() => setRange({ startDate: new Date(), endDate: new Date(), key: "selection" })}
            className="mt-4 ml-5 rtl:mr-5 text-sm text-[#0E766E] underline"
          >
            {t("clearDates")}
          </button>
        </div>

        {/* Sidebar Box */}
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between w-full">
          <div className="flex-1">
            {availableDays > 0 ? (
              <>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {totalPrice} R {t("forDays", { count: availableDays })}
                </h3>
                <div className="flex flex-col gap-2 mb-4 text-sm mt-0 sm:mt-32">
                  <div className="flex justify-between border rounded-md p-2">
                    <span className="font-medium">{t("checkIn")}</span>
                    <span>{start?.toLocaleDateString("en-GB")}</span>
                  </div>
                  <div className="flex justify-between border rounded-md p-2">
                    <span className="font-medium">{t("checkOut")}</span>
                    <span>{end?.toLocaleDateString("en-GB")}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm mb-4">
                {t("pleaseSelect")}
              </div>
            )}
          </div>

          <button
            disabled={!start || !end || availableDays === 0}
            onClick={handleRentNow}
            className={`rounded-lg py-3 font-semibold transition ${
              !start || !end || availableDays === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#0E766E] text-white hover:bg-[#095f55]"
            }`}
          >
            {t("rentNow")}
          </button>
        </div>
      </div>
    </>
  );
}