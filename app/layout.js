import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NextTopLoader from './_components/NextTopLoader';
import GoogleAnalytics from './_components/GoogleAnalytics';
import ConditionalLoader from './_components/ConditionalLoader';
import Provider from './provider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DecorMind",
  description: "Transform your space with AI-powered interior design",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Animation script for scroll reveal
const AnimationScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            // Observer for revealing elements on scroll
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('active');
                }
              });
            }, { threshold: 0.15 });
            
            // Add animation classes to sections
            function setupAnimations() {
              // Apply reveal animations
              document.querySelectorAll('#features .bg-black').forEach((el, i) => {
                el.classList.add('reveal');
                el.style.transitionDelay = (i * 0.1) + 's';
                observer.observe(el);
              });
              
              document.querySelectorAll('#how-it-works .text-center').forEach((el, i) => {
                el.classList.add('reveal');
                el.style.transitionDelay = (i * 0.15) + 's';
                observer.observe(el);
              });
              
              document.querySelectorAll('#gallery .group').forEach((el, i) => {
                el.classList.add('reveal');
                el.style.transitionDelay = (i * 0.1) + 's';
                observer.observe(el);
              });
              
              // Left to right animations
              document.querySelectorAll('#features h3, #how-it-works h3, #gallery h3, #Tutorial\\\\ Video h3, #cta h3').forEach(el => {
                el.classList.add('reveal');
                observer.observe(el);
              });
              
              // Right to left animations 
              document.querySelectorAll('#room-showcase').forEach(el => {
                el.classList.add('reveal-left');
                observer.observe(el);
              });
              
              // Ripple effect on buttons
              document.querySelectorAll('button').forEach(button => {
                button.classList.add('ripple');
              });
              
              // Animate headings with gradient
              document.querySelectorAll('.bg-gradient-to-r').forEach(el => {
                el.classList.add('animated-gradient-text');
              });
            }
            
            // Run animation setup after a short delay
            setTimeout(setupAnimations, 100);
            
            // Add floating animations to images
            document.querySelectorAll('.relative img').forEach((img, index) => {
              img.style.animation = 'float ' + (5 + index % 3) + 's ease-in-out infinite';
              img.style.animationDelay = (index * 0.5) + 's';
            });
          });
        `,
      }}
    />
  );
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
          <AnimationScript />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          suppressHydrationWarning={true}
        >
          <NextTopLoader
            color="#22d3ee"
            showSpinner={false}
            height={3}
            shadow={true}
          />
          <GoogleAnalytics />
          <Provider>
            <ConditionalLoader>
              {children}
            </ConditionalLoader>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}