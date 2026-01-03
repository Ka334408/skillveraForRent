"use client";

import { usePathname, useRouter } from "@/localization/navigation";
import { locales } from "@/localization/config";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";

interface topBarProps {
  bgColor?: string;
  iconwidth?: string;
  iconiHight?: string;
  enableLabel?: string;
  enableFlag?: string;
}

export default function LocaleSwitcher({
  bgColor = "bg-transparent", // غيرناه لـ شفاف عشان يندمج مع المنيو
  iconiHight = "w-4",
  iconwidth = "w-4",
  enableLabel = "block", // بنستخدم Tailwind classes بدل true/false
  enableFlag = "block",
}: topBarProps) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (nextLocale: string) => {
    router.replace({ pathname }, { locale: nextLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className={`flex items-center gap-3 px-4 py-3 rounded-[1.2rem] transition-all duration-300 group outline-none
            ${bgColor} hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border border-transparent hover:border-zinc-200 dark:hover:border-white/10`}
        >
          {/* العلم الحالي */}
          <div className={`relative w-6 h-6 overflow-hidden rounded-full border border-zinc-200 dark:border-white/20 ${enableFlag}`}>
            <Image
              src={`/locale/${locale}.svg`}
              alt={locale}
              fill
              className="object-cover"
            />
          </div>
          
          <span className={`text-sm font-extrabold dark:text-zinc-200 group-hover:text-[#0E766E] transition-colors ${enableLabel}`}>
            {t("locale", { locale })}
          </span>

          <Globe className={`${iconwidth} ${iconiHight} text-zinc-400 group-hover:text-[#0E766E] group-hover:rotate-12 transition-all ml-auto`} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="center"
        sideOffset={10}
        className="w-52 bg-zinc-900 dark:bg-black border border-white/10 rounded-[1.8rem] shadow-[0_15px_40px_rgba(0,0,0,0.4)] p-2 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          {t("select_language")}
        </div>

        {locales.map((cur) => (
          <DropdownMenuItem
            key={cur}
            onClick={() => handleLocaleChange(cur)}
            className={`flex items-center gap-3 px-3 py-3 rounded-[1.2rem] cursor-pointer mb-1 transition-all
              ${cur === locale
                ? "bg-[#0E766E] text-white shadow-lg shadow-emerald-900/20"
                : "text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
          >
            <div className="relative w-5 h-5 overflow-hidden rounded-full shadow-sm">
              <Image
                src={`/locale/${cur}.svg`}
                alt={cur}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm font-bold capitalize flex-1">
              {t("locale", { locale: cur })}
            </span>
            
            {cur === locale && <Check size={14} className="text-white animate-in zoom-in" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}