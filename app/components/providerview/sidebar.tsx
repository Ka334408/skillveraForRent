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
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useUserStore } from "@/app/store/userStore";
import { useLocale } from "next-intl";

export default function ProviderSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  // Zustand
  const { user, setUser, isHydrated } = useUserStore();
  const logout = useUserStore((state) => state.logout);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!isHydrated) return;

        if (user) {
          setLoadingUser(false);
          return;
        }

        const res = await axiosInstance.get("/authentication/current-user");

        const fetchedUser =
          res.data?.user || res.data?.data?.user || null;

        if (fetchedUser) {
          setUser(fetchedUser);
        } else {
          console.warn("Sidebar: no user returned");
        }
      } catch (err) {
        console.error("Sidebar fetch user error:", err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [isHydrated]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: `/${locale}/providerview/dashBoardHome/dashBoard` },
    { id: "facilities", label: "My Facilities", icon: Building2, href: `/${locale}/providerview/dashBoardHome/myFacilities` },
    { id: "calendar", label: "Calendar", icon: Calendar, href: `/${locale}/providerview/dashBoardHome/Calander` },
    { id: "finance", label: "Finance", icon: CreditCard, href: `/${locale}/providerview/dashBoardHome/Finance` },
    { id: "statistic", label: "Statistic", icon: BarChart, href: "/providerview/statistic" },
  ];

  const bottomItems = [
    { id: "support", label: "Support", icon: HelpCircle, href: "/providerview/support" },
    { id: "settings", label: "Settings", icon: Settings, href: "/providerview/settings" },
  ];

  const isActive = (href: string) => pathname.toLowerCase() === href.toLowerCase();

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/providerview/Home`);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 m-2 bg-white text-gray-500 rounded-lg fixed top-2 left-2 z-50 shadow"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white border-gray-200 p-6 z-50
          flex flex-col justify-between
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:border-r
        `}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-4 right-4 text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6 mt-4">
          <User className="w-7 h-7 text-[#0E766E]" />
          { (
            <h2 className="text-xl font-bold">
              {loadingUser ? "Skillvera" : user?.name || "Provider"}
            </h2>
          )}
        </div>

          <p className="mb-5 border-t-2 border-t-[#0E766E]" />

          {/* Main Menu */}
          <nav className="flex flex-col gap-2 mb-6">
            {menuItems.map(({ id, label, icon: Icon, href }) => (
              <Link
                key={id}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-left font-medium
                  ${
                    isActive(href)
                      ? "text-[#0E766E] bg-blue-100"
                      : "hover:bg-gray-100 text-gray-700"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive(href) ? "text-[#0E766E]" : "text-gray-500"
                  }`}
                />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          {bottomItems.map(({ id, label, icon: Icon, href }) => (
            <Link
              key={id}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-left font-medium
                ${
                  isActive(href)
                    ? "text-[#0E766E] bg-blue-100"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive(href) ? "text-[#0E766E]" : "text-gray-500"
                }`}
              />
              {label}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition text-left font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}