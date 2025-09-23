"use client"

import FacilityHeader from "@/app/components/allFacilities/facilitySec/FacilityHeder";
import FacilityCalendar from "@/app/components/allFacilities/facilitySec/facilityCalender";

import Header from "@/app/components/header";
import { notFound } from "next/navigation";

import dynamic from "next/dynamic";

// ✅ منع SSR
const FacilityMapSection = dynamic(
  () => import("@/app/components/allFacilities/facilitySec/facilityMap"),
  { ssr: false }
);

// نفس الداتا بتاعة all facilities
 const categoryImages: Record<string, string> = {
  Sports: "/stadium.jpg",
  Education: "/school.jpg",
  Health: "/hotal.jpg",
};

export const facilitiesData = Array.from({ length: 100 }, (_, i) => {
  const category = i % 3 === 0 ? "Sports" : i % 3 === 1 ? "Education" : "Health";

  return {
    id: i + 1,
    name: `Facility ${i + 1}`,
    description: `Description for facility ${i + 1}, lorem ipsum dolor sit amet.`,
    location: i % 2 === 0 ? "Riyadh" : "Jeddah",
    price: 400 + (i % 5) * 100,
    category,
    image: categoryImages[category] || `https://picsum.photos/400/300?random=${i}`,
     lat: 24.7136 + i * 0.01,
    lng: 46.6753 + i * 0.01,
  };
});

export default function FacilityPage({ params }: { params: { id: string } }) {
  const facilityId = Number(params.id);
  const facility = facilitiesData.find((f) => f.id === facilityId);

  if (!facility) return notFound();

  return (
    <div><Header
                bgColor="bg-white border-b-gray-200 border-2" 
                accounticonColor="bg-[#2C70E2]"
                menuiconColor="bg-[#2C70E2] text-white rounder-full"
                activeColor="bg-[#2C70E2] text-white"
                textColor="text-blue-600"
                hoverColor="hover:bg-[#2C70E2] hover:text-white"
                enable="hidden"
                isrounded="rounded-full"
              />
    <div className="container mx-auto px-4 py-8">
           
      {/* الهيدر */}
      <FacilityHeader facility={facility} />
      <FacilityMapSection
      location={facility.location}
        lat={facility.lat}
        lng={facility.lng}
        features={[
          "Free Wi-Fi",
          "Parking available",
          "Air Conditioning",
          "24/7 Security",
        ]}
      />
      <FacilityCalendar
                  bookedDates={[
                      "2025-09-20",
                      "2025-09-22",
                      "2025-09-25",
                  ]} pricePerDay={facility.price}/>

    
    </div>
    </div>
  );
}