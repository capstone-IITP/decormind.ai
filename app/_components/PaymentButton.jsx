'use client';

import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import Script from 'next/script';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

const PaymentButton = ({ amount = 500, buttonText = 'Pay Now', className = '', onSuccess }) => {
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      setIsRazorpayLoaded(true);
    }

    // Create overlay element if it doesn't exist
    if (!document.querySelector('.razorpay-payment-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'razorpay-payment-overlay';
      document.body.appendChild(overlay);
    }

    // Cleanup function to remove overlay when component unmounts
    return () => {
      const overlay = document.querySelector('.razorpay-payment-overlay');
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    };
  }, []);

  const handleRazorpayLoad = () => {
    setIsRazorpayLoaded(true);
  };

  // Function to show the overlay
  const showOverlay = () => {
    const overlay = document.querySelector('.razorpay-payment-overlay');
    if (overlay) {
      overlay.classList.add('active');
      // Add a small delay to ensure overlay is fully visible before opening Razorpay
      return new Promise(resolve => setTimeout(resolve, 300));
    }
    return Promise.resolve();
  };

  // Function to hide the overlay
  const hideOverlay = () => {
    const overlay = document.querySelector('.razorpay-payment-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  };

  const handlePayment = async () => {
    // Check if user is signed in before proceeding with payment
    if (!isSignedIn) {
      alert('Please sign in to continue with payment');
      router.push('/sign-in');
      return;
    }

    if (!isRazorpayLoaded) {
      alert('Razorpay is still loading. Please try again in a moment.');
      return;
    }

    try {
      setIsProcessing(true);

      console.log("Creating Razorpay order with amount:", amount);

      // Get auth token
      const token = await getToken();

      // Create order on the server
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: Math.max(100, Math.round(amount)) // Ensure minimum 1 INR (100 paise) and round to integer
        }),
      });

      if (!res.ok) {
        // Handle authentication errors specifically
        if (res.status === 401) {
          alert('Your session has expired. Please sign in again.');
          hideOverlay();
          setIsProcessing(false);
          router.push('/sign-in?redirectUrl=' + encodeURIComponent(window.location.pathname));
          return; // Return early instead of throwing an error
        }

        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create payment order');
      }

      const data = await res.json();
      console.log("Razorpay order created:", data);

      // Show overlay before opening Razorpay
      await showOverlay();

      // Log key for debugging (don't log in production)
      console.log("Razorpay Key ID exists:", !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

      // Simplify Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Decormind AI",
        description: "Interior Design AI Subscription",
        order_id: data.id,
        handler: function (response) {
          // Hide overlay when payment is successful
          hideOverlay();

          // Handle successful payment
          setIsProcessing(false);

          // Call the success callback if provided
          if (onSuccess && typeof onSuccess === 'function') {
            onSuccess(response);
          } else {
            alert("Payment Successful! Your plan has been upgraded.");
            console.log(response);
          }
        },
        modal: {
          ondismiss: function () {
            // Hide overlay when Razorpay modal is dismissed
            hideOverlay();
            setIsProcessing(false);
          },
          escape: true,
          backdropclose: false
        },
        theme: {
          color: "#C5A790" // Beige color to match the site theme
        }
      };

      console.log("Opening Razorpay with options:", {
        key_exists: !!options.key,
        amount: options.amount,
        currency: options.currency,
        order_id: options.order_id
      });

      // Initialize Razorpay
      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        hideOverlay();
        setIsProcessing(false);
      });

      // Open the Razorpay dialog
      setTimeout(() => {
        paymentObject.open();
      }, 100); // Short delay before opening
    } catch (error) {
      // Hide overlay in case of error
      hideOverlay();
      console.error("Payment error:", error);
      alert(`Payment initialization failed: ${error.message}`);
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Load Razorpay script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={handleRazorpayLoad}
        strategy="lazyOnload"
      />

      <Button
        onClick={handlePayment}
        disabled={isProcessing || !isRazorpayLoaded}
        className={`${className} ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isProcessing ? 'Processing...' : buttonText}
      </Button>
    </>
  );
};

export default PaymentButton;