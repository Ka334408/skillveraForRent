import { Heart, Star } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";
interface CardProps {
  id: string;
  title: string;
  image: string;
  price: number;
  rating: number;
  reviewsCount: number;
  isFavorite?: boolean;
  onFavorite?: (id: string) => void;
}

export default function Card({
  id,
  title,
  image,
  price,
  rating,
  reviewsCount,
  isFavorite,
  onFavorite,
}: CardProps) {
  const t = useTranslations("card");
  return (
    <div className="min-w-[250px] bg-white rounded-3xl shadow-lg overflow-hidden flex-shrink-0
     dark:bg-black/30 dark:text-white dark:border-2 dark:border-white ">
      {/* Image */}
      <div className="relative">
        <Image
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
           width={100}
          height={100}
        />
        <span className="absolute top-3 left-3 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold ">
          {title}
        </span>
        <button
          onClick={() => onFavorite && onFavorite(id)}
          className={`absolute top-3 right-3 p-2 rounded-full transition  ${isFavorite ? "bg-red-500" : "bg-blue-600"
            }`}
        >
          <Heart
            className={`w-5 h-5 ${isFavorite ? "text-white fill-white" : "text-white"}`}
          />
        </button>
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex items-center justify-between bg-blue-100 rounded-xl px-3 py-2 mb-3  dark:bg-[#2C70E2]">
          <span className="font-bold text-blue-600 dark:text-white">
            ${price} / Day
          </span>
          <span className="flex items-center gap-1 text-blue-600 font-semibold dark:text-white">
            <Star className="w-4 h-4 fill-blue-600" />
            {rating} ({reviewsCount})
          </span>
        </div>
        <Link href={`/userview/allFacilities/${id}`}>
          <button className="bg-white text-black border-2 border-[#2C70E2] px-4 py-2 rounded-2xl w-full hover:bg-blue-700 dark:bg-[#0a0a0a] dark:text-[#2C70E2] dark:hover:bg-white dark:hover:text-black">
            {t("more")}
          </button>
        </Link>
      </div>
    </div>
  );
}