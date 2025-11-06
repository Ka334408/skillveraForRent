"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import clsx from "clsx";

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();

  return (
    <footer
      className="bg-[#0E766E] text-white py-12 px-6 rounded-none ltr:sm:rounded-tl-[75px] rtl:sm:rounded-tr-[75px]"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        
        {/* العمود الأول */}
        <div>
          <h2 className="text-2xl font-bold mb-4">skillvera</h2>
          <p className="mb-1">{t("email")}</p>
          <p className="mb-1">(+1) 2345 6789</p>
          <p>4140 Parker Rd. Riyadh,<br /> King Abdullah road 31134</p>
        </div>

        {/* العمود الثاني */}
        <div>
          <h3 className="font-semibold mb-3">{t("home")}</h3>
          <ul className="space-y-2">
            <li><Link href="#">{t("facilities")}</Link></li>
            <li><Link href="#">{t("about")}</Link></li>
            <li><Link href="#">{t("categories")}</Link></li>
          </ul>
        </div>

        {/* العمود الثالث */}
        <div>
          <h3 className="font-semibold mb-3">{t("support")}</h3>
          <ul className="space-y-2">
            <li><Link href="#">{t("faq")}</Link></li>
            <li><Link href="#">{t("contact")}</Link></li>
          </ul>
        </div>

        {/* العمود الرابع */}
        <div>
          <h3 className="font-semibold mb-3">Skava</h3>
          <ul className="space-y-2">
            <li><Link href="#">Official Website</Link></li>
            <li><Link href="#">Play Store</Link></li>
            <li><Link href="#">App Store</Link></li>
          </ul>
        </div>

        {/* العمود الخامس */}
        <div>
          <h3 className="font-semibold mb-3">Copyright © skillvera</h3>
          <p>{t("taxNumber")}</p>
        </div>
      </div>
    </footer>
  );
}