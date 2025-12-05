import Image from "next/image";
import { MapPin } from "lucide-react";

interface FacilityCardProps {
  id: number;
  name: string;
  description: string;
  location: string;
  price: number;
  category: string;
  image: string;
}

export default function FacilityCard({
  name,
  description,
  location,
  price,
  category,
  image,
}: FacilityCardProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all w-full h-auto sm:h-40 cursor-pointer">
      
      {/* الصورة */}
      <div className="w-full sm:w-40 h-40 sm:h-full bg-gray-200 dark:bg-gray-700 flex-shrink-0">
        <Image
          src={image}
          alt={name}
          width={160}
          height={160}
          className="w-full h-full object-cover"
        />
      </div>

      {/* المعلومات */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{name}</h3>
          <p className="text-gray-500 dark:text-gray-300 text-sm line-clamp-2 mt-1">{description}</p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin size={16} className="mr-1 text-[#0E766E]" />
            {location}
          </div>

          <div className="flex items-center gap-2">
            <span className="sm:font-semibold bg-[#0E766E] text-white px-3 py-1 rounded-lg text-sm">
              {price} R
            </span>
            <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-xs font-medium">
              {category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}