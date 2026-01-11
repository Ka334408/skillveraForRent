"use client";

import { useLocale, useTranslations } from "next-intl";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const isArabic = locale === "ar";

  const sections = [
    { title: t("main"), items: t.raw("mainLinks") },
    { title: t("about"), items: t.raw("aboutLinks") },
    { title: t("support"), items: t.raw("supportLinks") },
    { title: t("apps"), items: t.raw("appsLinks") },
  ];

  return (
    <footer
      dir={isArabic ? "rtl" : "ltr"}
      className="bg-white text-gray-700 border-t border-gray-200 py-10"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div
          className={clsx(
            "grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
            isArabic ? "text-right" : "text-left"
          )}
        >
          {sections.map((section, i) => (
            <div key={i}>
              <h3 className="font-semibold text-gray-400 mb-3 text-base">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map(
                  (item: { label: string; href: string }, j: number) => (
                    <li key={j}>
                      <a
                        href={item.href}
                        className="hover:text-[#0C8A83] transition-colors font-medium text-sm"
                      >
                        {item.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        <div
          className={clsx(
            "flex items-center mt-10 mb-6",
            isArabic ? "justify-start" : "justify-end"
          )}
        >
          <div className="flex items-center gap-2">
             <div className="font-bold text-lg">
          <Link href={`/${locale}/userview/Home`}>
            <Image
              src="/logo.png"   
              alt="Logo"
              width={120}
              height={40}
              className="object-contain cursor-pointer"
            />
          </Link>
        </div>
          </div>
        </div>

        {/* الفاصل */}
        <div className="border-t border-gray-200 mb-6" />

        {/* الكوبي رايتس */}
        <div
          className={clsx(
            "flex items-center",
            isArabic ? "justify-end" : "justify-start"
          )}
        >
          <p className="text-sm text-gray-500">© 2025 All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}