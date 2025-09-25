"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
}

export default function ProviderSidebar({ active, setActive }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const name = localStorage.getItem("name");
    setUser({
      name: name || "Provider",
    });
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "facilities", label: "My Facilities", icon: Building2 },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "finance", label: "Finance", icon: CreditCard },
    { id: "statistic", label: "Statistic", icon: BarChart },
  ];

  const bottomItems = [
    { id: "support", label: "Support", icon: HelpCircle },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Menu Button (sticky) */}
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
        {/* Close Button on Mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-4 right-4 text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {/* 🔹 الجزء العلوي */}
        <div className="flex-1 overflow-y-auto">
          <h2 className="text-xl font-bold mb-6">{user?.name}</h2>
          <p className="mb-5 border-t-2 border-t-blue-500 "></p>

          {/* Main Menu */}
          <nav className="flex flex-col gap-2 mb-6">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActive(id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-left font-medium
                  ${
                    active === id
                      ? "text-blue-600 bg-gray-100"
                      : "hover:bg-gray-100"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* 🔹 الجزء السفلي (مثبّت تحت) */}
        <div className="flex flex-col gap-2 mt-auto">
          {bottomItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-left font-medium
                ${
                  active === id
                    ? "bg-gray-200 text-blue-600"
                    : "hover:bg-gray-100"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}

          <button className="flex items-center gap-3 px-4 py-3 rounded-xl transition text-left font-medium text-red-600 hover:bg-red-50">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}