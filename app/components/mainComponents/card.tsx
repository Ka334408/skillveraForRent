import { Heart, Star } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

interface CardProps {
  id: string;
  title: string;
  // 💡 التعديل: جعل الخاصية image اختيارية (string | undefined)
  image?: string; 
  price: number;
  rating: number;
  reviewsCount: number;
  isFavorite?: boolean;
  onFavorite?: (id: string) => void;
}

export default function Card({
  id,
  title,
  image, // يمكن أن تكون undefined
  price,
  rating,
  reviewsCount,
  isFavorite,
  onFavorite,
}: CardProps) {
  const t = useTranslations("card");
  const locale =useLocale();
  
  // 💡 تحديد الارتفاع القياسي
  const imageDisplayHeight = 192; // equivalent to h-48 in Tailwind CSS (12 * 16px)

  return (
    <div className="min-w-[250px] bg-white rounded-3xl shadow-lg overflow-hidden flex-shrink-0
      dark:bg-black/30 dark:text-white dark:border-2 dark:border-white ">
      
      {/* Image Area */}
      <div className="relative">
        
        {/* 💡 التعديل الرئيسي: منطق عرض الصورة أو رسالة "No Photo" */}
        {image ? (
          // في حال وجود image (string): نعرض مكون Image
          <Image
            src={image}
            alt={title}
            // استخدمنا height هنا لضمان أن المكون يعرف ارتفاعه
            className="w-full h-48 object-cover"
            width={300} // قيمة افتراضية مناسبة لعرض البطاقة
            height={imageDisplayHeight} // يجب أن يتطابق مع h-48
          />
        ) : (
          // في حال عدم وجود image (undefined): نعرض Placeholder
          <div 
            className={`w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-lg dark:bg-gray-800`}
            style={{ height: `${imageDisplayHeight}px` }}
          >
            No Photo
          </div>
        )}
        
        {/* Title Badge (يبقى كما هو) */}
        <span className="absolute top-3 left-3 bg-[#0E766E] text-white px-4 py-1 rounded-full text-sm font-bold ">
          {title}
        </span>
        
        {/* Favorite Button (يبقى كما هو) */}
        <button
          onClick={() => onFavorite && onFavorite(id)}
          className={`absolute top-3 right-3 p-2 rounded-full transition ${isFavorite ? "bg-red-500" : "bg-[#0E766E]"}`}
        >
          <Heart
            className={`w-5 h-5 ${isFavorite ? "text-white fill-white" : "text-white"}`}
          />
        </button>
      </div>

      {/* Details */}
      <div className="p-4 ">
        <div className="flex items-center justify-between bg-[#94ccc7] rounded-xl px-3 py-2 mb-3 dark:bg-[#0E766E]">
          <span className="font-bold text-[#0E766E] dark:text-white">
            ${price} / Day
          </span>
          <span className="flex items-center gap-1 text-[#0E766E] font-semibold dark:text-white">
            <Star className="w-4 h-4 fill-[#0E766E]" />
            {rating} ({reviewsCount})
          </span>
        </div>
        <Link href={`/${locale}/userview/allFacilities/${id}`}>
          <button className="bg-white text-black border-2 border-[##0E766E] px-4 py-2 rounded-2xl w-full hover:bg-[#0E766E] dark:bg-[#0a0a0a] dark:text-[#2C70E2] dark:hover:bg-white dark:hover:text-black">
            {t("more")}
          </button>
        </Link>
      </div>
    </div>
  );
}