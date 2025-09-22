"use client";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import HeroSection from "../../../components/userview/heroSection";
import SearchSection from "../../../components/userview/searchBar";
import CategoriesSection from "../../../components/userview/catigories";
import NearestMap from "@/app/components/userview/LiveMap";
import TrustedSection from "@/app/components/userview/TrustedSec";
import FAQSection from "@/app/components/userview/FAQSec";
import FeaturesSection from "@/app/components/userview/FeaturesSec";
import DownloadSection from "@/app/components/userview/downloadappsec";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

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
      <Header />
      <HeroSection />
      <SearchSection />
      <CategoriesSection />
      <NearestMap />
      <TrustedSection />
      <FAQSection />
      <FeaturesSection />
      <DownloadSection />
    
    </main>
  );
}