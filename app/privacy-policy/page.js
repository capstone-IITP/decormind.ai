'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => router.push('/')}>
          <div className="bg-[#C5A790] w-6 h-6 rounded-full flex items-center justify-center text-slate-800 text-xs font-bold">DM</div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-[#1A1A1A] via-[#C5A790] to-[#FFF] text-transparent bg-clip-text">DecorMind</h1>
        </div>

        <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 shadow-lg">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#1A1A1A] via-[#C5A790] to-[#FFF] text-transparent bg-clip-text">Privacy Policy</h1>

          <div className="text-zinc-300 space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <p className="text-sm text-zinc-500">Effective Date: April 2, 2025</p>
            </div>

            <p>Thank you for choosing DecorMind AI. Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our AI-powered interior design services.</p>

            <div>
              <h2 className="text-xl font-semibold mb-3 text-white">1. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><span className="font-medium">Personal Information:</span> Name, email address, contact details, and any information you provide when requesting AI-generated interior designs.</li>
                <li><span className="font-medium">Project Data:</span> Images, room dimensions, style preferences, and other design inputs you submit.</li>
                <li><span className="font-medium">Usage Data:</span> IP address, browser type, device information, and interactions with our website.</li>
                <li><span className="font-medium">Cookies and Tracking Technologies:</span> We use cookies to enhance user experience, analyze website traffic, and optimize our AI models.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3 text-white">2. How We Use Your Information</h2>
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>To generate AI-powered interior design suggestions based on your inputs.</li>
                <li>To personalize and improve our AI models for better recommendations.</li>
                <li>To communicate with you regarding design updates, promotions, and customer support.</li>
                <li>To ensure website security and prevent fraudulent activities.</li>
                <li>To comply with legal requirements.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3 text-white">3. Data Protection</h2>
              <p>We implement strict security measures to protect your personal and design-related data. However, while we strive to ensure security, no online transmission is 100% secure, and we cannot guarantee absolute protection.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3 text-white">4. Sharing of Information</h2>
              <p>We do not sell or rent your personal data. However, we may share your information with:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><span className="font-medium">Service providers</span> assisting in AI processing, cloud storage, and website operations.</li>
                <li><span className="font-medium">Legal authorities</span> if required by law.</li>
                <li><span className="font-medium">Business partners</span> in the case of mergers, acquisitions, or collaborations to enhance our AI services.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3 text-white">5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Access, update, or delete your personal data and project details.</li>
                <li>Opt-out of marketing communications.</li>
                <li>Disable cookies through your browser settings.</li>
                <li>Request removal of AI-generated designs linked to your account.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3 text-white">6. Data Retention</h2>
              <p>We retain your data only as long as necessary for the purposes mentioned above. You may request data deletion at any time by contacting us.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3 text-white">7. Contact Us</h2>
              <p>If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:ai.decormind@gmail.com" className="text-[#C5A790] hover:underline">ai.decormind@gmail.com</a>.</p>
            </div>

            <p>By using our website, you acknowledge and agree to the terms of this Privacy Policy.</p>

            <div className="border-t border-zinc-800 pt-4 mt-8">
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