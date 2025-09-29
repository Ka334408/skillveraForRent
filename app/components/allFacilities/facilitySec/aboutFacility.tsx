"use client";

import { useTranslations } from "next-intl";

export default function ThingsToKnow() {
  const t = useTranslations("thingsToKnow");
  const rules: string[] = t.raw("rules"); // نجيب ال Array زي ما هو من الترجمة

  return (
    <section className="py-8 px-4">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-8">
        {t("title")}
      </h2>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Facility Rules */}
        <div>
          <h3 className="font-semibold text-lg mb-3">{t("rulesTitle")}</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {rules.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </div>

        {/* Facility Policies */}
        <div>
          <h3 className="font-semibold text-lg mb-3">{t("policiesTitle")}</h3>
          <p className="text-gray-700 leading-relaxed mb-2">
            {t("policies")}
          </p>
          <button className="text-blue-600 font-medium hover:underline text-sm">
            {t("showMore")}
          </button>
        </div>
      </div>
    </section>
  );
}