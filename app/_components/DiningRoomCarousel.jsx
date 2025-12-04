'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const DiningRoomCarousel = ({ onSeeMoreClick }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Dining room transformations data
  const diningRoomTransformations = [
    {
      id: 1,
      beforeImage: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1400&auto=format&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1400&auto=format&fit=crop',
      beforeTitle: 'Traditional Dining Room',
      afterTitle: 'Modern Dining Room'
    },
    {
      id: 2,
      beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1615968679312-9b7ed9f04e79?q=80&w=1400&auto=format&fit=crop',
      beforeTitle: 'Outdated Dining Room',
      afterTitle: 'Scandinavian Dining Room'
    },
    {
      id: 3,
      beforeImage: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1400&auto=format&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?q=80&w=1400&auto=format&fit=crop',
      beforeTitle: 'Basic Dining Room',
      afterTitle: 'Industrial Dining Room'
    }
  ];

  useEffect(() => {
    setMounted(true);

    // Add custom styles for the carousel
    const style = document.createElement('style');
    style.textContent = `
      .dining-room-carousel .swiper-pagination {
        top: 5px;
        position: relative;
      }
      
      .dining-room-carousel .swiper-pagination-bullet {
        background-color: #C5A790;
        opacity: 0.5;
      }
      
      .dining-room-carousel .swiper-pagination-bullet-active {
        opacity: 1;
        transform: scale(1.2);
      }
      
      .dining-room-carousel .swiper-button-next,
      .dining-room-carousel .swiper-button-prev {
        color: #C5A790;
        background: rgba(0, 0, 0, 0.3);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .dining-room-carousel .swiper-button-next:after,
      .dining-room-carousel .swiper-button-prev:after {
        font-size: 18px;
        font-weight: bold;
      }
      
      .dining-room-carousel .swiper-button-disabled {
        opacity: 0.3;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .fade-in {
        animation: fadeIn 0.5s ease-out forwards;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="dining-room-carousel">

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="mb-10"
      >
        {diningRoomTransformations.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative h-80 rounded-xl overflow-hidden group">
                <Image
                  src={item.beforeImage}
                  alt={`${item.beforeTitle} Before`}
                  fill
                  priority
                  className="object-cover rounded-xl transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <span className="bg-[#C5A790] text-slate-800 px-3 py-1 rounded-full text-sm font-medium">Before</span>
                    <h3 className="text-xl font-bold text-white mt-2">{item.beforeTitle}</h3>
                  </div>
                </div>
              </div>

              <div className="relative h-80 rounded-xl overflow-hidden group">
                <Image
                  src={item.afterImage}
                  alt={`${item.afterTitle} After`}
                  fill
                  priority
                  className="object-cover rounded-xl transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <span className="bg-[#C5A790] text-slate-800 px-3 py-1 rounded-full text-sm font-medium">After</span>
                    <h3 className="text-xl font-bold text-white mt-2">{item.afterTitle}</h3>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="text-center fade-in">
        <Button
          className="bg-[#C5A790] text-slate-800 hover:bg-[#b0927a]"
          onClick={onSeeMoreClick}
        >
          See More Dining Room Designs
        </Button>
      </div>
    </div>
  );
};

export default DiningRoomCarousel;