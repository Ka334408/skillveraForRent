"use client";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import HeroSection from "../../../components/heroSection";
import SearchSection from "../../../components/searchBar";

import CategoriesSection from "../../../components/catigories";

import NearestMap from "@/app/components/LiveMap";
import TrustedSection from "@/app/components/TrustedSec";
import FAQSection from "@/app/components/FAQSec";


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
      <NearestMap/>
      <TrustedSection/>
      <FAQSection/>
      
    </main>
  );
}