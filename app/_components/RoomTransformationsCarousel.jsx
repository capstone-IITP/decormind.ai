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

const RoomTransformationsCarousel = ({ onSeeMoreClick }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeRoomType, setActiveRoomType] = useState('kitchen');
  const [isMobile, setIsMobile] = useState(false);

  // Room transformations data
  const roomTransformations = {
    kitchen: [
      {
        id: 1,
        beforeImage: '/images/traditional-kitchen.jpg',
        afterImage: '/images/luxury-kitchen.jpg',
        beforeTitle: 'Traditional Kitchen',
        afterTitle: 'Modern Luxury Kitchen'
      },
      {
        id: 2,
        beforeImage: '/images/outdated-kitchen.jpg',
        afterImage: '/images/scandinavian-kitchen.jpg',
        beforeTitle: 'Outdated Kitchen',
        afterTitle: 'Scandinavian Kitchen'
      },
      {
        id: 3,
        beforeImage: '/images/basic-kitchen.jpg',
        afterImage: '/images/industrial-kitchen.jpg',
        beforeTitle: 'Basic Kitchen',
        afterTitle: 'Industrial Kitchen'
      }
    ],
    livingRoom: [
      {
        id: 1,
        beforeImage: '/images/traditional-living-room.jpg',
        afterImage: '/images/modern-living-room.jpg',
        beforeTitle: 'Traditional Living Room',
        afterTitle: 'Modern Living Room'
      },
      {
        id: 2,
        beforeImage: '/images/outdated-living-room.jpg',
        afterImage: '/images/scandinavian-living-room.jpg',
        beforeTitle: 'Outdated Living Room',
        afterTitle: 'Scandinavian Living Room'
      },
      {
        id: 3,
        beforeImage: '/images/basic-living-room.jpg',
        afterImage: '/images/industrial-living-room.jpg',
        beforeTitle: 'Basic Living Room',
        afterTitle: 'Industrial Living Room'
      }
    ],
    bedroom: [
      {
        id: 1,
        beforeImage: '/images/traditional-bedroom.jpg',
        afterImage: '/images/modern-bedroom.jpg',
        beforeTitle: 'Traditional Bedroom',
        afterTitle: 'Modern Bedroom'
      },
      {
        id: 2,
        beforeImage: '/images/outdated-bedroom.jpg',
        afterImage: '/images/scandinavian-bedroom.jpg',
        beforeTitle: 'Outdated Bedroom',
        afterTitle: 'Scandinavian Bedroom'
      },
      {
        id: 3,
        beforeImage: '/images/basic-bedroom.jpg',
        afterImage: '/images/minimalist-bedroom.jpg',
        beforeTitle: 'Basic Bedroom',
        afterTitle: 'Minimalist Bedroom'
      }
    ],
    bathroom: [
      {
        id: 1,
        beforeImage: '/images/traditional-bathroom.jpg',
        afterImage: '/images/modern-bathroom.jpg',
        beforeTitle: 'Traditional Bathroom',
        afterTitle: 'Modern Bathroom'
      },
      {
        id: 2,
        beforeImage: '/images/outdated-bathroom.jpg',
        afterImage: '/images/luxury-bathroom.jpg',
        beforeTitle: 'Outdated Bathroom',
        afterTitle: 'Luxury Bathroom'
      },
      {
        id: 3,
        beforeImage: '/images/basic-bathroom.jpg',
        afterImage: '/images/minimalist-bathroom.jpg',
        beforeTitle: 'Basic Bathroom',
        afterTitle: 'Minimalist Bathroom'
      }
    ],
    homeOffice: [
      {
        id: 1,
        beforeImage: '/images/traditional-home-office.jpg',
        afterImage: '/images/modern-home-office.jpg',
        beforeTitle: 'Traditional Home Office',
        afterTitle: 'Modern Home Office'
      },
      {
        id: 2,
        beforeImage: '/images/cluttered-home-office.jpg',
        afterImage: '/images/scandinavian-home-office.jpg',
        beforeTitle: 'Cluttered Home Office',
        afterTitle: 'Scandinavian Home Office'
      },
      {
        id: 3,
        beforeImage: '/images/basic-home-office.jpg',
        afterImage: '/images/industrial-home-office.jpg',
        beforeTitle: 'Basic Home Office',
        afterTitle: 'Industrial Home Office'
      }
    ],
    diningRoom: [
      {
        id: 1,
        beforeImage: '/images/traditional-dining-room.jpg',
        afterImage: '/images/modern-dining-room.jpg',
        beforeTitle: 'Traditional Dining Room',
        afterTitle: 'Modern Dining Room'
      },
      {
        id: 2,
        beforeImage: '/images/outdated-dining-room.jpg',
        afterImage: '/images/scandinavian-dining-room.jpg',
        beforeTitle: 'Outdated Dining Room',
        afterTitle: 'Scandinavian Dining Room'
      },
      {
        id: 3,
        beforeImage: '/images/basic-dining-room.jpg',
        afterImage: '/images/industrial-dining-room.jpg',
        beforeTitle: 'Basic Dining Room',
        afterTitle: 'Industrial Dining Room'
      }
    ]
  };

  // Room type tabs
  const roomTypes = [
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'livingRoom', label: 'Living Room' },
    { id: 'bedroom', label: 'Bedroom' },
    { id: 'bathroom', label: 'Bathroom' },
    { id: 'homeOffice', label: 'Home Office' },
    { id: 'diningRoom', label: 'Dining Room' }
  ];

  useEffect(() => {
    setMounted(true);

    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Listen for resize events
    window.addEventListener('resize', checkMobile);

    // Add optimized styles for the carousel with minimal animations
    const style = document.createElement('style');
    style.textContent = `
      .room-carousel .swiper-pagination {
        top: 5px;
        position: relative;
      }
      
      .room-carousel .swiper-pagination-bullet {
        background-color: #C5A790;
        opacity: 0.5;
      }
      
      .room-carousel .swiper-pagination-bullet-active {
        opacity: 1;
      }
      
      .room-carousel .swiper-button-next,
      .room-carousel .swiper-button-prev {
        color: #C5A790;
        background: rgba(0, 0, 0, 0.3);
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      
      .room-carousel .swiper-button-next:after,
      .room-carousel .swiper-button-prev:after {
        font-size: 18px;
      }
      
      .room-carousel .swiper-button-disabled {
        opacity: 0.3;
      }
      
      .fade-in {
        opacity: 1;
        transition: opacity 0.3s;
      }
      
      .room-type-tab {
        transition: color 0.3s;
        position: relative;
      }

      .room-type-tab.active {
        color: #C5A790;
      }

      /* Mobile styles */
      @media (max-width: 767px) {
        .room-carousel .swiper-button-next,
        .room-carousel .swiper-button-prev {
          width: 30px;
          height: 30px;
        }
        
        .room-carousel .swiper-button-next:after,
        .room-carousel .swiper-button-prev:after {
          font-size: 14px;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  // Get the title based on active room type
  const getRoomTypeTitle = () => {
    const roomType = roomTypes.find(type => type.id === activeRoomType);
    return roomType ? roomType.label : 'Room';
  };

  // Get description based on active room type
  const getRoomTypeDescription = () => {
    switch (activeRoomType) {
      case 'kitchen':
        return 'See how our AI transforms ordinary kitchens into extraordinary culinary spaces. From modern minimalist to cozy traditional designs.';
      case 'livingRoom':
        return 'Transform your living room into a stylish and comfortable space. From contemporary to traditional, see how AI can reimagine your living area.';
      case 'bedroom':
        return 'Create the perfect bedroom retreat with our AI designer. From serene minimalist to luxurious comfort, see stunning bedroom transformations.';
      case 'bathroom':
        return 'Upgrade your bathroom with stunning AI-generated designs. From spa-like retreats to modern functional spaces, see the possibilities.';
      case 'homeOffice':
        return 'Convert any space into a productive home office with our AI designer. From modern to industrial styles, see how to create the perfect work environment.';
      case 'diningRoom':
        return 'Reimagine your dining area with our AI designer. From elegant formal spaces to cozy breakfast nooks, see beautiful dining room transformations.';
      default:
        return 'See how our AI transforms ordinary spaces into extraordinary rooms with personalized designs.';
    }
  };

  // Get button text based on active room type
  const getButtonText = () => {
    return `See More ${getRoomTypeTitle()} Designs`;
  };

  return (
    <div className="room-carousel px-4 md:px-0">
      <div className="text-center mb-8 md:mb-12 fade-in scale-in">
        <h2 id='title' className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">{getRoomTypeTitle()} Transformations</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
          {getRoomTypeDescription()}
        </p>
      </div>

      {/* Room type tabs - Scrollable on mobile */}
      <div className="flex overflow-x-auto md:justify-center gap-4 md:gap-6 mb-6 md:mb-8 pb-2 md:pb-0 hide-scrollbar">
        {roomTypes.map((type) => (
          <button
            key={type.id}
            className={`room-type-tab px-2 py-1 text-base md:text-lg font-medium whitespace-nowrap ${activeRoomType === type.id ? 'active text-[#C5A790]' : 'text-white'}`}
            onClick={() => {
              // Add animation class to the content when switching room types
              const contentElement = document.querySelector('.room-content');
              if (contentElement) {
                contentElement.classList.remove('scale-in');
                contentElement.classList.remove('slide-in');
                // Force a reflow to restart the animation
                void contentElement.offsetWidth;
                contentElement.classList.add('scale-in');
                contentElement.classList.add('slide-in');
              }
              setActiveRoomType(type.id);
            }}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="room-content scale-in slide-in">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          className="mb-8 md:mb-10"
          key={activeRoomType} // Force re-render when room type changes
        >
          {roomTransformations[activeRoomType].map((item) => (
            <SwiperSlide key={item.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="relative h-64 sm:h-72 md:h-80 rounded-xl overflow-hidden group">
                  <Image
                    src={item.beforeImage}
                    alt={`${item.beforeTitle} Before`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover rounded-xl transition-all duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-4 md:p-6">
                      <span className="bg-[#C5A790] text-slate-800 px-2 py-1 rounded-full text-xs md:text-sm font-medium">Before</span>
                      <h3 className="text-lg md:text-xl font-bold text-white mt-2">{item.beforeTitle}</h3>
                    </div>
                  </div>
                </div>

                <div className="relative h-64 sm:h-72 md:h-80 rounded-xl overflow-hidden group">
                  <Image
                    src={item.afterImage}
                    alt={`${item.afterTitle} After`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover rounded-xl transition-all duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-4 md:p-6">
                      <span className="bg-[#C5A790] text-slate-800 px-2 py-1 rounded-full text-xs md:text-sm font-medium">After</span>
                      <h3 className="text-lg md:text-xl font-bold text-white mt-2">{item.afterTitle}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="text-center fade-in">
        <Button
          className="w-full sm:w-auto bg-[#C5A790] text-slate-800 hover:bg-[#b0927a]"
          onClick={() => onSeeMoreClick(activeRoomType)}
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
};

export default RoomTransformationsCarousel;