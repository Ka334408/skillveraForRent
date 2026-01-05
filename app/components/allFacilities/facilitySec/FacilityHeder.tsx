"use client";

import Image from "next/image";
import { Star, Share2, X, MapPin, Globe, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useParams } from "next/navigation";
import { useFacilityStore } from "@/app/store/facilityStore";

export default function FacilityHeader() {
  const t = useTranslations("facilityHeader");
  const params = useParams();
  const facilityId = params?.id;
  const locale = useLocale();
  const isRTL = locale === "ar";

  const facility = useFacilityStore((state: any) => state.facility);
  const setFacility = useFacilityStore((state: any) => state.setFacility);
  const clearFacility = useFacilityStore((state: any) => state.clearFacility);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!facilityId) return;

    const fetchFacility = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/guest-facility/${facilityId}`);
        const data = res.data?.data;
        if (data) {
          clearFacility();
          setFacility({
            id: data.id,
            coverImage: data.cover ? `/api/media?media=${data.cover}` : "",
            images: data.images?.map((img: string) => `/api/media?media=${img}`) ?? [],
            name: { en: data.name?.en, ar: data.name?.ar },
            rate: data.rate ?? 0,
            category: {
              id: data.category?.id ?? "0",
              name: { en: data.category?.name?.en || "No Category", ar: data.category?.name?.ar||"لا اسم " },
            },
            description: { 
              en: data.description?.en || data.overview?.en || "ى", 
              ar: data.description?.ar || data.overview?.ar || "" 
            },
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
  }, [facilityId, clearFacility, setFacility, locale]);

  if (loading || !facility) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0E766E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const facilityName = isRTL ? facility.name?.ar : facility.name?.en;
  const facilityDesc = isRTL ? facility.description?.ar : facility.description?.en;
  
  const allImages: string[] = [
    ...(facility.coverImage ? [facility.coverImage] : []),
    ...(facility.images || [])
  ];

  return (
    <div className="flex flex-col gap-6 mb-12" dir={isRTL ? "rtl" : "ltr"}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-3">
          <div 
            className="relative w-full h-[350px] md:h-[450px] rounded-[2rem] overflow-hidden cursor-pointer group bg-gray-100 dark:bg-zinc-800"
            onClick={() => facility.coverImage && setSelectedImage(facility.coverImage)}
          >
            {facility.coverImage ? (
              <Image
                src={facility.coverImage}
                alt="Cover"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
            )}
            <div className="absolute top-4 right-4 md:top-6 md:right-6">
               <button className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg text-black hover:bg-white transition">
                 <Share2 size={18} />
               </button>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {allImages.slice(1, 7).map((img, i) => (
              <div
                key={i}
                className="relative min-w-[80px] h-[80px] rounded-2xl overflow-hidden cursor-pointer border border-transparent hover:border-[#0E766E] transition-all flex-shrink-0"
                onClick={() => setSelectedImage(img)}
              >
                <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm h-fit">
          <div className="space-y-5">
            <div>
              <span className="bg-[#0E766E]/10 text-[#0E766E] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {isRTL ? facility.category?.name?.ar : facility.category?.name?.en}
              </span>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mt-3">
                {facilityName}
              </h1>
              <div className="flex items-center gap-1 mt-2 text-gray-400 text-xs font-medium">
                <MapPin size={14} className="text-[#0E766E]" />
                <p className="line-clamp-1">{facility.address}</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-y border-gray-50 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-yellow-400 fill-current" />
                <span className="font-bold text-gray-900 dark:text-white">{facility.rate}</span>
              </div>
              <div className="text-right">
                 <p className="text-xl font-black text-[#0E766E]">{facility.price} <span className="text-xs font-medium">{t("currency")}</span></p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t("overview")}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-5">
                {facilityDesc}
              </p>
            </div>
            
            <div className="space-y-2 pt-2 border-t border-gray-50 dark:border-zinc-800">
               {facility.webSite && (
                 <a href={facility.webSite} target="_blank" className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#0E766E] transition">
                    <Globe size={14} /> {facility.webSite.replace(/(^\w+:|^)\/\//, '')}
                 </a>
               )}
               {facility.taxNumber && (
                 <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ShieldCheck size={14} /> <span>{t("taxNo")}: {facility.taxNumber}</span>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-8 right-8 text-white hover:rotate-90 transition-transform duration-300">
            <X size={40} />
          </button>
          <div className="relative w-full max-w-5xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image src={selectedImage} alt="Preview" fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}