import ContactFormSection from '@/app/components/contactus/form'
import HeroSection from '@/app/components/contactus/hero'
import InfoSection from '@/app/components/contactus/infosec'
import Header from '@/app/components/header'
import { useLocale } from 'next-intl'
import React from 'react'

export default function page() {
  const locale = useLocale();
  const loginUrl = `/${locale}/auth/login`;
  const signupUrl = `/${locale}/auth/signUp`;
  return (
    <div>
      <Header bgColor="bg-gray-100"  
      loginLink={loginUrl}
          signupLink={signupUrl} />
      <HeroSection />
      <InfoSection />
      <ContactFormSection />
    </div>
  )
}
