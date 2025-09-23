"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Card from "../mainComponents/card";
import LoginModal from "../loginmodel";

// 👇 هنستخدم نفس الداتا بتاعت الـ facilities
import { facilitiesData } from "@/app/constants/content";

export default function CategoriesSection() {
  const t = useTranslations("categories");
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 👇 نشوف هل في token في localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isLoggedIn = !!token;

  // 👇 subset من الـ facilities (أول 10 مثلاً)
  const items = facilitiesData.slice(0, 10).map((f) => ({
    id: f.id.toString(),
    title: f.name,
    category: f.category,
    image: f.image,
    price: f.price,
    rating: 4.5,
    reviewsCount: 20,
  }));

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category.includes(activeCategory));

  const handleFavorite = (id: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    // 👇 toggle logic
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <section className="px-6 py-10 relative bg-gray-100 dark:bg-[#0a0a0a] dark:text-white overflow-hidden mt-15">
      {/* Title + See All */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-600">{t("title")}</h2>
        <button
          onClick={() => router.push("/userview/allFacilities")}
          className="text-blue-600 font-semibold hover:text-white border-[#2C70E2] px-4 py-2 rounded-full border transition hover:bg-[#2C70E2]"
        >
          {t("see_all")}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {[
          { key: "all", label: t("all") },
          { key: "Sports", label: "Sports" },
          { key: "Education", label: "Education" },
          { key: "Health", label: "Health" },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 rounded-full border transition ${
              activeCategory === cat.key
                ? "bg-blue-600 text-white border-blue-600 dark:bg-white dark:text-blue-600"
                : "bg-white text-blue-600 border-blue-400 hover:bg-blue-100 dark:bg-[#0a0a0a]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
      >
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            {...item}
            isFavorite={favorites.includes(item.id)}
            onFavorite={() => handleFavorite(item.id)}
          />
        ))}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal show={true} onClose={() => setShowLoginModal(false)} />
      )}
    </section>
  );
}