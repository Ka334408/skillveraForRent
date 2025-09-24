"use client";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("about");

  return (
    <section className="bg-blue-600 text-white py-16 text-center rounded-b-3xl">
      <h1 className="text-4xl font-bold mb-2">{t("title")}</h1>
      <p className="text-lg">{t("subtitle")}</p>
    </section>
  );
}