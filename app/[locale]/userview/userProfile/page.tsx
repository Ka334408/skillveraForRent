import Header from '@/app/components/header'
import ProfilePage from '@/app/components/userview/userProfile'
import { useLocale } from 'next-intl';
import React from 'react'

export default function page() {
  const locale = useLocale();
  const loginUrl = `/${locale}/auth/login`;
  const signupUrl = `/${locale}/auth/signUp`;
  return (
    <div>
      <Header
              bgColor="bg-white border-b-gray-200 border-2" 
              loginLink={loginUrl}
          signupLink={signupUrl}
            />
            <ProfilePage/>
    </div>
  )
}
