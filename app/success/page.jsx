'use client';

import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

export default function VerificationSuccess() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="relative min-h-screen w-full bg-[#050505] flex items-center justify-center p-4 overflow-hidden font-sans text-slate-200">

            {/* --- Ambient Background Effects --- */}
            <div className={`absolute inset-0 transition-opacity ${mounted ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDuration: '2000ms' }}>

                {/* Animated Gold/Beige Orbs - "Breathing" Background */}
                <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-[#C5A790] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.08] animate-pulse" style={{ animationDuration: '10000ms' }}></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#C5A790] rounded-full mix-blend-screen filter blur-[140px] opacity-[0.05] animate-pulse" style={{ animationDuration: '7000ms' }}></div>

                {/* Fine Mesh Grid for Texture */}
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                        backgroundSize: '32px 32px'
                    }}
                ></div>
            </div>

            {/* --- Main Card Container --- */}
            <div
                className={`
          relative z-10 w-full max-w-[420px]
          transform transition-all duration-1000 cubic-bezier(0.2, 0.8, 0.2, 1)
          ${mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'}
        `}
            >
                {/* Glow behind the card */}
                <div className="absolute -inset-1 bg-gradient-to-b from-[#C5A790] to-transparent opacity-20 blur-xl rounded-[30px]"></div>

                {/* The Glass Card */}
                <div className="relative bg-[#111111]/80 backdrop-blur-2xl border border-[#ffffff]/10 rounded-[24px] p-1 shadow-2xl overflow-hidden">

                    {/* Inner Content Padding */}
                    <div className="bg-[#0A0A0A]/50 rounded-[20px] px-8 py-12 md:px-10 md:py-14 flex flex-col items-center text-center relative overflow-hidden">

                        {/* Shimmer Effect overlay on card */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] animate-[shimmer_3s_infinite_linear]"></div>

                        {/* Icon Section */}
                        <div className="relative mb-8 group cursor-default">
                            <div className="absolute inset-0 bg-[#C5A790] blur-[40px] opacity-20 rounded-full scale-150 transition-transform duration-700 group-hover:scale-175"></div>

                            <div className="relative w-20 h-20 rounded-full border border-[#C5A790]/30 bg-[#1A1A1A] flex items-center justify-center shadow-[0_0_15px_rgba(197,167,144,0.1)] transition-all duration-500 group-hover:border-[#C5A790] group-hover:shadow-[0_0_25px_rgba(197,167,144,0.3)]">
                                <Check
                                    size={32}
                                    className={`text-[#C5A790] drop-shadow-[0_0_8px_rgba(197,167,144,0.8)] transition-all duration-700 delay-300 ${mounted ? 'scale-100 opacity-100 rotate-0' : 'scale-50 opacity-0 -rotate-90'}`}
                                    strokeWidth={3}
                                />
                            </div>

                            {/* Floating Sparkles */}
                            <Sparkles size={16} className="absolute -top-2 -right-2 text-[#C5A790] opacity-0 animate-[ping_2s_infinite_delay-700ms]" />
                            <Sparkles size={12} className="absolute bottom-0 -left-2 text-[#C5A790] opacity-0 animate-[ping_3s_infinite_delay-200ms]" />
                        </div>

                        {/* Typography */}
                        <div className="space-y-4 mb-10 relative z-10">
                            <h1 className={`text-4xl md:text-5xl font-light text-white tracking-tight transition-all duration-700 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                Verified<span className="text-[#C5A790]">.</span>
                            </h1>
                            <div className={`h-px w-12 bg-[#C5A790]/50 mx-auto transition-all duration-700 delay-300 ${mounted ? 'w-12 opacity-100' : 'w-0 opacity-0'}`}></div>
                            <p className={`text-[#888] text-sm md:text-base leading-relaxed max-w-[280px] mx-auto transition-all duration-700 delay-400 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                Welcome to the inner circle. <br /> Your account is now active.
                            </p>
                        </div>

                        {/* Luxury Button */}
                        <a
                            href="decormind://home"
                            className={`
                group relative w-full max-w-[240px] py-4 bg-[#C5A790] text-[#000] 
                font-semibold text-xs tracking-[0.2em] uppercase rounded-lg 
                overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(197,167,144,0.3)]
                ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
              `}
                            style={{ transitionDelay: '600ms' }}
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full skew-y-12 transition-transform duration-500 group-hover:translate-y-[-100%]"></div>
                            <span className="relative flex items-center justify-center gap-3">
                                Enter Experience
                                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                        </a>

                    </div>
                </div>

                {/* Footer Note */}
                <p className={`mt-8 text-center text-[#444] text-[10px] uppercase tracking-[0.3em] transition-opacity duration-1000 delay-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                    DecorMind Secure
                </p>

            </div>
        </div>
    );
}