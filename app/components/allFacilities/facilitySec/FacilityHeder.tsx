import Image from "next/image";
import { Star, Share2, Bookmark } from "lucide-react";

export default function FacilityHeader({
  facility,
}: {
  facility: {
    id: number;
    name: string;
    description: string;
    location: string;
    price: number;
    image: string;
  };
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {/* الصور */}
      <div className="md:col-span-2">
        <div className="relative w-full h-72 rounded-xl overflow-hidden">
          <Image
            src={facility.image}
            alt={facility.name}
            fill
            className="object-cover"
          />
        </div>

        {/* صور صغيرة تحت الرئيسية */}
        <div className="flex gap-3 mt-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="relative w-20 h-20 rounded-lg overflow-hidden"
            >
              <Image
                src={`${facility.image}`}
                alt="thumb"
                fill
                className="object-cover"
              />
            </div>
          ))}
          <button className="w-20 h-20 border rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
            +20
          </button>
        </div>
      </div>

      {/* التفاصيل */}
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold">{facility.name}</h1>
          <p className="text-gray-500">{facility.location}</p>

          <div className="flex items-center gap-2 mt-2">
            <Star className="text-yellow-500" size={18} />
            <span className="font-medium">5.0</span>
            <span className="text-gray-500 text-sm">(100)</span>
          </div>

          <p className="mt-2 text-blue-600 font-semibold">
            {facility.price}/DAY
          </p>

          <h3 className="mt-4 font-bold">Overview</h3>
          <p className="text-gray-600 text-sm">{facility.description}</p>
        </div>

        {/* اكشنز */}
        <div className="flex gap-3 mt-4">
          <button className="p-2 rounded-full border hover:bg-gray-100">
            <Share2 size={18} />
          </button>
          <button className="p-2 rounded-full border hover:bg-gray-100">
            <Bookmark size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}