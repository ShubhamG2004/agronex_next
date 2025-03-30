'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const IMAGES = [
    { src: "/assets/Imgslider/Img1.png", alt: "Apple_Black_rot" },
    { src: "/assets/Imgslider/Img2.png", alt: "Apple_cedar_Apple_rot" },
    { src: "/assets/Imgslider/Img3.png", alt: "Cherry_Powdery_Mildew" },
    { src: "/assets/Imgslider/Img4.png", alt: "Corn_(Maize)_common_rust"},
    { src: "/assets/Imgslider/Img5.png", alt: "Graph_Black_rot"},
    { src: "/assets/Imgslider/Img6.png", alt: "Orane_Haunglongbing"},
    { src: "/assets/Imgslider/Img7.png", alt: "Strawberry_Leaf_Scorch"},
    { src: "/assets/Imgslider/Imh8.png", alt: "Tomato_Leaf_Mold"},
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % IMAGES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + IMAGES.length) % IMAGES.length);
  }, []);

  useEffect(() => {
    if (isHovered || isMobile) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide, isMobile]);

  const leftIndex = (currentIndex - 1 + IMAGES.length) % IMAGES.length;
  const rightIndex = (currentIndex + 1) % IMAGES.length;

  const Slide = ({ index, className, onClick, isMain = false }) => (
    <motion.div
      className={`relative ${className} cursor-pointer rounded-[10px] shadow-xl overflow-hidden`}
      onClick={onClick}
      initial={{ opacity: isMain ? 1 : 0.8, y: isMain ? 0 : 20 }}
      whileHover={{ opacity: 1, y: 0, ...(isMain && { y: -10 }) }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container */}
      <div className="absolute inset-0 h-full w-full border border-black-300 rounded-[10px]">
        <Image
          src={IMAGES[index].src}
          alt={IMAGES[index].alt}
          fill
          loading={isMain ? "eager" : "lazy"}
          priority={isMain}
          quality={isMain ? 100 : 75}
          className="object-cover object-center rounded-[10px]"
          sizes={isMain ? "(max-width: 768px) 100vw, 40vw" : "(max-width: 768px) 100vw, 30vw"}
        />
      </div>
      
      {/* Gradient Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/${isMain ? '60' : '50'} to-transparent z-10 rounded-[10px]`}
      />
      
      {/* Text Content */}
      <div 
        className={`absolute ${isMain ? 'bottom-6 left-6' : 'bottom-4 left-4'} text-white z-20`}
        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
      >
        {isMain ? (
          <>
            <h3 className="text-2xl font-bold">{IMAGES[index].alt}</h3>
            <p className="text-md opacity-90 mt-1">
              {index + 1} / {IMAGES.length}
            </p>
          </>
        ) : (
          <p className="text-sm font-medium">{IMAGES[index].alt}</p>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="w-full">
      {/* Header Section with responsive text size */}
      <div className="text-center mb-2 md:mb-4">
        <h1 className="text-3xl md:text-5xl font-bold text-green-900">Result & Accuracy</h1>
      </div>

      {/* Slider Section */}
      <div 
        className="relative w-full max-w-6xl mx-auto overflow-visible py-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex items-end justify-center gap-2 md:gap-6 h-[500px] md:h-[800px]">
          {/* Left Slide - hidden on mobile */}
          {!isMobile && (
            <Slide index={leftIndex} className="w-0 md:w-[30%] h-[400px] md:h-[650px]" onClick={prevSlide} />
          )}
          
          {/* Main Slide - full width on mobile */}
          <Slide 
            index={currentIndex} 
            className={`${isMobile ? 'w-full' : 'w-[35%]'} h-[500px] md:h-[800px] rounded-3xl shadow-2xl`} 
            isMain 
          />
          
          {/* Right Slide - hidden on mobile */}
          {!isMobile && (
            <Slide index={rightIndex} className="w-0 md:w-[30%] h-[400px] md:h-[650px]" onClick={nextSlide} />
          )}
        </div>

        {/* Navigation Arrows - always visible but styled differently on mobile */}
        <button 
          onClick={prevSlide}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 md:p-4 shadow-2xl rounded-full transition-all duration-300 hover:scale-110 z-30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 md:p-4 shadow-2xl rounded-full transition-all duration-300 hover:scale-110 z-30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        {/* Indicators - always visible */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
          {IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50 w-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;