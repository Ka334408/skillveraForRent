import FacilitySection from '@/app/components/allFacilities/allFacilities'
import FacilitySectionWrapper from '@/app/components/allFacilities/facilitySecWrapper'
import Header from '@/app/components/header'
import ProtectedPage from '@/app/components/protectedpages/protectedPage'
import React from 'react'

export default function page() {
  return (
    <div>
        <ProtectedPage>
       <Header
              bgColor="bg-white border-b-gray-200 border-2" 
              accounticonColor="bg-[#2C70E2]"
              menuiconColor="bg-[#2C70E2] text-white rounder-full"
              activeColor="bg-[#2C70E2] text-white"
              textColor="text-blue-600"
              hoverColor="hover:bg-black hover:text-white"
              enable="hidden"
              isrounded="rounded-full"
            />
            <FacilitySectionWrapper/>
            </ProtectedPage>
    </div>
  )
}
