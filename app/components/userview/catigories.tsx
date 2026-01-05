"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import LoginModal from "../loginmodel";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, LayoutGrid, ArrowUpRight } from "lucide-react";
import { useUserStore } from "@/app/store/userStore";

// ----------------------- Types (تمت إعادتها لحل الأخطاء) -----------------------
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

// ----------------------- Facility Card Component -----------------------
const FacilityCard = ({ item, isFavorite, onFavorite }: FacilityCardProps) => {
  const t = useTranslations("card");
  const locale = useLocale();
  const imageUrl = item.cover ? `/api/media?media=${item.cover}` : undefined;
  const title = locale === "ar" ? item.name?.ar : item.name?.en || "Facility";

  return (
    <div className="flex-shrink-0 w-[280px] md:w-[320px] snap-center bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group">
      <div className="relative h-56 m-2 rounded-[2rem] overflow-hidden">
        {imageUrl ? (
          <Image src={imageUrl} alt="image" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400">
            <LayoutGrid size={32} />
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg">
           <span className="text-[#0E766E] dark:text-teal-400 font-bold text-sm">
             ${item.price} <span className="text-[10px] font-normal opacity-70">/ Day</span>
           </span>
        </div>

        <button
          onClick={() => onFavorite(item._id)}
          className={`absolute top-4 right-4 p-2.5 rounded-full transition-all shadow-md ${
            isFavorite ? "bg-red-500 text-white" : "bg-white/80 text-gray-600 hover:bg-white"
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800 dark:text-white truncate pr-2">{title}</h3>
          <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
            <Star size={14} className="fill-current" />
            <span className="text-xs font-bold">{item.rate??0}</span>
          </div>
        </div>

        <Link href={`/userview/allFacilities/${item._id}`}>
          <button className="w-full bg-[#0E766E] text-white py-3.5 rounded-2xl font-bold hover:bg-[#0a5c56] transition-all flex items-center justify-center gap-2 group/btn shadow-md shadow-teal-900/10">
            {t("more")}
            <ArrowUpRight size={18} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  );
};

// ----------------------- Main Categories Section -----------------------
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

  // ------------------ Helpers (نفس اللوجيك الخاص بك) ------------------
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
        const parsed: CategoryItem[] = raw.map((c: any) => ({
          _id: toNumberSafe(c.id) ?? -1,
          name: { en: c.name?.en ?? "No name", ar: c.name?.ar ?? "لا اسم" },
        })).filter((c: any) => c._id !== -1);
        setCategories(parsed);
      } catch (error) { console.error(error); }
    };
    fetchCategories();
  }, []);

  // ------------------ Fetch facilities ------------------
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
          name: { en: f.name?.en ?? "No name", ar: f.name?.ar ?? "لا اسم" },
          cover: f.cover ?? f.image,
          price: Number(f.price) || 0,
          rate: Number(f.rate ?? f.rating) || undefined,
          reviewsCount: Number(f.reviewsCount) || 0,
          category: toNumberSafe(f.category) ?? (f.category?._id ? toNumberSafe(f.category._id) : undefined),
        })).filter((f: any) => f._id !== -1);
        setFacilities(parsed);
      } catch (error) { setFacilities([]); }
      setLoading(false);
    };
    fetchFacilities();
  }, [activeCategory]);

  // ------------------ Fetch favorites  ------------------
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isLoggedIn) return setFavorites([]);
      try {
        const res = await axiosInstance.get("/user-favorite");
        const raw = res.data?.data ?? [];
        const ids = raw.map((r: any) => {
          const fac = r.facility ?? r;
          if (typeof fac === "object") return toNumberSafe(fac._id ?? fac.id);
          return toNumberSafe(fac);
        }).filter((n: any) => typeof n === "number") as number[];
        setFavorites(ids);
      } catch (err) { setFavorites([]); }
    };
    fetchFavorites();
  }, [isLoggedIn]);

  // ------------------ Favorite toggle  ------------------
  const handleFavorite = async (id: number) => {
    if (!isLoggedIn) { setShowLoginModal(true); return; }
    const nid = toNumberSafe(id);
    if (nid === null) return;
    const prev = [...favorites];
    const isFav = prev.includes(nid);
    setFavorites(isFav ? prev.filter((f) => f !== nid) : [...prev, nid]);
    try { await axiosInstance.post(`/user-favorite/favorite-facility/${nid}`); } 
    catch (error) { setFavorites(prev); }
  };

  return (
    <section className="px-6 py-16 dark:bg-zinc-950 overflow-hidden" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        
        {/* العناوين */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-[#0E766E] dark:text-teal-500">{t("title")}</h2>
            <div className="h-1 w-12 bg-teal-200 dark:bg-teal-900 rounded-full" />
          </div>
          <button onClick={() => router.push("/userview/allFacilities")} className="hidden md:flex items-center gap-1.5 text-[#0E766E] dark:text-teal-400 font-bold hover:opacity-70 transition">
            {t("see_all")} <ArrowUpRight size={18} />
          </button>
        </div>

        {/* التصنيفات - تمرير أفقي */}
        <div className="flex gap-2 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
          <button
            onClick={() => setActiveCategory("all")}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
              activeCategory === "all" ? "bg-[#0E766E] text-white shadow-lg" : "bg-white dark:bg-zinc-900 text-gray-400 border border-gray-100 dark:border-zinc-800"
            }`}
          >
            {t("all")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat._id)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                activeCategory === cat._id ? "bg-[#0E766E] text-white shadow-lg" : "bg-white dark:bg-zinc-900 text-gray-400 border border-gray-100 dark:border-zinc-800"
              }`}
            >
              {locale === "ar" ? cat.name.ar : cat.name.en}
            </button>
          ))}
        </div>

        {/* الكروت - تمرير أفقي لمنع النزول لأسفل */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-10 px-2 no-scrollbar snap-x scroll-smooth">
            {loading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="min-w-[280px] h-80 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-[2.5rem]" />)
            ) : facilities.length === 0 ? (
              <div className="w-full py-10 text-center text-gray-400 italic">No facilities found</div>
            ) : (
              facilities.map((item, idx) => (
                <FacilityCard
                  key={`${item._id}-${idx}`}
                  item={item}
                  isFavorite={favorites.includes(item._id)}
                  isLoggedIn={isLoggedIn}
                  onFavorite={handleFavorite}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {showLoginModal && <LoginModal show={true} onClose={() => setShowLoginModal(false)} />}
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}