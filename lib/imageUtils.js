/**
 * Utility functions for image processing
 */

/**
 * Sanitizes a URL to prevent XSS attacks
 * Returns the URL string if valid (http/https only), or null if invalid
 * 
 * @param {string} urlString - The URL string to sanitize
 * @returns {string|null} - The sanitized URL or null if invalid
 */
export function sanitizeUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return null;
  }

  try {
    const url = new URL(urlString);
    // Only allow http and https protocols to prevent javascript: and data: XSS
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.toString();
    }
    // Also allow blob: URLs since we create them ourselves for watermarked images
    if (url.protocol === 'blob:') {
      return url.toString();
    }
    return null;
  } catch (_) {
    return null;
  }
}

/**
 * Adds a text watermark to an image URL and returns a new Blob URL
 * 
 * @param {string} imageUrl - The URL of the image to add watermark to
 * @returns {Promise<string>} - A Promise that resolves to the URL of the watermarked image
 */
export async function addWatermarkToImage(imageUrl) {
  return new Promise((resolve, reject) => {
    // Sanitize URL to prevent XSS attacks
    const safeUrl = sanitizeUrl(imageUrl);
    if (!safeUrl) {
      reject(new Error('Invalid image URL: URL must use http, https, or blob protocol'));
      return;
    }

    const image = new Image();

    // Handle CORS issues
    image.crossOrigin = "Anonymous";

    image.onload = () => {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set canvas dimensions to match the image
      canvas.width = image.width;
      canvas.height = image.height;

      // Draw the original image on the canvas
      ctx.drawImage(image, 0, 0);

      // Create text watermark
      const padding = 20;
      const fontSize = Math.min(Math.max(image.width * 0.025, 16), 32); // Responsive font size

      // Add watermark text in the top right corner
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;

      // Create gradient for text
      const textWidth = ctx.measureText('DecorMind').width;
      const textX = image.width - textWidth - padding;
      const textY = padding + fontSize;

      const gradient = ctx.createLinearGradient(textX, textY - fontSize, textX + textWidth, textY - fontSize);
      gradient.addColorStop(0, '#1e3a5c');
      gradient.addColorStop(0.5, '#22d3ee');
      gradient.addColorStop(1, '#4ade80');

      // Add a slight shadow for better visibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Draw the text
      ctx.fillStyle = gradient;
      ctx.fillText('DecorMind', textX, textY);

      // Convert canvas to blob and create URL
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          reject(new Error('Failed to create image blob'));
        }
      }, 'image/jpeg', 0.95);
    };

    image.onerror = () => {
      reject(new Error('Failed to load image for watermarking'));
    };

    // Start loading the image with sanitized URL
    image.src = safeUrl;
  });
}

/**
 * Downloads an image with a watermark
 * 
 * @param {string} imageUrl - The URL of the image to download
 * @param {string} fileName - The name to save the file as
 * @returns {Promise<void>}
 */
export async function downloadImageWithWatermark(imageUrl, fileName) {
  try {
    // Add watermark to the image
    const watermarkedImageUrl = await addWatermarkToImage(imageUrl);

    // Create a temporary anchor element for download
    const link = document.createElement('a');
    link.href = watermarkedImageUrl;
    link.download = fileName || 'decorated-image.jpg';

    // Append to body, click, then remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the object URL after a short delay
    setTimeout(() => {
      URL.revokeObjectURL(watermarkedImageUrl);
    }, 100);

  } catch (error) {
    console.error('Error downloading image with watermark:', error);
    throw error;
  }
} 