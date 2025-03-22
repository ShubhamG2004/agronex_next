"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function MiddlePage() {
  const images = [
    { src: "/assets/Disease/img1.png", label: "Cherry Powdery Mildew" },
    { src: "/assets/Disease/img2.png", label: "Bacterial Leaf Blight" },
    { src: "/assets/Disease/img3.png", label: "Peach Bacterial Spot" },
    { src: "/assets/Disease/img4.png", label: "Rust Disease" },
    { src: "/assets/Disease/img5.png", label: "Alternaria Leaf Spot" },
    { src: "/assets/Disease/img6.png", label: "Strawberry Leaf Scorch" },
    { src: "/assets/Disease/img7.png", label: "Squash Powdery Mildew" },
    { src: "/assets/Disease/img8.png", label: "Tomato Late Blight" },
  ];

  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col md:flex-row items-center p-6 bg-green-800 gap-4">
      
      {/* Left Section - Features */}
      <div className="w-full md:w-1/2 p-6  rounded-lg ">
        <h1 className="text-5xl font-bold text-center text-yellow-500 mb-5">
          Key Features 
        </h1>

        <div className="text-lg leading-relaxed text-gray-100 space-y-3">
          <p><strong>✅ 40+ Classes</strong> for Plant Disease Identification.</p>
          <p><strong>✅ 77,000+ Images</strong> used to train the AI model for high accuracy.</p>
          <p><strong>✅ Detailed Causes</strong> and descriptions for each disease.</p>
          <p><strong>✅ AI-Powered Diagnosis</strong> for real-time plant health analysis.</p>
          <p><strong>✅ Prevention Tips</strong> to help farmers and gardeners take proactive measures.</p>
          <p><strong>✅ Data Insights</strong> with statistical analysis of common diseases.</p>
        </div>
      </div>

      {/* Right Section - Larger Horizontal Image Slider */}
      <div className="relative w-full md:w-1/2 h-50 overflow-hidden">
        <motion.div
          className="h-full flex"
          animate={{ translateX: `-${scrollIndex * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {images.map((image, index) => (
            <div key={index} className="relative w-full h-50 flex-shrink-0 flex flex-col items-center">
              <div className="absolute top-0 w-[80%] bg-white bg-opacity-80 text-black-500 font-bold text-center py-2 rounded-t-lg">
                {image.label}
              </div>
              <img 
                src={image.src} 
                alt={image.label} 
                className="w-[80%] h-80 object-cover rounded-lg" 
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
