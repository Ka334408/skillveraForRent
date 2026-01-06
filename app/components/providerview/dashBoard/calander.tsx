"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar as CalendarIcon, Loader2, ChevronLeft, ChevronRight, Hash } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isWithinInterval, startOfDay } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import toast, { Toaster } from "react-hot-toast";
import { useLocale, useTranslations } from "next-intl";

export default function CalendarPage() {
  const locale = useLocale();
  const t = useTranslations("Calendar");
  const isRTL = locale === "ar";
  const dateLocale = isRTL ? ar : enUS;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/provider/calendar`, {
        params: { 
          startDateRange: format(startOfMonth(currentDate), "yyyy-MM-dd"), 
          endDateRange: format(endOfMonth(currentDate), "yyyy-MM-dd") 
        }
      });
      setEvents(res.data?.data || []);
    } catch (err) {
      toast.error(t("errorLoad") || "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate]);

  const daysInMonth = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    });
  }, [currentDate]);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-amber-50 text-amber-700 border-amber-200";
      case "FAILED": return "bg-rose-50 text-rose-700 border-rose-200";
      default: return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
  };

  return (
    <main className="flex-1 bg-[#F8FAFC] min-h-screen p-4 md:p-8" dir={isRTL ? "rtl" : "ltr"}>
      <Toaster />
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          {t("title")} <span className="text-indigo-600 underline decoration-indigo-200">2026</span>
        </h1>
        <p className="text-gray-500 font-medium mt-1 text-sm">{t("subtitle")}</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar: Agenda */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 sticky top-8">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">{t("agenda")}</h3>
                <CalendarIcon className="text-indigo-600" size={18} />
             </div>
             
             <div className="space-y-4 max-h-[550px] overflow-y-auto custom-scrollbar">
                {events.length === 0 && !loading && <p className="text-xs text-gray-400 text-center">{t("noEvents")}</p>}
                {events.map((event: any, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 group hover:border-indigo-200 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-indigo-500 flex items-center gap-1">
                        <Hash size={12} /> Reservation ID: {event.id}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getStatusStyles(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    <p className="text-sm font-black text-gray-800">{event.facility?.name[locale] || event.facility?.name.en}</p>
                    <div className="text-[10px] space-y-1 font-bold">
                      <p className="text-indigo-600">
                         <span className="opacity-60">{isRTL ? "من:" : "From:"}</span> {format(new Date(event.startDate), "yyyy-MM-dd")} (Start Date)
                      </p>
                      <p className="text-rose-500">
                         <span className="opacity-60">{isRTL ? "إلى:" : "To:"}</span> {format(new Date(event.endDate), "yyyy-MM-dd")} (End Date)
                      </p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Main Calendar Grid */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className={`flex items-center justify-between p-8 border-b border-gray-50 ${isRTL ? "flex-row-reverse" : ""}`}>
                <h2 className="text-xl font-black text-gray-900">{format(currentDate, "MMMM yyyy", { locale: dateLocale })}</h2>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-gray-100 rounded-xl transition-colors border border-gray-100">
                    {isRTL ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
                  </button>
                  <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-gray-100 rounded-xl transition-colors border border-gray-100">
                    {isRTL ? <ChevronLeft size={20}/> : <ChevronRight size={20}/>}
                  </button>
                </div>
            </div>

            <div className="grid grid-cols-7 bg-gray-50/50">
              {(isRTL ? ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]).map((d) => (
                <div key={d} className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 divide-x divide-y divide-gray-50 border-t border-gray-50" dir="ltr">
              {loading ? (
                <div className="col-span-7 h-96 flex items-center justify-center bg-white"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
              ) : (
                daysInMonth.map((day, i) => {
                  const dayEvents = events.filter((e: any) => {
                    const start = startOfDay(new Date(e.startDate));
                    const end = startOfDay(new Date(e.endDate));
                    const current = startOfDay(day);
                    return isWithinInterval(current, { start, end });
                  });

                  return (
                    <div key={i} className="min-h-[140px] p-2 hover:bg-gray-50/50 transition-all border-gray-50">
                      <span className={`text-sm font-black mb-2 inline-flex w-7 h-7 items-center justify-center rounded-lg ${isSameDay(day, new Date()) ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}>
                        {format(day, "d")}
                      </span>
                      
                      <div className="space-y-1">
                        {dayEvents.map((event: any, idx) => {
                          const isStart = isSameDay(day, new Date(event.startDate));
                          const isEnd = isSameDay(day, new Date(event.endDate));
                          
                          return (
                            <div key={idx} className={`px-2 py-1 rounded-md text-[8px] font-black border transition-all ${getStatusStyles(event.status)}`}>
                              <div className="truncate opacity-70 mb-0.5">ID: {event.id}</div>
                              <div className="truncate mb-1">{event.facility?.name[locale] || event.facility?.name.en}</div>
                              {isStart && <div className="text-[7px] text-indigo-600 font-bold tracking-tighter line-clamp-1">● Start Date</div>}
                              {isEnd && <div className="text-[7px] text-rose-600 font-bold tracking-tighter line-clamp-1">● End Date</div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}