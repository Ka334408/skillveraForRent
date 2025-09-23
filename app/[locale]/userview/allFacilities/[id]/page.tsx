import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin } from "lucide-react";

// 👇 الداتا التجريبية (ممكن تجيبها من API أو DB)
const categoryImages: Record<string, string> = {
  Sports: "/stadium.jpg",
  Education: "/school.jpg",
  Health: "/hotal.jpg",
};

const facilitiesData = Array.from({ length: 100 }, (_, i) => {
  const category = i % 3 === 0 ? "Sports" : i % 3 === 1 ? "Education" : "Health";

  return {
    id: i + 1,
    name: `Facility ${i + 1}`,
    description: `Description for facility ${i + 1}, lorem ipsum dolor sit amet.`,
    location: i % 2 === 0 ? "Riyadh" : "Jeddah",
    price: 400 + (i % 5) * 100,
    category,
    image: categoryImages[category] || `https://picsum.photos/400/300?random=${i}`,
  };
});

export default function FacilityPage({ params }: { params: { id: string } }) {
  const facilityId = Number(params.id);
  const facility = facilitiesData.find((f) => f.id === facilityId);

  if (!facility) return notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* الصورة */}
        <div className="relative w-full h-64">
          <Image
            src={facility.image}
            alt={facility.name}
            fill
            className="object-cover"
          />
        </div>

        {/* المحتوى */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{facility.name}</h1>
          <p className="text-gray-600 mb-4">{facility.description}</p>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center text-gray-600">
              <MapPin className="mr-1 text-blue-600" size={18} />
              {facility.location}
            </div>
            <span className="bg-blue-600 text-white px-3 py-1 rounded font-semibold">
              {facility.price} R
            </span>
          </div>

          <div className="text-sm text-gray-500">
            Category:{" "}
            <span className="font-medium text-gray-800">{facility.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}