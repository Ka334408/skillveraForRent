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
  Router,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import LocaleSwitcher from "./local-switcher";
import ThemeSwitcher from "./darkModeBtn";
import LoginModal from "./loginmodel";
import { useRouter } from "next/navigation";


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
  const router =useRouter()

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
    router.replace( `/${locale}/userview/Home`);
  };

  
  const handleProtectedClick = (href: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true); 
    } else {
      router.push( href); 
    }
  };

  const navLinks = [
    { href: `/${locale}/userview/Home`, label: t("home"), icon: Home },
    { href: `/${locale}/userview/allFacilities`, label: t("facilities"), icon: Building },
    { href: `/${locale}/userview/aboutUs`, label: t("about"), icon: User },
    { href: `/${locale}/userview/contactUs`, label: t("contact"), icon: MessageCircle },
  ];

  return (
    <>
      <nav
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={`sticky top-0 z-50 w-full ${bgColor} ${textColor} px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between`}
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
            onClick={() =>
                  handleProtectedClick(`/${locale}/providerview/Home`)}
            variant="outline"
            className={`${enable} bg-transparent font-bold border-2 ${textColor}  border-white hover:bg-white hover:text-[#0E766E] ${hoverColor}`}
          >
            {t("become_host")}
          </Button>

          {!isLoggedIn && (
            <Button className="bg-[#0E766E] text-white font-semibold hover:bg-gray-100 hover:text-black">
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
                className={`p-2 ${isrounded} hover:bg-[#0E766E] ${menuiconColor} transition`}
              >
                <Menu className="w-7 h-7" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-64 bg-[#0E766E] text-white rounded-xl shadow-xl p-4 text-lg z-20"
            >
              {/* Mobile Links */}
              <div className="sm:hidden">
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <DropdownMenuItem
                      key={href}
                      onClick={() => router.push(href)} 
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl w-full mt-2 mb-2 text-white text-lg ${
                        isActive
                          ? "bg-white text-black font-semibold"
                          : "bg-[#0E766E] hover:bg-[#0E766E]"
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
                className="flex items-center gap-1 px-3 py-3 rounded-xl bg-[#0E766E] mt-2 mb-2 hover:bg-[#0E766E] cursor-pointer text-center text-white text-lg"
              >
                <User className="w-5 h-5" />
                <span className="flex-1  italic">{t("account")}</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleProtectedClick(`/${locale}/userview/allFacilities`)}
                className="flex items-center gap-1 px-3 py-3 roundedlg bg-[#0E766E] mt-2 mb-2 hover:bg-[#0E766E] cursor-pointer text-center text-white text-lg"
              >
                <Building className="w-5 h-5" />
                <span className="flex-1  italic">{t("facilities")}</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleProtectedClick(`/${locale}/userview/contactUs`)}
                className="flex items-center gap-1 px-3 py-3 rounded-xl bg-[#0E766E] mt-2 mb-2 hover:bg-[#0E766E] cursor-pointer text-center text-white text-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="flex-1  italic">{t("contact")}</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleProtectedClick(`/${locale}/support`)}
                className="flex items-center gap-1 px-3 py-3 rounded-xl bg-[#0E766E] mt-2 mb-2 hover:bg-[#0E766E] cursor-pointer text-center text-white text-lg"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="flex-1  italic">{t("support")}</span>
              </DropdownMenuItem>

              {/* Lang Switcher */}
              <div className="border-t border-[bg-[#0E766E]] my-3">
                <LocaleSwitcher />
              </div>
             

              <div className="border-t border-[#0E766E] my-3"></div>

              {!isLoggedIn ? (
                <DropdownMenuItem asChild>
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-3 px-3 py-3 rounded-3xl bg-[#0E766E] hover:bg-white text-center text-white text-xl cursor-pointer"
                  >
                    <LogIn className="w-5 h-5 " />
                    <span className="flex-1 ">{t("login")}</span>
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-3 rounded-3xl bg-[#0E766E] hover:bg-[#0E766E] cursor-pointer text-center text-white text-lg "
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