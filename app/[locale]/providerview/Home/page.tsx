import Header from '@/app/components/header'
import CardsSection from '@/app/components/providerview/home/cardsSec'
import HeroSection from '@/app/components/providerview/home/herosection'
import HowItWorks from '@/app/components/providerview/home/HowitWork'
import ToolsSection from '@/app/components/providerview/home/toolsSec'
import WhyChooseUs from '@/app/components/providerview/home/whyChooseUs'
import FAQSection from '@/app/components/userview/FAQSec'

import React from 'react'

export default function page() {
  return (
    <div>
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
      <HeroSection/>
      <CardsSection/>
      <ToolsSection/>
      <HowItWorks/>
      <WhyChooseUs/>
      <FAQSection/>
    </div>
  )
}
