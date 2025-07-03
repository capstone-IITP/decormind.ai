'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function MobileMenu({ isOpen, onClose, onLinkClick }) {
  const menuRef = useRef(null);
  
  // Add event listener for escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);
  
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Don't render anything if not open
  if (!isOpen) return null;
  
  console.log("Rendering MobileMenu, isOpen:", isOpen);
  
  return (
    <div 
      className="fixed inset-0 z-[999] flex md:hidden" 
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-70 transition-opacity duration-300 ease-in-out"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      {/* Menu Content */}
      <div 
        ref={menuRef}
        className="fixed right-0 top-0 h-full w-72 bg-zinc-900 shadow-xl overflow-y-auto transform transition-transform duration-300 ease-in-out animate-slide-in"
        style={{
          animation: 'slideIn 0.3s ease-out forwards',
        }}
      >
        <style jsx global>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <div className="bg-cyan-400 w-6 h-6 rounded-full flex items-center justify-center text-slate-800 text-xs font-bold">DM</div>
              <span className="font-bold text-lg bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text" suppressHydrationWarning>DecorMind</span>
            </div>
            <button 
              type="button"
              onClick={onClose}
              className="text-white hover:text-cyan-400 transition-colors p-2"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <nav className="flex flex-col gap-6">
            <Link 
              href="/dashboard" 
              className="text-white hover:text-cyan-400 transition-colors duration-300 text-lg font-medium"
              onClick={() => onLinkClick('/dashboard')}
            >
              Home
            </Link>
            <Link 
              href="/redesign" 
              className="text-white hover:text-cyan-400 transition-colors duration-300 text-lg font-medium"
              onClick={() => onLinkClick('/redesign')}
            >
              Redesign
            </Link>
            <Link 
              href="/decormind" 
              className="text-white hover:text-cyan-400 transition-colors duration-300 text-lg font-medium"
              onClick={() => onLinkClick('/decormind')}
            >
              DecorMind
            </Link>
            <Link 
              href="/dashboard-pricing" 
              className="text-white hover:text-cyan-400 transition-colors duration-300 text-lg font-medium"
              onClick={() => onLinkClick('/dashboard-pricing')}
            >
              Pricing
            </Link>
            <Link 
              href="/dashboard-contact-us" 
              className="text-white hover:text-cyan-400 transition-colors duration-300 text-lg font-medium"
              onClick={() => onLinkClick('/dashboard-contact-us')}
            >
              Contact Us
            </Link>
            <Link 
              href="/favorites" 
              className="text-white hover:text-cyan-400 transition-colors duration-300 text-lg font-medium"
              onClick={() => onLinkClick('/favorites')}
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:fill-cyan-400 transition-colors">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                Favorites
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
} 