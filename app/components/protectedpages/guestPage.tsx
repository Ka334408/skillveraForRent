"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/userStore";

export default function GuestPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useUserStore(); // <-- جاي من zustand
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      router.replace("/userview/Home"); 
      // لو لوجين بالفعل ارميه على الهوم
    } else {
      setLoading(false); // مفيش يوزر → سيبه يدخل
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0E766E] animate-bounce">
          Skillvera
        </h1>
      </div>
    );
  }

  return <>{children}</>;
}