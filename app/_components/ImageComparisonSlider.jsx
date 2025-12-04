"use client";

import React, { useState, useRef, useEffect } from 'react';

export default function ImageComparisonSlider({ originalImage, generatedImage, darkMode = true }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // Dynamically determine styling based on darkMode prop
  const containerStyle = darkMode
    ? "border-zinc-800 bg-zinc-900"
    : "border-gray-200 bg-white";

  const textColorStyle = darkMode
    ? "text-zinc-200"
    : "text-gray-700";

  const subTextColorStyle = darkMode
    ? "text-zinc-400"
    : "text-gray-500";

  const hintTextColorStyle = darkMode
    ? "text-zinc-500"
    : "text-gray-400";

  // Colors for the indicators
  const originalFillColor = darkMode ? "#d4d4d8" : "#6b7280";
  const aiFillColor = "#C5A790";

  // Determine which side is active based on slider position
  const isOriginalActive = sliderPosition < 50;
  const isAIActive = sliderPosition > 50;

  // Handle mouse and touch events
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = (x / rect.width) * 100;

    if (position >= 0 && position <= 100) {
      setSliderPosition(position);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const position = (x / rect.width) * 100;

    if (position >= 0 && position <= 100) {
      setSliderPosition(position);
    }
  };

  // Set up event listeners
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <div className="w-full space-y-2">
      <div
        ref={containerRef}
        className={`relative rounded-lg overflow-hidden border ${containerStyle} shadow-lg max-w-3xl mx-auto bg-transparent h-[300px] md:h-[400px]`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchStart={handleMouseDown}
        onTouchMove={handleTouchMove}
      >
        {/* Original image (left side) */}
        <div
          className="absolute top-0 left-0 h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${originalImage})`,
            width: '100%',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundColor: darkMode ? '#111' : '#f8f8f8'
          }}
        />

        {/* Generated image (right side) - clipped by slider */}
        <div
          className="absolute top-0 left-0 h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${generatedImage})`,
            width: `${sliderPosition}%`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundColor: darkMode ? '#111' : '#f8f8f8'
          }}
        />

        {/* Slider line */}
        <div
          className="absolute top-0 h-full w-0.5 bg-[#C5A790] cursor-ew-resize flex items-center justify-center z-10"
          style={{ left: `calc(${sliderPosition}% - 1px)` }}
        >
          <div className="w-8 h-8 rounded-full bg-[#C5A790] flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.5 8L9 5.5v5L11.5 8zM4.5 8L7 10.5v-5L4.5 8z" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">Before</div>
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">After</div>
      </div>

      <div className={`flex justify-center items-center space-x-6 text-xs sm:text-sm ${subTextColorStyle} mt-1`}>
        <div className={`flex items-center transition-colors duration-300 ${isOriginalActive ? 'font-medium ' + textColorStyle : ''}`}>
          <div
            className="w-2 h-2 md:w-3 md:h-3 rounded-full mr-1 md:mr-2 transition-all duration-300"
            style={{
              backgroundColor: isOriginalActive ? originalFillColor : (darkMode ? '#333' : '#d1d5db'),
              boxShadow: isOriginalActive ? `0 0 4px ${originalFillColor}` : 'none'
            }}
          ></div>
          <span>Original Room</span>
        </div>
        <div className={`flex items-center transition-colors duration-300 ${isAIActive ? 'font-medium ' + textColorStyle : ''}`}>
          <div
            className="w-2 h-2 md:w-3 md:h-3 rounded-full mr-1 md:mr-2 transition-all duration-300"
            style={{
              backgroundColor: isAIActive ? aiFillColor : (darkMode ? '#333' : '#d1d5db'),
              boxShadow: isAIActive ? `0 0 4px ${aiFillColor}` : 'none'
            }}
          ></div>
          <span>AI Design</span>
        </div>
      </div>

      <p className={`text-xs ${hintTextColorStyle} text-center mt-1`}>
        Drag the slider to compare
      </p>
    </div>
  );
} 