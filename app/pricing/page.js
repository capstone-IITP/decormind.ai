'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import PaymentButton from '../_components/PaymentButton';
import { useUser } from '@clerk/nextjs';
import { useUserDetail } from '../_context/UserDetailContext';

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
    router.push('/sign-in');
  };

  // Function to handle sign up
  const handleSignUp = () => {
    router.push('/sign-up');
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
    const storedPlan = localStorage.getItem('userPlan') || 'free';
    setCurrentPlan(storedPlan);

    // Check if a specific plan is highlighted from URL params
    const planParam = searchParams.get('plan');
    if (planParam && ['premium', 'pro'].includes(planParam)) {
      setHighlightedPlan(planParam);
    }
  }, [searchParams]);

  // Handle plan upgrade
  const handleUpgrade = (plan) => {
    // Don't do anything if clicking on current plan
    if (plan === currentPlan) return;

    // Check if user is signed in
    if (!isSignedIn) {
      showCustomPopup("Please sign in to upgrade your plan", () => {
        router.push(`/sign-in?redirectUrl=${encodeURIComponent('/dashboard-pricing')}`);
      });
      return;
    }

    // If it's the free plan, we can set it directly
    if (plan === 'free') {
      localStorage.setItem("userPlan", plan);
      localStorage.setItem("usedCredits", "0"); // Reset used credits

      // Show success notification and redirect
      showCustomPopup(`Successfully switched to ${plan.toUpperCase()} plan!`, () => {
        router.push("/redesign");
      }, true);
    }
    // For premium and pro plans, we'll handle it in the payment success callback
  };

  // Handle payment success
  const handlePaymentSuccess = (plan, response) => {
    console.log("Payment successful", response);

    // Update user plan and credits in localStorage
    localStorage.setItem("userPlan", plan);

    // Set credits based on plan
    if (plan === 'premium') {
      localStorage.setItem("usedCredits", "0");
      localStorage.setItem("totalCredits", "10");
    } else if (plan === 'pro') {
      localStorage.setItem("usedCredits", "0");
      localStorage.setItem("totalCredits", "unlimited");
    }

    // Show success notification and redirect
    showCustomPopup(`Successfully upgraded to ${plan.toUpperCase()} plan!`, () => {
      // Redirect to redesign page only if signed in
      if (isSignedIn) {
        router.push("/redesign");
      } else {
        router.push(`/sign-in?redirectUrl=${encodeURIComponent('/dashboard-pricing')}`);
      }
    });
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
          0% { background-color: rgba(197, 167, 144, 0.1); }
          50% { background-color: rgba(197, 167, 144, 0.2); }
          100% { background-color: transparent; }
        }
        
        .highlight-section {
          animation: highlightSection 1.5s ease-out;
        }

        /* Special animation for contact section */
        @keyframes highlightContactSection {
          0% { background-color: rgba(197, 167, 144, 0.15); }
          50% { background-color: rgba(197, 167, 144, 0.3); }
          100% { background-color: rgba(24, 24, 27, 1); } /* bg-zinc-900 */
        }
        
        #contact.highlight-section {
          animation: highlightContactSection 1.5s ease-out;
        }

        /* Contact form highlight animation */
        @keyframes highlightContactForm {
          0% { box-shadow: 0 0 0 0 rgba(197, 167, 144, 0.3); }
          50% { box-shadow: 0 0 20px 5px rgba(197, 167, 144, 0.5); }
          100% { box-shadow: 0 0 0 0 rgba(197, 167, 144, 0); }
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
          border: 2px solid #C5A790;
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
          background-color: #C5A790;
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
          background-color: #b0927a;
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
          background-image: linear-gradient(transparent 60%, rgba(197, 167, 144, 0.2) 40%);
          background-size: 100% 0%;
          background-repeat: no-repeat;
          animation: headingHighlight 0.8s ease-out forwards;
        }

        /* Icon animation */
        @keyframes iconPulse {
          0% { 
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(197, 167, 144, 0.7);
          }
          70% { 
            transform: scale(1.1);
            box-shadow: 0 0 0 10px rgba(197, 167, 144, 0);
          }
          100% { 
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(197, 167, 144, 0);
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
          color: #C5A790 !important;
        }

        /* Navigation link hover animation */
        .nav-link {
          position: relative;
          opacity: 0;
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
          background: radial-gradient(circle, rgba(197, 167, 144, 0.4) 0%, rgba(197, 167, 144, 0) 70%);
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
      <nav className="p-5 shadow-sm flex justify-between items-center bg-zinc-900 border-b border-zinc-800 rounded-bl-3xl rounded-br-3xl nav-slide-down sticky-nav">
        <div
          className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity logo-pulse animate-fade-in"
          onClick={() => router.push('/')}
        >
          <div className="logo-container bg-[#C5A790] w-6 h-6 rounded-full flex items-center justify-center text-slate-800 text-xs font-bold">DM</div>
          <h2 className="font-bold text-lg bg-gradient-to-r from-[#1A1A1A] via-[#C5A790] to-[#FFF] text-transparent bg-clip-text">DecorMind</h2>
        </div>

        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center">
          <nav className="flex gap-4 md:gap-6 mx-auto justify-center flex-wrap" style={{ fontSize: '0.875rem' }}>
            <Link
              href="/"
              className="nav-link text-white hover:text-[#C5A790] transition-colors relative group"
              style={{ animationDelay: '100ms' }}
            >
              Home
            </Link>
            <Link
              href="/#features"
              className="nav-link text-white hover:text-[#C5A790] transition-colors relative group"
              style={{ animationDelay: '200ms' }}
              onClick={(e) => {
                e.preventDefault();
                router.push('/');
              }}
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="nav-link text-white hover:text-[#C5A790] transition-colors relative group"
              style={{ animationDelay: '300ms' }}
              onClick={(e) => {
                e.preventDefault();
                router.push('/');
              }}
            >
              How it Works
            </Link>
            <Link
              href="/#gallery"
              className="nav-link text-white hover:text-[#C5A790] transition-colors relative group"
              style={{ animationDelay: '400ms' }}
              onClick={(e) => {
                e.preventDefault();
                router.push('/');
              }}
            >
              Gallery
            </Link>
            <Link
              href="/tutorial-video"
              className="nav-link text-white hover:text-[#C5A790] transition-colors relative group"
              style={{ animationDelay: '500ms' }}
            >
              Tutorial Video
            </Link>
            <Link
              href="/pricing"
              className="nav-link text-[#C5A790] active transition-colors relative group"
              style={{ animationDelay: '600ms' }}
              onClick={(e) => {
                e.preventDefault();
                router.push('/');
              }}
            >
              Pricing
            </Link>
            <Link
              href="/contact-us"
              className="nav-link text-white hover:text-[#C5A790] transition-colors relative group"
              style={{ animationDelay: '700ms' }}
              onClick={(e) => {
                e.preventDefault();
                router.push('/');
              }}
            >
              Contact Us
            </Link>
          </nav>
        </div>

        <div>
          <div className="hidden md:flex items-center gap-2 animate-fade-in" style={{ animationDelay: '800ms' }}>
            {isSignedIn ? (
              <>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <Link
                  href={`/sign-in?redirectUrl=${encodeURIComponent('/dashboard-pricing')}`}
                  className="text-white border border-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md text-sm transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href={`/sign-up?redirectUrl=${encodeURIComponent('/dashboard-pricing')}`}
                  className="bg-[#C5A790] text-slate-800 hover:bg-[#b0927a] px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden animate-fade-in" style={{ animationDelay: '800ms' }}>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        <button className="md:hidden text-white animate-fade-in" onClick={toggleMobileMenu} style={{ animationDelay: '800ms' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-16 left-0 right-0 z-40 bg-zinc-900 shadow-md border-b border-zinc-800 transition-all duration-300 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <Link href="/" className="block py-2 w-full text-center hover:text-[#C5A790] text-white transition-colors duration-300 " onClick={closeMobileMenu}>Home</Link>
        <Link href="/#features" className="block py-2 w-full text-center hover:text-[#C5A790] text-white transition-colors duration-300" onClick={closeMobileMenu}>Features</Link>
        <Link href="/#how-it-works" className="block py-2 w-full text-center hover:text-[#C5A790] text-white transition-colors duration-300" onClick={closeMobileMenu}>How it Works</Link>
        <Link href="/#gallery" className="block py-2 w-full text-center hover:text-[#C5A790] text-white transition-colors duration-300" onClick={closeMobileMenu}>Gallery</Link>
        <Link href="/pricing" className="block py-2 w-full text-center text-[#C5A790] transition-colors duration-300" onClick={closeMobileMenu}>Pricing</Link>
        <Link href="/contact-us" className="block py-2 w-full text-center hover:text-[#C5A790] text-white transition-colors duration-300" onClick={closeMobileMenu}>Contact Us</Link>
        <div className="flex gap-2 mt-4 w-full justify-center pb-4">
          <button
            className="text-white border border-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md text-sm transition-colors"
            onClick={() => {
              closeMobileMenu();
              handleSignIn();
            }}
          >
            Sign In
          </button>
          <button
            className="bg-[#C5A790] text-slate-800 hover:bg-[#b0927a] px-4 py-2 rounded-md text-sm font-bold transition-colors"
            onClick={() => {
              closeMobileMenu();
              handleSignUp();
            }}
          >
            Sign Up
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#1A1A1A] via-[#C5A790] to-[#FFF] text-transparent bg-clip-text">
            Choose Your Plan
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-6">
            Unlock the full potential of AI-powered interior design with our premium plans. Choose the plan that suits your needs.
          </p>

          {/* Currency Selector */}
          <div className="flex justify-center items-center space-x-2 mb-8">
            <span className="text-zinc-400">Select Currency:</span>
            <select
              className="bg-zinc-800 text-white rounded-md border border-zinc-700 py-1 px-2 focus:outline-none focus:ring-2 focus:ring-[#C5A790]"
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
                className={`rounded-xl p-6 bg-zinc-900 text-white shadow-md ${isCurrent ? "border-2 border-[#C5A790]" : ""
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
  const { isLoaded, isSignedIn, user } = useUser();
  const { userDetail, updatePlan, loading: userLoading } = useUserDetail();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupAction, setPopupAction] = useState(null);
  const [isSuccessPopup, setIsSuccessPopup] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Add useEffect to fix nav link styles
  useEffect(() => {
    // Create style element for nav links
    const style = document.createElement('style');
    style.innerHTML = `
      .nav-link {
        position: relative;
        opacity: 1;
        transition: color 0.3s ease;
      }

      .nav-link::after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: -4px;
        left: 0;
        background-color: #C5A790;
        transition: width 0.3s ease;
      }
      
      .nav-link:hover::after {
        width: 100%;
      }

      .nav-link.active::after {
        width: 100%;
      }
    `;
    document.head.appendChild(style);

    // Clean up
    return () => {
      if (style && style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Convert price to selected currency
  const convertPrice = (usdPrice) => {
    // For simplicity, we're just returning the INR price directly
    const currencySymbols = {
      INR: '₹',
    };
    return `${currencySymbols[currency]}${usdPrice}`;
  };

  // Custom popup component
  const CustomPopup = ({ message, onClose, onAction, isSuccess }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-zinc-900 border-2 border-[#C5A790] rounded-xl p-6 max-w-md w-full mx-4">
        <div className="text-center">
          {isSuccess ? (
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          )}
          <h3 className="text-lg font-medium text-white mb-4">{message}</h3>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onAction || onClose}
              className="px-4 py-2 bg-[#C5A790] text-black rounded-lg hover:bg-[#b0927a] transition-colors"
            >
              {onAction ? 'Continue' : 'Close'}
            </button>
            {onAction && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Update the showCustomPopup function to remove the CSS we added
  const showCustomPopup = (message, action = null, isSuccess = false) => {
    setPopupMessage(message);
    setPopupAction(() => action);
    setIsSuccessPopup(isSuccess);
    setShowPopup(true);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Handle link click
  const handleLinkClick = (path) => {
    closeMobileMenu();

    // If it's an anchor link on the same page
    if (path.startsWith('/#')) {
      // Extract the id from the path
      const id = path.substring(2);
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If element not found on current page, navigate to home page with the anchor
        router.push(path);
      }
    } else {
      // For regular links
      router.push(path);
    }
  };

  // Check if a link is active
  const isActive = (path) => {
    if (!isLoaded) return false;
    return pathname === path;
  };

  // Handle plan upgrade
  const handleUpgrade = (plan) => {
    // Don't do anything if clicking on current plan
    if (plan === userDetail.plan) return;

    // Check if user is signed in
    if (!isSignedIn) {
      showCustomPopup("Please sign in to upgrade your plan", () => {
        router.push(`/sign-in?redirectUrl=${encodeURIComponent('/pricing')}`);
      });
      return;
    }

    // If it's the free plan, check if the user has already used it
    if (plan === 'free') {
      if (!userDetail.canUseFreeplan) {
        showCustomPopup("You have already used your free plan credits. Please choose a premium plan to continue.", null, false);
        return;
      }

      // Update to free plan
      updatePlan('free');

      // Show success notification and redirect
      showCustomPopup(`Successfully switched to ${plan.toUpperCase()} plan!`, () => {
        router.push("/interior-generator");
      }, true);
    }
    // For premium and pro plans, we'll handle it in the payment success callback
  };

  // Handle payment success
  const handlePaymentSuccess = (plan, response) => {
    console.log("Payment successful", response);

    // Update user plan
    updatePlan(plan);

    // Show success notification and redirect
    showCustomPopup(`Successfully upgraded to ${plan.toUpperCase()} plan!`, () => {
      // Redirect to interior generator page
      router.push("/interior-generator");
    }, true);
  };

  // Render action button based on plan status
  const renderActionButton = (plan, isCurrent, isDisabled) => {
    if (isCurrent) {
      return (
        <button className="mt-6 w-full bg-gray-700 text-white py-2 rounded-lg cursor-default" disabled>
          Current Plan
        </button>
      );
    } else if (plan.planKey === 'free') {
      // Disable free plan if already used
      const freeDisabled = !userDetail.canUseFreeplan;

      return (
        <button
          onClick={() => handleUpgrade('free')}
          className={`mt-6 w-full ${freeDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-[#C5A790] hover:bg-[#b0927a]"} text-black py-2 rounded-lg`}
          disabled={freeDisabled}
        >
          {freeDisabled ? "Already Used" : "Select Free Plan"}
        </button>
      );
    } else if (plan.planKey === 'premium') {
      // For premium plan
      if (!isSignedIn) {
        return (
          <button
            onClick={() => router.push(`/sign-in?redirectUrl=${encodeURIComponent('/pricing')}`)}
            className="mt-6 w-full bg-[#C5A790] hover:bg-[#b0927a] text-black py-2 rounded-lg"
          >
            Sign in to upgrade
          </button>
        );
      } else {
        // Check if user is already on this plan and has used all credits
        const needsRenewal = userDetail.plan === 'premium' && !userDetail.hasAvailableCredits;

        return (
          <PaymentButton
            amount={100} // 1 INR in paise
            buttonText={needsRenewal ? "Buy Again" : "Buy Premium Plan"}
            className="mt-6 w-full bg-[#C5A790] hover:bg-[#b0927a] text-black py-2 rounded-lg"
            onSuccess={(response) => handlePaymentSuccess('premium', response)}
          />
        );
      }
    } else if (plan.planKey === 'pro') {
      // For pro plan
      if (!isSignedIn) {
        return (
          <button
            onClick={() => router.push(`/sign-in?redirectUrl=${encodeURIComponent('/pricing')}`)}
            className="mt-6 w-full bg-[#C5A790] hover:bg-[#b0927a] text-black py-2 rounded-lg"
          >
            Sign in to upgrade
          </button>
        );
      } else {
        // Check if user is already on this plan and has used all credits
        const needsRenewal = userDetail.plan === 'pro' && !userDetail.hasAvailableCredits;

        return (
          <PaymentButton
            amount={83500} // 835 INR in paise
            buttonText={needsRenewal ? "Buy Again" : "Buy Unlimited Credits"}
            className="mt-6 w-full bg-[#C5A790] hover:bg-[#b0927a] text-black py-2 rounded-lg"
            onSuccess={(response) => handlePaymentSuccess('pro', response)}
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
      price: "₹1.00",
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
          className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity logo-pulse animate-fade-in"
          onClick={() => router.push('/')}
        >
          <div className="logo-container bg-[#C5A790] w-6 h-6 rounded-full flex items-center justify-center text-slate-800 text-xs font-bold">DM</div>
          <h2 className="font-bold text-lg bg-gradient-to-r from-[#1A1A1A] via-[#C5A790] to-[#FFF] text-transparent bg-clip-text">DecorMind</h2>
        </div>

        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center">
          <nav className="flex gap-4 md:gap-6 mx-auto justify-center flex-wrap" style={{ fontSize: '0.875rem' }}>
            <Link
              href="/"
              className="nav-link text-white hover:text-[#C5A790] transition-colors relative group"
              style={{ animationDelay: '100ms' }}
            >
              Home
            </Link>
            <Link
              href="/#features"
              className="nav-link text-white hover:text-[#C5A790] transition-colors relative group"
              style={{ animationDelay: '200ms' }}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/#features');
              }}
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="nav-link text-white hover:text-[#C5A790] transition-colors relative group"
              style={{ animationDelay: '300ms' }}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/#how-it-works');
              }}
            >
              How it Works
            </Link>
            <Link
              href="/#gallery"
              className="nav-link text-white hover:text-[#C5A790] transition-colors relative group"
              style={{ animationDelay: '400ms' }}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/#gallery');
              }}
            >
              Gallery
            </Link>
            <Link
              href="/tutorial-video"
              className="nav-link text-white hover:text-[#C5A790] transition-colors relative group"
              style={{ animationDelay: '500ms' }}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/tutorial-video');
              }}
            >
              Tutorial Video
            </Link>
            <Link
              href="/pricing"
              className="nav-link text-[#C5A790] active transition-colors relative group"
              style={{ animationDelay: '600ms' }}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/pricing');
              }}
            >
              Pricing
            </Link>
            <Link
              href="/contact-us"
              className="nav-link text-white hover:text-[#C5A790] transition-colors relative group"
              style={{ animationDelay: '700ms' }}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/contact-us');
              }}
            >
              Contact Us
            </Link>
          </nav>
        </div>

        <div>
          <div className="hidden md:flex items-center gap-2 animate-fade-in" style={{ animationDelay: '800ms' }}>
            {isSignedIn ? (
              <>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <Link
                  href={`/sign-in?redirectUrl=${encodeURIComponent('/dashboard-pricing')}`}
                  className="text-white border border-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md text-sm transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href={`/sign-up?redirectUrl=${encodeURIComponent('/dashboard-pricing')}`}
                  className="bg-[#C5A790] text-slate-800 hover:bg-[#b0927a] px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden animate-fade-in" style={{ animationDelay: '800ms' }}>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        <button className="md:hidden text-white animate-fade-in" onClick={toggleMobileMenu} style={{ animationDelay: '800ms' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-16 left-0 right-0 z-40 bg-zinc-900 shadow-md border-b border-zinc-800 transition-all duration-300 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <Link
          href="/dashboard"
          className="block py-2 w-full text-center hover:text-[#C5A790] text-white transition-colors duration-300"
          onClick={closeMobileMenu}
        >
          Home
        </Link>
        <Link
          href="#"
          className="block py-2 w-full text-center hover:text-[#C5A790] text-white transition-colors duration-300"
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
          className="block py-2 w-full text-center hover:text-[#C5A790] text-white transition-colors duration-300"
          onClick={closeMobileMenu}
        >
          DecorMind
        </Link>
        <Link
          href="/pricing"
          className="block py-2 w-full text-center text-[#C5A790] transition-colors duration-300"
          onClick={closeMobileMenu}
        >
          Pricing
        </Link>
        <Link
          href="/contact-us"
          className="block py-2 w-full text-center hover:text-[#C5A790] text-white transition-colors duration-300"
          onClick={closeMobileMenu}
        >
          Contact Us
        </Link>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#1A1A1A] via-[#C5A790] to-[#FFF] text-transparent bg-clip-text">
            Choose Your Plan
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-6">
            Unlock the full potential of AI-powered interior design with our premium plans. Choose the plan that suits your needs.
          </p>

          {/* Currency Selector */}
          <div className="flex justify-center items-center space-x-2 mb-8">
            <span className="text-zinc-400">Select Currency:</span>
            <select
              className="bg-zinc-800 text-white rounded-md border border-zinc-700 py-1 px-2 focus:outline-none focus:ring-2 focus:ring-[#C5A790]"
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
            const isCurrent = plan.planKey === userDetail.plan;
            const isDisabled = userDetail.plan === "pro" || (userDetail.plan === "premium" && plan.planKey === "free");

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
                className={`rounded-xl p-6 bg-zinc-900 text-white shadow-md ${isCurrent ? "border-2 border-[#C5A790]" : ""
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
