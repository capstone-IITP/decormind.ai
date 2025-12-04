'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Button } from "../../components/ui/button";
import { useRouter, useSearchParams } from 'next/navigation';
import useGoogleAnalytics from '../_hooks/useGoogleAnalytics';
import Image from 'next/image';
import { downloadImageWithWatermark, addWatermarkToImage } from "../../lib/imageUtils";
import FeedbackForm from "../../components/FeedbackForm";

// Helper: Sanitize URL to prevent XSS
// Returns the URL string if valid, or null if invalid
const sanitizeUrl = (string) => {
  try {
    const url = new URL(string);
    // Only allow http and https protocols
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.toString();
    }
    return null;
  } catch (_) {
    return null;
  }
};

// Setup IndexedDB for favorites storage
const initIndexedDB = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      console.error("Your browser doesn't support IndexedDB");
      reject("IndexedDB not supported");
      return;
    }

    const request = indexedDB.open("DesignFavoritesDB", 1);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
      reject("Error opening IndexedDB");
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("favorites")) {
        db.createObjectStore("favorites", { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };
  });
};

// Get favorites from IndexedDB
const getFavoritesFromIndexedDB = async () => {
  try {
    const db = await initIndexedDB();
    const transaction = db.transaction(["favorites"], "readonly");
    const store = transaction.objectStore("favorites");
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        console.error("Get request error:", event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error("Error getting from IndexedDB:", error);
    return [];
  }
};

// Remove a favorite from IndexedDB
const removeFavoriteFromIndexedDB = async (id) => {
  try {
    const db = await initIndexedDB();
    const transaction = db.transaction(["favorites"], "readwrite");
    const store = transaction.objectStore("favorites");

    return new Promise((resolve, reject) => {
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = (event) => {
        console.error("Delete error:", event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error("Error removing from IndexedDB:", error);
    return false;
  }
};

// Create a client component that uses useSearchParams
function FavoritesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { event } = useGoogleAnalytics();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const shareOptionsRef = useRef(null);

  // Load favorites from IndexedDB on component mount
  useEffect(() => {
    // Track page view
    event({
      action: 'page_view',
      category: 'favorites',
      label: 'favorites_page'
    });

    async function loadFavorites() {
      try {
        // Try IndexedDB first
        const indexedDBFavorites = await getFavoritesFromIndexedDB();

        if (indexedDBFavorites && indexedDBFavorites.length > 0) {
          setFavorites(indexedDBFavorites);
        } else {
          // Fall back to localStorage for backward compatibility
          const storedFavorites = JSON.parse(localStorage.getItem('favoriteDesigns') || '[]');
          setFavorites(storedFavorites);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);

        // Fall back to localStorage
        try {
          const storedFavorites = JSON.parse(localStorage.getItem('favoriteDesigns') || '[]');
          setFavorites(storedFavorites);
        } catch (lsError) {
          console.error('Failed to load from localStorage:', lsError);
          setFavorites([]);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadFavorites();
  }, [event]);

  // Add click outside handler for share options
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareOptionsRef.current && !shareOptionsRef.current.contains(event.target)) {
        setShowShareOptions(false);
      }
    };

    if (showShareOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareOptions]);

  // Remove a design from favorites
  const handleRemoveFavorite = async (id) => {
    try {
      // Remove from IndexedDB
      await removeFavoriteFromIndexedDB(id);

      // Update state
      const updatedFavorites = favorites.filter(fav => fav.id !== id);
      setFavorites(updatedFavorites);

      // Also update localStorage for compatibility
      try {
        const minimalFavorites = updatedFavorites.map(fav => ({
          id: fav.id,
          roomType: fav.roomType,
          style: fav.style,
          date: fav.date
        }));
        localStorage.setItem('favoriteDesigns', JSON.stringify(minimalFavorites));
      } catch (storageError) {
        console.warn("Could not update localStorage reference:", storageError);
      }

      // Track removal event
      event({
        action: 'design_removed_from_favorites',
        category: 'favorites',
        label: 'removed_from_favorites_page'
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  // Handle opening image in new tab
  const handleOpenImage = async (imageUrl) => {
    if (!imageUrl) {
      console.error('Image URL is missing');
      alert('Sorry, the image URL is missing or invalid. Please try again or create a new design.');
      return;
    }

    // For thumbnails from our new storage approach, convert back to full size if possible
    let fullSizeUrl = imageUrl;
    if (imageUrl.includes('unsplash.com') && (imageUrl.includes('w=200') || imageUrl.includes('q=60'))) {
      // Convert back to high quality
      fullSizeUrl = imageUrl.replace(/w=200/, 'w=1400').replace(/q=60/, 'q=80');
    }

    try {
      // Apply watermark to the image before opening
      const watermarkedImageUrl = await addWatermarkToImage(fullSizeUrl);

      // Validate URL strictly before fetching
      const safeUrl = sanitizeUrl(watermarkedImageUrl);
      if (!safeUrl) throw new Error("Invalid URL");

      // Create a Blob from the watermarked image URL
      // This allows us to open it safely without writing to a blank window's DOM
      const response = await fetch(safeUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Open the blob URL directly
      // Browsers handle Blob URLs safely as they point to local resources
      const newWindow = window.open(blobUrl, '_blank');

      // If popup blocked or failed, alert the user rather than redirecting safely.
      // This prevents "Open Redirect" vulnerabilities.
      if (!newWindow) {
        alert("Pop-up was blocked. Please allow pop-ups to view this image.");
      }

      // Revoke URL after delay to allow page to load
      // 60 seconds should be plenty for the user to view/save it
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);

    } catch (error) {
      console.error('Error applying watermark:', error);

      // Fallback: Sanitize and open original URL
      // This avoids constructing a new window and writing to it
      const safeUrl = sanitizeUrl(fullSizeUrl);
      if (safeUrl) {
        window.open(safeUrl, '_blank');
      } else {
        console.error('Failed to open image: Invalid URL');
        alert("Unable to open image due to an invalid URL.");
      }
    }
  };

  // Open detailed view modal
  const handleViewDesign = (design) => {
    setSelectedDesign(design);
    setShowModal(true);

    // Track view event
    event({
      action: 'view_design_detail',
      category: 'favorites',
      label: 'design_detail_viewed'
    });
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Add a new function to download images
  const handleDownloadImage = async (imageUrl, roomType) => {
    if (!imageUrl) {
      console.error('Image URL is missing');
      alert('Sorry, the image URL is missing or invalid.');
      return;
    }

    try {
      // Generate a filename based on the room type and date
      const fileName = `${roomType.toLowerCase().replace(/\s+/g, '-')}-design-${Date.now()}.jpg`;

      // Use the watermarking utility to download the image
      await downloadImageWithWatermark(imageUrl, fileName);

      // Track download event
      event({
        action: 'design_downloaded',
        category: 'favorites',
        label: 'design_download'
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  // Add a function to handle sharing the design
  const handleShareDesign = async (e, design) => {
    e.stopPropagation();

    // Check if Web Share API is available
    if (navigator.share && !navigator.userAgent.match(/firefox|fxios/i)) { // Firefox has issues with Web Share API
      try {
        const shareTitle = `${design.style} ${design.roomType} Design by Decormind`;
        const shareText = `Check out my ${design.style} style ${design.roomType.toLowerCase()} design created with AI!`;
        const shareUrl = window.location.href;

        // Check if we can share the image directly
        if (design.thumbnailUrl && navigator.canShare && navigator.canShare({ files: [new File([new Blob()], 'test.jpg', { type: 'image/jpeg' })] })) {
          try {
            // Apply watermark to image before sharing
            const watermarkedImageUrl = await addWatermarkToImage(design.thumbnailUrl || design.imageUrl);

            // Fetch the watermarked image
            const response = await fetch(watermarkedImageUrl);
            const blob = await response.blob();
            const file = new File([blob], `${design.roomType.toLowerCase()}_design.jpg`, { type: 'image/jpeg' });

            navigator.share({
              title: shareTitle,
              text: shareText,
              url: shareUrl,
              files: [file]
            })
              .then(() => {
                setShareSuccess(true);
                setShareMessage('Design shared successfully!');

                // Track share event
                event({
                  action: 'design_image_shared',
                  category: 'favorites',
                  label: 'web_share_api_with_image'
                });

                // Hide success message after 3 seconds
                setTimeout(() => {
                  setShareSuccess(false);
                }, 3000);

                // Clean up the object URL
                URL.revokeObjectURL(watermarkedImageUrl);
              })
              .catch((error) => {
                console.error('Error sharing with image:', error);
                // Fallback to sharing without image
                shareWithoutImage();
              });
          } catch (error) {
            console.error('Error applying watermark:', error);
            // Fallback to sharing without image
            shareWithoutImage();
          }
        } else {
          // Share without image
          shareWithoutImage();
        }

        function shareWithoutImage() {
          navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl,
          })
            .then(() => {
              setShareSuccess(true);
              setShareMessage('Design shared successfully!');

              // Track share event
              event({
                action: 'design_shared',
                category: 'favorites',
                label: 'web_share_api'
              });

              // Hide success message after 3 seconds
              setTimeout(() => {
                setShareSuccess(false);
              }, 3000);
            })
            .catch((error) => {
              console.error('Error sharing:', error);
              // If user cancels, don't show the fallback options
              if (error.name !== 'AbortError') {
                setShowShareOptions(true);
                setSelectedDesign(design);
              }
            });
        }
      } catch (error) {
        console.error('Error using Web Share API:', error);
        setShowShareOptions(true);
        setSelectedDesign(design);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      setShowShareOptions(true);
      setSelectedDesign(design);
    }
  };

  // Add a function to handle sharing the design via a selected platform
  const handleShareVia = (platform) => {
    if (!selectedDesign) return;

    const shareTitle = `${selectedDesign.style} ${selectedDesign.roomType} Design by Decormind`;
    const shareText = `Check out my ${selectedDesign.style} style ${selectedDesign.roomType.toLowerCase()} design created with AI!`;
    const shareUrl = window.location.href;

    // ✅ FIXED: Sanitize URL before usage in ANY sink
    const safeShareUrl = sanitizeUrl(shareUrl);

    if (!safeShareUrl) {
      console.error('Invalid share URL');
      return;
    }

    let shareLink = '';

    switch (platform) {
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${safeShareUrl}`)}`;
        window.open(shareLink, '_blank');
        break;

      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(safeShareUrl)}`;
        window.open(shareLink, '_blank');
        break;

      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(safeShareUrl)}`;
        window.open(shareLink, '_blank');
        break;

      case 'copy':
        // Copy link to clipboard
        try {
          navigator.clipboard.writeText(safeShareUrl).then(() => {
            setShareSuccess(true);
            setShareMessage('Link copied to clipboard!');

            // Track copy event
            event({
              action: 'design_link_copied',
              category: 'favorites',
              label: 'clipboard'
            });

            // Hide success message after 3 seconds
            setTimeout(() => {
              setShareSuccess(false);
            }, 3000);
          });
        } catch (err) {
          console.error('Clipboard API failed', err);
          alert("Failed to copy link. Please copy it manually from the address bar.");
        }
        break;

      default:
        console.error('Unknown sharing platform:', platform);
    }

    // Track share event if not copy (which has its own tracking)
    if (platform !== 'copy') {
      event({
        action: 'design_shared',
        category: 'favorites',
        label: platform
      });
    }

    // Hide share options after selecting one
    setShowShareOptions(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-transparent bg-clip-text">
            My Favorite Designs
          </h1>

          <div className="flex gap-3">
            <Button
              onClick={() => router.push('/dashboard')}
              className="bg-zinc-800 hover:bg-zinc-700 text-white transition-colors duration-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Button>

            <Button
              onClick={() => router.push('/redesign')}
              className="bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-white hover:opacity-90 transition-all duration-300"
            >
              Create New Design
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-[#22d3ee] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center shadow-xl">
            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">No favorite designs yet</h2>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Start creating designs and save them to your favorites to see them here.
            </p>
            <Button
              onClick={() => router.push('/redesign')}
              className="bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-white hover:opacity-90 transition-all duration-300"
            >
              Create Your First Design
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:border-[#22d3ee]/50">
                <div
                  key={`image-container-${favorite.id}`}
                  className="relative cursor-pointer h-48 overflow-hidden"
                  onClick={() => handleViewDesign(favorite)}
                >
                  <Image
                    src={favorite.thumbnailUrl || favorite.imageUrl}
                    alt={`${favorite.roomType} design`}
                    className="transition-transform duration-500 hover:scale-110"
                    fill
                    style={{ objectFit: 'cover' }}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  {/* Add DecorMind watermark overlay */}
                  <div className="absolute top-2 right-2 text-white text-sm font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" style={{
                    background: 'linear-gradient(90deg, #1e3a5c, #22d3ee, #4ade80)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}>
                    DecorMind
                  </div>
                  <div key={`overlay-${favorite.id}`} className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div key={`caption-${favorite.id}`} className="p-4 w-full">
                      <p className="text-white font-medium">Click to view full image</p>
                    </div>
                  </div>
                </div>

                <div key={`content-${favorite.id}`} className="p-4">
                  <div key={`header-${favorite.id}`} className="flex justify-between items-start mb-3">
                    <div key={`info-${favorite.id}`}>
                      <h3 className="text-lg font-medium text-white">{favorite.roomType} Design</h3>
                      <p className="text-zinc-400 text-sm">{favorite.style} Style</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        key={`share-btn-${favorite.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareDesign(e, favorite);
                        }}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-full transition-colors duration-300 group relative"
                        title="Share design"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                          Share Design
                        </span>
                      </button>
                      <button
                        key={`remove-btn-${favorite.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFavorite(favorite.id);
                        }}
                        className="bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-full transition-colors duration-300 group relative"
                        title="Remove from favorites"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                          Remove from favorites
                        </span>
                      </button>
                    </div>
                  </div>

                  <p key={`date-${favorite.id}`} className="text-zinc-500 text-xs">
                    Saved on {new Date(favorite.date).toLocaleDateString()}
                  </p>

                  <div key={`actions-${favorite.id}`} className="mt-4 flex justify-between">
                    <Button
                      key={`view-btn-${favorite.id}`}
                      onClick={() => handleViewDesign(favorite)}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white transition-colors duration-300 text-sm"
                    >
                      View Design
                    </Button>

                    <Button
                      key={`similar-btn-${favorite.id}`}
                      onClick={() => router.push('/redesign')}
                      className="bg-[#22d3ee] text-black hover:bg-[#22d3ee]/90 transition-all duration-300 text-sm"
                    >
                      Create Similar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed View Modal */}
      {showModal && selectedDesign && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-zinc-800">
              <h3 className="text-xl font-bold text-white">{selectedDesign.roomType} Design</h3>
              <button
                onClick={handleCloseModal}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-grow">
              <div className="relative">
                <div className="relative w-full h-[70vh]">
                  <Image
                    src={selectedDesign.thumbnailUrl || selectedDesign.imageUrl}
                    alt={`${selectedDesign.roomType} design`}
                    fill
                    style={{ objectFit: 'contain' }}
                    onContextMenu={(e) => e.preventDefault()}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                    }}
                  />
                  {/* Add DecorMind watermark overlay */}
                  <div className="absolute top-4 right-4 text-white text-sm font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" style={{
                    background: 'linear-gradient(90deg, #1e3a5c, #22d3ee, #4ade80)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}>
                    DecorMind
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-zinc-400 text-sm mb-1">Style</h4>
                    <p className="text-white text-lg">{selectedDesign.style}</p>
                  </div>
                  <div>
                    <h4 className="text-zinc-400 text-sm mb-1">Saved On</h4>
                    <p className="text-white">{new Date(selectedDesign.date).toLocaleDateString()}</p>
                  </div>
                </div>

                {shareSuccess && (
                  <div className="bg-blue-900/30 text-blue-200 p-3 rounded-lg mb-4 text-sm flex items-center w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {shareMessage || 'Design shared successfully!'}
                  </div>
                )}

                {showShareOptions && (
                  <div ref={shareOptionsRef} className="bg-zinc-800 p-3 rounded-lg mb-4 w-full">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-zinc-300 text-sm">Share via:</p>
                      <button
                        onClick={() => setShowShareOptions(false)}
                        className="text-zinc-400 hover:text-white"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleShareVia('whatsapp')}
                        className="bg-[#25D366] hover:bg-opacity-90 text-white p-2 rounded-md transition-colors duration-300 flex items-center gap-1 text-sm"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp
                      </button>
                      <button
                        onClick={() => handleShareVia('facebook')}
                        className="bg-[#1877F2] hover:bg-opacity-90 text-white p-2 rounded-md transition-colors duration-300 flex items-center gap-1 text-sm"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                      </button>
                      <button
                        onClick={() => handleShareVia('twitter')}
                        className="bg-[#1DA1F2] hover:bg-opacity-90 text-white p-2 rounded-md transition-colors duration-300 flex items-center gap-1 text-sm"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShareVia('copy')}
                        className="bg-zinc-600 hover:bg-zinc-500 text-white p-2 rounded-md transition-colors duration-300 flex items-center gap-1 text-sm"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                        </svg>
                        Copy Link
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadImage(selectedDesign.thumbnailUrl || selectedDesign.imageUrl, selectedDesign.roomType);
                    }}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white transition-colors duration-300 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </Button>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareDesign(e, selectedDesign);
                    }}
                    className="bg-zinc-700 hover:bg-zinc-600 text-white transition-colors duration-300 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </Button>

                  <Button
                    onClick={() => {
                      router.push('/redesign');
                      handleCloseModal();
                    }}
                    className="bg-[#22d3ee] text-black hover:bg-[#22d3ee]/90 transition-all duration-300"
                  >
                    Create Similar Design
                  </Button>
                </div>

                {/* Add feedback form to modal */}
                <div className="mt-8">
                  <FeedbackForm
                    designId={selectedDesign.id}
                    roomType={selectedDesign.roomType}
                    styleType={selectedDesign.style}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile share button - fixed to bottom on small screens */}
      {favorites.length > 0 && !showModal && (
        <div className="md:hidden fixed bottom-4 right-4 z-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (favorites.length > 0) {
                handleShareDesign(e, favorites[0]);
              }
            }}
            className="bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-white p-3 rounded-full shadow-lg hover:opacity-90 transition-all duration-300"
            aria-label="Share design"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// Server component (page.js)
export default function FavoritesPage() {
  return (
    <Suspense fallback={<div>Loading favorites...</div>}>
      <FavoritesContent />
    </Suspense>
  );
}
