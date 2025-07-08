'use client';

import React from 'react';

export default function NewsletterForm() {
  return (
    <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto md:mx-0">
      <input
        type="email"
        placeholder="Enter your email"
        className="px-4 py-3 rounded-lg bg-slate-800 border border-zinc-700 text-white flex-grow focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
        aria-label="Email for newsletter"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-green-400 hover:from-cyan-500 hover:to-green-500 rounded-lg text-slate-900 font-semibold transition-all transform hover:scale-105 whitespace-nowrap"
        aria-label="Subscribe to newsletter"
        suppressHydrationWarning={true}
      >
        Subscribe
      </button>
    </form>
  );
} 