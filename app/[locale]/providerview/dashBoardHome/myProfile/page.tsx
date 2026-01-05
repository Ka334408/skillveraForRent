"use client"

import MyProfile from '@/app/components/providerview/proProfile/myprofile'
import Topbar from '@/app/components/providerview/topBar'
import React from 'react'

export default function page() {
  return (
    <div>
      <Topbar/>
      <MyProfile/>
    </div>
  )
}
