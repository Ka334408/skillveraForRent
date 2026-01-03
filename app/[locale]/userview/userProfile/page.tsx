import Header from '@/app/components/header'
import ProfilePage from '@/app/components/userview/userProfile'
import React from 'react'

export default function page() {
  return (
    <div>
      <Header
              bgColor="bg-white border-b-gray-200 border-2" 
              loginLink="/auth/login"
        signupLink="/auth/signUp"
            />
            <ProfilePage/>
    </div>
  )
}
