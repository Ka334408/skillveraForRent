"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  User, Home, Building, HelpCircle, MessageCircle, Menu, 
  LogOut, LogIn, UserPlus, ArrowRightLeft, Sparkles
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import LocaleSwitcher from "./local-switcher";
import LoginModal from "./loginmodel";
import { useUserStore } from "@/app/store/userStore";
import Image from "next/image";

export default function Navbar({
  bgColor = "bg-white/95 dark:bg-zinc-950/95",
  signupLink = "/signup",
  loginLink = "/login"
}) {
  const locale = useLocale();
  const t = useTranslations("navbar");
  const pathname = usePathname();
  const router = useRouter();
  const isRTL = locale === "ar";

  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isLoggedIn = !!user;

  const handleLogout = () => {
    logout();
    router.replace(`/${locale}/userview/Home`);
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
        dir={isRTL ? "rtl" : "ltr"}
        className={`sticky top-0 z-[100] w-full backdrop-blur-md border-b border-zinc-200 dark:border-white/5 ${bgColor} px-4 sm:px-12 py-4 flex items-center justify-between shadow-sm`}
      >
        {/* Logo */}
        <Link href={`/${locale}/userview/Home`} className="transition-transform hover:scale-105 active:scale-95">
          <Image src="/logo.png" alt="Logo" width={125} height={40} className="object-contain dark:brightness-200" />
        </Link>

        {/* Desktop Navigation - العناوين مكبرة وأكثر بروزاً */}
        <div className="hidden md:flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-200 dark:border-white/5">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-6 py-2.5 rounded-xl transition-all text-base font-extrabold tracking-tight ${
                  isActive 
                    ? "bg-[#0E766E] text-white shadow-md shadow-emerald-900/20" 
                    : "text-zinc-600 dark:text-zinc-400 hover:text-[#0E766E] dark:hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <div className="hidden xl:block">
            <LocaleSwitcher bgColor="bg-transparent" enableFlag="block" enableLabel="hidden" iconiHight="w-5" iconwidth="w-5" />
          </div>

          <Button
            onClick={() => router.push(`/${locale}/providerview/Home`)}
            className="hidden lg:flex bg-transparent border-2 border-[#0E766E] text-[#0E766E] hover:bg-[#0E766E] hover:text-white font-extrabold rounded-2xl transition-all gap-2 px-5 py-6"
          >
            <ArrowRightLeft size={20} />
            {t("become_host")}
          </Button>

          {!isLoggedIn ? (
            <div className="hidden sm:flex items-center gap-4">
               <Link href={loginLink} className="text-sm font-extrabold hover:text-[#0E766E] transition-colors">{t("login")}</Link>
               <Button className="bg-[#0E766E] text-white font-black hover:bg-[#0A5D57] rounded-2xl px-8 py-6 shadow-xl shadow-emerald-900/20 active:scale-95 transition-all">
                  <Link href={signupLink}>{t("signup")}</Link>
               </Button>
            </div>
          ) : (
            <Link href={`/${locale}/userview/useraccount`} className="transition-all hover:scale-110 active:scale-90">
               <div className="w-12 h-12 rounded-2xl border-2 border-[#0E766E] p-0.5 shadow-lg shadow-emerald-900/10">
                  <div className="w-full h-full bg-[#0E766E] rounded-[14px] flex items-center justify-center text-white">
                    <User size={24} />
                  </div>
               </div>
            </Link>
          )}

          {/* DARK PREMIUM MOBILE MENU */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-3 rounded-2xl bg-zinc-900 text-white hover:bg-[#0E766E] transition-all shadow-lg active:scale-90 border border-white/10">
                <Menu className="w-6 h-6" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={15}
              className="w-80 bg-zinc-900 dark:bg-black border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 text-white animate-in zoom-in-95 duration-200"
            >
              {/* User Greeting Section */}
              <div className="px-4 py-6 mb-2 rounded-[2rem] bg-white/5 border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0E766E] flex items-center justify-center shadow-lg">
                  <Sparkles className="text-white w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-zinc-400 uppercase tracking-widest leading-none mb-1">{t("welcome")}</h4>
                  <p className="text-base font-bold truncate max-w-[150px]">{isLoggedIn ? user.name : t("guest")}</p>
                </div>
              </div>

              <div className="space-y-1">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <DropdownMenuItem
                    key={href}
                    onClick={() => router.push(href)}
                    className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-white/10 focus:bg-white/10 transition-all group"
                  >
                    <div className="p-2 bg-zinc-800 group-hover:bg-[#0E766E] rounded-xl transition-colors">
                      <Icon size={20} className="text-zinc-400 group-hover:text-white" />
                    </div>
                    <span className="font-extrabold text-base">{label}</span>
                  </DropdownMenuItem>
                ))}
              </div>

              <DropdownMenuSeparator className="bg-white/10 my-3" />

              <DropdownMenuItem
                onClick={() => router.push(`/${locale}/userview/useraccount`)}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-white/10"
              >
                <div className="p-2 bg-zinc-800 rounded-xl">
                  <User size={20} className="text-emerald-500" />
                </div>
                <span className="font-extrabold text-base">{t("account")}</span>
              </DropdownMenuItem>

              <div className="p-2 bg-white/5 rounded-2xl my-2">
                <LocaleSwitcher bgColor="bg-transparent text-white" enableFlag="block" enableLabel="block" iconiHight="w-5" iconwidth="w-5" />
              </div>

              {/* AUTH SECTION */}
              {!isLoggedIn ? (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Link href={loginLink} className="flex flex-col items-center gap-2 p-4 rounded-[1.8rem] bg-zinc-800 hover:bg-zinc-700 transition-all border border-white/5">
                    <LogIn size={20} className="text-zinc-400" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{t("login")}</span>
                  </Link>
                  <Link href={signupLink} className="flex flex-col items-center gap-2 p-4 rounded-[1.8rem] bg-[#0E766E] hover:bg-[#0A5D57] transition-all shadow-lg shadow-emerald-900/40">
                    <UserPlus size={20} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{t("signup")}</span>
                  </Link>
                </div>
              ) : (
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-4 p-4 rounded-[1.8rem] cursor-pointer text-rose-400 hover:bg-rose-500/10 mt-2 border border-rose-500/10 transition-all"
                >
                  <div className="p-2 bg-rose-500/20 rounded-xl">
                    <LogOut size={20} />
                  </div>
                  <span className="font-black text-base">{t("logout")}</span>
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