"use client";

import DashboardPage from "@/app/components/providerview/dashboard";
import FacilitiesPage from "@/app/components/providerview/myfacility";
import ProviderSidebar from "@/app/components/providerview/sidebar";
import { useState } from "react";


export default function ProviderLayout() {
  const [active, setActive] = useState("dashboard");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <ProviderSidebar active={active} setActive={setActive} />

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        {active === "dashboard" && <DashboardPage />}
        {active === "facilities" && <FacilitiesPage />}
        
      </main>
    </div>
  );
}