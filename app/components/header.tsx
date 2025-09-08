"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  User,
  Home,
  Building,
  HelpCircle,
  MessageCircle,
  Menu,
  LogOut,
  LogIn,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import LocaleSwitcher from "./local-switcher";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const locale = useLocale();
  const t = useTranslations("navbar");
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    window.location.href = "/auth/login";
  };

  const navLinks = [
    { href: `/${locale}`, label: t("home"), icon: Home },
    { href: `/${locale}/facilities`, label: t("facilities"), icon: Building },
    { href: `/${locale}/about`, label: t("about"), icon: User },
    { href: `/${locale}/contact`, label: t("contact"), icon: MessageCircle },
  ];

  return (
    <nav
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="w-full bg-blue-600 text-white px-6 py-4 flex items-center justify-between"
    >
      {/* Logo */}
      <div className="font-bold text-lg">{t("logo")}</div>

      {/* Links - Desktop */}
      <div className="hidden md:flex gap-6">
        {navLinks.map(({ href, label }) => {
          const isActive =  pathname === href;
          
          return (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-white text-black font-semibold"
                  : "hover:bg-blue-500 text-white"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="sm:inline bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
        >
          {t("become_host")}
        </Button>

        {!isLoggedIn && (
          <Button
            
            className="bg-white text-blue-600 font-semibold hover:bg-gray-100"
          >
            <Link href="/auth/signUp">{t("signup")}</Link>
          </Button>
        )}

        {/* Hamburger Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-md hover:bg-blue-500 transition">
              <Menu className="w-7 h-7" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-64 bg-blue-600 text-white rounded-2xl shadow-xl p-4 text-lg"
          >
            {/* Mobile Links */}
            <div className="md:hidden">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <DropdownMenuItem asChild key={href}>
                    <Link
                      href={href}
                      className={`flex items-center gap-3 px-3 py-3 rounded-3xl text-center w-full mt-2 mb-2 text-black ${
                        isActive
                          ? "bg-white text-black font-semibold"
                          : "bg-[#85ADEF] hover:bg-blue-500"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="flex-1 text-center">{label}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}

              <div className="border-t border-blue-400 my-3"></div>
            </div>

            {/* Account (original dropdown item) */}
            <DropdownMenuItem className="flex items-center gap-1 px-3 py-3 rounded-3xl bg-[#85ADEF] mt-2 mb-2 hover:bg-blue-500 cursor-pointer text-center text-black">
              <User className="w-5 h-5" />
              <span className="flex-1  italic">{t("account")}</span>
            </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-1 px-3 py-3 rounded-3xl bg-[#85ADEF] mt-2 mb-2 hover:bg-blue-500 cursor-pointer text-center text-black">
              <Building className="w-5 h-5" />
              <span className="flex-1  italic">{t("facilities")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-1 px-3 py-3 rounded-3xl bg-[#85ADEF] mt-2 mb-2 hover:bg-blue-500 cursor-pointer text-center text-black">
              <MessageCircle className="w-5 h-5" />
              <span className="flex-1  italic">{t("contact")}</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-1 px-3 py-3 rounded-3xl bg-[#85ADEF] mt-2 mb-2 hover:bg-blue-500 cursor-pointer text-center text-black">
              <HelpCircle className="w-5 h-5" />
              <span className="flex-1  italic">{t("support")}</span>
            </DropdownMenuItem>

            {/* Lang Switcher */}
            <div className="border-t border-blue-400 my-3">
              <LocaleSwitcher />
            </div>

            <div className="border-t border-blue-400 my-3"></div>

            {!isLoggedIn ? (
              <DropdownMenuItem asChild>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-3 px-3 py-3 rounded-3xl bg-[#85ADEF] hover:bg-blue-500 text-center text-black"
                >
                  <LogIn className="w-5 h-5 " />
                  <span className="flex-1 ">{t("login")}</span>
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-3 rounded-3xl bg-[#85ADEF] hover:bg-blue-500 cursor-pointer text-center text-black"
              >
                <LogOut className="w-5 h-5" />
                <span className="flex-1">{t("logout")}</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}