"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllCategories } from "../../../lib/sanity";
import { Category } from "@/types/category";
import { getBrandName } from "@/config/brand";

interface CategoryTilesProps {
  categories?: Category[];
}

const CategoryTiles = ({ categories: propCategories }: CategoryTilesProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (propCategories && propCategories.length > 0) {
          setCategories(propCategories);
        } else {
          const fetchedCategories = await getAllCategories();
          setCategories(fetchedCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Only show categories that have actual products, no fallback dummy data
        setCategories([]);
      } finally {
        setLoading(false);
        setTimeout(() => setIsVisible(true), 100);
      }
    };

    fetchCategories();
  }, [propCategories]);

  if (loading) {
    return (
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-200 border-t-black mx-auto mb-6"></div>
            <p className="text-gray-500 font-light">Curating collections...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-black"></div>
            <span className="text-sm font-medium text-gray-500 uppercase tracking-[0.3em]">
              Collections
            </span>
            <div className="w-8 h-px bg-black"></div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-light text-black mb-6 tracking-tight">
            Curated for
            <span className="block font-bold">Modern Living</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Discover our carefully crafted collections designed for those who appreciate quality and style
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <Link
                href={`/shop-collection?category=${category.slug}`}
                className="block relative overflow-hidden bg-white hover:shadow-2xl transition-all duration-700 group-hover:scale-[1.02]"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  {/* Category Image */}
                  {category.img && category.img !== '/images/placeholder.jpg' ? (
                    <Image
                      src={category.img}
                      alt={`${category.title} category`}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <>
                      {/* Premium Placeholder */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-white"></div>

                      {/* Geometric Pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-4 left-4 w-8 h-8 border-2 border-black transform rotate-45"></div>
                        <div className="absolute bottom-4 right-4 w-6 h-6 bg-black rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-black rounded-full"></div>
                      </div>

                      {/* Category Letter */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl lg:text-8xl text-gray-200 font-extralight">
                          {category.title.charAt(0)}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Premium Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <div className="transform translate-y-8 group-hover:translate-y-0 transition-all duration-700">
                      {/* Category Badge */}
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full mb-4 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        <span className="text-xs text-white font-medium uppercase tracking-wider">
                          Collection
                        </span>
                      </div>

                      <h3 className="text-2xl lg:text-3xl font-light text-black group-hover:text-white mb-3 transition-all duration-700 delay-200">
                        {category.title}
                      </h3>

                      <p className="text-gray-600 group-hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-300 font-light leading-relaxed">
                        {category.description || `Discover our ${category.title.toLowerCase()} collection`}
                      </p>

                      {/* Shop Now Button */}
                      <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-400">
                        <span className="inline-flex items-center text-white font-medium text-sm uppercase tracking-wider hover:tracking-widest transition-all duration-300">
                          Explore Collection
                          <svg
                            className="ml-3 w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                      </svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Premium Corner Accent */}
                  <div className="absolute top-6 right-6 w-6 h-6 border-t border-r border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-500"></div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Premium Bottom CTA */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-4 group">
            <div className="w-12 h-px bg-black group-hover:w-16 transition-all duration-500"></div>
            <Link
              href="/shop-collection"
              className="text-black font-light text-lg hover:font-medium transition-all duration-300 tracking-wide hover:tracking-wider"
            >
              Explore All Collections
            </Link>
            <div className="w-12 h-px bg-black group-hover:w-16 transition-all duration-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryTiles;
