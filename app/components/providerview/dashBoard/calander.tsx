"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar as CalendarIcon, Search, ChevronDown, X, Plus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Calculate Date Ranges for API
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
      console.error("Error fetching calendar:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate]);

  // Generate days for the grid
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
    <main className="flex-1 bg-[#F8FAFC] min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Schedule <span className="text-teal-600 underline decoration-teal-200">2026</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1 text-sm">Manage your provider bookings and events</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-xl shadow-gray-200 transition-all active:scale-95 text-sm font-bold"
        >
          <Plus size={18} /> Add Event
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar: Mini View & Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Agenda</h3>
                <CalendarIcon className="text-teal-600" size={18} />
             </div>
             
             <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-teal-600 uppercase mb-3">Today&apos;s Priority</p>
                  <div className="space-y-3">
                    {events.slice(0, 3).map((event: any, i) => (
                      <div key={i} className="group cursor-pointer flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                        <div className="w-1.5 h-10 bg-teal-500 rounded-full" />
                        <div>
                          <p className="text-sm font-bold text-gray-800 line-clamp-1">{event.title || "Booking"}</p>
                          <p className="text-xs text-gray-400 font-medium">{event.time || "09:00 AM"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Main Calendar Grid */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between p-8 border-b border-gray-50">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-black text-gray-900">{format(currentDate, "MMMM yyyy")}</h2>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><ChevronLeft size={20}/></button>
                  <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><ChevronRight size={20}/></button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input placeholder="Filter events..." className="bg-gray-50 border-none rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-2 focus:ring-teal-500/20 outline-none w-48" />
                </div>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-50">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{d}</div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="grid grid-cols-7 divide-x divide-y divide-gray-50">
              {loading ? (
                <div className="col-span-7 h-96 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                  <Loader2 className="animate-spin text-teal-600" size={40} />
                </div>
              ) : (
                daysInMonth.map((day, i) => {
                  const dayEvents = events.filter((e: any) => isSameDay(new Date(e.date), day));
                  return (
                    <div 
                      key={i} 
                      onClick={() => handleDayClick(day)}
                      className="min-h-[120px] p-3 hover:bg-teal-50/30 transition-colors cursor-pointer group"
                    >
                      <span className={`text-sm font-black ${isSameDay(day, new Date()) ? 'bg-teal-600 text-white w-7 h-7 flex items-center justify-center rounded-lg shadow-lg shadow-teal-200' : 'text-gray-400 group-hover:text-gray-900'}`}>
                        {format(day, "d")}
                      </span>
                      <div className="mt-2 space-y-1">
                        {dayEvents.map((event: any, idx) => (
                          <div key={idx} className="bg-teal-100/50 text-teal-700 text-[9px] font-bold px-2 py-1 rounded-md truncate border border-teal-200/50">
                            {event.title || "Booked"}
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

      {/* Modern Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
            <h3 className="text-2xl font-black text-gray-900 mb-2">New Event</h3>
            <p className="text-gray-500 text-sm font-medium mb-6">{selectedDay ? format(selectedDay, "EEEE, MMMM do") : "Select a date"}</p>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Event Name</label>
                <input type="text" placeholder="e.g. Client Consultation" className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-teal-500/10 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notes</label>
                <textarea placeholder="Add details..." className="w-full bg-gray-50 border-none rounded-2xl p-4 h-24 focus:ring-2 focus:ring-teal-500/10 outline-none resize-none" />
              </div>
              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-teal-100 transition-all active:scale-95 mt-4">
                Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}