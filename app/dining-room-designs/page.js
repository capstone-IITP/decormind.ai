'use client';

import React, { useState } from 'react';
import { Button } from "../../components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import useGoogleAnalytics from '../_hooks/useGoogleAnalytics';
import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';

export default function DiningRoomDesigns() {
    const router = useRouter();
    const { event } = useGoogleAnalytics();
    const { isSignedIn } = useUser();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    // Close mobile menu
    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    // Handle link click
    const handleLinkClick = (path) => {
        if (path.startsWith('/#')) {
            router.push('/');
            // We'll need to wait for the navigation to complete before scrolling
            setTimeout(() => {
                const sectionId = path.substring(2); // Remove the /# to get the section id
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
            return;
        }

        router.push(path);
    };

    // Sign in handler
    const handleSignIn = () => {
        router.push('/sign-in');
    };

    // Sign up handler
    const handleSignUp = () => {
        router.push('/sign-up');
    };

    // Track page view when component mounts
    React.useEffect(() => {
        event({
            action: 'page_view',
            category: 'dining_room_designs',
            label: 'dining_room_designs_page'
        });

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            .highlight-section {
                animation: highlightSection 0.1s ease-out;
            }
            
            .section-fade-in {
                animation: fadeIn 0.1s ease-out forwards;
            }
            
            .heading-highlight {
                background: linear-gradient(90deg, rgba(30, 58, 92, 0.1), rgba(34, 211, 238, 0.2), rgba(74, 222, 128, 0.1));
                background-size: 200% 100%;
                animation: gradientMove 2s ease infinite;
                border-radius: 4px;
            }
            
            .icon-pulse {
                animation: pulse 0.1s ease-out;
            }
            
            @keyframes highlightSection {
                0% { background-color: rgba(34, 211, 238, 0.05); }
                100% { background-color: transparent; }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes gradientMove {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }, [event]);

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

    // Dining room design examples data
    const diningRoomDesigns = [
        {
            id: 1,
            title: 'Modern Dining Room',
            description: 'Clean lines, minimal decoration, and neutral colors create an elegant dining space.',
            style: 'Modern',
            imageUrl: '/images/modern-dining-room.jpg',
        },
        {
            id: 2,
            title: 'Scandinavian Dining Room',
            description: 'Light colors, natural materials, and functional design for a bright, airy dining area.',
            style: 'Scandinavian',
            imageUrl: '/images/scandinavian-dining-room-1.jpg',
        },
        {
            id: 3,
            title: 'Industrial Dining Room',
            description: 'Raw materials, exposed elements, and utilitarian objects for an urban loft feel.',
            style: 'Industrial',
            imageUrl: '/images/industrial-dining-room.jpg',
        },
        {
            id: 4,
            title: 'Traditional Dining Room',
            description: 'Classic design with rich colors and ornate details for a timeless appeal.',
            style: 'Traditional',
            imageUrl: '/images/traditional-dining-room.jpg',
        },
        {
            id: 5,
            title: 'Bohemian Dining Room',
            description: 'Eclectic, colorful, and artistic with global influences for a vibrant dining space.',
            style: 'Bohemian',
            imageUrl: '/images/bohemian-dining-room.jpg',
        },
        {
            id: 6,
            title: 'Minimalist Dining Room',
            description: 'Extreme simplicity, clean lines, and monochromatic palette for a serene environment.',
            style: 'Minimalist',
            imageUrl: '/images/minimalist-dining-room.jpg',
        }
    ];

    // Handle redesign button click
    const handleRedesignClick = () => {
        event({
            action: 'redesign_click',
            category: 'dining_room_designs',
            label: 'dining_room_redesign_button'
        });

        // Check if user is signed in, redirect to sign-in page if not
        if (isSignedIn) {
            router.push('/redesign');
        } else {
            router.push('/sign-in');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
            {/* Header with navigation */}
            <div className="p-5 shadow-sm flex flex-col md:flex-row justify-between items-center bg-zinc-900 border-b border-zinc-800 rounded-bl-3xl rounded-br-3xl">
                <div
                    className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity mb-4 md:mb-0"
                    onClick={() => router.push('/')}
                >
                    <div className="bg-cyan-400 w-6 h-6 rounded-full flex items-center justify-center text-slate-800 text-xs font-bold">DM</div>
                    <h2 className="font-bold text-lg bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text">DecorMind</h2>
                </div>

                <nav className="flex gap-4 md:gap-6 mx-auto justify-center flex-wrap" style={{ fontSize: '0.875rem' }}>
                    <Link href="/" className="text-white hover:text-cyan-400 transition-colors relative group">
                        Home
                        <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                        href="/#features"
                        className="text-white hover:text-cyan-400 transition-colors relative group"
                        onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick('/#features');
                        }}
                    >
                        Features
                        <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                        href="/#how-it-works"
                        className="text-white hover:text-cyan-400 transition-colors relative group"
                        onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick('/#how-it-works');
                        }}
                    >
                        How it Works
                        <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                        href="/#gallery"
                        className="text-white hover:text-cyan-400 transition-colors relative group"
                        onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick('/#gallery');
                        }}
                    >
                        Gallery
                        <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                        href="/#Tutorial Video"
                        className="text-white hover:text-cyan-400 transition-colors relative group"
                        onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick('/#Tutorial Video');
                        }}
                    >
                        Tutorial Video
                        <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                        href="/pricing"
                        className="text-white hover:text-cyan-400 transition-colors relative group"
                        onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick('/pricing');
                        }}
                    >
                        Pricing
                        <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                        href="/contact-us"
                        className="text-white hover:text-cyan-400 transition-colors relative group"
                        onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick('/contact-us');
                        }}
                    >
                        Contact Us
                        <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </nav>

                <div className="flex items-center gap-2 mt-4 md:mt-0">
                    {!isSignedIn ? (
                        <>
                            <Link href="/sign-in">
                                <Button variant="ghost" className="text-white hover:text-cyan-400 hover:bg-zinc-800 transition-colors">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button className="bg-cyan-400 hover:bg-cyan-500 text-slate-800">
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <UserButton afterSignOutUrl="/" />
                    )}
                    <button className="md:hidden ml-2 text-white" onClick={toggleMobileMenu}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden fixed top-16 left-0 right-0 z-40 bg-zinc-900 shadow-md border-b border-zinc-800 transition-all duration-300 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
                <Link href="/" className="block py-2 w-full text-center hover:text-cyan-400 text-white transition-colors duration-300"
                    onClick={(e) => {
                        e.preventDefault();
                        closeMobileMenu();
                        handleLinkClick('/');
                    }}
                >Home</Link>
                <Link href="/#features" className="block py-2 w-full text-center hover:text-cyan-400 text-white transition-colors duration-300"
                    onClick={(e) => {
                        e.preventDefault();
                        closeMobileMenu();
                        handleLinkClick('/#features');
                    }}
                >Features</Link>
                <Link href="/#how-it-works" className="block py-2 w-full text-center hover:text-cyan-400 text-white transition-colors duration-300"
                    onClick={(e) => {
                        e.preventDefault();
                        closeMobileMenu();
                        handleLinkClick('/#how-it-works');
                    }}
                >How it Works</Link>
                <Link href="/#gallery" className="block py-2 w-full text-center hover:text-cyan-400 text-white transition-colors duration-300"
                    onClick={(e) => {
                        e.preventDefault();
                        closeMobileMenu();
                        handleLinkClick('/#gallery');
                    }}
                >Gallery</Link>
                <Link href="/#Tutorial Video" className="block py-2 w-full text-center hover:text-cyan-400 text-white transition-colors duration-300"
                    onClick={(e) => {
                        e.preventDefault();
                        closeMobileMenu();
                        handleLinkClick('/#Tutorial Video');
                    }}
                >Tutorial Video</Link>
                <Link href="/pricing" className="block py-2 w-full text-center hover:text-cyan-400 text-white transition-colors duration-300"
                    onClick={(e) => {
                        e.preventDefault();
                        closeMobileMenu();
                        handleLinkClick('/pricing');
                    }}
                >Pricing</Link>
                <Link href="/contact-us" className="block py-2 w-full text-center hover:text-cyan-400 text-white transition-colors duration-300"
                    onClick={(e) => {
                        e.preventDefault();
                        closeMobileMenu();
                        handleLinkClick('/contact-us');
                    }}
                >Contact Us</Link>
                <div className="flex gap-2 mt-4 w-full justify-center pb-4">
                    <button
                        className="text-white border border-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md text-sm transition-colors"
                        onClick={() => {
                            closeMobileMenu();
                            router.push('/sign-in');
                        }}
                    >
                        Sign In
                    </button>
                    <button
                        className="bg-cyan-400 text-slate-800 hover:bg-cyan-500 px-4 py-2 rounded-md text-sm font-bold transition-colors"
                        onClick={() => {
                            closeMobileMenu();
                            router.push('/sign-up');
                        }}
                    >
                        Sign Up
                    </button>
                </div>
            </div>

            {/* Hero section */}
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 id='title' className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-transparent bg-clip-text px-2 py-2 inline-block w-auto">
                        Dining Room Design Inspiration
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                        Explore our collection of stunning dining room designs to inspire your next home transformation.
                    </p>
                </div>

                {/* Design examples grid */}
                <div id="dining-room-designs-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {diningRoomDesigns.map((design) => (
                        <div
                            key={design.id}
                            className="bg-zinc-800/50 rounded-xl overflow-hidden border border-zinc-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10"
                            onMouseEnter={(e) => animateSection(e.currentTarget)}
                        >
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={design.imageUrl}
                                    alt={design.title}
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-105"
                                />
                                <div className="absolute top-3 right-3 bg-cyan-400 text-slate-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {design.style}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2">{design.title}</h3>
                                <p className="text-zinc-400 mb-4">{design.description}</p>
                                <div className="flex justify-between items-center">
                                    <Button
                                        className="bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] hover:opacity-90 text-white"
                                        onClick={handleRedesignClick}
                                    >
                                        Redesign My Room
                                    </Button>
                                    <button
                                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                                        onClick={() => {
                                            event({
                                                action: 'view_before_after',
                                                category: 'dining_room_designs',
                                                label: design.title
                                            });
                                        }}
                                    >
                                        <span>Before/After</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to action */}
                <div className="bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 rounded-2xl p-8 md:p-12 border border-zinc-700/50 mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your dining room?</h2>
                            <p className="text-zinc-400 mb-6">
                                Upload a photo of your current dining room and our AI will redesign it in minutes. Choose from various styles and see the transformation instantly.
                            </p>
                            <Button
                                className="bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] hover:opacity-90 hover:bg-cyan-500"
                                onClick={handleRedesignClick}
                            >
                                Redesign My Dining Room
                            </Button>
                        </div>
                        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
                            <div className="absolute inset-0 grid grid-cols-2 gap-2">
                                <div className="relative">
                                    <Image
                                        src="/images/dining.jpg"
                                        alt="Before"
                                        fill
                                        className="object-cover rounded-l-xl"
                                    />
                                    <div className="absolute bottom-3 left-3 bg-cyan-400 text-slate-800 px-3 py-1 rounded-full text-sm">
                                        Before
                                    </div>
                                </div>
                                <div className="relative">
                                    <Image
                                        src="/images/dining-room.jpg"
                                        alt="After"
                                        fill
                                        className="object-cover rounded-r-xl"
                                    />
                                    <div className="absolute bottom-3 right-3 bg-cyan-400 text-slate-800 px-3 py-1 rounded-full text-sm">
                                        After
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Design Tips Section */}
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-white mb-16 mx-auto text-center">Dining Room Design Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:border-[#22d3ee]/50 transition-all duration-300">
                        <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Table Placement</h3>
                        <p className="text-zinc-400">
                            Center your dining table in the room with at least 36 inches of clearance on all sides for comfortable movement. For rectangular rooms, align the table with the longer dimension. Consider a round table for smaller spaces or to encourage conversation.
                        </p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:border-[#22d3ee]/50 transition-all duration-300">
                        <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Lighting Options</h3>
                        <p className="text-zinc-400">
                            Install a statement pendant light or chandelier centered above your dining table, hanging 30-36 inches above the tabletop. Add dimmers to create ambiance for different occasions. Consider wall sconces or buffet lamps for additional layered lighting.
                        </p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:border-[#22d3ee]/50 transition-all duration-300">
                        <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Space Utilization</h3>
                        <p className="text-zinc-400">
                            Include a buffet or sideboard for storage and serving space. Add a rug under the dining table that extends at least 24 inches beyond all sides of the table. Consider built-in banquette seating to maximize space in smaller dining areas.
                        </p>
                    </div>
                </div>
            </div>

            {/* FAQ section */}
            <div className="mb-16 container mx-auto px-4 py-16 text-center">
                <h2 className="text-3xl font-bold text-white mb-16 text-center">Frequently Asked Questions</h2>
                <div className="space-y-6 max-w-3xl mx-auto">
                    <div className="bg-zinc-800/30 p-6 rounded-xl border border-zinc-700/30">
                        <h3 className="text-xl font-bold text-white mb-2">How does the dining room redesign process work?</h3>
                        <p className="text-zinc-400">
                            Simply upload a photo of your current dining room, select your preferred style and budget, and our AI will generate a redesigned version of your space within minutes.
                        </p>
                    </div>
                    <div className="bg-zinc-800/30 p-6 rounded-xl border border-zinc-700/30">
                        <h3 className="text-xl font-bold text-white mb-2">What dining room styles can I choose from?</h3>
                        <p className="text-zinc-400">
                            We offer a variety of styles including Modern, Scandinavian, Industrial, Traditional, Bohemian, and Minimalist. Each style has unique characteristics that can transform your dining space.
                        </p>
                    </div>
                    <div className="bg-zinc-800/30 p-6 rounded-xl border border-zinc-700/30">
                        <h3 className="text-xl font-bold text-white mb-2">Can I get furniture recommendations for my dining room?</h3>
                        <p className="text-zinc-400">
                            Yes! After generating your redesign, you'll receive a list of dining tables, chairs, lighting fixtures, and decor recommendations that match the new design, along with estimated prices.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-zinc-900 border-t border-zinc-800 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <div className="bg-cyan-400 w-6 h-6 rounded-full flex items-center justify-center text-slate-800 text-xs font-bold mr-2">DM</div>
                            <span className="text-white font-medium">DecorMind</span>
                        </div>
                        <div className="text-zinc-500 text-sm">
                            © {new Date().getFullYear()} DecorMind. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}