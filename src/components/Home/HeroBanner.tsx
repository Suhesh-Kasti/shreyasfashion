"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getBrandName, BRAND_CONFIG } from "@/config/brand";

const HeroBanner = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-black transition-colors duration-300">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 30px 30px'
        }}></div>
      </div>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-black/5 to-black/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-gray-200/30 to-gray-300/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-black/3 to-black/8 rounded-full blur-lg animate-pulse delay-500"></div>

        {/* Floating Fashion Elements */}
        <div className="absolute top-1/4 right-1/4 opacity-5 animate-float">
          <div className="w-16 h-16 border-2 border-black dark:border-white rounded-full"></div>
        </div>
        <div className="absolute bottom-1/3 left-1/3 opacity-5 animate-float delay-1000">
          <div className="w-12 h-12 bg-black dark:bg-white transform rotate-45"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Premium Badge */}
          <div className={`inline-flex items-center gap-2 px-6 py-2 bg-black/5 dark:bg-white/10 backdrop-blur-sm rounded-full mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 tracking-wider uppercase">
              Premium Fashion
            </span>
          </div>

          {/* Main Heading */}
          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-light text-black dark:text-white mb-6 tracking-tight leading-none transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="block font-extralight">Redefine</span>
            <span className="block font-bold bg-gradient-to-r from-black via-gray-800 to-black dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
              {BRAND_CONFIG.hero.title}
            </span>
          </h1>

          {/* Tagline */}
          <p className={`text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {BRAND_CONFIG.tagline} • {BRAND_CONFIG.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link
              href="/shop-collection"
              className="group relative bg-black text-white px-12 py-4 font-medium text-lg overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl min-w-[220px]"
            >
              <span className="relative z-10 group-hover:tracking-widest transition-all duration-300">
                {BRAND_CONFIG.hero.ctaText}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Link>
            <Link
              href="/about"
              className="group relative border-2 border-black dark:border-white text-black dark:text-white px-12 py-4 font-medium text-lg overflow-hidden transition-all duration-500 hover:scale-105 min-w-[220px]"
            >
              <span className="relative z-10 group-hover:text-white group-hover:tracking-widest transition-all duration-300">
                {BRAND_CONFIG.hero.secondaryCtaText}
              </span>
              <div className="absolute inset-0 bg-black dark:bg-white dark:group-hover:text-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Link>
          </div>

          {/* Premium Features */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {BRAND_CONFIG.features.map((feature, index) => (
              <div key={index} className="group text-center">
                <div className="relative mb-4">
                  <div className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                    {feature.value}
                  </div>
                  <div className="w-12 h-0.5 bg-black dark:bg-white mx-auto transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
                <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 uppercase tracking-[0.2em] font-medium">
                  {feature.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* Floating Brand Elements */}
      <div className="absolute top-1/4 left-8 hidden xl:block">
        <div className="transform -rotate-90 text-gray-300 dark:text-gray-600 text-xs tracking-[0.4em] uppercase font-light hover:text-black dark:hover:text-white transition-colors duration-500">
          Premium Quality
        </div>
      </div>
      <div className="absolute bottom-1/4 right-8 hidden xl:block">
        <div className="transform rotate-90 text-gray-300 dark:text-gray-600 text-xs tracking-[0.4em] uppercase font-light hover:text-black dark:hover:text-white transition-colors duration-500">
          Made in {BRAND_CONFIG.country}
        </div>
      </div>

      {/* Decorative Lines */}
      <div className="absolute top-20 left-10 w-px h-24 bg-gradient-to-b from-transparent via-black/20 dark:via-white/20 to-transparent hidden lg:block"></div>
      <div className="absolute bottom-20 right-10 w-px h-24 bg-gradient-to-b from-transparent via-black/20 dark:via-white/20 to-transparent hidden lg:block"></div>

      {/* Corner Accents */}
      <div className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-black/10 dark:border-white/10 hidden lg:block"></div>
      <div className="absolute top-8 right-8 w-8 h-8 border-r-2 border-t-2 border-black/10 dark:border-white/10 hidden lg:block"></div>
      <div className="absolute bottom-8 left-8 w-8 h-8 border-l-2 border-b-2 border-black/10 dark:border-white/10 hidden lg:block"></div>
      <div className="absolute bottom-8 right-8 w-8 h-8 border-r-2 border-b-2 border-black/10 dark:border-white/10 hidden lg:block"></div>
    </section>
  );
};

export default HeroBanner;
