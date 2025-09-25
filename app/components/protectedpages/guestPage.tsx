"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GuestPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/"); // أو "/dashboard" لو عندك صفحة داشبورد
    } else {
      setLoading(false); // مفيش لوجين → سيبه يدخل
    }
  }, [router]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 animate-bounce">
          Skillvera
        </h1>
      </div>
    );
  }

  return <>{children}</>;
}