import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard',
  '/dashboard/(.*)',
  '/generate',
  '/interior-generator',
  '/favorites',
  '/redesign',
  '/decormind'
]);

export default clerkMiddleware((auth, request) => {
  // Allow users to access all routes without restriction
  return NextResponse.next();
});

// Configure middleware to match all routes
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 