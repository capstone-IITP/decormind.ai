import React from 'react'
import Listing from './_components/Listing'
import Header from './_components/Header'

function Dashboard() {
  return (
    <div className="bg-black min-h-screen">
      <Header />
      <Listing />
    </div>
  )
}

export default Dashboard