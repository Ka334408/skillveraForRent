"use client";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import HeroSection from "../components/heroSection";
import SearchSection from "../components/searchBar";

import CategoriesSection from "../components/catigories";

export default function HomePage() {
  const [email, setEmail] = useState<string | null>(null);
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    router.push('/login');
  };

  return (
   
    
    <main
     
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <HeroSection />
    <SearchSection/>
      <CategoriesSection  />
    </main>
  );
}