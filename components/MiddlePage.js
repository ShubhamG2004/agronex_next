"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function MiddlePage() {
  const images = [
    "/assets/Disease/img1.png",
    "/assets/Disease/img2.png",
    "/assets/Disease/img3.png",
    "/assets/Disease/img4.png",
    "/assets/Disease/img5.png",
    "/assets/Disease/img6.png",
    "/assets/Disease/img7.png",
    "/assets/Disease/img8.png",
  ];

  const [scrollIndex, setScrollIndex] = useState(0);

  // Auto-scroll every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleScroll("down");
    }, 2000);

    return () => clearInterval(interval);
  }, [scrollIndex]);

  const handleScroll = (direction) => {
    if (direction === "up") {
      setScrollIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    } else {
      setScrollIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-center p-6 bg-gray-100">
      {/* Left Section - Paragraph */}
      <div className="w-full md:w-1/2 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-green-800">
          Why Vertical Sliders Matter?
        </h2>
        <p className="text-lg leading-relaxed text-gray-700">
          Vertical sliders provide an <strong>interactive and engaging</strong> way to 
          showcase content. They allow users to smoothly navigate through 
          multiple images without overwhelming them. Using <strong>Framer Motion</strong>, 
          this slider ensures <strong>seamless transitions</strong>, enhancing user experience.
        </p>
      </div>

      {/* Right Section - Vertical Image Slider */}
      <div className="w-full md:w-1/2 h-[350px] flex flex-col items-center relative overflow-hidden">
        {/* Images Slider */}
        <motion.div
          className="w-56 h-full flex flex-col items-center space-y-4" // Added space between images
          animate={{ y: -scrollIndex * 200 }} // Adjusted for proper spacing
          transition={{ type: "spring", stiffness: 100, damping: 12 }}
        >
          {images.map((src, index) => (
            <motion.img
              key={index}
              src={src}
              alt={`Image ${index + 1}`}
              className={`w-48 object-cover rounded-lg shadow-md transition-all duration-500 ${
                index === scrollIndex
                  ? "h-[180px] scale-110 z-10 opacity-100" // Main image in center
                  : index === scrollIndex - 1 || (scrollIndex === 0 && index === images.length - 1)
                  ? "h-[130px] opacity-60" // Top previous image with spacing
                  : index === scrollIndex + 1 || (scrollIndex === images.length - 1 && index === 0)
                  ? "h-[130px] opacity-60" // Bottom next image with spacing
                  : "opacity-0"
              }`}
            />
          ))}
        </motion.div>

        {/* Navigation Buttons */}
        <button
          onClick={() => handleScroll("up")}
          className="absolute top-2 bg-green-600 text-white p-2 rounded-full shadow-lg"
        >
          ↑
        </button>
        <button
          onClick={() => handleScroll("down")}
          className="absolute bottom-2 bg-green-600 text-white p-2 rounded-full shadow-lg"
        >
          ↓
        </button>
      </div>
    </div>
  );
}
