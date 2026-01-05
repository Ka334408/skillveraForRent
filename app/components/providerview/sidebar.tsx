"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Calendar,
  CreditCard,
  BarChart,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  MessageSquareX,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useUserStore } from "@/app/store/userStore";
import { useLocale, useTranslations } from "next-intl";

export default function ProviderSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [cancelCount, setCancelCount] = useState(0);

  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("providerSidebar");
  const isRTL = locale === "ar";

  const { user, setUser, isHydrated } = useUserStore();
  const logout = useUserStore((state) => state.logout);

  // --- دالة التحقق من الحالة النشطة المحسنة ---
  const getIsActive = (href: string) => {
    if (!pathname) return false;
    // نقوم بتنظيف المسارات من الـ locale للمقارنة الدقيقة
    const cleanPath = pathname.replace(/^\/(ar|en)/, "") || "/";
    const cleanHref = href.replace(/^\/(ar|en)/, "") || "/";
    return cleanPath === cleanHref;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isHydrated) return;

        if (!user) {
          const res = await axiosInstance.get("/authentication/current-user");
          const fetchedUser = res.data?.user || res.data?.data?.user || null;
          if (fetchedUser) setUser(fetchedUser);
        }

        const cancelRes = await axiosInstance.get("/provider-reservation/cancellation-requests");
        const total = cancelRes.data?.total || cancelRes.data?.data?.length || 0;
        setCancelCount(total);
      } catch (err) {
        console.error("Sidebar fetch error:", err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchData();
  }, [isHydrated, user, setUser]);

  const menuItems = [
    { id: "dashboard", label: t("dashboard"), icon: LayoutDashboard, href: `/${locale}/providerview/dashBoardHome/dashBoard` },
    { id: "facilities", label: t("facilities"), icon: Building2, href: `/${locale}/providerview/dashBoardHome/myFacilities` },
    { id: "calendar", label: t("calendar"), icon: Calendar, href: `/${locale}/providerview/dashBoardHome/Calander` },
    { id: "finance", label: t("finance"), icon: CreditCard, href: `/${locale}/providerview/dashBoardHome/Finance` },
    { id: "myprofile", label: t("profile"), icon: User, href: `/${locale}/providerview/dashBoardHome/myProfile` },
    { 
      id: "cancelRequests", 
      label: t("cancelRequests"), 
      icon: MessageSquareX, 
      href: `/${locale}/providerview/dashBoardHome/cancelRequests`,
      count: cancelCount 
    },
  ];


  const handleLogout = () => {
    logout();
    router.push(`/${locale}/providerview/Home`);
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className={`md:hidden p-2 m-2 bg-white text-gray-500 rounded-lg fixed top-2 ${isRTL ? 'right-2' : 'left-2'} z-50 shadow-md border border-gray-100`}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Aside */}
      <aside
        dir={isRTL ? "rtl" : "ltr"}
        className={`
          fixed top-0 ${isRTL ? "right-0" : "left-0"} h-screen w-64 bg-white p-6 z-50
          flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : (isRTL ? "translate-x-full" : "-translate-x-full")}
          md:static md:translate-x-0 ${isRTL ? "md:border-l" : "md:border-r"} border-gray-100
        `}
      >
        {/* Close Button Mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className={`md:hidden absolute top-4 ${isRTL ? "left-4" : "right-4"} text-gray-400 hover:text-gray-600`}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex-1 overflow-y-auto">
          {/* User Profile Header */}
          <div className="flex items-center gap-3 mb-8 mt-2 px-2">
            <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center border border-[#0E766E]/10">
                <User className="w-6 h-6 text-[#0E766E]" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <h2 className="text-base font-black text-gray-900 truncate">
                {loadingUser ? "..." : user?.name || t("provider")}
              </h2>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t("provider")}</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            {menuItems.map(({ id, label, icon: Icon, href, count }) => {
              const active = getIsActive(href);
              return (
                <Link
                  key={id}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                    ${active 
                      ? "bg-teal-50 text-[#0E766E] shadow-sm shadow-teal-100/50" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-colors ${active ? "text-[#0E766E]" : "text-gray-400 group-hover:text-gray-600"}`} />
                    <span className={`text-sm ${active ? "font-black" : "font-medium"}`}>{label}</span>
                  </div>
                  
                  {count !== undefined && count >= 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[18px] text-center">
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-1.5 mt-auto pt-6 border-t border-gray-50">
          

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition text-red-500 hover:bg-red-50 font-bold mt-2"
          >
            <LogOut className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
            <span className="text-sm">{t("logout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}