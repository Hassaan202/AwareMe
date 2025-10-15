import React from 'react'
import Navbar from './Navbar/Navbar'
import ChildHomePage from './ChildHomePage/ChildHomePage'
import EmergencyButton from '@/app/components/EmergencyButton'

export default function page() {
  return (
    <>
    <Navbar />
    <EmergencyButton />
    <ChildHomePage />
    </>
    
  )
}
