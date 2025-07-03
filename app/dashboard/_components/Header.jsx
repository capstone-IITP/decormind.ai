'use client';

import React, { useEffect, useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import MobileMenu from './MobileMenu';

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    router.push('/dashboard');
  };

  // Handle link click animation
  const handleLinkClick = (path) => {
    setActiveLink(path);
    setMobileMenuOpen(false);
    
    // Reset active link after animation completes
    setTimeout(() => {
      setActiveLink(null);
    }, 300);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    console.log("Toggle mobile menu", !mobileMenuOpen);
    setMobileMenuOpen(prevState => !prevState);
  };

  // Close mobile menu on resize if screen becomes larger than mobile breakpoint
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        if (window.innerWidth >= 768 && mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [mobileMenuOpen]);

  // Add CSS animations when component mounts
  useEffect(() => {
    setMounted(true);
    
    // Skip on server-side rendering
    if (typeof window === 'undefined') return;
    
    // Create a style element
    const style = document.createElement('style');
    style.innerHTML = `
      /* Navbar link animations */
      @keyframes fadeInDown {
        0% {
          opacity: 0;
          transform: translateY(-10px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .nav-link {
        position: relative;
        opacity: 0;
      }

      .nav-link::after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: -4px;
        left: 0;
        background-color: #22d3ee;
        transition: width 0.3s ease;
      }
      
      .nav-link:hover::after {
        width: 100%;
      }

      .nav-link.active::after {
        width: 100%;
      }

      /* Click animation */
      @keyframes clickEffect {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(0.95);
        }
        100% {
          transform: scale(1);
        }
      }

      .link-clicked {
        animation: clickEffect 0.3s ease forwards;
      }

      /* Desktop animations */
      @media (min-width: 768px) {
        .nav-link:nth-child(1) {
          animation: fadeInDown 0.5s ease-out 0.1s forwards;
        }

        .nav-link:nth-child(2) {
          animation: fadeInDown 0.5s ease-out 0.2s forwards;
        }

        .nav-link:nth-child(3) {
          animation: fadeInDown 0.5s ease-out 0.3s forwards;
        }

        .nav-link:nth-child(4) {
          animation: fadeInDown 0.5s ease-out 0.4s forwards;
        }

        .nav-link:nth-child(5) {
          animation: fadeInDown 0.5s ease-out 0.5s forwards;
        }
      }

      /* Navigation bar slide-down animation */
      @keyframes slideDown {
        0% {
          transform: translateY(-100%);
        }
        100% {
          transform: translateY(0);
        }
      }

      .nav-slide-down {
        animation: slideDown 0.5s ease-out forwards;
      }

      /* Logo animation */
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
        100% {
          transform: scale(1);
        }
      }

      .logo-pulse:hover {
        animation: pulse 1s infinite;
      }
      
      /* Logo glow effect */
      .logo-container {
        position: relative;
        transition: all 0.3s ease;
      }
      
      .logo-container:hover::after {
        content: '';
        position: absolute;
        top: -5px;
        left: -5px;
        right: -5px;
        bottom: -5px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, rgba(34, 211, 238, 0) 70%);
        z-index: -1;
        animation: glow 1.5s infinite alternate;
      }
      
      @keyframes glow {
        0% {
          opacity: 0.5;
        }
        100% {
          opacity: 1;
        }
      }
      
      /* Sticky navbar effect */
      .sticky-nav {
        position: sticky;
        top: 0;
        z-index: 50;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
      }
      
      .sticky-nav.scrolled {
        background-color: rgba(24, 24, 27, 0.8);
        box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
      }

      /* Hamburger menu animation */
      .hamburger-line {
        display: block;
        width: 24px;
        height: 2px;
        margin: 4px auto;
        background-color: white;
        transition: all 0.3s ease-in-out;
      }

      .hamburger-open .line-1 {
        transform: translateY(6px) rotate(45deg);
      }

      .hamburger-open .line-2 {
        opacity: 0;
      }

      .hamburger-open .line-3 {
        transform: translateY(-6px) rotate(-45deg);
      }
    `;
    document.head.appendChild(style);
    
    // Add scroll event for sticky navbar effect
    const handleScroll = () => {
      const navbar = document.querySelector('.sticky-nav');
      if (navbar) {
        if (window.scrollY > 10) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);

    // Cleanup function
    return () => {
      document.head.removeChild(style);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to check if the link is active
  const isActive = (path) => {
    if (!mounted) return false;
    return pathname === path;
  };

  // Update active links after mounting
  useEffect(() => {
    if (mounted) {
      const currentPath = pathname;
      const links = document.querySelectorAll('.nav-link');
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
          link.classList.add('text-cyan-400');
          link.classList.add('active');
        }
      });
    }
  }, [mounted, pathname]);

  return (
    <>
      <div className="p-5 shadow-sm flex justify-between items-center bg-zinc-900 border-b border-zinc-800 rounded-bl-3xl rounded-br-3xl nav-slide-down sticky-nav relative z-30">
        <div
          className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity logo-pulse"
          onClick={() => router.push('/')}
        >
          <div className="logo-container bg-cyan-400 w-6 h-6 rounded-full flex items-center justify-center text-slate-800 text-xs font-bold">DM</div>
          <h2 suppressHydrationWarning className="font-bold text-lg bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text">DecorMind</h2>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <nav className="flex gap-6" style={{ fontSize: '0.875rem' }}>
            <Link 
              href="/dashboard" 
              suppressHydrationWarning
              className="nav-link text-white hover:text-cyan-400 transition-colors duration-300 relative"
              onClick={() => handleLinkClick('/dashboard')}
            >
              Home
            </Link>
            <Link 
              href="/redesign" 
              suppressHydrationWarning
              className="nav-link text-white hover:text-cyan-400 transition-colors duration-300 relative"
              onClick={() => handleLinkClick('/redesign')}
            >
              Redesign
            </Link>
            <Link 
              href="/decormind" 
              suppressHydrationWarning
              className="nav-link text-white hover:text-cyan-400 transition-colors duration-300 relative"
              onClick={() => handleLinkClick('/decormind')}
            >
              DecorMind
            </Link>
            <Link 
              href="/dashboard-pricing" 
              suppressHydrationWarning
              className="nav-link text-white hover:text-cyan-400 transition-colors duration-300 relative"
              onClick={() => handleLinkClick('/dashboard-pricing')}
            >
              Pricing
            </Link>
            <Link 
              href="/dashboard-contact-us" 
              suppressHydrationWarning
              className="nav-link text-white hover:text-cyan-400 transition-colors duration-300 relative"
              onClick={() => handleLinkClick('/dashboard-contact-us')}
            >
              Contact Us
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center h-8">
            <Link 
              href="/favorites" 
              suppressHydrationWarning
              className="flex items-center justify-center text-white hover:text-cyan-400 transition-all duration-300 transform hover:scale-110 h-full"
              onClick={() => handleLinkClick('/favorites')}
              aria-label="Favorites"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:fill-cyan-400 transition-colors">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </Link>
          </div>
          <UserButton afterSignOutUrl="/" />
          
          {/* Mobile Menu Button */}
          <button 
            type="button"
            className={`md:hidden flex flex-col justify-center items-center p-2 rounded-md ${mobileMenuOpen ? 'hamburger-open bg-zinc-800' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            suppressHydrationWarning
          >
            <span className="hamburger-line line-1"></span>
            <span className="hamburger-line line-2"></span>
            <span className="hamburger-line line-3"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Component */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={toggleMobileMenu} 
        onLinkClick={handleLinkClick} 
      />
    </>
  );
}

export default Header;