'use client';

import React from 'react'
import Listing from './_components/Listing'
import Header from './_components/Header'

function Dashboard() {
  return (
    <div className="bg-black min-h-screen w-full overflow-x-hidden">
      <Header />
      <Listing />
    </div>
  )
}

export default Dashboard