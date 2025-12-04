'use client';

import React, { Suspense } from 'react';
import { Button } from "../components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useGoogleAnalytics from './_hooks/useGoogleAnalytics';
import RoomTransformationsCarousel from './_components/RoomTransformationsCarousel';

// Simple loading component
const Loading = () => (
  <div id="loader"></div>
);

// Client-side only component with no SSR
const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return <>{children}</>;
};

// Create a client component that uses useSearchParams
function HomeContent() {
  const [mounted, setMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const analytics = useGoogleAnalytics();

  // Array of interior design images for carousel
  const carouselImages = [
    "/images/living_room.jpg",
    "/images/kitchen.jpg",
    "/images/bedroom.jpg",
    "/images/bathroom.jpg",
    "/images/dining_room.jpg",
    "/images/home_office.jpg",
    "/images/Luxury-Bathroom.jpg",
    "/images/house.jpg",
    "/images/livingroom.jpg",
    "/images/kitchen-4.jpg",
  ];

  // Function to handle sign in
  const handleSignIn = () => {
    analytics.event({
      action: 'sign_in_click',
      category: 'engagement',
      label: 'home_page'
    });
    router.push('/sign-in');
  };

  // Function to handle sign up
  const handleSignUp = () => {
    analytics.event({
      action: 'sign_up_click',
      category: 'engagement',
      label: 'home_page'
    });
    router.push('/sign-up');
  };

  // Function to handle mobile menu toggle
  const toggleMobileMenu = () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;
    const menuButton = document.querySelector('.md\\:hidden');

    if (mobileMenu) {
      // Toggle the active class instead of hidden/flex
      mobileMenu.classList.toggle('active');

      // Animate hamburger to X
      if (menuButton) {
        menuButton.classList.toggle('menu-active');
        
        // Animate the menu bars
        const spans = menuButton.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
          // Animate to X
          if (spans[0]) spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          if (spans[1]) spans[1].style.opacity = '0';
          if (spans[2]) spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
          // Reset to hamburger
          if (spans[0]) spans[0].style.transform = 'none';
          if (spans[1]) spans[1].style.opacity = '1';
          if (spans[2]) spans[2].style.transform = 'none';
        }
      }

      // Toggle body scroll
      body.classList.toggle('mobile-menu-open');
      
      // Add staggered animations to menu items
      if (mobileMenu.classList.contains('active')) {
        const menuItems = mobileMenu.querySelectorAll('a, button');
        menuItems.forEach((item, index) => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          
          // Staggered animation with delay
          setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 100 + (index * 50));
        });
      }
    }
  };

  // Function to close mobile menu (for when clicking a link)
  const closeMobileMenu = () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;
    const menuButton = document.querySelector('.md\\:hidden');

    if (mobileMenu && mobileMenu.classList.contains('active')) {
      // Animate menu items out
      const menuItems = mobileMenu.querySelectorAll('a, button');
      menuItems.forEach((item, index) => {
        item.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
      });
      
      // Delay the menu closing slightly for a smoother animation
      setTimeout(() => {
        mobileMenu.classList.remove('active');
        
        // Reset hamburger icon
        if (menuButton) {
          menuButton.classList.remove('menu-active');
          const spans = menuButton.querySelectorAll('span');
          if (spans[0]) spans[0].style.transform = 'none';
          if (spans[1]) spans[1].style.opacity = '1';
          if (spans[2]) spans[2].style.transform = 'none';
        }

        // Re-enable body scroll
        body.classList.remove('mobile-menu-open');
      }, 200);
    }
  };

  // Set mounted to true on client and setup image carousel
  useEffect(() => {
    // Set mounted state to true
    setMounted(true);

    // API call to fetch users
    fetch(`/api/users`, {
      headers: {
        'Accept': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error fetching users:", error));

    // Preload all carousel images
    carouselImages.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    // Setup interval for changing images
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 2000); // Change image every 2 seconds

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
          --nav-underline-width: 0;
          opacity: 1; /* Set links to be visible by default */
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          width: var(--nav-underline-width, 0);
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: #22d3ee;
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after {
          width: 100%;
        }

        .nav-link.text-cyan-400::after {
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
        
        .nav-link:nth-child(6) {
          animation: fadeInDown 0.5s ease-out 0.6s forwards;
          opacity: 0;
        }
        
        .nav-link:nth-child(7) {
          animation: fadeInDown 0.5s ease-out 0.7s forwards;
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
      const sections = document.querySelectorAll('div[id]');
      const navLinks = document.querySelectorAll('.nav-link');

      let currentSectionId = '';

      // Find which section is currently in view
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
          currentSectionId = section.getAttribute('id');
        }
      });

      // Reset all links to inactive first
      navLinks.forEach(link => {
        link.classList.remove('text-cyan-400');
        link.classList.add('text-white');
        link.style.setProperty('--nav-underline-width', '0');
      });

      // Set only the current section's link to active
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('text-cyan-400');
          link.classList.remove('text-white');
          link.style.setProperty('--nav-underline-width', '100%');
        } else if (currentSectionId === 'top' && href === '#top') {
          link.classList.add('text-cyan-400');
          link.classList.remove('text-white');
          link.style.setProperty('--nav-underline-width', '100%');
        }
      });
    };

    // Smooth scroll function with delay animation
    const handleSmoothScroll = (e) => {
      e.preventDefault();
      const href = e.currentTarget?.getAttribute("href");

      // Skip smooth scroll for external links
      if (href && (href.startsWith("/") || href.startsWith("http"))) {
        router.push(href);
        return;
      }

      // Add a visual feedback to the clicked link
      if (e.currentTarget && e.currentTarget.classList) {
        e.currentTarget.classList.add("nav-link-clicked");
      }

      // Reset all links to inactive state first
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.classList.remove('text-cyan-400');
        link.classList.add('text-white');
        link.style.setProperty('--nav-underline-width', '0');
      });

      // Set only the clicked link to active
      if (e.currentTarget) {
        e.currentTarget.classList.add('text-cyan-400');
        e.currentTarget.classList.remove('text-white');
        e.currentTarget.style.setProperty('--nav-underline-width', '100%');
      }

      // Delay the scroll action for a better visual effect
      setTimeout(() => {
        const targetId = href?.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Calculate the position to scroll to
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;

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

        // Remove the visual feedback class
        setTimeout(() => {
          if (e.currentTarget && e.currentTarget.classList) {
            e.currentTarget.classList.remove("nav-link-clicked");
          }
        }, 300);
      }, 300); // 300ms delay before scrolling
    };

    // Initial setup for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
      // Set initial opacity for fade-in animation
      link.style.opacity = '0';

      // Set Home link as active initially
      if (index === 0) {
        link.classList.add('text-cyan-400');
        link.classList.remove('text-white');
        link.style.setProperty('--nav-underline-width', '100%');
      }

      // Add click event listener only to hash links (not to Link components)
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        link.addEventListener("click", handleSmoothScroll);
      }
    });

    // Add scroll event listener to highlight active section
    window.addEventListener('scroll', highlightActiveSection);

    // Initial call to highlight the active section
    setTimeout(highlightActiveSection, 500);

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

      // Cleanup the interval when component unmounts
      clearInterval(interval);
    };
  }, [carouselImages]);

  // Show loading state until client-side rendering is ready
  if (!mounted) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-black text-white" id="top">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center py-4 px-4 md:px-6 bg-zinc-900 sticky top-0 z-50 shadow-md border-b border-zinc-800 rounded-bl-2xl rounded-br-2xl nav-slide-down">
        <div className="flex items-center gap-2">
          <div className="bg-cyan-400 w-6 h-6 rounded-full flex items-center justify-center text-slate-800 text-xs font-bold">DM</div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text">DecorMind</h1>
        </div>
        {/* Mobile Menu Button */}
        <button className="md:hidden flex flex-col space-y-1" onClick={toggleMobileMenu}>
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
        </button>
        {/* Desktop Navigation */}
        <div className="hidden md:flex desktop-nav absolute left-1/2 transform -translate-x-1/2 gap-4 md:gap-8 text-sm">
          <a href="#top" className="nav-link text-cyan-400 transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-cyan-400">Home</a>
          <a href="#features" className="nav-link hover:text-cyan-400 text-white transition-colors duration-300 relative">Features</a>
          <a href="#how-it-works" className="nav-link hover:text-cyan-400 text-white transition-colors duration-300 relative">How it Works</a>
          <a href="#Tutorial Video" className="nav-link hover:text-cyan-400 text-white transition-colors duration-300 relative">Tutorial Video</a>
          <a href="#gallery" className="nav-link hover:text-cyan-400 text-white transition-colors duration-300 relative">Gallery</a>
          <Link href="/pricing" className="nav-link hover:text-cyan-400 text-white transition-colors duration-300 relative">Pricing</Link>
          <Link href="/contact-us" className="nav-link hover:text-cyan-400 text-white transition-colors duration-300 relative">Contact Us</Link>
        </div>
        {/* Desktop Buttons */}
        <div className="hidden md:flex desktop-nav-buttons gap-2">
          <button
            className="text-white border border-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md text-sm transition-colors"
            onClick={handleSignIn}
          >
            Sign In
          </button>
          <button
            className="bg-cyan-400 text-slate-800 hover:bg-cyan-500 px-4 py-2 rounded-md text-sm font-bold transition-colors"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div id="mobile-menu" className="mobile-menu py-4 bg-zinc-900 fixed top-16 left-0 right-0 z-40 shadow-md border-b border-zinc-800">
        <a href="#top" className="py-2 w-full text-center nav-link text-cyan-400 transition-colors duration-300" onClick={closeMobileMenu}>Home</a>
        <a href="#features" className="py-2 w-full text-center nav-link hover:text-cyan-400 text-white transition-colors duration-300" onClick={closeMobileMenu}>Features</a>
        <a href="#how-it-works" className="py-2 w-full text-center nav-link hover:text-cyan-400 text-white transition-colors duration-300" onClick={closeMobileMenu}>How it Works</a>
        <a href="#Tutorial Video" className="py-2 w-full text-center nav-link hover:text-cyan-400 text-white transition-colors duration-300" onClick={closeMobileMenu}>Tutorial Video</a>
        <a href="#gallery" className="py-2 w-full text-center nav-link hover:text-cyan-400 text-white transition-colors duration-300" onClick={closeMobileMenu}>Gallery</a>
        <Link href="/pricing" className="py-2 w-full text-center nav-link hover:text-cyan-400 text-white transition-colors duration-300" onClick={closeMobileMenu}>Pricing</Link>
        <Link href="/contact-us" className="py-2 w-full text-center nav-link hover:text-cyan-400 text-white transition-colors duration-300" onClick={closeMobileMenu}>Contact Us</Link>
        <div className="flex gap-2 mt-4 w-full justify-center">
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
            className="bg-cyan-400 text-slate-800 hover:bg-cyan-500 px-4 py-2 rounded-md text-sm font-bold transition-colors"
            onClick={() => {
              closeMobileMenu();
              handleSignUp();
            }}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative px-4 md:px-6 py-8 md:py-12 bg-black flex flex-col md:flex-row">
        <div className="w-full max-w-3xl z-10 md:w-1/2 md:pr-8 mb-8 md:mb-0">
          <h2 id='title' className="text-3xl md:text-4xl font-bold font-acorn bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text mb-4">Transform Your Space with AI</h2>
          <p className="text-base md:text-lg text-white mb-6">
            Design your dream interior in minutes, not months. Our AI-powered platform creates stunning, personalized room designs tailored to your style and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8 md:mb-12">
            <button
              className="w-full sm:w-auto bg-cyan-400 text-slate-800 hover:bg-cyan-500 px-4 py-2 rounded-md font-medium transition-colors"
              onClick={() => router.push('/sign-up')}
            >
              Get Started Free
            </button>
            <button
              className="w-full sm:w-auto text-white border border-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md font-medium transition-colors"
              onClick={() => {
                const howItWorksSection = document.getElementById('how-it-works');
                if (howItWorksSection) {
                  // Add a visual feedback to the button
                  const button = document.activeElement;
                  button.classList.add("bg-white/20");

                  // Delay the scroll action for a better visual effect
                  setTimeout(() => {
                    // Calculate the position to scroll to
                    const targetPosition = howItWorksSection.getBoundingClientRect().top + window.pageYOffset - 80;

                    // Use the native smooth scrolling
                    window.scrollTo({
                      top: targetPosition,
                      behavior: 'smooth'
                    });

                    // Add animations to the target section after scrolling
                    setTimeout(() => {
                      animateSection(howItWorksSection);
                    }, 1000); // Wait for the scroll to complete

                    // Remove the visual feedback from the button
                    setTimeout(() => {
                      button.classList.remove("bg-white/20");
                    }, 300);
                  }, 300); // 300ms delay before scrolling
                }
              }}
            >
              See How it Works
            </button>
          </div>
          <div className="bg-black p-4 rounded-lg inline-block border border-zinc-800">
            <p className="text-sm text-white">Design generated in 45 seconds</p>
          </div>
        </div>
        <div className="relative md:absolute md:top-0 md:right-0 w-full md:w-1/2 h-64 sm:h-80 md:h-full">
          <div className="relative w-full h-full overflow-hidden">
            {carouselImages.map((src, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
              >
                <Image
                  src={src}
                  alt={`Interior Design ${index + 1}`}
                  fill
                  priority
                  className="object-cover brightness-125"
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 md:via-transparent to-transparent md:to-transparent z-20"></div>
          </div>
        </div>
      </div>

      {/* Room Transformations Showcase Section */}
      <div id="room-showcase" className="py-16 bg-black">
        <div className="container mx-auto px-6">
          <RoomTransformationsCarousel
            onSeeMoreClick={(roomType) => {
              let targetPath = '/kitchen-designs';
              let actionLabel = 'kitchen_designs_button';

              // Set appropriate path based on room type
              if (roomType === 'livingRoom') {
                targetPath = '/living-room-designs';
                actionLabel = 'living_room_designs_button';
              } else if (roomType === 'bedroom') {
                targetPath = '/bedroom-designs';
                actionLabel = 'bedroom_designs_button';
              } else if (roomType === 'bathroom') {
                targetPath = '/bathroom-designs';
                actionLabel = 'bathroom_designs_button';
              } else if (roomType === 'homeOffice') {
                targetPath = '/home-office-designs';
                actionLabel = 'home_office_designs_button';
              } else if (roomType === 'diningRoom') {
                targetPath = '/dining-room-designs';
                actionLabel = 'dining_room_designs_button';
              } else if (roomType === 'bedroom') {
                targetPath = '/redesign?room=bedroom';
                actionLabel = 'bedroom_designs_button';
              } else if (roomType === 'bathroom') {
                targetPath = '/redesign?room=bathroom';
                actionLabel = 'bathroom_designs_button';
              }

              analytics.event({
                action: `see_more_${roomType}_designs`,
                category: 'homepage',
                label: actionLabel
              });
              router.push(targetPath);
            }}
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 bg-black transition-all duration-300" id="features">
        <h3 id='title' className="text-2xl font-bold text-center bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text mb-12">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-black border border-zinc-800 p-6 rounded-lg">
            <div className="w-10 h-10 bg-cyan-400 rounded-md flex items-center justify-center text-slate-800 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </div>
            <h4 className="text-lg font-bold mb-2 text-white">AI-Powered Design</h4>
            <p className="text-white text-sm">Our sophisticated creative algorithms create beautiful, functional room designs personalized for you.</p>
          </div>
          <div className="bg-black border border-zinc-800 p-6 rounded-lg">
            <div className="w-10 h-10 bg-cyan-400 rounded-md flex items-center justify-center text-slate-800 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h4 className="text-lg font-bold mb-2 text-white">Save Time & Money</h4>
            <p className="text-white text-sm">Get professional-quality designs in minutes instead of waiting weeks for costly human designers.</p>
          </div>
          <div className="bg-black border border-zinc-800 p-6 rounded-lg">
            <div className="w-10 h-10 bg-cyan-400 rounded-md flex items-center justify-center text-slate-800 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
            </div>
            <h4 className="text-lg font-bold mb-2 text-white">Highly Effective</h4>
            <p className="text-white text-sm">Explore countless design options from modern to traditional and everything in between.</p>
          </div>
          <div className="bg-black border border-zinc-800 p-6 rounded-lg">
            <div className="w-10 h-10 bg-cyan-400 rounded-md flex items-center justify-center text-slate-800 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            </div>
            <h4 className="text-lg font-bold mb-2 text-white">Shop the Look</h4>
            <p className="text-white text-sm">Purchase the exact furniture and decor items featured in your design with one click.</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 px-6 bg-black transition-all duration-300" id="how-it-works">
        <h3 id='title' className="text-2xl font-bold text-center bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text mb-12">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center text-slate-800 font-bold mx-auto mb-4">1</div>
            <h4 className="text-lg font-bold mb-2 text-white">Upload Your Space</h4>
            <p className="text-white text-sm">Take a photo of your room or upload an existing one.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center text-slate-800 font-bold mx-auto mb-4">2</div>
            <h4 className="text-lg font-bold mb-2 text-white">Set Your Preferences</h4>
            <p className="text-white text-sm">Choose your style, budget, and specific requirements.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center text-slate-800 font-bold mx-auto mb-4">3</div>
            <h4 className="text-lg font-bold mb-2 text-white">Get AI Designs</h4>
            <p className="text-white text-sm">Receive multiple design options in less than 2 minutes.</p>
          </div>
        </div>
      </div>

      {/* Video Tutorial Section */}
      <div className="py-16 px-6 bg-black transition-all duration-300" id="Tutorial Video">
        <h3 id='title' className="text-2xl font-bold text-center bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text mb-8">Watch How It Works</h3>
        <p className="text-center text-white mb-8 max-w-2xl mx-auto">See DecorMind in action with our step-by-step tutorial video</p>
        <div className="max-w-4xl mx-auto aspect-video relative rounded-lg overflow-hidden border border-zinc-800">
          <video
            className="w-full h-full"
            src="/videos/tutorial-video.mp4"
            title="DecorMind Tutorial Video"
            controls
            autoPlay={false}
            playsInline
            poster="/images/cover-page.jpg">
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Stunning Transformations Section */}
      <div className="py-16 px-6 bg-black transition-all duration-300" id="gallery">
        <h3 id='title' className="text-2xl font-bold text-center bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text mb-8">Stunning Transformations</h3>
        <p className="text-center text-white mb-12 max-w-2xl mx-auto">See what our AI can do with these real customer examples</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-black border border-zinc-800 rounded-lg overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1400&auto=format&fit=crop"
                alt="Living Room Before"
                fill
                priority
                className="object-cover brightness-110 contrast-105 transition-opacity duration-500 group-hover:opacity-0"
              />
              <Image
                src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1400&auto=format&fit=crop"
                alt="Living Room After"
                fill
                priority
                className="object-cover brightness-110 contrast-105 absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            </div>
            <div className="p-4">
              <h4 className="font-bold text-white">Living Room</h4>
              <p className="text-xs text-white">45 seconds</p>
            </div>
          </div>
          <div className="bg-black border border-zinc-800 rounded-lg overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1611095210561-67f0832b1ca3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Kitchen Before"
                fill
                priority
                className="object-cover brightness-110 contrast-105 transition-opacity duration-500 group-hover:opacity-0"
              />
              <Image
                src="https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=1400&auto=format&fit=crop"
                alt="Kitchen After"
                fill
                priority
                className="object-cover brightness-110 contrast-105 absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            </div>
            <div className="p-4">
              <h4 className="font-bold text-white">Kitchen</h4>
              <p className="text-xs text-white">38 seconds</p>
            </div>
          </div>
          <div className="bg-black border border-zinc-800 rounded-lg overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1400&auto=format&fit=crop"
                alt="Bedroom Before"
                fill
                priority
                className="object-cover brightness-110 contrast-105 transition-opacity duration-500 group-hover:opacity-0"
              />
              <Image
                src="https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?q=80&w=1400&auto=format&fit=crop"
                alt="Bedroom After"
                fill
                priority
                className="object-cover brightness-110 contrast-105 absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            </div>
            <div className="p-4">
              <h4 className="font-bold text-white">Bedroom</h4>
              <p className="text-xs text-white">41 seconds</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-6 text-center bg-black" id="cta">
        <h3 id='title' className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text mb-4">Ready to Transform Your Space?</h3>
        <p className="text-white mb-8 max-w-2xl mx-auto">
          Join thousands of happy customers who have reimagined their homes with DecorMind.
        </p>
        <Button className="bg-cyan-400 text-slate-800 hover:bg-cyan-500">
          Start Your Free Design
        </Button>
      </div>

      {/* Contact Section Removed - Now available as a separate page */}

      {/* Footer */}
      <footer className="bg-black py-10 px-6 border-t border-zinc-800" id="footer">
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
          <p>© 2025 DecorMind. All rights reserved.</p>
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
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                <path fill="#212121" fillRule="evenodd" d="M38,42H10c-2.209,0-4-1.791-4-4V10c0-2.209,1.791-4,4-4h28	c2.209,0,4,1.791,4,4v28C42,40.209,40.209,42,38,42z" clipRule="evenodd"></path><path fill="#fff" d="M34.257,34h-6.437L13.829,14h6.437L34.257,34z M28.587,32.304h2.563L19.499,15.696h-2.563 L28.587,32.304z"></path><polygon fill="#fff" points="15.866,34 23.069,25.656 22.127,24.407 13.823,34"></polygon><polygon fill="#fff" points="24.45,21.721 25.355,23.01 33.136,14 31.136,14"></polygon>
              </svg>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Server component (page.js)
export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}