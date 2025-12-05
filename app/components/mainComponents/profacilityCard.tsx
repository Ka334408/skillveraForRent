"use client";

import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface FacilityCardProps {
  id: number | string;
  name: string;
  image: string;
  onDelete: (id: number | string) => void;
}

export default function FacilityCard({ id, name, image, onDelete }: FacilityCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-200 rounded-xl p-4 flex flex-col justify-between h-52 w-full relative">
      {/* Header */}
      <div className="flex items-center justify-between relative">
        <span className="text-xs text-gray-800 px-2 py-1 rounded-md font-semibold">
          #{id}
        </span>

        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="p-1 rounded-full hover:bg-blue-300 transition"
          >
            <MoreHorizontal className="text-gray-700 w-5 h-5" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-50">
              <button
                onClick={() => {
                  setOpen(false);
                  alert(`Edit facility ${id}`);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                ✏ Edit Facility
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  onDelete(id);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                🗑 Delete Facility
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <h3 className="font-semibold text-lg mt-2">{name}</h3>

      {/* Image */}
      <div className="relative w-full h-28 mt-2 rounded-lg overflow-hidden bg-white">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    </div>
  );
}