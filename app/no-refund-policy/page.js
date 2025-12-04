'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NoRefundPolicy() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => router.push('/')}>
          <div className="bg-[#C5A790] w-6 h-6 rounded-full flex items-center justify-center text-slate-800 text-xs font-bold">DM</div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-[#1A1A1A] via-[#C5A790] to-[#FFF] text-transparent bg-clip-text">DecorMind</h1>
        </div>

        <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 shadow-lg">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#1A1A1A] via-[#C5A790] to-[#FFF] text-transparent bg-clip-text">No Refund Policy</h1>

          <div className="text-zinc-300 space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <p className="text-sm text-zinc-500">Effective Date: April 2, 2025</p>
            </div>

            <p>Thank you for choosing DecorMind AI. Please read this policy carefully before making a purchase.</p>

            <div>
              <h2 className="text-xl font-semibold mb-3 text-white">1. No Refunds</h2>
              <p>All sales are final. Due to the nature of our services/products, we do not offer refunds, exchanges, or cancellations once a purchase has been completed.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3 text-white">2. Exceptions</h2>
              <p>We do not provide refunds under any circumstances, including but not limited to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Change of mind</li>
                <li>Incorrect product/service selection</li>
                <li>Personal dissatisfaction</li>
                <li>Technical issues not caused by us</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3 text-white">3. Support & Assistance</h2>
              <p>If you encounter any issues with our product/service, please contact our support team at <a href="mailto:ai.decormind@gmail.com" className="text-[#C5A790] hover:underline">ai.decormind@gmail.com</a>. We will do our best to resolve any concerns.</p>
            </div>

            <p>By making a purchase on our website, you acknowledge and agree to this No Refund Policy.</p>

            <p>If you have any questions, feel free to reach out to us at <a href="mailto:ai.decormind@gmail.com" className="text-[#C5A790] hover:underline">ai.decormind@gmail.com</a>.</p>

            <div className="border-t border-zinc-800 pt-4 mt-8">
              <p>Thank you for your understanding and support!</p>
              <p className="font-semibold">DecorMind AI</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-[#C5A790] hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}