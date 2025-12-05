"use client";

import Image from "next/image";
import { Star, Share2, Bookmark, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useParams } from "next/navigation"; // لو Next.js App Router
import { useFacilityStore } from "@/app/store/facilityStore"

export default function FacilityHeader() {
  const t = useTranslations("facilityHeader");
  const params = useParams();
  const facilityId = params?.id;

  const local = useLocale();

  // ----------------- Zustand store -----------------
  const facility = useFacilityStore((state: any) => state.facility);
  const setFacility = useFacilityStore((state: any) => state.setFacility);
  const clearFacility = useFacilityStore((state: any) => state.clearFacility);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ----------------- Fetch Facility -----------------
  useEffect(() => {
    if (!facilityId) return;

    const fetchFacility = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/guest-facility/${facilityId}`);
        const data = res.data?.data;
        if (data) {
          // 1️⃣ مسح القديم
          clearFacility();

          // 2️⃣ حفظ الجديد في الـ store
          setFacility({
            id: data.id,
            coverImage: data.cover ? `/${local}/api/media?media=${data.cover}` : "",
            images: data.images?.map((img: string) => `/${local}/api/media?media=${img}`) ?? [],
            name: data.name.en,
            rate: data.rate ?? 0,
            category: {
              id: data.category?.id ?? "0",
              name: data.category?.name?.en ?? "",
            },
            description: data.description?.en ?? data.overview?.en ?? "",
            price: data.price,
            location: {
              lat: Number(data.addressLatLong?.split(",")[0] ?? 0),
              lng: Number(data.addressLatLong?.split(",")[1] ?? 0),
            },
            address: data.address ?? "",
            webSite: data.website ?? "",
            taxNumber: data.taxNumber ?? "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch facility:", err);
      }
      setLoading(false);
    };

    fetchFacility();
  }, [facilityId, clearFacility, setFacility, local]);

  if (loading || !facility) {
    return <div className="py-10 text-center">Loading</div>;
  }

  const images: string[] = facility.images && facility.images.length
    ? facility.images
    : facility.coverImage
      ? [facility.coverImage]
      : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative">
      {/* الصور */}
      <div className="md:col-span-2">
        <div
          className="relative w-full h-72 rounded-xl overflow-hidden cursor-pointer group flex items-center justify-center bg-gray-200 text-gray-500 text-lg font-medium"
          onClick={() => facility.coverImage && setSelectedImage(facility.coverImage)}
        >
          {facility.coverImage ? (
            <Image
              src={facility.coverImage}
              alt={facility.name?.en ?? "Facility"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            "No photo"
          )}
        </div>

        <div className="flex gap-3 mt-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-80"
              onClick={() => setSelectedImage(img)}
            >
              <Image src={img} alt={`thumb-${i}`} fill className="object-cover" />
            </div>
          ))}
          {images.length > 5 && (
            <button className="w-20 h-20 border rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
              +{images.length - 5}
            </button>
          )}
        </div>
      </div>

      {/* التفاصيل */}
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold">{facility.name}</h1>
          <p className="text-gray-500">{facility.address}</p>

          <div className="flex items-center gap-2 mt-2">
            <Star className="text-yellow-500" size={18} />
            <span className="font-medium">{facility.rate ?? 0}</span>
            <span className="text-gray-500 text-sm">
              {t("ratingCount", { count: 100 })}
            </span>
          </div>

          <p className="mt-2 text-[#0E766E] font-semibold">
            {t("priceUnit", { price: facility.price })}
          </p>

          <h3 className="mt-4 font-bold">{t("overview")}</h3>
          <p className="text-gray-600 text-sm">{facility.description}</p>
        </div>

        <div className="flex gap-3 mt-4">
          <button className="p-2 rounded-full border hover:bg-gray-100" title={t("share")}>
            <Share2 size={18} />
          </button>
          <button className="p-2 rounded-full border hover:bg-gray-100" title={t("save")}>
            <Bookmark size={18} />
          </button>
        </div>
      </div>

      {/* Overlay */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-[90%] h-[80%] rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <Image src={selectedImage} alt="selected" fill className="object-contain bg-black" />
            <button className="absolute top-3 right-3 bg-white/80 hover:bg-white text-black rounded-full p-2" onClick={() => setSelectedImage(null)}>
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}