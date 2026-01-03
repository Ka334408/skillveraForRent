import FacilitySection from '@/app/components/allFacilities/allFacilities'
import FacilitySectionWrapper from '@/app/components/allFacilities/facilitySecWrapper'
import Header from '@/app/components/header'
import React from 'react'

export default function page() {
  return (
    <div>
               <Header
              bgColor="bg-white border-b-gray-200 " 
              loginLink="/auth/login"
        signupLink="/auth/signUp"
            />
            <FacilitySectionWrapper/>
           
    </div>
  )
}
