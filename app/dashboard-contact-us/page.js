'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from "../../components/ui/button";
import { UserButton } from '@clerk/nextjs';
import useGoogleAnalytics from '../_hooks/useGoogleAnalytics';
import { useUser } from '@clerk/nextjs';
import MobileMenu from '../dashboard/_components/MobileMenu';

export default function ContactUs() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { event } = useGoogleAnalytics();
  const [activeLink, setActiveLink] = useState(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupAction, setPopupAction] = useState(null);
  const [isSuccessPopup, setIsSuccessPopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState({
    message: '',
    type: '' // 'success' or 'error'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

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
                router.push(`/sign-in?redirectUrl=${encodeURIComponent('/dashboard-contact-us')}`);
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

  // Handle link click animation
  const handleLinkClick = (path) => {
    setActiveLink(path);

    // If user is trying to go to redesign page and isn't signed in, show popup
    if (path === '/redesign' && !isSignedIn) {
      showCustomPopup("Please sign in to access the redesign page");
      return;
    }

    // Reset active link after animation completes
    setTimeout(() => {
      setActiveLink(null);
    }, 300);

    // Navigate to the page using router.push instead of window.location.href
    router.push(path);
  };

  // Function to check if the link is active
  const isActive = (path) => {
    if (!mounted) return false;
    console.log("Current path:", pathname, "Checking:", path);
    return pathname === path;
  };
  
  // Add effect to update active state when component mounts
  useEffect(() => {
    if (mounted && pathname === "/dashboard-contact-us") {
      // Force the Contact Us tab to be active
      const contactLink = document.querySelector('a[href="/dashboard-contact-us"]');
      if (contactLink) {
        contactLink.classList.add('text-cyan-400');
        contactLink.classList.add('active');
      }
    }
  }, [mounted, pathname]);

  // Add CSS animations
  useEffect(() => {
    // Set mounted state to true
    setMounted(true);

    // Add CSS for animations
    let style;
    if (typeof window !== 'undefined') {
      style = document.createElement('style');
      style.innerHTML = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        /* Navbar link hover underline effect */
        .nav-link {
          position: relative;
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

        /* Active link state */
        .nav-link.active {
          color: #22d3ee !important;
        }
        
        .nav-link.active::after {
          width: 100%;
        }
        
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
        
        /* Hamburger menu styles */
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
      `;
      document.head.appendChild(style);
      
      // Clean up
      return () => {
        if (style && document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
  }, []);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    event({
      action: 'contact_form_submit',
      category: 'engagement',
      label: 'contact_page'
    });

    setIsSubmitting(true);
    setSubmitStatus({ message: '', type: '' });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ message: data.success, type: 'success' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus({ message: data.error, type: 'error' });
      }
    } catch (error) {
      setSubmitStatus({ message: 'Something went wrong. Please try again later.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      {/* Popup for notifications */}
      {showPopup && (
        <CustomPopup
          message={popupMessage}
          onClose={() => setShowPopup(false)}
          onAction={popupAction}
          isSuccess={isSuccessPopup}
        />
      )}

      {/* Header with navigation */}
      <nav className="p-5 shadow-sm flex justify-between items-center bg-zinc-900 border-b border-zinc-800 rounded-bl-3xl rounded-br-3xl sticky top-0 z-30">
        <div
          className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push('/')}
        >
          <div className="bg-cyan-400 w-6 h-6 rounded-full flex items-center justify-center text-slate-800 text-xs font-bold">DM</div>
          <h2 className="font-bold text-lg bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text" suppressHydrationWarning>DecorMind</h2>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <nav className="flex gap-6" style={{ fontSize: '0.875rem' }}>
            <Link 
              href="/dashboard" 
              className={`text-white hover:text-cyan-400 transition-colors duration-300 ${isActive('/dashboard') ? 'text-cyan-400' : ''} nav-link`}
              onClick={() => handleLinkClick('/dashboard')}
              suppressHydrationWarning
            >
              Home
            </Link>
            <Link 
              href="/redesign" 
              className={`text-white hover:text-cyan-400 transition-colors duration-300 ${isActive('/redesign') ? 'text-cyan-400' : ''} nav-link`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/redesign');
              }}
              suppressHydrationWarning
            >
              Redesign
            </Link>
            <Link 
              href="/decormind" 
              className={`text-white hover:text-cyan-400 transition-colors duration-300 ${isActive('/decormind') ? 'text-cyan-400' : ''} nav-link`}
              onClick={() => handleLinkClick('/decormind')}
              suppressHydrationWarning
            >
              DecorMind
            </Link>
            <Link 
              href="/dashboard-pricing" 
              className={`text-white hover:text-cyan-400 transition-colors duration-300 ${isActive('/dashboard-pricing') ? 'text-cyan-400' : ''} nav-link`}
              onClick={() => handleLinkClick('/dashboard-pricing')}
              suppressHydrationWarning
            >
              Pricing
            </Link>
            <Link 
              href="/dashboard-contact-us" 
              className={`text-white hover:text-cyan-400 transition-colors duration-300 ${isActive('/dashboard-contact-us') ? 'text-cyan-400 active' : ''} nav-link active`}
              onClick={() => handleLinkClick('/dashboard-contact-us')}
              suppressHydrationWarning
            >
              Contact Us
            </Link>
          </nav>
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
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        onLinkClick={handleLinkClick} 
      />

      {/* Main Content */}
      <div className="py-16 px-6 fade-in">
        <div className="max-w-3xl mx-auto">
          <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 shadow-lg">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text" suppressHydrationWarning>Contact Us</h1>

            <p className="text-zinc-300 mb-8">Have questions or need assistance? Reach out to our team and we'll get back to you as soon as possible.</p>

            {mounted ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white mb-1 md:mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-1.5 md:py-2 bg-black border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 form-field transition-all duration-300 text-sm md:text-base"
                      placeholder="Your name"
                      required={true}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-1 md:mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-1.5 md:py-2 bg-black border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 form-field transition-all duration-300 text-sm md:text-base"
                      placeholder="Your email"
                      required={true}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-white mb-1 md:mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-1.5 md:py-2 bg-black border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 form-field transition-all duration-300 text-sm md:text-base"
                    placeholder="Subject"
                    required={true}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white mb-1 md:mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 md:px-4 py-1.5 md:py-2 bg-black border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 form-field transition-all duration-300 text-sm md:text-base"
                    placeholder="Your message"
                    required={true}
                  ></textarea>
                </div>
                <div className="text-center">
                  <Button
                    type="submit"
                    className="bg-cyan-400 text-slate-800 hover:bg-cyan-500 transition-all duration-300 transform hover:scale-[1.02]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>

                {submitStatus.message && (
                  <div className={`mt-4 p-3 rounded ${submitStatus.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
                    {submitStatus.message}
                  </div>
                )}
              </form>
            ) : (
              <div className="space-y-6 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="h-5 w-16 bg-zinc-800 rounded mb-2"></div>
                    <div className="h-10 bg-zinc-800 rounded"></div>
                  </div>
                  <div>
                    <div className="h-5 w-16 bg-zinc-800 rounded mb-2"></div>
                    <div className="h-10 bg-zinc-800 rounded"></div>
                  </div>
                </div>
                <div>
                  <div className="h-5 w-20 bg-zinc-800 rounded mb-2"></div>
                  <div className="h-10 bg-zinc-800 rounded"></div>
                </div>
                <div>
                  <div className="h-5 w-20 bg-zinc-800 rounded mb-2"></div>
                  <div className="h-32 bg-zinc-800 rounded"></div>
                </div>
                <div className="flex justify-center">
                  <div className="h-10 w-32 bg-zinc-800 rounded"></div>
                </div>
              </div>
            )}

            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-zinc-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-white">Email Us</h3>
                  <p className="text-zinc-300 text-sm md:text-base">For general inquiries: <a href="mailto:ai.decormind@gmail.com" className="text-cyan-400 hover:underline">ai.decormind@gmail.com</a></p>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-white">Address</h3>
                  <a href="https://maps.google.com/?q=Old+Kondli,+Delhi,+110096" target="_blank" rel="noopener noreferrer" className="text-zinc-300 text-sm md:text-base flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Old Kondli, Delhi, 110096</span>
                  </a>
                </div>
                <div className="sm:col-span-2 md:col-span-1">
                  <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-white">Follow Us</h3>
                  <div className="flex gap-4">
                    <a href="#" className="text-white hover:text-cyan-400 transform transition-transform duration-300 hover:-translate-y-1">
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
                        <linearGradient id="Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1" x1="9.993" x2="40.615" y1="9.993" y2="40.615" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#2aa4f4"></stop><stop offset="1" stopColor="#007ad9"></stop></linearGradient><path fill="url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)" d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"></path><path fill="#fff" d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"></path>
                      </svg>
                    </a>
                    <a href="#" className="text-white hover:text-cyan-400 transform transition-transform duration-300 hover:-translate-y-1">
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
                        <radialGradient id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1" cx="19.38" cy="42.035" r="44.899" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fd5"></stop><stop offset=".328" stopColor="#ff543f"></stop><stop offset=".348" stopColor="#fc5245"></stop><stop offset=".504" stopColor="#e64771"></stop><stop offset=".643" stopColor="#d53e91"></stop><stop offset=".761" stopColor="#cc39a4"></stop><stop offset=".841" stopColor="#c837ab"></stop></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path><radialGradient id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2" cx="11.786" cy="5.54" r="29.813" gradientTransform="matrix(1 0 0 .6663 0 1.849)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#4168c9"></stop><stop offset=".999" stopColor="#4168c9" stopOpacity="0"></stop></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path><path fill="#fff" d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"></path><circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle><path fill="#fff" d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"></path>
                      </svg>
                    </a>
                    <a href="#" className="text-white hover:text-cyan-400 transform transition-transform duration-300 hover:-translate-y-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer removed - Now handled by the global Footer component */}
    </div>
  );
}