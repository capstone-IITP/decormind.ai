'use client';

import React, { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { useRouter } from 'next/navigation'

export default function EmptyState() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 px-4 text-center">
      <div className="bg-cyan-400 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-slate-800 text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        <span suppressHydrationWarning className="bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text">D</span>
      </div>
      <h3 suppressHydrationWarning className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text">No Rooms Yet</h3>
      <p className="text-white text-opacity-80 mb-6 sm:mb-8 max-w-md text-sm sm:text-base">
        Welcome to DecorMind! Your personalized interior design experience.
      </p>
      <Button 
        className="bg-cyan-400 text-slate-800 hover:bg-cyan-500 px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-colors flex items-center gap-2 text-sm sm:text-base"
        onClick={() => router.push('/redesign')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        Create New Design
      </Button>
    </div>
  )
}
