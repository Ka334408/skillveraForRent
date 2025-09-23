"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function FacilityCalendar({
  pricePerDay,
  bookedDates = [],
}: {
  pricePerDay: number;
  bookedDates?: string[];
}) {
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);

  // نحول الـ string dates لـ Date strings عشان نمنع الحجز فيها
  const booked = bookedDates.map((d) => new Date(d).toDateString());

  const [start, end] = range;
  const totalDays =
    start && end
      ? Math.ceil(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;
  const totalPrice = totalDays > 0 ? totalDays * pricePerDay : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
      {/* الكاليندر */}
      <div className="lg:col-span-2 bg-white shadow-md rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Select check-in date</h3>

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
            Clear dates
          </button>
        )}
      </div>

      {/* البوكس اللي على اليمين */}
      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between">
        <div className="flex-1">
          {totalDays > 0 ? (
            <>
              <h3 className="text-lg font-semibold mb-2">
                {totalPrice} R for {totalDays} days
              </h3>
              <div className="flex flex-col gap-2 mb-4 text-sm">
                <div className="flex justify-between border rounded-md p-2 mt-20">
                  <span className="font-medium">CHECK-IN</span>
                  <span>
                    {start?.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between border rounded-md p-2">
                  <span className="font-medium">CHECK-OUT</span>
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
              Please select your dates to rent
            </div>
          )}
        </div>

        {/* زرار Rent Now دايمًا ظاهر */}
        <button
          disabled={!start || !end}
          className={`rounded-lg py-3 font-semibold transition ${
            !start || !end
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Rent now
        </button>
      </div>
    </div>
  );
}