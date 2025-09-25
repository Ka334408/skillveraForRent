import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

interface FacilityCardProps {
  id: number | string;
  name: string;
  image: string;
}

export default function FacilityCard({ id, name, image }: FacilityCardProps) {
  return (
    <div className="bg-blue-200 rounded-xl p-4 flex flex-col justify-between h-52 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs bg-blue-300 px-2 py-1 rounded-md font-semibold">
          #{id}
        </span>
        <MoreHorizontal className="text-gray-600 cursor-pointer" />
      </div>

      {/* Name */}
      <h3 className="font-semibold text-lg mt-2">{name}</h3>

      {/* Image */}
      <div className="relative w-full h-28 mt-2 rounded-lg overflow-hidden bg-white">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}