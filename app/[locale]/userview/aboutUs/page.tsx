import Benefits from "@/app/components/aboutus/benfiets";
import Hero from "@/app/components/aboutus/hero";
import Story from "@/app/components/aboutus/story";
import Testimonials from "@/app/components/aboutus/testimonials";
import Header from "@/app/components/header";


export default function AboutPage() {
  return (
    <main>
        <Header
                      bgColor="bg-white border-b-gray-200 border-2" 
                      accounticonColor="bg-[#2C70E2]"
                      menuiconColor="bg-[#2C70E2] text-white rounder-full"
                      activeColor="bg-[#2C70E2] text-white"
                      textColor="text-blue-600"
                      hoverColor="hover:bg-[#2C70E2] hover:text-white"
                      enable="hidden"
                      isrounded="rounded-full"
                    />
      <Hero />
      <Benefits />
      <Story />
      <Testimonials />
    </main>
  );
}