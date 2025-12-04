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
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-cyan-400 w-16 h-16 rounded-full flex items-center justify-center text-slate-800 text-2xl font-bold mb-6">
        <span suppressHydrationWarning className="bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text">D</span>
      </div>
      <h3 suppressHydrationWarning className="text-2xl font-bold mb-2 bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text">No Rooms Yet</h3>
      <p className="text-white text-opacity-80 mb-8 max-w-md">
        Welcome to DecorMind! Your personalized interior design experience.
      </p>
      <Button 
        className="bg-cyan-400 text-slate-800 hover:bg-cyan-500 px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2"
        onClick={() => router.push('/redesign')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        Create New Design
      </Button>
    </div>
  )
}
