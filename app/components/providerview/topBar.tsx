"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Search, User as UserIcon, ArrowRight, FileText, BadgeCheck, Loader2 } from "lucide-react";
import LocaleSwitcher from "../local-switcher";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function Topbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const locale = useLocale();
  const t = useTranslations("providerTopbar");
  const isRTL = locale === "ar";

  // --- جلب بيانات المستخدم من الـ API ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/authentication/current-user", {
          headers: { "Content-Type": "application/json" },
          credentials: "include", // مهم جداً لإرسال الكوكيز/الجلسة
        });

        const result = await res.json();
        
        // بناءً على هيكلة الـ API الخاصة بك (result.data أو result.user)
        if (result?.data) {
          const { name, image } = result.data;
          setUser({
            name: name || "Provider",
            photo: image ? `/api/media?media=${image}` : null, // ربط مسار الميديا
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

  const searchItems = [
    { id: 1, title: isRTL ? "لوحة التحكم" : "Dashboard", href: `/${locale}/providerview/dashBoardHome/dashBoard`, category: isRTL ? "عام" : "General" },
    { id: 2, title: isRTL ? "مرافقي" : "My Facilities", href: `/${locale}/providerview/dashBoardHome/myFacilities`, category: isRTL ? "إدارة" : "Management" },
    { id: 3, title: isRTL ? "التقويم" : "Calendar", href: `/${locale}/providerview/dashBoardHome/Calander`, category: isRTL ? "حجوزات" : "Bookings" },
    { id: 4, title: isRTL ? "المالية" : "Finance", href: `/${locale}/providerview/dashBoardHome/Finance`, category: isRTL ? "حسابات" : "Accounts" },
    { id: 5, title: isRTL ? "ملفي الشخصي" : "Profile", href: `/${locale}/providerview/dashBoardHome/myProfile`, category: isRTL ? "إعدادات" : "Settings" },
  ];

  const filteredResults = searchQuery 
    ? searchItems.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      className="relative z-50 flex flex-col md:flex-row md:items-center md:justify-between bg-white border border-gray-100 shadow-md shadow-gray-200/50 rounded-[2.5rem] p-4 mb-10 gap-5 transition-all duration-300" 
      dir={isRTL ? "rtl" : "ltr"}
    >
      
      {/* 1. User Info Section (Enlarged & Connected to API) */}
      <div className="flex items-center gap-4 px-3 shrink-0 border-gray-100 ltr:border-r rtl:border-l pr-6">
        <div className="relative w-14 h-14 flex items-center justify-center bg-gradient-to-br from-teal-50 to-white rounded-2xl overflow-hidden border-2 border-[#0E766E]/10 shadow-sm group">
          {loading ? (
            <Loader2 className="w-6 h-6 text-[#0E766E] animate-spin" />
          ) : user?.photo ? (
            <img
              src={user.photo}
              alt="User"
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <UserIcon className="text-[#0E766E] w-7 h-7" />
          )}
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-gray-900 text-base tracking-tight truncate max-w-[160px]">
              {loading ? "..." : user?.name || "Provider"}
            </span>
            {!loading && <BadgeCheck size={16} className="text-[#0E766E]" />}
          </div>
          <span className="text-[#0E766E] text-[10px] font-black uppercase tracking-[0.15em] opacity-70">
            {t("verifiedStatus")}
          </span>
        </div>
      </div>

      {/* 2. Global Search Section */}
      <div className="flex items-center gap-6 flex-1 justify-end w-full md:max-w-3xl" ref={searchRef}>
        <div className="relative flex-1 group max-w-lg">
          <Search className={`absolute ${isRTL ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0E766E] w-5 h-5 transition-colors`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder={t("searchPlaceholder")}
            className={`w-full bg-gray-50/80 border border-transparent rounded-[1.5rem] ${isRTL ? 'pr-14 pl-6' : 'pl-14 pr-6'} py-3.5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-teal-500/5 focus:border-[#0E766E]/20 outline-none transition-all shadow-inner`}
          />

          {/* Search Dropdown */}
          {isSearchOpen && searchQuery && (
            <div className="absolute top-[110%] mt-2 w-full bg-white border border-gray-100 shadow-2xl rounded-[2rem] overflow-hidden py-3 animate-in fade-in zoom-in-95 duration-200">
              {filteredResults.length > 0 ? (
                filteredResults.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                    className="flex items-center justify-between px-6 py-4 hover:bg-teal-50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-white transition-colors shadow-sm">
                        <FileText size={16} className="text-gray-400 group-hover:text-[#0E766E]" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-800">{item.title}</p>
                        <p className="text-[10px] text-[#0E766E] font-bold uppercase tracking-widest opacity-60">{item.category}</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className={`text-gray-300 group-hover:text-[#0E766E] transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                  </Link>
                ))
              ) : (
                <div className="px-6 py-10 text-center">
                  <p className="text-sm font-bold text-gray-400">{isRTL ? "لم يتم العثور على نتائج" : "No results found"}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Actions Section */}
        <div className="flex items-center gap-3">        
          <div className="w-[1px] h-8 bg-gray-100 mx-2 hidden lg:block"></div>

          <div className="hover:scale-110 transition-transform">
            <LocaleSwitcher 
                bgColor="bg-transparent" 
                enableFlag="hidden" 
                enableLabel="hidden" 
                iconiHight="w-6 text-gray-400 hover:text-[#0E766E]" 
                iconwidth="w-6" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}