"use client";
import { useState, useEffect } from "react";
import { User, BookOpen, MessageCircle, Bookmark, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
}

export default function ProfileSidebar({ active, setActive }: SidebarProps) {
  const t = useTranslations("profile");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "about", label: t("myProfile"), icon: User },
    { id: "reservations", label: t("myReservations"), icon: BookOpen },
    { id: "reviews", label: t("reviews"), icon: MessageCircle },
    { id: "favorites", label: t("favorites"), icon: Bookmark },
  ];

  useEffect(() => {
    const storedActive = localStorage.getItem("profileActiveTab");
    if (storedActive) setActive(storedActive);
  }, [setActive]);

  // منع السكرول لما المنيو تفتح في الموبايل
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const handleTabClick = (id: string) => {
    setActive(id);
    localStorage.setItem("profileActiveTab", id);
    setIsOpen(false);
  };

  return (
    <>
      {/* 1. زر المنيو - تم نقله ليكون fixed ومستقل تماماً */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={`md:hidden fixed top-24 ${isRTL ? "right-4" : "left-4"} z-[100] p-3 bg-white dark:bg-zinc-900 shadow-xl rounded-2xl border border-zinc-200 dark:border-white/10 text-[#0E766E] transition-transform active:scale-90`}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* 2. الـ Overlay - رفع الـ z-index لضمان التغطية */}
      <div
        className={`fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* 3. الـ Sidebar - تعديل الـ Positioning والـ Z-index */}
      <aside
        dir={isRTL ? "rtl" : "ltr"}
        className={`
          fixed top-0 bottom-0 ${isRTL ? "right-0" : "left-0"}
          h-screen w-72 bg-white dark:bg-zinc-950 p-6 z-[120]
          transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isOpen ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"}
          md:relative md:translate-x-0 md:h-auto md:z-10 md:bg-transparent md:border-e md:border-zinc-100 dark:md:border-white/5
        `}
      >
        {/* زر الإغلاق */}
        <button
          onClick={() => setIsOpen(false)}
          className={`md:hidden absolute top-6 ${isRTL ? "left-6" : "right-6"} p-2 text-zinc-400 hover:text-red-500 transition-colors`}
        >
          <X className="w-6 h-6" />
        </button>

        {/* العنوان */}
        <div className="mb-10 pt-6 md:pt-0">
            <h2 className={`text-xl font-black text-zinc-900 dark:text-white ${isRTL ? "text-right" : "text-left"}`}>
                {t("sidebarTitle")}
            </h2>
            <div className={`h-1 w-10 bg-[#0E766E] mt-2 rounded-full ${isRTL ? "mr-0" : "ml-0"}`}></div>
        </div>

        {/* الروابط */}
        <nav className="flex flex-col gap-2">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold group
                ${
                  active === id
                    ? "bg-[#0E766E] text-white shadow-lg shadow-[#0E766E]/20"
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-[#0E766E]"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}