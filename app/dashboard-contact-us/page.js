'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from "../../components/ui/button";
import { UserButton } from '@clerk/nextjs';
import useGoogleAnalytics from '../_hooks/useGoogleAnalytics';
import { useUser } from '@clerk/nextjs';

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
    return pathname === path;
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-out forwards;
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

        /* Form field animation */
        @keyframes formFieldFocus {
          0% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0); }
          50% { box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.3); }
          100% { box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.2); }
        }
        
        .form-field:focus {
          animation: formFieldFocus 0.5s ease-out forwards;
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

      // Cleanup
      return () => {
        if (style && style.parentNode) {
          document.head.removeChild(style);
        }
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

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
      <nav className="flex justify-between items-center py-4 px-6 bg-zinc-900 sticky top-0 z-50 shadow-md border-b border-zinc-800 rounded-bl-3xl rounded-br-3xl nav-slide-down">
        <div
          className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity logo-pulse"
          onClick={() => router.push('/')}
        >
          <div className="logo-container bg-cyan-400 w-6 h-6 rounded-full flex items-center justify-center text-slate-800 text-xs font-bold">DM</div>
          <h2 className="font-bold text-lg bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text">DecorMind</h2>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-8 text-sm">
          <nav className="flex gap-6">
            <Link
              href="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'text-cyan-400 active' : 'text-white'} ${activeLink === '/dashboard' ? 'link-clicked' : ''} hover:text-cyan-400 transition-colors duration-300 relative`}
              onClick={() => handleLinkClick('/dashboard')}
            >
              Home
            </Link>
            <Link
              href="/redesign"
              className={`nav-link ${isActive('/redesign') ? 'text-cyan-400 active' : 'text-white'} ${activeLink === '/redesign' ? 'link-clicked' : ''} hover:text-cyan-400 transition-colors duration-300 relative`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/redesign');
              }}
            >
              Redesign
            </Link>
            <Link
              href="/decormind"
              className={`nav-link ${isActive('/decormind') ? 'text-cyan-400 active' : 'text-white'} ${activeLink === '/decormind' ? 'link-clicked' : ''} hover:text-cyan-400 transition-colors duration-300 relative`}
              onClick={() => handleLinkClick('/decormind')}
            >
              DecorMind
            </Link>
            <Link
              href="/dashboard-pricing"
              className={`nav-link ${isActive('/dashboard-pricing') ? 'text-cyan-400 active' : 'text-white'} ${activeLink === '/dashboard-pricing' ? 'link-clicked' : ''} hover:text-cyan-400 transition-colors duration-300 relative`}
              onClick={() => handleLinkClick('/dashboard-pricing')}
            >
              Pricing
            </Link>
            <Link
              href="/dashboard-contact-us"
              className={`nav-link ${isActive('/dashboard-contact-us') ? 'text-cyan-400 active' : 'text-white'} ${activeLink === '/dashboard-contact-us' ? 'link-clicked' : ''} hover:text-cyan-400 transition-colors duration-300 relative`}
              onClick={() => handleLinkClick('/dashboard-contact-us')}
            >
              Contact Us
            </Link>
          </nav>
        </div>

        <div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-16 px-6 fade-in">
        <div className="max-w-3xl mx-auto">
          <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 shadow-lg">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text">Contact Us</h1>

            <p className="text-zinc-300 mb-8">Have questions or need assistance? Reach out to our team and we'll get back to you as soon as possible.</p>

            {mounted ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-black border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 form-field transition-all duration-300"
                      placeholder="Your name"
                      required={true}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-black border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 form-field transition-all duration-300"
                      placeholder="Your email"
                      required={true}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-black border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 form-field transition-all duration-300"
                    placeholder="Subject"
                    required={true}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 bg-black border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 form-field transition-all duration-300"
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

            <div className="mt-8 pt-8 border-t border-zinc-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-white">Email Us</h3>
                  <p className="text-zinc-300">For general inquiries: <a href="mailto:ai.decormind@gmail.com" className="text-cyan-400 hover:underline">ai.decormind@gmail.com</a></p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-white">Address</h3>
                  <a href="https://maps.google.com/?q=Old+Kondli,+Delhi,+110096" target="_blank" rel="noopener noreferrer" className="text-zinc-300 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Old Kondli, Delhi, 110096
                  </a>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-white">Follow Us</h3>
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

      {/* Footer */}
      <footer className="bg-black py-10 px-6 border-t border-zinc-800 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-cyan-400 w-6 h-6 rounded-full flex items-center justify-center text-slate-800 text-xs font-bold">DM</div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text">DecorMind</h1>
            </div>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-white">Company</h5>
            <ul className="space-y-2 text-sm text-white">
              <li><Link href="#" className="hover:text-white text-white">About Us</Link></li>
              <li><Link href="#" className="hover:text-white text-white">Careers</Link></li>
              <li><Link href="/contact-us" className="hover:text-white text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-white">Resources</h5>
            <ul className="space-y-2 text-sm text-white">
              <li><Link href="#" className="hover:text-white text-white">Blog</Link></li>
              <li><Link href="#" className="hover:text-white text-white">Design Tips</Link></li>
              <li><Link href="#" className="hover:text-white text-white">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-white">Legal</h5>
            <ul className="space-y-2 text-sm text-white">
              <li><Link href="/terms-and-conditions" className="hover:text-white text-white">Terms and Conditions</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white text-white">Privacy Policy</Link></li>
              <li><Link href="/no-refund-policy" className="hover:text-white text-white">No Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex justify-between items-center pt-8 border-t border-zinc-800 text-sm text-white">
          <p>© {new Date().getFullYear()} DecorMind. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transform transition-transform duration-300 hover:-translate-y-1">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                <linearGradient id="Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1" x1="9.993" x2="40.615" y1="9.993" y2="40.615" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#2aa4f4"></stop><stop offset="1" stopColor="#007ad9"></stop></linearGradient><path fill="url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)" d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"></path><path fill="#fff" d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"></path>
              </svg>
            </Link>
            <Link href="#" className="hover:text-white transform transition-transform duration-300 hover:-translate-y-1">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                <radialGradient id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1" cx="19.38" cy="42.035" r="44.899" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fd5"></stop><stop offset=".328" stopColor="#ff543f"></stop><stop offset=".348" stopColor="#fc5245"></stop><stop offset=".504" stopColor="#e64771"></stop><stop offset=".643" stopColor="#d53e91"></stop><stop offset=".761" stopColor="#cc39a4"></stop><stop offset=".841" stopColor="#c837ab"></stop></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path><radialGradient id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2" cx="11.786" cy="5.54" r="29.813" gradientTransform="matrix(1 0 0 .6663 0 1.849)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#4168c9"></stop><stop offset=".999" stopColor="#4168c9" stopOpacity="0"></stop></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path><path fill="#fff" d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"></path><circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle><path fill="#fff" d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"></path>
              </svg>
            </Link>
            <Link href="#" className="hover:text-white transform transition-transform duration-300 hover:-translate-y-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 225 225">
                <g>
                  <path d="M 58.67,60.75 L 60.75,63.78 L 62.39,66.16 L 63.32,67.51 L 65.23,70.28 L 66.26,71.79 L 68.38,74.86 L 69.49,76.47 L 74.05,83.10 L 76.38,86.48 L 81.02,93.22 L 83.19,96.37 L 85.59,99.86 L 87.07,102.01 L 87.74,103.00 L 89.05,104.92 L 89.64,105.80 L 90.79,107.51 L 91.31,108.28 L 93.25,111.20 L 94.01,112.38 L 95.40,114.59 L 95.92,115.47 L 96.85,117.08 L 97.15,117.70 L 97.67,118.83 L 97.80,119.25 L 97.97,120.00 L 97.96,120.27 L 97.85,120.76 L 97.72,120.94 L 97.01,121.83 L 96.09,122.93 L 95.43,123.71 L 93.99,125.42 L 93.10,126.47 L 91.20,128.71 L 90.10,130.00 L 87.81,132.68 L 86.55,134.16 L 83.93,137.21 L 82.53,138.85 L 79.66,142.20 L 78.15,143.96 L 75.08,147.52 L 73.50,149.36 L 68.87,154.74 L 65.93,158.18 L 64.54,159.81 L 61.84,162.97 L 60.61,164.43 L 58.22,167.25 L 57.16,168.51 L 55.14,170.90 L 54.29,171.92 L 52.71,173.81 L 52.11,174.55 L 51.03,175.87 L 50.70,176.29 L 50.19,176.97 L 50.17,177.03 L 50.21,177.29 L 50.40,177.41 L 50.89,177.63 L 51.27,177.72 L 52.12,177.87 L 52.65,177.92 L 53.77,178.00 L 54.40,178.00 L 56.36,177.95 L 57.52,177.80 L 58.11,177.59 L 59.31,177.05 L 60.01,176.57 L 61.48,175.43 L 62.40,174.56 L 63.35,173.64 L 63.89,173.09 L 65.01,171.92 L 65.64,171.24 L 66.96,169.80 L 67.70,168.98 L 69.23,167.25 L 70.09,166.26 L 71.88,164.20 L 72.88,163.04 L 74.95,160.64 L 76.10,159.29 L 78.48,156.50 L 79.80,154.96 L 82.52,151.76 L 84.02,150.00 L 87.88,145.48 L 90.34,142.60 L 91.51,141.25 L 93.78,138.61 L 94.82,137.41 L 96.84,135.08 L 97.74,134.05 L 99.46,132.09 L 100.18,131.26 L 101.54,129.73 L 102.06,129.15 L 103.01,128.11 L 103.31,127.79 L 103.79,127.31 L 103.83,127.29 L 104.32,127.76 L 104.96,128.56 L 105.43,129.18 L 106.47,130.56 L 107.12,131.44 L 108.50,133.34 L 109.30,134.46 L 110.97,136.80 L 111.90,138.12 L 113.81,140.85 L 114.85,142.33 L 116.96,145.37 L 118.07,146.98 L 120.33,150.27 L 121.50,151.98 L 125.20,157.35 L 127.52,160.68 L 128.61,162.21 L 130.72,165.18 L 131.68,166.51 L 133.55,169.07 L 134.38,170.18 L 135.97,172.29 L 136.65,173.17 L 137.94,174.79 L 138.46,175.41 L 139.42,176.51 L 139.76,176.85 L 140.35,177.38 L 140.50,177.42 L 141.39,177.57 L 142.28,177.65 L 142.85,177.69 L 144.08,177.76 L 144.80,177.79 L 146.31,177.85 L 147.16,177.87 L 150.73,177.95 L 152.72,177.96 L 156.80,177.98 L 158.87,177.97 L 162.98,177.94 L 164.89,177.90 L 168.57,177.82 L 170.10,177.76 L 171.56,177.69 L 172.18,177.66 L 173.35,177.58 L 173.81,177.54 L 174.63,177.45 L 174.88,177.40 L 175.29,177.30 L 175.33,177.25 L 175.24,176.99 L 175.06,176.64 L 174.92,176.37 L 174.16,175.10 L 173.57,174.16 L 172.24,172.07 L 171.38,170.75 L 169.54,167.93 L 168.45,166.29 L 166.17,162.86 L 164.88,160.94 L 162.22,156.98 L 160.77,154.84 L 157.79,150.46 L 156.21,148.15 L 152.99,143.44 L 151.30,141.00 L 146.37,133.83 L 143.22,129.25 L 141.73,127.09 L 138.83,122.85 L 137.49,120.90 L 134.91,117.13 L 133.76,115.44 L 131.56,112.22 L 130.63,110.85 L 128.89,108.29 L 128.22,107.29 L 127.00,105.48 L 126.61,104.90 L 126.27,104.37 L 126.15,104.20 L 125.96,103.90 L 125.93,103.84 L 125.92,103.12 L 126.20,102.39 L 126.50,101.86 L 127.20,100.70 L 127.74,99.94 L 128.95,98.28 L 129.76,97.23 L 131.53,94.99 L 132.65,93.62 L 135.04,90.71 L 136.49,88.97 L 137.99,87.19 L 138.81,86.22 L 140.49,84.24 L 141.40,83.17 L 143.27,80.98 L 144.27,79.80 L 146.34,77.39 L 147.45,76.10 L 151.97,70.84 L 154.85,67.48 L 156.21,65.89 L 158.86,62.79 L 160.07,61.37 L 162.43,58.61 L 163.47,57.38 L 165.47,55.03 L 166.31,54.04 L 167.88,52.18 L 168.49,51.45 L 169.57,50.15 L 169.91,49.74 L 170.45,49.07 L 170.50,49.01 L 170.39,48.59 L 169.94,48.36 L 169.54,48.27 L 168.62,48.12 L 167.99,48.08 L 166.64,48.01 L 165.81,48.01 L 160.50,48.02 L 140.50,71.44 L 136.47,76.15 L 133.90,79.14 L 132.69,80.54 L 130.33,83.28 L 129.25,84.52 L 127.16,86.94 L 126.23,88.00 L 124.45,90.03 L 123.71,90.87 L 122.31,92.45 L 121.77,93.05 L 120.81,94.11 L 120.51,94.42 L 120.03,94.91 L 120.00,94.91 L 119.57,94.44 L 118.98,93.67 L 118.54,93.08 L 117.58,91.76 L 116.98,90.92 L 115.69,89.12 L 114.95,88.06 L 113.38,85.83 L 112.52,84.59 L 110.72,82.01 L 109.75,80.61 L 107.77,77.74 L 106.72,76.22 L 104.60,73.12 L 103.50,71.51 L 87.50,48.07 L 68.70,48.03 L 49.90,48.00" fill="currentColor" />
                </g>
              </svg>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}