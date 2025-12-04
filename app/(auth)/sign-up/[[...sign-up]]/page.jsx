'use client';

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState('/dashboard');
  const [isClient, setIsClient] = useState(false);

  const handleLogoClick = () => {
    router.push('/');
  };

  // Set isClient when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get the redirectUrl from the URL query parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const redirectParam = params.get('redirectUrl');
      console.log('Sign-up page - URL query parameters:', window.location.search);
      console.log('Sign-up page - redirectParam:', redirectParam);

      if (redirectParam) {
        try {
          // Decode the URL if it's encoded
          const decodedUrl = decodeURIComponent(redirectParam);
          console.log('Sign-up page - Decoded redirectUrl:', decodedUrl);
          setRedirectUrl(decodedUrl);
        } catch (error) {
          console.error('Error decoding redirectUrl:', error);
          setRedirectUrl(redirectParam);
        }
      }
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  // Log redirectUrl whenever it changes
  useEffect(() => {
    console.log('Sign-up page - redirectUrl updated to:', redirectUrl);
  }, [redirectUrl]);

  // Array of interior design images
  const images = [
    "https://images.unsplash.com/photo-1611095210561-67f0832b1ca3?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?q=80&w=1932&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?q=80&w=1932&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618219944342-824e40a13285?q=80&w=1471&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1374&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=1770&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=1770&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1770&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1770&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?q=80&w=1770&auto=format&fit=crop"
  ];

  // Effect to change the image every 2 seconds
  useEffect(() => {
    if (!isClient) return;

    // Preload all images
    images.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // Changed from 3000ms to 2000ms (2 seconds)

    return () => clearInterval(interval);
  }, [images, isClient]);

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* Left side - Branding and Image */}
      <div className="hidden md:block md:w-1/2 relative bg-zinc-900">
        <div className="absolute inset-0 overflow-hidden">
          {isClient && images.map((src, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
            >
              <Image
                src={src}
                alt={`Interior Design ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
                suppressHydrationWarning
              />
            </div>
          ))}
          <div suppressHydrationWarning className={`absolute inset-0 ${isClient ? "bg-gradient-to-r from-black to-transparent" : "bg-black"} z-20`}></div>
        </div>
        <div className="relative z-30 p-12 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleLogoClick}>
              <div className="bg-[#C5A790] w-8 h-8 rounded-full flex items-center justify-center text-slate-800 text-lg font-bold">DM</div>
              <h1 suppressHydrationWarning className="text-2xl font-bold bg-gradient-to-r from-[#1A1A1A] via-[#C5A790] to-[#FFF] text-transparent bg-clip-text">DecorMind</h1>
            </div>
            <h2 suppressHydrationWarning className="text-3xl font-bold text-white mb-4">Join DecorMind</h2>
            <p className="text-zinc-400 max-w-md">
              Create an account to start transforming your space with AI-powered interior design.
            </p>
          </div>
          <div suppressHydrationWarning className="text-sm text-white">
            &copy; {isClient ? new Date().getFullYear() : ''} DecorMind. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <SignUp
            redirectUrl={redirectUrl}
            routing="path"
            path="/sign-up"
            appearance={{
              elements: {
                rootBox: 'mx-auto',
                card: 'bg-zinc-900 border-none shadow-xl rounded-xl',
                headerTitle: 'text-white text-center text-xl',
                headerSubtitle: 'text-zinc-400 text-center',
                socialButtonsBlockButton: 'bg-[#C5A790] border-none hover:bg-[#b0927a] text-slate-800',
                socialButtonsBlockButtonArrow: 'text-slate-800',
                socialButtonsBlockButtonText: 'text-slate-800 font-medium',
                socialButtonsBlockButtonIcon: 'text-slate-800',
                dividerLine: 'bg-[#C5A790]',
                dividerText: 'text-zinc-500',
                formFieldLabel: 'text-zinc-300',
                formFieldInput: 'bg-zinc-800 border-zinc-700 text-white',
                formButtonPrimary: 'bg-[#C5A790] hover:bg-[#b0927a] text-slate-800 font-normal',
                footerActionText: 'text-zinc-400',
                footerActionLink: 'text-[#C5A790] hover:text-[#b0927a]',
                formFieldAction: 'text-[#C5A790] hover:text-[#b0927a]',
              },
              layout: {
                socialButtonsPlacement: 'top',
                showOptionalFields: false,
              },
              variables: {
                borderRadius: '0.75rem',
                colorBackground: '#18181b', // zinc-900
                colorPrimary: '#C5A790', // primary-color
                colorText: 'white',
                colorTextSecondary: '#a1a1aa', // zinc-400
                fontFamily: 'var(--font-geist-sans)',
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
