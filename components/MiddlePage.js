"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function MiddlePage() {
  const images = [
    { src: "/assets/Disease/img1.png", label: "Cherry Powdery Mildew" },
    { src: "/assets/Disease/img2.png", label: "Bacterial Leaf Blight" },
    { src: "/assets/Disease/img3.png", label: "Peach Backterial Spot" },
    { src: "/assets/Disease/img4.png", label: "Rust Disease" },
    { src: "/assets/Disease/img5.png", label: "Alternaria Leaf Spot" },
    { src: "/assets/Disease/img6.png", label: "Strawberry Leaf scorch" },
    { src: "/assets/Disease/img7.png", label: "Squash Powdery mildew" },
    { src: "/assets/Disease/img8.png", label: "Tomato Late Blight" },
  ];

  const [scrollIndex, setScrollIndex] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollIndex < images.length - 1) {
        setScrollIndex((prev) => prev + 1);
      } else {
        setIsResetting(true);
        setTimeout(() => {
          setScrollIndex(0);
          setIsResetting(false);
        }, 1000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [scrollIndex]);

  return (
    <div className="w-full flex flex-col md:flex-row items-center p-6 bg-green-800 gap-2">
      <h1 className="text-5xl font-bold text-center text-green-900 mb-5">
        Explore The Blogs
      </h1>
      
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
      <div className="relative w-full md:w-1/2 h-96 flex flex-col items-center overflow-hidden">
        <motion.div
          className="h-full flex flex-col"
          animate={{ translateY: isResetting ? "0%" : `-${scrollIndex * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {images.map((image, index) => (
            <div key={index} className="relative w-full h-96 flex flex-col items-center">
              <div className="absolute top-0 w-full bg-black bg-opacity-50 text-white text-center py-2 rounded-t-lg">
                {image.label}
              </div>
              <img src={image.src} className="w-full h-96 object-cover rounded-lg" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}