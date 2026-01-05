"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar as CalendarIcon, Search, X, Plus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { ar, enUS } from "date-fns/locale"; // لدعم أسماء الشهور في التقويم
import toast, { Toaster } from "react-hot-toast";
import { useLocale, useTranslations } from "next-intl";

export default function CalendarPage() {
  const locale = useLocale();
  const t = useTranslations("Calendar");
  const isRTL = locale === "ar";
  
  // ضبط اللغة لمكتبة date-fns
  const dateLocale = isRTL ? ar : enUS;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const [newEvent, setNewEvent] = useState({ title: "", notes: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startDateRange = format(startOfMonth(currentDate), "yyyy-MM-dd");
  const endDateRange = format(endOfMonth(currentDate), "yyyy-MM-dd");

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/provider/calendar`, {
        params: { startDateRange, endDateRange }
      });
      setEvents(res.data?.data || []);
    } catch (err) {
      toast.error(t("errorLoad"));
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

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setShowModal(true);
  };

  

  return (
    <main className="flex-1 bg-[#F8FAFC] min-h-screen p-4 md:p-8" dir={isRTL ? "rtl" : "ltr"}>
      <Toaster />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className={isRTL ? "text-right" : "text-left"}>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            {t("title")} <span className="text-teal-600 underline decoration-teal-200">2026</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1 text-sm">{t("subtitle")}</p>
        </div>
        
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar: Agenda */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 sticky top-8">
             <div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">{t("agenda")}</h3>
                <CalendarIcon className="text-teal-600" size={18} />
             </div>
             
             <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {events.length === 0 && !loading && <p className="text-xs text-gray-400 text-center">{t("noEvents")}</p>}
                {events.slice(0, 5).map((event: any, i) => (
                  <div key={i} className={`group cursor-pointer flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                    <div className="w-1.5 h-10 bg-teal-500 rounded-full shrink-0" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-gray-800 truncate">{event.title || "Booking"}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase">{format(new Date(event.date), "MMM dd", { locale: dateLocale })}</p>
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
              <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <h2 className="text-xl font-black text-gray-900">{format(currentDate, "MMMM yyyy", { locale: dateLocale })}</h2>
                <div className={`flex gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    {isRTL ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
                  </button>
                  <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    {isRTL ? <ChevronLeft size={20}/> : <ChevronRight size={20}/>}
                  </button>
                </div>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-50">
              {(isRTL ? ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]).map((d) => (
                <div key={d} className="py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{d}</div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="grid grid-cols-7 divide-x divide-y divide-gray-50" dir="ltr">
              {loading ? (
                <div className="col-span-7 h-96 flex items-center justify-center bg-white">
                  <Loader2 className="animate-spin text-teal-600" size={40} />
                </div>
              ) : (
                daysInMonth.map((day, i) => {
                  const dayEvents = events.filter((e: any) => isSameDay(new Date(e.date), day));
                  const isToday = isSameDay(day, new Date());
                  
                  return (
                    <div 
                      key={i} 
                      onClick={() => handleDayClick(day)}
                      className="min-h-[120px] p-3 hover:bg-teal-50/30 transition-colors cursor-pointer group relative text-left"
                    >
                      <span className={`text-sm font-black transition-all ${isToday ? 'bg-teal-600 text-white w-8 h-8 flex items-center justify-center rounded-xl shadow-lg shadow-teal-200' : 'text-gray-400 group-hover:text-gray-900'}`}>
                        {format(day, "d")}
                      </span>
                      <div className="mt-2 space-y-1">
                        {dayEvents.map((event: any, idx) => (
                          <div key={idx} className="bg-teal-100/50 text-teal-700 text-[9px] font-black px-2 py-1 rounded-md truncate border border-teal-200/50">
                            {event.title}
                          </div>
                        ))}
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