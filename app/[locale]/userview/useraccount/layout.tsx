"use client";

import { useState } from "react";
import Header from "@/app/components/header";
import ProfileSidebar from "@/app/components/useraccount/userSideBar";
import PastReservation from "@/app/components/useraccount/pastreservation";
import Aboutme from "@/app/components/useraccount/Aboutme";
import Reviews from "@/app/components/useraccount/myreviews";
import Favorites from "@/app/components/useraccount/myfavourits";
import ProtectedPage from "@/app/components/protectedpages/protectedPage";


export default function UserAccountLayout() {
  const [active, setActive] = useState("about");

  return (
    <div className="min-h-screen flex flex-col">
      
      <Header
        bgColor="bg-white border-b-gray-200 border-2" 
        loginLink="/auth/login"
        signupLink="/auth/signUp"
      />

      
      <div className="flex flex-1">
        {/* Sidebar */}
        <ProfileSidebar active={active} setActive={setActive} />

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          {active === "about" && <ProtectedPage><Aboutme /></ProtectedPage>}
          {active === "reservations" && <ProtectedPage><PastReservation /></ProtectedPage>}
          {active === "reviews" && <ProtectedPage><Reviews /></ProtectedPage>}
          {active === "favorites" && <ProtectedPage><Favorites /></ProtectedPage>}
        </main>
      </div>
    </div>
  );
}