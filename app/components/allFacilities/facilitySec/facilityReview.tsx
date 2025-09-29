"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

export default function RatingCard() {
  const t = useTranslations("rating");

  // رقم عشوائي من 1 لـ 5 مع كسر عشري (مثال: 4.3)
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    // يتنفذ بس في الكلاينت
    const random = (Math.random() * 4 + 1).toFixed(1); // من 1.0 ل 5.0
    setRating(Number(random));
  }, []);


  return (
    <div className="my-10 rounded-md p-6 text-center shadow-sm bg-white">
        <p className="border-t-2 border-t-blue-700 mb-10"/>
      <p className="text-4xl font-bold text-gray-800">{rating}</p>
      <p className="text-blue-600 font-semibold mt-2">{t("title")}</p>
      <p className="text-gray-600 text-lg mt-1">{t("description")}</p>
      <p className="border-b-2 border-b-blue-700 mt-10"/>
    </div>
  );
}