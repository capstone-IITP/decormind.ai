'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import PaymentButton from '../_components/PaymentButton';
import { useUser } from '@clerk/nextjs';

export default function PricingPage() {
  return <SimplifiedPricingComponent />;
}

// Client Component that safely uses useSearchParams
function PricingComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [exchangeRates, setExchangeRates] = useState({
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    INR: 83.50,
    CAD: 1.37,
    AUD: 1.52,
    JPY: 150.45
  });
  const [currentPlan, setCurrentPlan] = useState('free');
  const [highlightedPlan, setHighlightedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Function to close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Function to handle sign in
  const handleSignIn = () => {
    router.push(`/sign-in?redirectUrl=${encodeURIComponent('/dashboard-pricing')}`);
  };

  // Function to handle sign up
  const handleSignUp = () => {
    router.push(`/sign-up?redirectUrl=${encodeURIComponent('/dashboard-pricing')}`);
  };

  // Function to convert price to selected currency
  const convertPrice = (usdPrice) => {
    const convertedPrice = (usdPrice * exchangeRates[currency]).toFixed(2);
    const currencySymbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      CAD: 'C$',
      AUD: 'A$',
      JPY: '¥'
    };
    return `${currencySymbols[currency]}${convertedPrice}`;
  };

  // Load user's current plan on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPlan = localStorage.getItem('userPlan') || 'free';
      setCurrentPlan(storedPlan);

      // Check if a specific plan is highlighted from URL params
      const planParam = searchParams.get('plan');
      if (planParam && ['premium', 'pro'].includes(planParam)) {
        setHighlightedPlan(planParam);
      }
    }
  }, [searchParams]);

  // Handle plan upgrade
  const handleUpgrade = (plan) => {
    // Don't do anything if clicking on current plan
    if (plan === currentPlan) return;

    // Check if user is signed in
    if (!isSignedIn) {
      showCustomPopup("Please sign in to upgrade your plan", () => {
        setTimeout(() => {
          router.push(`/sign-in?redirectUrl=${encodeURIComponent('/dashboard-pricing')}`);
        }, 0);
      });
      return;
    }

    // If it's the free plan, we can set it directly
    if (plan === 'free' && typeof window !== 'undefined') {
      // Check if the user has already used the free plan
      const hasUsedFreePlan = localStorage.getItem("hasUsedFreePlan") === 'true';
      if (hasUsedFreePlan) {
        showCustomPopup("You have already used your free plan credits. Please choose a premium plan to continue.");
        return;
      }

      localStorage.setItem("userPlan", plan);
      localStorage.setItem("usedCredits", "0"); // Reset used credits
      localStorage.setItem("totalCredits", "2"); // Set total credits for free plan
      localStorage.setItem("hasUsedFreePlan", "true"); // Mark free plan as used

      // Show success notification and redirect
      showCustomPopup(`Successfully switched to ${plan.toUpperCase()} plan!`, () => {
        // Redirect to redesign page
        setTimeout(() => {
          router.push("/redesign");
        }, 0);
      }, true);
    }
    // For premium and pro plans, we'll handle it in the payment success callback
  };

  // Handle payment success
  const handlePaymentSuccess = (plan, response) => {
    console.log("Payment successful", response);

    if (typeof window !== 'undefined') {
      // Update user plan and credits in localStorage
      localStorage.setItem("userPlan", plan);
      localStorage.setItem("usedCredits", "0"); // Reset used credits

      // Set credits based on plan
      if (plan === 'premium') {
        localStorage.setItem("totalCredits", "10");
      } else if (plan === 'pro') {
        localStorage.setItem("totalCredits", "unlimited");
      }

      // Show success notification and redirect
      showCustomPopup(`Successfully ${currentPlan === plan ? 'renewed' : 'upgraded to'} ${plan.toUpperCase()} plan!`, () => {
        // Redirect to redesign page only if signed in
        if (isSignedIn) {
          setTimeout(() => {
            router.push("/redesign");
          }, 0);
        } else {
          setTimeout(() => {
            router.push(`/sign-in?redirectUrl=${encodeURIComponent('/dashboard-pricing')}`);
          }, 0);
        }
      }, true);
    }
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
          font-size: 0.875rem !important; /* much smaller equivalent */
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
      const href = e.currentTarget?.getAttribute("href");

      // Add a visual feedback to the clicked link
      if (e.currentTarget && e.currentTarget.classList) {
        e.currentTarget.classList.add("nav-link-clicked");
      }

      // Delay the scroll action for a better visual effect
      setTimeout(() => {
        try {
          // If it's not a hash link, navigate to the page
          if (!href || !href.startsWith("#")) {
            router.push(href);
            return;
          }

          const targetId = href?.substring(1);
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
        } catch (error) {
          console.error("Error in smooth scroll:", error);
        }

        // Remove the visual feedback class
        if (e.currentTarget && e.currentTarget.classList) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center py-4 px-6 bg-zinc-900 sticky top-0 z-50 shadow-md border-b border-zinc-800 rounded-bl-3xl rounded-br-3xl nav-slide-down">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <div className="bg-cyan-400 w-6 h-6 rounded-full flex items-center justify-center text-slate-800 text-xs font-bold">DM</div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text">DecorMind</h1>
        </div>

        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center">
          <nav className="flex gap-6" style={{ fontSize: '0.875rem' }}>
            <Link
              href="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'text-cyan-400 active' : 'text-white'} ${activeLink === '/dashboard' ? 'link-clicked' : ''} hover:text-cyan-400 transition-colors duration-300 relative`}
              onClick={() => handleLinkClick('/dashboard')}
              style={{ fontSize: '0.875rem !important' }}
            >
              Home
            </Link>
            <Link
              href="#"
              className={`nav-link ${isActive('/redesign') ? 'text-cyan-400 active' : 'text-white'} ${activeLink === '/redesign' ? 'link-clicked' : ''} hover:text-cyan-400 transition-colors duration-300 relative`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/redesign');
              }}
              style={{ fontSize: '0.875rem !important' }}
            >
              Redesign
            </Link>
            <Link
              href="/decormind"
              className={`nav-link ${isActive('/decormind') ? 'text-cyan-400 active' : 'text-white'} ${activeLink === '/decormind' ? 'link-clicked' : ''} hover:text-cyan-400 transition-colors duration-300 relative`}
              onClick={() => handleLinkClick('/decormind')}
              style={{ fontSize: '0.875rem !important' }}
            >
              DecorMind
            </Link>
            <Link
              href="/dashboard-pricing"
              className={`nav-link ${isActive('/dashboard-pricing') ? 'text-cyan-400 active' : 'text-white'} ${activeLink === '/dashboard-pricing' ? 'link-clicked' : ''} hover:text-cyan-400 transition-colors duration-300 relative`}
              onClick={() => handleLinkClick('/dashboard-pricing')}
              style={{ fontSize: '0.875rem !important' }}
            >
              Pricing
            </Link>
            <Link
              href="/dashboard-contact-us"
              className={`nav-link ${isActive('/dashboard-contact-us') ? 'text-cyan-400 active' : 'text-white'} ${activeLink === '/dashboard-contact-us' ? 'link-clicked' : ''} hover:text-cyan-400 transition-colors duration-300 relative`}
              onClick={() => handleLinkClick('/dashboard-contact-us')}
              style={{ fontSize: '0.875rem !important' }}
            >
              Contact Us
            </Link>
          </nav>
        </div>

        <div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-16 left-0 right-0 z-40 bg-zinc-900 shadow-md border-b border-zinc-800 transition-all duration-300 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <Link href="/" className="block py-2 w-full text-center hover:text-cyan-400 text-white transition-colors duration-300 " onClick={closeMobileMenu}>Home</Link>
        <Link href="/#features" className="block py-2 w-full text-center hover:text-cyan-400 text-white transition-colors duration-300" onClick={closeMobileMenu}>Features</Link>
        <Link href="/#how-it-works" className="block py-2 w-full text-center hover:text-cyan-400 text-white transition-colors duration-300" onClick={closeMobileMenu}>How it Works</Link>
        <Link href="/#gallery" className="block py-2 w-full text-center hover:text-cyan-400 text-white transition-colors duration-300" onClick={closeMobileMenu}>Gallery</Link>
        <Link href="/dashboard-pricing" className="block py-2 w-full text-center text-cyan-400 transition-colors duration-300" onClick={closeMobileMenu}>Pricing</Link>
        <Link href="/dashboard-contact-us" className="block py-2 w-full text-center hover:text-cyan-400 text-white transition-colors duration-300" onClick={closeMobileMenu}>Contact Us</Link>
        <div className="flex gap-2 mt-4 w-full justify-center pb-4">
          <Link
            href={`/sign-in?redirectUrl=${encodeURIComponent('/dashboard-pricing')}`}
            className="text-white border border-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md text-sm transition-colors"
          >
            Sign In
          </Link>
          <Link
            href={`/sign-up?redirectUrl=${encodeURIComponent('/dashboard-pricing')}`}
            className="bg-cyan-400 text-slate-800 hover:bg-cyan-500 px-4 py-2 rounded-md text-sm font-bold transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-transparent bg-clip-text">
            Choose Your Plan
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-6">
            Unlock the full potential of AI-powered interior design with our premium plans. Choose the plan that suits your needs.
          </p>

          {/* Currency Selector */}
          <div className="flex justify-center items-center space-x-2 mb-8">
            <span className="text-zinc-400">Select Currency:</span>
            <select
              className="bg-zinc-800 text-white rounded-md border border-zinc-700 py-1 px-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isCurrent = plan.planKey === currentPlan;
            const isDisabled = currentPlan === "pro" || (currentPlan === "premium" && plan.planKey === "free");

            // Convert prices based on currency
            let price;
            if (plan.planKey === 'free') {
              price = currency === 'INR' ? '₹0.00' : convertPrice(0);
            } else if (plan.planKey === 'premium') {
              price = currency === 'INR' ? '₹1.00' : convertPrice(0.012); // Approximately 1 INR in USD
            } else {
              price = currency === 'INR' ? '₹835.00 /month' : `${convertPrice(10)} /month`; // Approximately 835 INR in USD
            }

            return (
              <div
                key={plan.planKey}
                className={`rounded-xl p-6 bg-zinc-900 text-white shadow-md ${isCurrent ? "border-2 border-cyan-400" : ""
                  } ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
              >
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                <p className="text-xl mt-2">{price}</p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      ✅ {feature}
                    </li>
                  ))}
                </ul>

                {renderActionButton(plan, isCurrent, isDisabled)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
// New simplified pricing component
function SimplifiedPricingComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [currentPlan, setCurrentPlan] = useState('free');
  const { isLoaded, isSignedIn, user } = useUser();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupAction, setPopupAction] = useState(null);
  const [isSuccessPopup, setIsSuccessPopup] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [exchangeRates, setExchangeRates] = useState({
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    INR: 83.50,
    CAD: 1.37,
    AUD: 1.52,
    JPY: 150.45
  });

  // Function to convert price to selected currency
  const convertPrice = (usdPrice) => {
    const convertedPrice = (usdPrice * exchangeRates[currency]).toFixed(2);
    const currencySymbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      CAD: 'C$',
      AUD: 'A$',
      JPY: '¥'
    };
    return `${currencySymbols[currency]}${convertedPrice}`;
  };

  // Add CSS animations when component mounts
  useEffect(() => {
    // Load user's current plan from localStorage
    if (typeof window !== 'undefined') {
      const storedPlan = localStorage.getItem('userPlan') || 'free';
      setCurrentPlan(storedPlan);
    }

    // Add CSS for animations
    let style;
    if (typeof window !== 'undefined') {
      style = document.createElement('style');
      style.innerHTML = `
        /* Popup animations */
        @keyframes fade-in-scale {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s ease-out forwards;
        }
        
        /* Button hover effect */
        .popup-btn {
          position: relative;
          overflow: hidden;
        }
        
        .popup-btn:after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 5px;
          height: 5px;
          background: rgba(255, 255, 255, 0.3);
          opacity: 0;
          border-radius: 100%;
          transform: scale(1, 1) translate(-50%);
          transform-origin: 50% 50%;
        }
        
        .popup-btn:hover:after {
          animation: ripple 1s ease-out;
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0, 0);
            opacity: 0.5;
          }
          100% {
            transform: scale(20, 20);
            opacity: 0;
          }
        }
        
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
      
      return () => {
        if (style && style.parentNode) {
          document.head.removeChild(style);
        }
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // Custom popup component
  const CustomPopup = ({ message, onClose, onAction, isSuccess }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
      <div className={`bg-zinc-900 border-2 ${isSuccess ? 'border-green-400' : 'border-cyan-400'} rounded-xl p-8 max-w-md w-full mx-4 ${isSuccess ? 'shadow-[0_0_15px_rgba(74,222,128,0.3)]' : 'shadow-[0_0_15px_rgba(34,211,238,0.3)]'} animate-fade-in-scale`}>
        <div className="text-center">
          <div className={`mx-auto w-12 h-12 ${isSuccess ? 'bg-green-400' : 'bg-cyan-400'} rounded-full flex items-center justify-center text-slate-800 mb-4`}>
            {isSuccess ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{isSuccess ? 'Success' : 'Notice'}</h3>
          <p className="text-zinc-300 mb-6">{message}</p>
          <div className="flex justify-center">
            <button
              onClick={() => {
                onClose();
                if (!isSuccess && !isSignedIn) {
                  setTimeout(() => {
                    router.push(`/sign-in?redirectUrl=${encodeURIComponent('/dashboard-pricing')}`);
                  }, 0);
                } else if (onAction) {
                  onAction();
                }
              }}
              className={`popup-btn bg-gradient-to-r ${isSuccess ? 'from-green-500 to-green-400' : 'from-cyan-500 to-cyan-400'} text-slate-800 font-medium px-10 py-2 rounded-md hover:opacity-90 transition-colors`}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Function to show popup
  const showCustomPopup = (message, action = null, isSuccess = false) => {
    setPopupMessage(message);
    setPopupAction(action);
    setShowPopup(true);
    setIsSuccessPopup(isSuccess);
  };
  
  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Function to close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  // Function to check if the link is active
  const isActive = (path) => {
    if (!isLoaded) return false;
    return pathname === path;
  };
  
  // Handle link click animation
  const handleLinkClick = (path) => {
    setActiveLink(path);

    // If user is trying to go to redesign page and isn't signed in, redirect to login first
    if (path === '/redesign' && !isSignedIn) {
      showCustomPopup("Please sign in to access the redesign page");
      return;
    }

    // Reset active link after animation completes
    setTimeout(() => {
      setActiveLink(null);
    }, 300);

    // Navigate using router instead of changing window.location
    setTimeout(() => {
      router.push(path);
    }, 0);
  };

  // Handle plan upgrade
  const handleUpgrade = (plan) => {
    // Don't do anything if clicking on current plan
    if (plan === currentPlan) return;

    // Check if user is signed in
    if (!isSignedIn) {
      showCustomPopup("Please sign in to upgrade your plan", () => {
        setTimeout(() => {
          router.push(`/sign-in?redirectUrl=${encodeURIComponent('/dashboard-pricing')}`);
        }, 0);
      });
      return;
    }

    // If it's the free plan, we can set it directly
    if (plan === 'free' && typeof window !== 'undefined') {
      // Check if the user has already used the free plan
      const hasUsedFreePlan = localStorage.getItem("hasUsedFreePlan") === 'true';
      if (hasUsedFreePlan) {
        showCustomPopup("You have already used your free plan credits. Please choose a premium plan to continue.");
        return;
      }

      localStorage.setItem("userPlan", plan);
      localStorage.setItem("usedCredits", "0"); // Reset used credits
      localStorage.setItem("totalCredits", "2"); // Set total credits for free plan
      localStorage.setItem("hasUsedFreePlan", "true"); // Mark free plan as used

      // Show success notification and redirect
      showCustomPopup(`Successfully switched to ${plan.toUpperCase()} plan!`, () => {
        // Redirect to redesign page
        setTimeout(() => {
          router.push("/redesign");
        }, 0);
      }, true);
    }
    // For premium and pro plans, we'll handle it in the payment success callback
  };

  // Handle payment success
  const handlePaymentSuccess = (plan, response) => {
    console.log("Payment successful", response);

    if (typeof window !== 'undefined') {
      // Update user plan and credits in localStorage
      localStorage.setItem("userPlan", plan);
      localStorage.setItem("usedCredits", "0"); // Reset used credits

      // Set credits based on plan
      if (plan === 'premium') {
        localStorage.setItem("totalCredits", "10");
      } else if (plan === 'pro') {
        localStorage.setItem("totalCredits", "unlimited");
      }

      // Show success notification and redirect
      showCustomPopup(`Successfully ${currentPlan === plan ? 'renewed' : 'upgraded to'} ${plan.toUpperCase()} plan!`, () => {
        // Redirect to redesign page only if signed in
        if (isSignedIn) {
          setTimeout(() => {
            router.push("/redesign");
          }, 0);
        } else {
          setTimeout(() => {
            router.push(`/sign-in?redirectUrl=${encodeURIComponent('/dashboard-pricing')}`);
          }, 0);
        }
      }, true);
    }
  };

  // Add a check before showing payment button
  const renderActionButton = (plan, isCurrent, isDisabled) => {
    if (typeof window === 'undefined') {
      // Return a placeholder during server-side rendering
      return (
        <button className="mt-6 w-full bg-cyan-400 hover:bg-cyan-500 text-black py-2 rounded-lg">
          Loading...
        </button>
      );
    }
    
    // Get remaining credits from localStorage
    const usedCredits = parseInt(localStorage.getItem("usedCredits") || "0", 10);
    const totalCredits = localStorage.getItem("totalCredits") || (currentPlan === 'free' ? "2" : currentPlan === 'premium' ? "10" : "unlimited");
    const hasUsedFreePlan = localStorage.getItem("hasUsedFreePlan") === 'true';
    
    // Check if credits are used up for current plan
    const isPremiumWithNoCredits = currentPlan === 'premium' && usedCredits >= parseInt(totalCredits, 10);
    const isProWithNoCredits = currentPlan === 'pro' && usedCredits >= (totalCredits === 'unlimited' ? 999999 : parseInt(totalCredits, 10));
    
    if (isCurrent) {
      // If current plan has no credits left, show "Buy Again" button for Premium and Pro
      if ((plan.planKey === 'premium' && isPremiumWithNoCredits) || 
          (plan.planKey === 'pro' && isProWithNoCredits)) {
        return (
          <PaymentButton
            amount={plan.planKey === 'premium' ? 100 : 83500} // 1 or 835 INR in paise
            buttonText="Buy Again"
            className="mt-6 w-full bg-cyan-400 hover:bg-cyan-500 text-black py-2 rounded-lg"
            onSuccess={(response) => handlePaymentSuccess(plan.planKey, response)}
          />
        );
      }
      
      return (
        <button className="mt-6 w-full bg-gray-700 text-white py-2 rounded-lg cursor-default" disabled>
          Current Plan
        </button>
      );
    } else if (plan.planKey === 'free') {
      // Disable free plan if it has been used
      const freeDisabled = hasUsedFreePlan;
      
      return (
        <button
          onClick={() => handleUpgrade('free')}
          className={`mt-6 w-full ${freeDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-700"} text-white py-2 rounded-lg`}
          disabled={freeDisabled}
        >
          {freeDisabled ? "Already Used" : "Current Plan"}
        </button>
      );
    } else {
      // Check if user is signed in
      if (!isSignedIn) {
        return (
          <button
            onClick={() => {
              setTimeout(() => {
                router.push(`/sign-in?redirectUrl=${encodeURIComponent('/dashboard-pricing')}`);
              }, 0);
            }}
            className="mt-6 w-full bg-cyan-400 hover:bg-cyan-500 text-black py-2 rounded-lg"
          >
            Sign in to upgrade
          </button>
        );
      } else {
        return (
          <PaymentButton
            amount={plan.planKey === 'premium' ? 100 : 83500} // 1 or 835 INR in paise
            buttonText={plan.planKey === 'pro' ? "Buy Unlimited Credits" : "Buy Premium Plan"}
            className={`mt-6 w-full ${isDisabled ? "bg-gray-500" : "bg-cyan-400 hover:bg-cyan-500"} text-black py-2 rounded-lg`}
            onSuccess={(response) => handlePaymentSuccess(plan.planKey, response)}
          />
        );
      }
    }
  };

  const plans = [
    {
      name: "Free",
      price: "₹0.00",
      features: ["2 AI Design Generations", "Basic Room Styles", "Community Support"],
      planKey: "free",
    },
    {
      name: "Premium",
      price: "₹1",
      features: ["10 AI Design Generations", "All Room Styles", "High-Quality Generations", "Email Support"],
      planKey: "premium",
    },
    {
      name: "Pro",
      price: "₹835.00 /month",
      features: ["Unlimited AI Designs", "Premium Styles & Features", "4K Resolution", "Priority Support", "Commercial License"],
      planKey: "pro",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {showPopup && (
        <CustomPopup
          message={popupMessage}
          onClose={() => setShowPopup(false)}
          onAction={popupAction}
          isSuccess={isSuccessPopup}
        />
      )}

      {/* Navigation Bar */}
      <nav className="p-5 shadow-sm flex justify-between items-center bg-zinc-900 border-b border-zinc-800 rounded-bl-3xl rounded-br-3xl nav-slide-down sticky-nav">
        <div
          className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity logo-pulse"
          onClick={() => router.push('/')}
        >
          <div className="logo-container bg-cyan-400 w-6 h-6 rounded-full flex items-center justify-center text-slate-800 text-xs font-bold">DM</div>
          <h2 className="font-bold text-lg bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text">DecorMind</h2>
        </div>

        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center">
          <nav className="flex gap-6" style={{ fontSize: '0.875rem' }}>
            <Link
              href="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'text-cyan-400 active' : 'text-white'} ${activeLink === '/dashboard' ? 'link-clicked' : ''} hover:text-cyan-400 transition-colors duration-300 relative`}
              onClick={() => handleLinkClick('/dashboard')}
              style={{ fontSize: '0.875rem !important' }}
            >
              Home
            </Link>
            <Link
              href="#"
              className={`nav-link ${isActive('/redesign') ? 'text-cyan-400 active' : 'text-white'} ${activeLink === '/redesign' ? 'link-clicked' : ''} hover:text-cyan-400 transition-colors duration-300 relative`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/redesign');
              }}
              style={{ fontSize: '0.875rem !important' }}
            >
              Redesign
            </Link>
            <Link
              href="/decormind"
              className={`nav-link ${isActive('/decormind') ? 'text-cyan-400 active' : 'text-white'} ${activeLink === '/decormind' ? 'link-clicked' : ''} hover:text-cyan-400 transition-colors duration-300 relative`}
              onClick={() => handleLinkClick('/decormind')}
              style={{ fontSize: '0.875rem !important' }}
            >
              DecorMind
            </Link>
            <Link
              href="/dashboard-pricing"
              className={`nav-link ${isActive('/dashboard-pricing') ? 'text-cyan-400 active' : 'text-white'} ${activeLink === '/dashboard-pricing' ? 'link-clicked' : ''} hover:text-cyan-400 transition-colors duration-300 relative`}
              onClick={() => handleLinkClick('/dashboard-pricing')}
              style={{ fontSize: '0.875rem !important' }}
            >
              Pricing
            </Link>
            <Link
              href="/dashboard-contact-us"
              className={`nav-link ${isActive('/dashboard-contact-us') ? 'text-cyan-400 active' : 'text-white'} ${activeLink === '/dashboard-contact-us' ? 'link-clicked' : ''} hover:text-cyan-400 transition-colors duration-300 relative`}
              onClick={() => handleLinkClick('/dashboard-contact-us')}
              style={{ fontSize: '0.875rem !important' }}
            >
              Contact Us
            </Link>
          </nav>
        </div>

        <div className="md:block">
          <UserButton afterSignOutUrl="/" />
        </div>

        <button className="md:hidden text-white" onClick={toggleMobileMenu}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-16 left-0 right-0 z-40 bg-zinc-900 shadow-md border-b border-zinc-800 transition-all duration-300 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <Link
          href="/dashboard"
          className="block py-2 w-full text-center hover:text-cyan-400 text-white transition-colors duration-300"
          onClick={closeMobileMenu}
        >
          Home
        </Link>
        <Link
          href="#"
          className="block py-2 w-full text-center hover:text-cyan-400 text-white transition-colors duration-300"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('/redesign');
            closeMobileMenu();
          }}
        >
          Redesign
        </Link>
        <Link
          href="/decormind"
          className="block py-2 w-full text-center hover:text-cyan-400 text-white transition-colors duration-300"
          onClick={closeMobileMenu}
        >
          DecorMind
        </Link>
        <Link
          href="/dashboard-pricing"
          className="block py-2 w-full text-center text-cyan-400 transition-colors duration-300"
          onClick={closeMobileMenu}
        >
          Pricing
        </Link>
        <Link
          href="/dashboard-contact-us"
          className="block py-2 w-full text-center hover:text-cyan-400 text-white transition-colors duration-300"
          onClick={closeMobileMenu}
        >
          Contact Us
        </Link>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-transparent bg-clip-text">
            Choose Your Plan
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-6">
            Unlock the full potential of AI-powered interior design with our premium plans. Choose the plan that suits your needs.
          </p>

          {/* Currency Selector */}
          <div className="flex justify-center items-center space-x-2 mb-8">
            <span className="text-zinc-400">Select Currency:</span>
            <select
              className="bg-zinc-800 text-white rounded-md border border-zinc-700 py-1 px-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isCurrent = plan.planKey === currentPlan;
            const isDisabled = currentPlan === "pro" || (currentPlan === "premium" && plan.planKey === "free");

            // Convert prices based on currency
            let price;
            if (plan.planKey === 'free') {
              price = currency === 'INR' ? '₹0.00' : convertPrice(0);
            } else if (plan.planKey === 'premium') {
              price = currency === 'INR' ? '₹1.00' : convertPrice(0.012); // Approximately 1 INR in USD
            } else {
              price = currency === 'INR' ? '₹835.00 /month' : `${convertPrice(10)} /month`; // Approximately 835 INR in USD
            }

            return (
              <div
                key={plan.planKey}
                className={`rounded-xl p-6 bg-zinc-900 text-white shadow-md ${isCurrent ? "border-2 border-cyan-400" : ""
                  } ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
              >
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                <p className="text-xl mt-2">{price}</p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      ✅ {feature}
                    </li>
                  ))}
                </ul>

                {renderActionButton(plan, isCurrent, isDisabled)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
