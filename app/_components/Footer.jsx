import React from 'react';
import Image from "next/image";
import Link from "next/link";
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  return (
    <footer className="bg-black py-16 px-6 border-t border-zinc-800" id="footer">
      {/* Newsletter Section */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="bg-gradient-to-r from-slate-900 via-cyan-800 to-slate-900 p-8 md:p-12 rounded-2xl border border-zinc-700 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/house.jpg')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-green-400 to-cyan-400"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Stay Inspired</h3>
              <p className="text-zinc-300 max-w-md">Get the latest design trends, tips, and exclusive offers delivered to your inbox.</p>
            </div>
            <div className="w-full md:w-auto">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-cyan-400 w-10 h-10 rounded-full flex items-center justify-center text-slate-900 text-lg font-bold shadow-lg">DM</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text" suppressHydrationWarning={true}>DecorMind</h1>
            </div>
            <p className="text-zinc-400 mb-6 max-w-md">Transform your space with AI-powered interior design. Get professional designs in minutes, not weeks.</p>
            <div className="flex gap-3 mb-6">
              <Link href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 transition-all transform hover:scale-110 hover:-translate-y-1 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-cyan-400 transition-colors">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Link>
              <Link href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 transition-all transform hover:scale-110 hover:-translate-y-1 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-cyan-400 transition-colors">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </Link>
              <Link href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 transition-all transform hover:scale-110 hover:-translate-y-1 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-cyan-400 transition-colors">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </Link>
            </div>
            <div className="flex flex-row gap-4 ">
              {/* Google Play button */}
              <Link href="#" aria-label="Get it on Google Play" className="flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-300 rounded-full px-5 py-2.5 transition-all">
                <div className="flex items-center">
                <Image src="https://static.cdnlogo.com/logos/g/98/google-play.svg" alt="Google Play" width={24} height={24} />
                  <div className="text-black font-semibold ml-2">Google Play</div>
                </div>
              </Link>
              
              {/* App Store button */}
              <Link href="#" aria-label="Download on the App Store" className="flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-300 rounded-full px-5 py-2.5 transition-all">
                <div className="flex items-center">
                  <Image src="https://www.svgrepo.com/show/354797/apple-app-store.svg" alt="App Store" width={24} height={24} />
                  <div className="text-black font-semibold ml-2">App Store</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold mb-4 text-white relative inline-block">
              Company
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-green-400"></span>
            </h5>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-zinc-400 hover:text-cyan-400 transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-cyan-400 transition-colors">Careers</Link></li>
              <li><Link href="/contact-us" className="text-zinc-400 hover:text-cyan-400 transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-cyan-400 transition-colors">Press Kit</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-4 text-white relative inline-block">
              Resources
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-green-400"></span>
            </h5>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-zinc-400 hover:text-cyan-400 transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-cyan-400 transition-colors">Design Tips</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-cyan-400 transition-colors">FAQs</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-cyan-400 transition-colors">Tutorials</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-4 text-white relative inline-block">
              Legal
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-green-400"></span>
            </h5>
            <ul className="space-y-3 text-sm">
              <li><Link href="/terms-and-conditions" className="text-zinc-400 hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="text-zinc-400 hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/no-refund-policy" className="text-zinc-400 hover:text-cyan-400 transition-colors">Refund Policy</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-cyan-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t border-zinc-800 text-sm">
          <p className="text-zinc-500 mb-4 md:mb-0">© {new Date().getFullYear()} DecorMind. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="#" className="text-zinc-500 hover:text-cyan-400 transition-colors text-xs">Sitemap</Link>
            <Link href="#" className="text-zinc-500 hover:text-cyan-400 transition-colors text-xs">Accessibility</Link>
            <Link href="#" className="text-zinc-500 hover:text-cyan-400 transition-colors text-xs">Cookies</Link>
            <Link href="#" className="text-zinc-500 hover:text-cyan-400 transition-colors text-xs">Do Not Sell My Info</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 