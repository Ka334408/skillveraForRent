"use client";

import { useState, useEffect } from "react";
import { Bell, Search, User as UserIcon } from "lucide-react";
import LocaleSwitcher from "../local-switcher";

interface User {
  name: string;
  email: string;
  photo: string;
}

export default function Topbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/authentication/current-user", {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const result = await res.json();
        if (result?.data) {
          const { name, email, image } = result.data;
          setUser({
            name: name || "Provider",
            email: email || "user@email.com",
            photo: image ? `/api/media?media=${image}` : "",
          });
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-between p-4 mb-5 animate-pulse bg-white/50 rounded-2xl">
        <div className="flex items-center space-x-3 w-32 h-10 bg-gray-200 rounded-full" />
        <div className="w-1/2 h-10 bg-gray-200 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white border border-gray-100 shadow-sm rounded-[2rem] p-3 mb-8 gap-4 mt-6 sm:mt-0 ltr:pr-6 rtl:pl-6">
      
      {/* 1. Left Section: User Info (Fixed Image) */}
      <div className="flex items-center gap-3 rtl:space-x-reverse px-2">
        <div className="relative w-12 h-12 flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
          {user?.photo ? (
            <img
              src={user.photo}
              alt="User"
              className="max-w-full max-h-full object-contain" // NO CROPPING
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          ) : (
            <UserIcon className="text-gray-300 w-6 h-6" />
          )}
        </div>
        
        <div className="flex flex-col text-left rtl:text-right">
          <span className="font-bold text-gray-900 text-sm tracking-tight truncate max-w-[150px]">
            {user?.name}
          </span>
          <span className="text-teal-600 text-[10px] font-black uppercase tracking-widest">
            Verified Provider
          </span>
        </div>
      </div>

      {/* 2. Right Section: Search + Actions */}
      <div className="flex items-center gap-4 flex-1 justify-end max-w-full md:max-w-2xl w-full">
        
        {/* Modern Search Bar */}
        <div className="relative flex-1 group">
          <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors w-4 h-4" />
          <input
            type="text"
            placeholder="Search platform..."
            className="w-full bg-gray-50/50 border border-transparent rounded-2xl pl-11 pr-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/20 outline-none transition-all rtl:text-right"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Notification */}
          <button className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors relative group">
            <Bell className="w-5 h-5 text-gray-500 group-hover:text-gray-900 transition-colors" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </button>

          {/* Divider */}
          <div className="w-[1px] h-6 bg-gray-100 mx-1 hidden sm:block"></div>

          {/* Locale Switcher */}
          <div className="flex items-center justify-center">
            <LocaleSwitcher
              bgColor="bg-transparent"
              enableFlag="hidden"
              enableLabel="hidden"
              iconiHight="w-5 text-gray-600 hover:text-gray-900 transition-colors"
              iconwidth="w-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}