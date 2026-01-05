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
import { Calendar as CalendarIcon, Info, RefreshCw } from "lucide-react";
import { arSA } from "date-fns/locale";

export default function FacilityCalendar() {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const t = useTranslations("FacilityCalendar");

  const facility = useFacilityStore((state: any) => state.facility);
  const { user } = useUserStore();

  const [isMobile, setIsMobile] = useState(false);
  
  // --- نفس اللوجيك القديم تماماً ---
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

  if (!facility) return <div className="py-20 text-center animate-pulse text-gray-400">{t("loading") || "Loading..."}</div>;

  const start = range.startDate!;
  const end = range.endDate!;

  // اللوجيك الخاص بالأيام المحجوزة (سيبته زي ما هو عشان تضيف الـ API براحتك)
  const bookedDates: string[] = []; 
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

  // --- نفس لوجيك الـ API القديم ---
  const handleRentNow = async () => {
    if (!facility) return;
    const formattedStartDate = formatLocalDate(start);
    const formattedEndDate = formatLocalDate(end);

    try {
      const res = await axiosInstance.get(
        `/guest-facility/${facility.id}/check-availability`,
        {
          params: {
            startDate: start.toISOString().split("T")[0],
            endDate: end.toISOString().split("T")[0],
          }
        }
      );
        
      const isAvailable = res.data.data?.isAvailable;

      if (isAvailable) {
        toast.success("Available");
        const reservationData = {
          id: facility.id,
          name: facility.name,
          image: facility.coverImage,
          price: totalPrice,
          start: formattedStartDate,
          end: formattedEndDate,
          username: user?.name,
        };
        localStorage.setItem("reservationData", JSON.stringify(reservationData));
        window.location.href = `/${locale}/userview/allFacilities/reservation`;
      } else {
        toast.error("Not Available");
      }
    } catch (err) {
      console.error(err);
      toast.error("Not Available");
    }
  };

  return (
    <div className="mt-16 pb-20 max-w-7xl mx-auto px-4 md:px-6" dir={isRTL ? "rtl" : "ltr"}>
      <Toaster position="top-center" />
      
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[#0E766E]/10 rounded-xl text-[#0E766E]">
          <CalendarIcon size={24} />
        </div>
        <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
          {t("selectCheckIn")}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
        
        {/* Calendar Card */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[2.5rem] p-4 md:p-8 shadow-sm flex flex-col justify-between">
          <div className="flex justify-center w-full overflow-hidden calendar-fix-wrapper" dir="ltr">
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setRange(item.selection)}
              moveRangeOnFirstSelection={false}
              ranges={[range]}
              months={isMobile ? 1 : 2}
              direction={isMobile ? "vertical" : "horizontal"}
              showDateDisplay={false}
              minDate={new Date()}
              disabledDates={booked.map((d) => new Date(d))}
              rangeColors={["#0E766E"]}
              locale={isRTL ? arSA : undefined}
            />
          </div>

          <div className="mt-8 pt-6 border-t border-gray-50 dark:border-zinc-800 flex flex-wrap justify-between items-center gap-4">
            <button
              onClick={() => setRange({ startDate: new Date(), endDate: new Date(), key: "selection" })}
              className="flex items-center gap-2 text-sm font-bold text-[#0E766E] hover:opacity-75 transition"
            >
              <RefreshCw size={16} /> {t("clearDates")}
            </button>
            <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-400">
              <Info size={14} />
              <span>{t("timezoneNote") || "Check-in times are based on facility local time"}</span>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-4 h-full">
          <div className="bg-[#0E766E] text-white rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-teal-900/20 h-full flex flex-col justify-between border border-white/10">
            <div className="space-y-8">
              <div>
                <p className="text-[10px] uppercase font-bold opacity-60 tracking-[0.2em] mb-2">{t("totalAmount")}</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-4xl md:text-5xl font-black leading-none">{totalPrice}</h3>
                   <span className="text-sm font-medium opacity-80 uppercase">{t("currency") || "SAR"}</span>
                </div>
                {availableDays > 0 && (
                  <p className="text-xs mt-3 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10">
                    {t("forDays", { count: availableDays })}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                  <p className="text-[10px] uppercase font-bold opacity-50 mb-1 tracking-wider">{t("checkIn")}</p>
                  <p className="font-bold text-lg">{start ? start.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-GB') : "---"}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                  <p className="text-[10px] uppercase font-bold opacity-50 mb-1 tracking-wider">{t("checkOut")}</p>
                  <p className="font-bold text-lg">{end ? end.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-GB') : "---"}</p>
                </div>
              </div>
            </div>

            <div className="mt-10 lg:mt-0 pt-6">
              <button
                disabled={!start || !end || availableDays === 0}
                onClick={handleRentNow}
                className="w-full bg-white text-[#0E766E] py-5 rounded-2xl font-black text-lg transition-all hover:shadow-2xl active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("rentNow")}
              </button>
              <p className="text-[10px] text-center mt-4 opacity-50 italic px-4 leading-tight">
                {t("disclaimer") || "Prices may vary depending on the season and special events."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .calendar-fix-wrapper .rdrMonthAndYearWrapper { padding-top: 10px; height: 60px; }
        .calendar-fix-wrapper .rdrPprevButton, .calendar-fix-wrapper .rdrNextButton {
            background: #f8f8f8 !important; border-radius: 12px !important; margin: 0 8px !important;
        }
        .calendar-fix-wrapper .rdrMonths { justify-content: center !important; gap: 20px; }
        @media (max-width: 640px) { .rdrMonth { width: 100% !important; } }
      `}</style>
    </div>
  );
}