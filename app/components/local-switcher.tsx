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
interface topBarProps{
  bgColor:string,
  iconwidth:string,
  iconiHight:string,
  enableLabel:string,
  enableFlag:string,

};
import { Globe } from "lucide-react";

export default function LocaleSwitcher({
  bgColor="#0E766E",
  iconiHight="w-4",
  iconwidth="w-4",
  enableLabel="true",
  enableFlag="true",
}:topBarProps) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (nextLocale: string) => {
    router.replace(

      { pathname },
      { locale: nextLocale }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`${bgColor} flex items-center gap-2 px-3 py-2 rounded-lg  hover:bg-white hover:text-black transition w-full text-white mt-2`}>
          <Image
            src={`/locale/${locale}.svg`}
            alt={locale}
            width={20}
            height={20}
            className={`rounded-full ${enableFlag}`}
          />
          <span className={`capitalize ${enableLabel}`}>{t("locale", { locale })}</span>
          <Globe className={`${iconwidth} ${iconiHight} ml-auto`} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={`w-48 ${bgColor} text-black rounded-2xl shadow-xl p-2 text-lg`}
      >
        {locales.map((cur) => (
          <DropdownMenuItem
            key={cur}
            onClick={() => handleLocaleChange(cur)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${cur === locale
                ? "bg-white hover:gray-400"
                : "bg-gray-200 text-black font-semibold"
              }`}
          >
            <Image
              src={`/locale/${cur}.svg`}
              alt={cur}
              width={20}
              height={20}
              className="rounded-full"
            />
            <span className="capitalize">{t("locale", { locale: cur })}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}