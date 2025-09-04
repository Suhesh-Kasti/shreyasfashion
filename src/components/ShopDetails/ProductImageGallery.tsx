'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Product } from '@/types/product'

interface ProductImageGalleryProps {
  product: Product
  selectedColor?: any
  onImageClick?: () => void
}

export default function ProductImageGallery({
  product,
  selectedColor,
  onImageClick
}: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentImages, setCurrentImages] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Update images when color changes
  useEffect(() => {
    let images: string[] = []

    // If a color is selected and it has an image, use that
    if (selectedColor?.image) {
      images = [selectedColor.image]
      // Add other product images as additional options
      if (product.imgs?.thumbnails) {
        images = [...images, ...product.imgs.thumbnails.filter(img => img !== selectedColor.image)]
      }
    } else {
      // Use default product images
      images = product.imgs?.thumbnails || []
    }

    // Add gallery images if available
    if (product.imgs?.gallery) {
      images = [...images, ...product.imgs.gallery]
    }

    // Remove duplicates and filter out empty/placeholder images
    const uniqueImages = Array.from(new Set(images)).filter(
      img => img && img !== '/images/placeholder.jpg'
    )

    setCurrentImages(uniqueImages)
    setCurrentImageIndex(0) // Reset to first image when color changes
  }, [selectedColor, product.imgs])

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? currentImages.length - 1 : prev - 1
    )
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === currentImages.length - 1 ? 0 : prev + 1
    )
  }

  const handleImageClick = () => {
    setIsModalOpen(true)
    onImageClick?.()
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  if (currentImages.length === 0) {
    // Fallback when no images available
    return (
      <div className="space-y-4">
        <div className="relative aspect-square bg-gradient-to-br from-danios-neutral via-danios-neutral-2 to-danios-neutral-3 rounded-lg flex items-center justify-center">
          <span className="text-6xl text-danios-text-muted/30 font-bold">
            {product?.title?.charAt(0) || 'P'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-danios-neutral rounded-lg overflow-hidden group">
        <Image
          src={currentImages[currentImageIndex]}
          alt={`${product.title}${selectedColor ? ` in ${selectedColor.name}` : ''}`}
          fill
          className="object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
          onClick={handleImageClick}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        
        {/* Navigation Arrows */}
        {currentImages.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <svg className="w-5 h-5 text-danios-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <svg className="w-5 h-5 text-danios-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        {currentImages.length > 1 && (
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
            {currentImageIndex + 1} / {currentImages.length}
          </div>
        )}

        {/* Color Indicator */}
        {selectedColor && (
          <div className="absolute top-4 left-4 flex items-center space-x-2 px-3 py-1 bg-white/90 rounded-full">
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: selectedColor.value }}
            ></div>
            <span className="text-sm font-medium text-danios-black">
              {selectedColor.name}
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {currentImages.length > 1 && (
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {currentImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentImageIndex
                  ? 'border-danios-black'
                  : 'border-gray-300 hover:border-danios-black'
              }`}
            >
              <Image
                src={image}
                alt={`${product.title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Info */}
      <div className="text-center text-sm text-danios-text-light">
        Click image to view full size
      </div>

      {/* Full Size Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90" onClick={closeModal}>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={currentImages[currentImageIndex]}
                alt={`${product.title} full size`}
                width={800}
                height={800}
                className="object-contain max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Navigation in Modal */}
            {currentImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image Counter in Modal */}
            {currentImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 text-white text-sm rounded-full">
                {currentImageIndex + 1} / {currentImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
