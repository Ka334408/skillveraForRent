"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/"); 
    } else {
      setLoading(false); 
    }

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
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 animate-bounce">
          Skillvera
        </h1>
      </div>
    );
  }

  return <>{children}</>;
}