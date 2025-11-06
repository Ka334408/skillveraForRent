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
                      accounticonColor="bg-[#0E766E]"
                      menuiconColor="bg-[#0E766E] text-white rounder-full"
                      activeColor="bg-[#0E766E] text-white"
                      textColor="text-[#0E766E]"
                      hoverColor="hover:bg-[#0E766E] hover:text-white"
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