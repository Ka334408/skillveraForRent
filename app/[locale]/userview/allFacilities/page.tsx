import FacilitySection from '@/app/components/allFacilities/allFacilities'
import FacilitySectionWrapper from '@/app/components/allFacilities/facilitySecWrapper'
import Header from '@/app/components/header'
import { useLocale } from 'next-intl';
import React from 'react'

export default function page() {
  const locale = useLocale();
  const loginUrl = `/${locale}/auth/login`;
  const signupUrl = `/${locale}/auth/signUp`;
  return (
    <div>
               <Header
              bgColor="bg-white border-b-gray-200 " 
              loginLink={loginUrl}
          signupLink={signupUrl}
            />
            <FacilitySectionWrapper/>
           
    </div>
  )
}
