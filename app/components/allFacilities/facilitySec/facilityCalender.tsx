"use client";

import { useState, useEffect } from "react";
import { DateRange, Range } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useTranslations } from "next-intl";

export default function FacilityCalendar({
  pricePerDay,
  bookedDates = [],
}: {
  pricePerDay: number;
  bookedDates?: string[];
}) {
  const t = useTranslations("FacilityCalendar");
  const [isMobile, setIsMobile] = useState(false);

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

  const booked = bookedDates.map((d) => new Date(d).toDateString());

  const start = range.startDate;
  const end = range.endDate;

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

  const totalPrice = availableDays > 0 ? availableDays * pricePerDay : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
      {/* الكاليندر */}
      <div className="lg:col-span-2 bg-white shadow-md rounded-xl py-6 w-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          {t("selectCheckIn")}
        </h3>

        <div className={`${isMobile ? "flex flex-col" : ""}`}>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setRange(item.selection)}
            moveRangeOnFirstSelection={false}
            ranges={[range]}
            months={2} // 📆 شهرين دايمًا
            direction={isMobile ? "vertical" : "horizontal"} // 📱 عمودي في الموبايل
            showDateDisplay={false}
            minDate={new Date()}
            disabledDates={booked.map((d) => new Date(d))}
            rangeColors={["#0E766E"]}
          />
        </div>

        <button
          onClick={() =>
            setRange({
              startDate: new Date(),
              endDate: new Date(),
              key: "selection",
            })
          }
          className="mt-4 text-sm text-[#0E766E] underline"
        >
          {t("clearDates")}
        </button>
      </div>

      {/* البوكس الجانبي */}
      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between w-full">
        <div className="flex-1">
          {availableDays > 0 ? (
            <>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {totalPrice} R {t("forDays", { count: availableDays })}
              </h3>
              <div className="flex flex-col gap-2 mb-4 text-sm  mt-0 sm:mt-32">
                <div className="flex justify-between border rounded-md p-2">
                  <span className="font-medium">{t("checkIn")}</span>
                  <span>
                    {start?.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between border rounded-md p-2">
                  <span className="font-medium">{t("checkOut")}</span>
                  <span>
                    {end?.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm mb-4">
              {t("pleaseSelect")}
            </div>
          )}
        </div>

        {/* زرار */}
        <button
          disabled={!start || !end || availableDays === 0}
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
  );
}