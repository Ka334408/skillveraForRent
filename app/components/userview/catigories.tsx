"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import LoginModal from "../loginmodel";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { useUserStore } from "@/app/store/userStore";

// ----------------------- Types -----------------------
interface FacilityItem {
  _id: number;
  name?: { en: string; ar: string };
  cover?: string;
  price: number;
  rate?: number;
  reviewsCount?: number;
  category?: number;
}

interface CategoryItem {
  _id: number;
  name: { en: string; ar?: string };
}

interface FacilityCardProps {
  item: FacilityItem;
  isFavorite: boolean;
  onFavorite: (id: number) => void;
  isLoggedIn: boolean;
}

// ----------------------- Card -----------------------
const FacilityCard = ({ item, isFavorite, onFavorite }: FacilityCardProps) => {
  const t = useTranslations("card");
  const locale = useLocale();

  const imageUrl = item.cover ? `/api/media?media=${item.cover}` : undefined;
  const title = locale === "ar" ? item.name?.ar : item.name?.en || "Facility";

  return (
    <div className="min-w-[250px] bg-white rounded-3xl shadow-lg overflow-hidden flex-shrink-0 dark:bg-black/30 dark:text-white dark:border-2 dark:border-white transition-all duration-300 hover:shadow-2xl">
      <div className="relative">
        {imageUrl ? (
          <Image src={imageUrl} alt="" className="w-full h-48 object-cover" width={300} height={192} />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-lg dark:bg-gray-800">
            No Photo
          </div>
        )}

        <span className="absolute top-3 left-3 bg-[#0E766E] text-white px-4 py-1 rounded-full text-sm font-bold opacity-90">
          {title}
        </span>

        <button
          onClick={() => onFavorite(item._id)}
          className={`absolute top-3 right-3 p-2 rounded-full transition shadow-md ${
            isFavorite ? "bg-red-500" : "bg-[#0E766E]/80 hover:bg-[#0E766E]"
          }`}
          aria-label={isFavorite ? "unfavorite" : "favorite"}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "text-white fill-white" : "text-white"}`} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between bg-[#94ccc7] rounded-xl px-3 py-2 mb-3 dark:bg-[#0E766E] dark:text-white">
          <span className="font-bold text-[#0E766E] dark:text-white">${item.price} / Day</span>
          <span className="flex items-center gap-1 text-[#0E766E] font-semibold dark:text-white">
            <Star className="w-4 h-4 fill-[#0E766E] dark:fill-white" />
            {item.rate ?? 4.5} ({item.reviewsCount ?? 0})
          </span>
        </div>

        <Link href={`/userview/allFacilities/${item._id}`}>
          <button className="bg-white text-black border-2 border-[#0E766E] px-4 py-2 rounded-2xl w-full hover:bg-[#0E766E] hover:text-white transition duration-200 dark:bg-[#0a0a0a] dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black">
            {t("more")}
          </button>
        </Link>
      </div>
    </div>
  );
};

// ----------------------- Main -----------------------
export default function CategoriesSection() {
  const t = useTranslations("categories");
  const locale = useLocale();
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const userStore = useUserStore();
  const isLoggedIn = !!userStore.token;

  // ------------------ Helpers ------------------
  const toNumberSafe = (v: any): number | null => {
    if (v === null || v === undefined) return null;
    if (typeof v === "number") return v;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  };

  // ------------------ Fetch categories ------------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/category/categories");
        const raw = res.data?.data ?? [];

        const parsed: CategoryItem[] = raw
          .map((c: any) => ({
            _id: toNumberSafe(c.id) ?? -1,
            name: {
              en: c.name?.en ?? "No name",
              ar: c.name?.ar ?? "لا اسم",
            },
          }))
          .filter((c:any) => c._id !== -1);

        setCategories(parsed);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // ------------------ Fetch facilities (filtered) ------------------
  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);
      try {
        const params: any = { limit: 10 };
        if (activeCategory !== "all") params.categoryId = activeCategory;

        const res = await axiosInstance.get("/guest-facility", { params });
        const raw = res.data?.data ?? [];

        const parsed: FacilityItem[] = raw.map((f: any) => ({
          _id: toNumberSafe(f._id ?? f.id) ?? -1,
          name: {
            en: f.name?.en ?? "No name",
            ar: f.name?.ar ?? "لا اسم",
          },
          cover: f.cover ?? f.image,
          price: typeof f.price === "number" ? f.price : Number(f.price) || 0,
          rate: typeof f.rate === "number" ? f.rate : Number(f.rating) || undefined,
          reviewsCount: typeof f.reviewsCount === "number" ? f.reviewsCount : Number(f.reviewsCount) || 0,
          category: toNumberSafe(f.category) ?? (f.category?._id ? toNumberSafe(f.category._id) : undefined),
        })).filter((f:any) => f._id !== -1);

        setFacilities(parsed);
      } catch (error) {
        console.error("Error loading facilities:", error);
        setFacilities([]);
      }
      setLoading(false);
    };
    fetchFacilities();
  }, [activeCategory]);

  // ------------------ Fetch favorites ------------------
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isLoggedIn) return setFavorites([]);

      try {
        const res = await axiosInstance.get("/user-favorite");
        const raw = res.data?.data ?? [];

        const ids: number[] = raw
          .map((r: any) => {
            const fac = r.facility ?? r;
            if (typeof fac === "object") return toNumberSafe(fac._id ?? fac.id);
            return toNumberSafe(fac);
          })
          .filter((n :any) => typeof n === "number") as number[];

        setFavorites(ids);
      } catch (err) {
        console.error("Failed to load favorites:", err);
        setFavorites([]);
      }
    };
    fetchFavorites();
  }, [isLoggedIn]);

  // ------------------ Favorite toggle ------------------
  const handleFavorite = async (id: number) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    const nid = toNumberSafe(id);
    if (nid === null) return;

    const prev = [...favorites];
    const isFav = prev.includes(nid);

    setFavorites(isFav ? prev.filter((f) => f !== nid) : [...prev, nid]);

    try {
      await axiosInstance.post(`/user-favorite/favorite-facility/${nid}`);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      setFavorites(prev);
    }
  };

  // ------------------ Render ------------------
  return (
    <section className="px-6 py-10 relative bg-[#f3f4f4] dark:bg-[#0a0a0a] dark:text-white mt-15 overflow-hidden">
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0E766E]">{t("title")}</h2>
        <button
          onClick={() => router.push("/userview/allFacilities")}
          className="text-[#0E766E] font-semibold hover:text-white border-[#0E766E] px-4 py-2 rounded-full border transition hover:bg-[#0E766E]"
        >
          {t("see_all")}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-full border transition ${
            activeCategory === "all" ? "bg-[#0E766E] text-white border-[#0E766E]" : "bg-white text-[#0E766E] border-blue-400"
          }`}
        >
          {t("all")}
        </button>

        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setActiveCategory(cat._id)}
            className={`px-4 py-2 rounded-full border transition ${
              activeCategory === cat._id ? "bg-[#0E766E] text-white border-[#0E766E]" : "bg-white text-[#0E766E] border-blue-400"
            }`}
          >
            {locale === "ar" ? cat.name.ar : cat.name.en}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="w-full text-center py-10 text-lg font-semibold text-[#0E766E]">
          Loading...
        </div>
      )}

      {/* No Data */}
      {!loading && facilities.length === 0 && (
        <div className="w-full text-center py-10 text-lg text-gray-500">No facilities found</div>
      )}

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {facilities.map((item, idx) => (
          <FacilityCard
            key={`${item._id}-${idx}`}
            item={item}
            isFavorite={favorites.includes(item._id)}
            isLoggedIn={isLoggedIn}
            onFavorite={handleFavorite}
          />
        ))}
      </div>

      {showLoginModal && <LoginModal show={true} onClose={() => setShowLoginModal(false)} />}
    </section>
  );
}