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
import FeaturesSection from "@/app/components/FeaturesSec";
import DownloadSection from "@/app/components/downloadappsec";
import Header from "@/app/components/header";
import ProfileImageUploader from "@/app/components/Aboutme";

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
          <Header bgColor="bg-white border-b-gray-200 border-2" accounticonColor="bg-[#2C70E2]" menuiconColor="bg-[#2C70E2] text-white" activeColor="bg-black text-white" textColor="text-blue-600"  
      hoverColor="hover:bg-black hover:text-white" enable="hidden"
      />
     
    </main>
  );
}