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
  const [needsProfile, setNeedsProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // ✅ لو عامل لوج ان شيك على الـ DOB & Gender
      const dob = localStorage.getItem("dob");
      const gender = localStorage.getItem("gender");

      if (!dob || !gender || dob === "null" || gender === "null") {
        setNeedsProfile(true);
      }
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
       <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 animate-bounce">
          Skillvera
        </h1>
      </div>
    );
  }

  return (
    <main dir={locale === "ar" ? "rtl" : "ltr"} className="relative">
      {/* 🟢 محتوى الهوم */}
      <div className={needsProfile ? "blur-sm pointer-events-none select-none" : ""}>
        <Header />
        <HeroSection />
        <SearchSection />
        <CategoriesSection />
        <NearestMap />
        <TrustedSection />
        <FAQSection />
        <FeaturesSection />
        <DownloadSection />
        <Footer />
      </div>

      {/* 🟢 أوفرلاي الرسالة */}
      {needsProfile && (
        <div className="fixed top-20 right-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 text-left max-w-xs border border-gray-200 mr-5">
            <h2 className="text-lg font-semibold mb-2">Complete your profile</h2>
            <p className="text-gray-600 mb-3 text-sm">
              Please update your date of birth and gender to continue.
            </p>
            <button
              onClick={() => router.push("/userview/useraccount")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full"
            >
              Go to Profile
            </button>
          </div>
        </div>
      )}
    </main>
  );
}