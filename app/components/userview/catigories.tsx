"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Card from "../mainComponents/card";
import LoginModal from "../loginmodel";
import { facilitiesData } from "@/app/constants/content";

export default function CategoriesSection() {
  const t = useTranslations("categories");
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isLoggedIn = !!token;

  // تجهيز الداتا
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

  // 🌀 التكرار (عشان الانزلاق يكون دائري)
  const loopedItems = [...filteredItems, ...filteredItems.slice(0, 4)]; // نكرر أول 3 كروت في النهاية

  // ⏱ Auto Slide كل 3 ثواني
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setStartIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 🎯 لما نوصل لآخر كارت من النسخة المكررة، نرجع لأول واحد بدون حركة
  useEffect(() => {
    if (startIndex === filteredItems.length) {
      // بعد انتهاء الانيميشن بوقت قصير جدًا
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setStartIndex(0);
      }, 600); // نفس زمن transition
      return () => clearTimeout(timeout);
    }
  }, [startIndex, filteredItems.length]);

  const handleFavorite = (id: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <section className="px-6 py-10 relative bg-gray-100 dark:bg-[#0a0a0a] dark:text-white mt-15 overflow-hidden">
      {/* Title + See All */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0E766E]">{t("title")}</h2>
        <button
          onClick={() => router.push("/userview/allFacilities")}
          className="text-[#0E766E] font-semibold hover:text-white border-[#2C70E2] px-4 py-2 rounded-full border transition hover:bg-[#2C70E2]"
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
          { key: "hotal", label: "hotal" },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              setActiveCategory(cat.key);
              setStartIndex(0);
            }}
            className={`px-4 py-2 rounded-full border transition ${
              activeCategory === cat.key
                ? "bg-[#0E766E] text-white border-[#0E766E] dark:bg-white dark:text-[#0E766E]"
                : "bg-white text-[#0E766E] border-blue-400 hover:bg-blue-100 dark:bg-[#0a0a0a]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cards Slider */}
      <div ref={containerRef} className="relative w-full overflow-hidden">
        <div
          className={`flex gap-6 ${
            isTransitioning ? "transition-transform duration-700 ease-in-out" : ""
          }`}
          style={{
            transform: `translateX(-${startIndex * 320}px)`, // كل كارت عرضه تقريبي 320px
          }}
        >
          {loopedItems.map((item, index) => (
            <Card
              key={`${item.id}-${index}`}
              {...item}
              isFavorite={favorites.includes(item.id)}
              onFavorite={() => handleFavorite(item.id)}
            />
          ))}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal show={true} onClose={() => setShowLoginModal(false)} />
      )}
    </section>
  );
}