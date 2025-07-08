'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { useRouter } from 'next/navigation';
import useGoogleAnalytics from '../_hooks/useGoogleAnalytics';
import { UserButton } from '@clerk/nextjs';
import MobileMenu from '../dashboard/_components/MobileMenu';

export default function DecorMind() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { event } = useGoogleAnalytics();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prevState => !prevState);
  };
  
  // Handle link click for navigation
  const handleLinkClick = (path) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  // Add CSS animations
  useEffect(() => {
    // Set mounted state to true
    setMounted(true);

    // Add CSS for animations
    let style;
    if (typeof window !== 'undefined') {
      style = document.createElement('style');
      style.innerHTML = `
        @keyframes highlightSection {
          0% { background-color: rgba(34, 211, 238, 0.1); }
          50% { background-color: rgba(34, 211, 238, 0.2); }
          100% { background-color: transparent; }
        }
        
        .highlight-section {
          animation: highlightSection 1.5s ease-out;
        }

        /* Special animation for contact section */
        @keyframes highlightContactSection {
          0% { background-color: rgba(34, 211, 238, 0.15); }
          50% { background-color: rgba(34, 211, 238, 0.3); }
          100% { background-color: rgba(24, 24, 27, 1); } /* bg-zinc-900 */
        }
        
        #contact.highlight-section {
          animation: highlightContactSection 1.5s ease-out;
        }

        /* Contact form highlight animation */
        @keyframes highlightContactForm {
          0% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.3); }
          50% { box-shadow: 0 0 20px 5px rgba(34, 211, 238, 0.5); }
          100% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0); }
        }
        
        #contact.highlight-section form {
          animation: highlightContactForm 2s ease-out;
        }

        /* Success Popup Styles */
        .success-popup {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          background-color: rgba(0, 0, 0, 0.7);
        }

        .success-popup-content {
          background-color: #18181b;
          border: 2px solid #22d3ee;
          border-radius: 12px;
          padding: 20px 30px;
          text-align: center;
          max-width: 400px;
          animation: popupAppear 0.3s ease-out forwards;
        }

        @keyframes popupAppear {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .success-popup button {
          background-color: #22d3ee;
          color: #000;
          border: none;
          border-radius: 50px;
          padding: 10px 20px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 15px;
        }

        .success-popup button:hover {
          background-color: #0cb8de;
          transform: scale(1.05);
        }
        
        /* Section scroll animation */
        @keyframes sectionFadeIn {
          0% { 
            opacity: 0.7; 
            transform: translateY(20px);
          }
          100% { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .section-fade-in {
          animation: sectionFadeIn 0.8s ease-out forwards;
        }

        /* Heading highlight animation */
        @keyframes headingHighlight {
          0% { 
            background-size: 100% 0%;
          }
          100% { 
            background-size: 100% 100%;
          }
        }
        
        .heading-highlight {
          background-image: linear-gradient(transparent 60%, rgba(34, 211, 238, 0.2) 40%);
          background-size: 100% 0%;
          background-repeat: no-repeat;
          animation: headingHighlight 0.8s ease-out forwards;
        }

        /* Icon animation */
        @keyframes iconPulse {
          0% { 
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.7);
          }
          70% { 
            transform: scale(1.1);
            box-shadow: 0 0 0 10px rgba(34, 211, 238, 0);
          }
          100% { 
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(34, 211, 238, 0);
          }
        }
        
        .icon-pulse {
          animation: iconPulse 1.5s ease-out;
        }

        /* Navigation link click animation */
        @keyframes navLinkClick {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        .nav-link-clicked {
          animation: navLinkClick 0.3s ease-out;
          color: #22d3ee !important;
        }

        /* Hamburger menu styles */
        .hamburger-line {
          display: block;
          width: 24px;
          height: 2px;
          margin: 4px auto;
          background-color: white;
          transition: all 0.3s ease-in-out;
        }

        .line-1.hamburger-open {
          transform: translateY(6px) rotate(45deg);
        }

        .line-2.hamburger-open {
          opacity: 0;
        }

        .line-3.hamburger-open {
          transform: translateY(-6px) rotate(-45deg);
        }

        /* Navigation link hover animation */
        .nav-link {
          position: relative;
          transition: all 0.3s ease;
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

        /* Navigation links fade-in animation on page load */
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

        .nav-link:nth-child(1) {
          animation: fadeInDown 0.5s ease-out 0.1s forwards;
          opacity: 0;
        }

        .nav-link:nth-child(2) {
          animation: fadeInDown 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }

        .nav-link:nth-child(3) {
          animation: fadeInDown 0.5s ease-out 0.3s forwards;
          opacity: 0;
        }

        .nav-link:nth-child(4) {
          animation: fadeInDown 0.5s ease-out 0.4s forwards;
          opacity: 0;
        }

        .nav-link:nth-child(5) {
          animation: fadeInDown 0.5s ease-out 0.5s forwards;
          opacity: 0;
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

        /* Global smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `;
      document.head.appendChild(style);
    }

    // Function to add animations to a section
    const animateSection = (section) => {
      if (!section) return;

      // Add highlight animation to the section
      section.classList.add("highlight-section");

      // Add fade-in animation to section elements
      const sectionElements = section.querySelectorAll('h2, h3, h4, p, .grid, .flex');
      sectionElements.forEach((element, index) => {
        // Stagger the animations
        setTimeout(() => {
          element.classList.add('section-fade-in');

          // Remove the animation class after it completes
          setTimeout(() => {
            element.classList.remove('section-fade-in');
          }, 800);
        }, index * 100); // Stagger by 100ms
      });

      // Add special highlight to headings
      const headings = section.querySelectorAll('h2, h3');
      headings.forEach((heading, index) => {
        setTimeout(() => {
          heading.classList.add('heading-highlight');

          // Remove the animation class after some time
          setTimeout(() => {
            heading.classList.remove('heading-highlight');
          }, 2000);
        }, 300 + (index * 150)); // Stagger with delay
      });

      // Add pulse animation to icons
      const icons = section.querySelectorAll('.w-10, .w-12, svg');
      icons.forEach((icon, index) => {
        setTimeout(() => {
          icon.classList.add('icon-pulse');

          // Remove the animation class after it completes
          setTimeout(() => {
            icon.classList.remove('icon-pulse');
          }, 1500);
        }, 500 + (index * 200)); // Stagger with delay
      });

      // Remove the highlight animation after some time
      setTimeout(() => {
        section.classList.remove("highlight-section");
      }, 1500);
    };

    // Function to highlight active section based on scroll position
    const highlightActiveSection = () => {
      // This is a placeholder function since we don't need this functionality on this page
      // But we need to define it to avoid the error when removing the event listener
    };

    // Smooth scroll function with delay animation
    const handleSmoothScroll = (e) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute("href");

      // Add a visual feedback to the clicked link
      if (e.currentTarget.classList && e.currentTarget.classList.add) {
        e.currentTarget.classList.add("nav-link-clicked");
      }

      // Delay the scroll action for a better visual effect
      setTimeout(() => {
        // If it's not a hash link, navigate to the page
        if (!href || !href.startsWith("#")) {
          router.push(href);
          return;
        }

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Special case for top - scroll to top
          if (targetId === 'top') {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          } else {
            // Add extra offset for contact section
            const offset = targetId === 'contact' ? 100 : 80;

            // Calculate the position to scroll to
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

            // Use the native smooth scrolling
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });

            // Add animations to the target section after scrolling
            setTimeout(() => {
              animateSection(targetElement);
            }, 1000); // Wait for the scroll to complete
          }
        }

        // Remove the visual feedback class
        if (e.currentTarget.classList && e.currentTarget.classList.remove) {
          setTimeout(() => {
            e.currentTarget.classList.remove("nav-link-clicked");
          }, 300);
        }
      }, 300); // 300ms delay before scrolling
    };

    // Add event listeners to navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener("click", handleSmoothScroll);
    });

    // Cleanup
    return () => {
      if (style && style.parentNode) {
        document.head.removeChild(style);
      }

      // Get all navigation links again for cleanup
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.removeEventListener("click", handleSmoothScroll);
      });

      // Remove scroll event listener
      window.removeEventListener('scroll', highlightActiveSection);
    };
  }, [router]);

  // Add tracking for Try DecorMind Now button
  const handleTryDecorMind = () => {
    event({
      action: 'try_decormind_click',
      category: 'engagement',
      label: 'decormind_page'
    });
    router.push('/dashboard');
  };

  // Add tracking for CTA buttons
  const handleStartFreeTrial = () => {
    event({
      action: 'start_free_trial_click',
      category: 'conversion',
      label: 'decormind_page'
    });
    router.push('/dashboard');
  };

  const handleViewPricingPlans = () => {
    event({
      action: 'view_pricing_plans_click',
      category: 'engagement',
      label: 'decormind_page'
    });
    router.push('/pricing');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar - Made responsive */}
      <nav className="flex justify-between items-center py-4 px-6 bg-zinc-900 sticky top-0 z-50 shadow-md border-b border-zinc-800 rounded-bl-3xl rounded-br-3xl nav-slide-down">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <div className="bg-cyan-400 w-6 h-6 rounded-full flex items-center justify-center text-slate-800 text-xs font-bold">DM</div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text" suppressHydrationWarning>DecorMind</h1>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-8 text-sm">
          <Link href="/dashboard" className="nav-link hover:text-cyan-400 text-white transition-colors duration-300 relative" prefetch={true}>Home</Link>
          <Link href="/redesign" className="nav-link hover:text-cyan-400 text-white transition-colors duration-300 relative" prefetch={true}>Redesign</Link>
          <Link href="/decormind" className="nav-link text-cyan-400 transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-cyan-400" prefetch={true}>DecorMind</Link>
          <Link href="/dashboard-pricing" className="nav-link hover:text-cyan-400 text-white transition-colors duration-300 relative" prefetch={true}>Pricing</Link>
          <Link href="/dashboard-contact-us" className="nav-link hover:text-cyan-400 text-white transition-colors duration-300">Contact Us</Link>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-8">
            <Link 
              href="/favorites" 
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
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={toggleMobileMenu}
          onLinkClick={handleLinkClick}
        />
      )}

      {/* Hero Section - Made responsive */}
      <div className="relative px-4 sm:px-6 py-12 sm:py-16 bg-black flex flex-col items-center">
        <div className="max-w-3xl text-center z-10">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text mb-4" suppressHydrationWarning>Meet DecorMind</h2>
          <p className="text-base sm:text-lg text-white mb-6">
            Your AI interior design assistant that understands your style, preferences, and needs.
          </p>
          <Button
            className="bg-cyan-400 text-slate-800 hover:bg-cyan-500 px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-colors"
            onClick={handleTryDecorMind}
          >
            Try DecorMind Now
          </Button>
        </div>
      </div>

      {/* Features Section - Made responsive */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text mb-8 sm:mb-12" suppressHydrationWarning>What DecorMind Can Do</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-black border border-zinc-800 p-4 sm:p-6 rounded-lg">
              <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center text-slate-800 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <h4 className="text-lg font-bold mb-2 text-white">Personalized Advice</h4>
              <p className="text-white text-sm">Get tailored interior design recommendations based on your preferences, space, and budget.</p>
            </div>
            <div className="bg-black border border-zinc-800 p-4 sm:p-6 rounded-lg">
              <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center text-slate-800 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <h4 className="text-lg font-bold mb-2 text-white">Design Q&A</h4>
              <p className="text-white text-sm">Ask any interior design questions and get expert answers instantly.</p>
            </div>
            <div className="bg-black border border-zinc-800 p-4 sm:p-6 rounded-lg">
              <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center text-slate-800 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
              </div>
              <h4 className="text-lg font-bold mb-2 text-white">Style Suggestions</h4>
              <p className="text-white text-sm">Discover your perfect interior style with AI-powered style analysis.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section - Made responsive */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text mb-8 sm:mb-12" suppressHydrationWarning>How DecorMind Works</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="bg-zinc-900 p-8 rounded-lg border border-zinc-800">
              <div className="mb-6">
                <span className="bg-cyan-400 text-slate-800 px-3 py-1 rounded-full text-sm font-medium">Step 1</span>
              </div>
              <h4 className="text-xl font-bold mb-4 text-white">Start a Conversation</h4>
              <p className="text-white mb-6">
                Begin chatting with DecorMind about your space, preferences, and design goals.
              </p>
              <div className="bg-black p-4 rounded-lg border border-zinc-800">
                <p className="text-sm text-white italic">"I need help redesigning my living room with a modern minimalist style on a budget of $2,000."</p>
              </div>
            </div>
            <div className="bg-zinc-900 p-8 rounded-lg border border-zinc-800">
              <div className="mb-6">
                <span className="bg-cyan-400 text-slate-800 px-3 py-1 rounded-full text-sm font-medium">Step 2</span>
              </div>
              <h4 className="text-xl font-bold mb-4 text-white">Get Personalized Guidance</h4>
              <p className="text-white mb-6">
                Receive tailored advice, product recommendations, and design concepts.
              </p>
              <div className="bg-black p-4 rounded-lg border border-zinc-800">
                <p className="text-sm text-white italic">"Based on your preferences, I recommend a low-profile sofa in light gray, paired with natural wood accents. Here are some specific pieces within your budget..."</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Made responsive */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 text-center bg-zinc-950">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text mb-4" suppressHydrationWarning>Ready to Transform Your Space?</h3>
          <p className="text-white mb-6 sm:mb-8">
            Get unlimited access to DecorMind with our premium plans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-cyan-400 text-slate-800 hover:bg-cyan-500"
              onClick={handleStartFreeTrial}
            >
              Start Free Trial
            </Button>
            <Button
              className="bg-transparent text-white border border-white hover:bg-white/10"
              onClick={handleViewPricingPlans}
            >
              View Pricing Plans
            </Button>
          </div>
        </div>
      </div>

      {/* Footer section removed - now handled by global Footer component */}
    </div>
  );
}