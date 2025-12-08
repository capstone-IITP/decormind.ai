'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function LenisProvider({ children }) {
    const lenisRef = useRef(null);

    useEffect(() => {
        // Initialize Lenis
        lenisRef.current = new Lenis({
            duration: 1.2, // Smooth scroll duration
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function for smooth feel
            orientation: 'vertical', // Scroll direction
            gestureOrientation: 'vertical', // Gesture direction
            smoothWheel: true, // Enable smooth scroll for mouse wheel
            wheelMultiplier: 1, // Wheel scroll speed multiplier
            touchMultiplier: 2, // Touch scroll speed multiplier
            infinite: false, // Infinite scroll
        });

        // Animation frame loop
        function raf(time) {
            lenisRef.current?.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Cleanup on unmount
        return () => {
            lenisRef.current?.destroy();
        };
    }, []);

    return <>{children}</>;
}
