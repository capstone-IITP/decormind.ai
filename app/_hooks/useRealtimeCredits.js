'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';

/**
 * Hook to fetch real-time credits from MongoDB API
 * @returns {Object} { credits, loading, error, refreshCredits }
 */
export default function useRealtimeCredits() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [credits, setCredits] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch credits from MongoDB API
    const fetchCredits = useCallback(async () => {
        if (!isSignedIn || !user) {
            setCredits(0);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/user/credits', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch credits');
            }

            const data = await response.json();
            setCredits(data.credits || 0);
        } catch (err) {
            console.error('Error fetching credits:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [isSignedIn, user]);

    // Fetch credits when user signs in or changes
    useEffect(() => {
        if (isLoaded) {
            fetchCredits();
        }
    }, [isLoaded, isSignedIn, user?.id, fetchCredits]);

    // Manual refresh function
    const refreshCredits = useCallback(() => {
        fetchCredits();
    }, [fetchCredits]);

    return {
        credits,
        loading,
        error,
        refreshCredits,
    };
}
