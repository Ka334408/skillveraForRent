import ContactFormSection from '@/app/components/contactus/form'
import HeroSection from '@/app/components/contactus/hero'
import InfoSection from '@/app/components/contactus/infosec'
import Header from '@/app/components/header'
import React from 'react'

export default function page() {
  return (
    <div>
      <Header bgColor="bg-gray-100"  loginLink="/auth/login"
        signupLink="/auth/signUp" />
      <HeroSection />
      <InfoSection />
      <ContactFormSection />
    </div>
  )
}
