"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/userStore";
import axiosInstance from "@/lib/axiosInstance";
import HeroSection from "../../../components/userview/heroSection";
import SearchSection from "../../../components/userview/searchBar";
import CategoriesSection from "../../../components/userview/catigories";
import NearestMap from "@/app/components/userview/LiveMap";
import TrustedSection from "@/app/components/userview/TrustedSec";
import FAQSection from "@/app/components/userview/FAQSec";
import FeaturesSection from "@/app/components/userview/FeaturesSec";
import DownloadSection from "@/app/components/userview/downloadappsec";
import Header from "@/app/components/header";
import ContactSection from "@/app/components/userview/contact";
import AboutSection from "@/app/components/userview/aboutSkillavera";

export default function HomePage() {
  const [needsProfile, setNeedsProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isHydrated } = useUserStore();

  const locale = useLocale();

  const { user, setUser } = useUserStore();

  const loginUrl = `/${locale}/auth/login`;
  const signupUrl = `/${locale}/auth/signUp`;

  return (
    <main dir={locale === "ar" ? "rtl" : "ltr"} className="relative bg-[#f3f4f4]">
      <div>
        <Header
          bgColor="bg-[#f3f4f4] border-b-gray-200"
          loginLink={loginUrl}
          signupLink={signupUrl}
        />

        <HeroSection />
        <SearchSection />
        <CategoriesSection />
        <NearestMap />
        <TrustedSection />
        <FAQSection questions="FAQ" />
        <ContactSection />
        {/* <FeaturesSection /> */}
        <AboutSection />
      </div>
    </main>
  );
}