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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}