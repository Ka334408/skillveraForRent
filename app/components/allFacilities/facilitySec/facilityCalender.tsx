"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useTranslations } from "next-intl";

export default function FacilityCalendar({
  pricePerDay,
  bookedDates = [],
}: {
  pricePerDay: number;
  bookedDates?: string[];
}) {
  const t = useTranslations("FacilityCalendar");

  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);

  // نحول الـ string dates لـ Date strings
  const booked = bookedDates.map((d) => new Date(d).toDateString());

  const [start, end] = range;

  // نحسب الأيام المتاحة بس (من غير الأيام المحجوزة)
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
      <div className="lg:col-span-2 bg-white shadow-md rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("selectCheckIn")}
        </h3>

        <Calendar
          selectRange
          onChange={(val) => setRange(val as [Date, Date])}
          value={range}
          tileDisabled={({ date }) => booked.includes(date.toDateString())}
        />

        {range[0] && range[1] && (
          <button
            onClick={() => setRange([null, null])}
            className="mt-4 text-sm text-blue-600 underline"
          >
            {t("clearDates")}
          </button>
        )}
      </div>

      {/* البوكس اللي على اليمين */}
      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between">
        <div className="flex-1">
          {availableDays > 0 ? (
            <>
              <h3 className="text-lg font-semibold mb-2">
                {totalPrice} R {t("forDays", { count: availableDays })}
              </h3>
              <div className="flex flex-col gap-2 mb-4 text-sm">
                <div className="flex justify-between border rounded-md p-2 mt-20">
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

        {/* زرار Rent Now دايمًا ظاهر */}
        <button
          disabled={!start || !end || availableDays === 0}
          className={`rounded-lg py-3 font-semibold transition ${
            !start || !end || availableDays === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {t("rentNow")}
        </button>
      </div>
    </div>
  );
}