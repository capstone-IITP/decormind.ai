'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './BrutalistFooter.module.css';

const RollingLink = ({ href, children }) => {
    return (
        <Link href={href} className={styles.rollingLink}>
            <span className={styles.rollingText} data-text={children}>
                {children}
            </span>
        </Link>
    );
};

const BrutalistFooter = ({ variant = 'default' }) => {
    const [currentTime, setCurrentTime] = useState('--:--');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    }, []);

    const handleScrollToTop = () => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Menu items based on variant
    const menuItems = variant === 'dashboard' ? [
        { href: '/', label: 'HOME' },
        { href: '/redesign', label: 'REDESIGN' },
        { href: '/decormind', label: 'DECORMIND' },
        { href: '/pricing', label: 'PRICING' },
        { href: '/dashboard-contact-us', label: 'CONTACT US' },
    ] : [
        { href: '/', label: 'HOME' },
        { href: '/#features', label: 'FEATURES' },
        { href: '/#how-it-works', label: 'HOW IT WORKS' },
        { href: '/#Tutorial Video', label: 'TUTORIAL VIDEO' },
        { href: '/#gallery', label: 'GALLERY' },
        { href: '/pricing', label: 'PRICING' },
        { href: '/contact-us', label: 'CONTACT US' },
    ];

    return (
        <footer className={styles.footer} suppressHydrationWarning>
            {/* Top Border */}
            <div className={styles.borderTop}></div>

            <div className={styles.container}>
                {/* 1. Header Section */}
                <div className={styles.headerSection}>
                    <div className={styles.headerLabel}>
                        <span className={styles.dot}></span>
                        READY TO TRANSFORM YOUR SPACE?
                    </div>
                    <Link href="/sign-up" className={styles.ctaButton}>
                        START NOW <span className={styles.arrow}>→</span>
                    </Link>
                </div>

                {/* 2. Main Grid Layout */}
                <div className={styles.gridContainer}>
                    {/* Navigation Column */}
                    <div className={styles.gridCol}>
                        <h4 className={styles.colLabel}>MENU</h4>
                        <nav className={styles.navStack}>
                            {menuItems.map((item) => (
                                <RollingLink key={item.href} href={item.href}>{item.label}</RollingLink>
                            ))}
                        </nav>
                    </div>

                    {/* Socials Column */}
                    <div className={styles.gridCol}>
                        <h4 className={styles.colLabel}>SOCIALS</h4>
                        <nav className={styles.navStack}>
                            <RollingLink href="#">INSTAGRAM</RollingLink>
                            <RollingLink href="#">TWITTER / X</RollingLink>
                            <RollingLink href="#">LINKEDIN</RollingLink>
                            <RollingLink href="#">DRIBBBLE</RollingLink>
                        </nav>
                    </div>

                    {/* Legal Column */}
                    <div className={styles.gridCol}>
                        <h4 className={styles.colLabel}>LEGAL</h4>
                        <nav className={styles.navStack}>
                            <RollingLink href="/privacy">PRIVACY</RollingLink>
                            <RollingLink href="/terms">TERMS</RollingLink>
                            <RollingLink href="/cookies">COOKIES</RollingLink>
                        </nav>
                    </div>

                    {/* Newsletter / Contact */}
                    <div className={`${styles.gridCol} ${styles.contactCol}`}>
                        <h4 className={styles.colLabel}>CONTACT</h4>
                        <a href="mailto:hello@decormind.ai" className={styles.emailLink}>
                            hello@decormind.ai
                        </a>
                        <p className={styles.address}>
                            1200 VAN NESS AVE.<br />
                            SAN FRANCISCO, CA
                        </p>
                    </div>
                </div>

                {/* 3. Massive Brand Name */}
                <div className={styles.bigBrandWrapper}>
                    <h1 className={styles.bigBrand}>DECORMIND</h1>
                </div>

                {/* 4. Bottom Utilities */}
                <div className={styles.bottomBar}>
                    <div className={styles.copyright}>© 2025 DECORMIND INC.</div>
                    <div className={styles.timeZone} suppressHydrationWarning>LOCAL: {currentTime}</div>
                    <button className={styles.backToTop} onClick={handleScrollToTop}>
                        BACK TO TOP ↑
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default BrutalistFooter;
