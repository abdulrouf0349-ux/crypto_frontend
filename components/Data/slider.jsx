"use client";
import React, { useState, useEffect } from "react";

export default function Slider({ serverData }) {
  const MOCK_DATA = [
    { id: 1, title: "Bitcoin Reaches New Heights Amid Institutional Interest", category: "Analysis", image: "/media/news1.jpg" },
    { id: 2, title: "Ethereum 2.0: What You Need To Know About The Merge", category: "Market", image: "/media/news2.jpg" }
  ];

  const data = serverData && serverData.length > 0 ? serverData : MOCK_DATA;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveIndex((current) => (current === data.length - 1 ? 0 : current + 1));
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [data.length]);

  const handleClickDot = (index) => setActiveIndex(index);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-[400px] bg-slate-50 rounded-2xl mt-8 border border-slate-100">
        <div className="w-10 h-10 rounded-full animate-spin border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    /* Change 1: Mobile par mx-4 (sides se gap) aur mt-6 kiya taake device edges se na lage */
    <div className="relative w-full max-w-[1400px] mx-auto px-4 md:px-0 mt-6 md:mt-8">
      <div className="relative w-full rounded-2xl overflow-hidden bg-[#0a0a0a] group shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/5">
        
        {/* FIXED HEIGHT SLIDER */}
<div className="slider-container relative w-full h-[280px] sm:h-[400px] md:h-[450px]">          
          {/* Slides Wrapper */}
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {data.map((slide) => (
              <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
                <a href={`/${slide.slug}`} className="block w-full h-full relative group">
                  
                  {/* OVERLAYS */}
                  <div className="absolute inset-0 bg-black/30 z-10" /> 
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
                  
                  {/* IMAGE */}
                  <img
src={(slide?.image || slide?.image_main || "/images/bitcoin.jpg").replace(
      'cryptonews.fun', 
      'cryptonewstrend.com' // Yahan apna sahi domain name likhein jo aap chahte hain
    )}                      alt={slide.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 z-20">
          <div className="flex items-center gap-3 mb-4">
             <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded shadow-lg">
                {slide.category || "Breaking"}
             </span>
          </div>

          {/* Text is now Pure White with a Text-Shadow for extra safety */}
          <h2 className="text-black bg-white font-extrabold text-md sm:text-3xl lg:text-3xl leading-tight tracking-tight mb-6 max-w-4xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {slide.title}
          </h2>
          
          <span className="text-[11px] font-bold text-white/90 uppercase tracking-widest border-b-2 border-indigo-500 pb-1">
            Read Story
          </span>
        </div>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* DOTS - Adjusted for better mobile view */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 z-30">
          {data.map((_, index) => (
            <button
              key={index}
              onClick={() => handleClickDot(index)}
              className={`h-1 transition-all duration-500 rounded-full ${
                index === activeIndex
                  ? "bg-white w-8 shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                  : "bg-white/30 w-1.5 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

