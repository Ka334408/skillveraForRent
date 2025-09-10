"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Card from "./card";

export default function CategoriesSection() {
  const t = useTranslations("categories");
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // هيتم ضبطها بالـ auth
  const [items, setItems] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) setIsLoggedIn(true);

    // Fetch من fakestoreapi
    const fetchItems = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();
        // نخلي الكاتيجوري مؤقتاً = category من api
        const mapped = data.map((p: any) => ({
          id: p.id.toString(),
          title: p.title,
          category: p.category,
          image: p.image,
          price: p.price,
          rating: p.rating?.rate || 0,
          reviewsCount: p.rating?.count || 0,
        }));
        setItems(mapped);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };
    fetchItems();
  }, [token]);

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category.includes(activeCategory));

  const handleFavorite = async (id: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify({ itemId: id }),
      });
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
      );
    } catch (err) {
      console.error("Error adding favorite:", err);
    }
  };

  return (
    <section className="px-6 py-10 relative bg-gray-100">
      {/* Title + See All */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-600" data-aos="fade-up" data-aos-duration="2000">{t("title")}</h2>
        <button
          onClick={() => router.push("/categories")}
          data-aos="fade-up" data-aos-duration="2000"
          className="text-blue-600 font-semibold hover:text-white border-[#2C70E2] px-4 py-2 rounded-full border transition hover:bg-[#2C70E2]"
        >
          {t("see_all")}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {[
          { key: "all", label: t("all") },
          { key: "men", label: "Men" },
          { key: "women", label: "Women" },
          { key: "jewelery", label: "Jewelery" },
          { key: "electronics", label: "Electronics" },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 rounded-full border transition ${
              activeCategory === cat.key
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-blue-600 border-blue-400 hover:bg-blue-100"
            }`}
          data-aos="fade-up" data-aos-duration="2000"

          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        data-aos="fade-right" data-aos-duration="3000"
        
      >
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            {...item}
            isFavorite={favorites.includes(item.id)}
            onFavorite={handleFavorite}
            
          />
        ))}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm text-center">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              {t("login_required")}
            </h3>
            <button
              onClick={() => setShowLoginModal(false)}
              className="bg-[#2C70E2] text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              {t("ok")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}