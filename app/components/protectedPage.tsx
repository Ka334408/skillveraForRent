"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // لودينج لحد ما نعرف

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/"); // مفيش توكن → روح للهوم
    } else {
      setLoading(false); // فيه توكن → فك اللودينج ورندر الصفحة
    }

    // لو حصل لوج آوت
    const handleStorage = () => {
      if (!localStorage.getItem("token")) {
        router.replace("/");
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
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