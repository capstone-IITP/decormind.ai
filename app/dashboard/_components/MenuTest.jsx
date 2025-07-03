'use client';

import React, { useState } from 'react';
import MobileMenu from './MobileMenu';

export default function MenuTest() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    console.log("Toggling menu, current state:", isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLinkClick = (path) => {
    console.log("Link clicked:", path);
    setIsMenuOpen(false);
  };
  
  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-2xl mb-6">Mobile Menu Test</h1>
      
      <button
        className="bg-cyan-400 text-black px-4 py-2 rounded-md"
        onClick={toggleMenu}
      >
        Toggle Menu
      </button>
      
      <div className="mt-4">
        <p>Menu state: {isMenuOpen ? 'Open' : 'Closed'}</p>
      </div>
      
      <MobileMenu 
        isOpen={isMenuOpen}
        onClose={toggleMenu}
        onLinkClick={handleLinkClick}
      />
    </div>
  );
} 