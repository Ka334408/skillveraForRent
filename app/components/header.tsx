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
import ThemeSwitcher from "./darkModeBtn";
import LoginModal from "./loginmodel";


interface NavbarProps {
  bgColor?: string;
  textColor?: string;
  hoverColor?: string;
  activeColor?: string;
  menuiconColor?: string;
  accounticonColor?: string;
  enable?: string;
  isrounded?: string;
}

export default function Navbar({
  bgColor = "bg-[#2C70E2]",
  textColor = "text-white",
  hoverColor = "hover:bg-blue-500",
  activeColor = "bg-white text-black",
  menuiconColor = "bg-[#2C70E2]",
  accounticonColor = "bg-[#2C70E2]",
  enable = "hidden sm:inline",
  isrounded = "rounded-md",
}: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); 
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
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setIsLoggedIn(false);
    window.location.href = `/${locale}/userview/Home`;
  };

  
  const handleProtectedClick = (href: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true); 
    } else {
      window.location.href = href; 
    }
  };

  const navLinks = [
    { href: `/${locale}/userview/Home`, label: t("home"), icon: Home },
    { href: `/${locale}/facilities`, label: t("facilities"), icon: Building },
    { href: `/${locale}/about`, label: t("about"), icon: User },
    { href: `/${locale}/contact`, label: t("contact"), icon: MessageCircle },
  ];

  return (
    <>
      <nav
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={`w-full ${bgColor} ${textColor} px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between`}
      >
        {/* Logo */}
        <div className="font-bold text-lg">{t("logo")}</div>

        {/* Links - Desktop */}
        <div className="hidden md:flex gap-4">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 rounded-lg transition text-sm lg:text-lg font-bold ${
                  isActive ? activeColor : `${hoverColor} ${textColor}`
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            className={`${enable} bg-transparent font-bold border-2 ${textColor}  border-white hover:bg-white hover:text-blue-600 ${hoverColor}`}
          >
            {t("become_host")}
          </Button>

          {!isLoggedIn && (
            <Button className="bg-white text-blue-600 font-semibold hover:bg-gray-100">
              <Link href="/auth/signUp">{t("signup")}</Link>
            </Button>
          )}
          {isLoggedIn && (
            <Button
              className={`rounded-full text-gray-200 border-gray-200 ${accounticonColor} border-2 font-semibold hover:bg-gray-100 hover:text-black`}
            >
              <Link href="/userview/useraccount">
                <User className="w-8 h-8" />
              </Link>
            </Button>
          )}

          {/* Hamburger Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`p-2 ${isrounded} hover:bg-blue-500 ${menuiconColor} transition`}
              >
                <Menu className="w-7 h-7" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-64 bg-blue-600 text-white rounded-xl shadow-xl p-4 text-lg"
            >
              {/* Mobile Links */}
              <div className="sm:hidden">
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <DropdownMenuItem
                      key={href}
                      onClick={() => handleProtectedClick(href)} 
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl w-full mt-2 mb-2 text-black ${
                        isActive
                          ? "bg-white text-black font-semibold"
                          : "bg-[#85ADEF] hover:bg-blue-500"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="flex-1 text-center">{label}</span>
                    </DropdownMenuItem>
                  );
                })}
              </div>

              <DropdownMenuItem
                onClick={() =>
                  handleProtectedClick(`/${locale}/userview/useraccount`)
                }
                className="flex items-center gap-1 px-3 py-3 rounded-xl bg-[#85ADEF] mt-2 mb-2 hover:bg-blue-500 cursor-pointer text-center text-black"
              >
                <User className="w-5 h-5" />
                <span className="flex-1  italic">{t("account")}</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleProtectedClick(`/${locale}/facilities`)}
                className="flex items-center gap-1 px-3 py-3 rounded-xl bg-[#85ADEF] mt-2 mb-2 hover:bg-blue-500 cursor-pointer text-center text-black"
              >
                <Building className="w-5 h-5" />
                <span className="flex-1  italic">{t("facilities")}</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleProtectedClick(`/${locale}/contact`)}
                className="flex items-center gap-1 px-3 py-3 rounded-xl bg-[#85ADEF] mt-2 mb-2 hover:bg-blue-500 cursor-pointer text-center text-black"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="flex-1  italic">{t("contact")}</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleProtectedClick(`/${locale}/support`)}
                className="flex items-center gap-1 px-3 py-3 rounded-xl bg-[#85ADEF] mt-2 mb-2 hover:bg-blue-500 cursor-pointer text-center text-black"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="flex-1  italic">{t("support")}</span>
              </DropdownMenuItem>

              {/* Lang Switcher */}
              <div className="border-t border-blue-400 my-3">
                <LocaleSwitcher />
              </div>
              <DropdownMenuItem asChild>
                <ThemeSwitcher />
              </DropdownMenuItem>

              <div className="border-t border-blue-400 my-3"></div>

              {!isLoggedIn ? (
                <DropdownMenuItem asChild>
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-3 px-3 py-3 rounded-3xl bg-[#85ADEF] hover:bg-blue-500 text-center text-black cursor-pointer"
                  >
                    <LogIn className="w-5 h-5 " />
                    <span className="flex-1 ">{t("login")}</span>
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-3 rounded-3xl bg-[#85ADEF] hover:bg-blue-500 cursor-pointer text-center text-black "
                >
                  <LogOut className="w-5 h-5" />
                  <span className="flex-1">{t("logout")}</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      
      <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}