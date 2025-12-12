'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types/product'

interface ProductVariantsProps {
  product: Product;
  selectedSize?: string;
  selectedColor?: string;
  onSizeChange?: (size: string) => void;
  onColorChange?: (color: string) => void;
  onQuantityChange?: (quantity: number) => void;
}

export default function ProductVariants({
  product,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
  onQuantityChange
}: ProductVariantsProps) {
  // We remove local state to make this a fully controlled component
  // derived from the parent's state
  const [selectedMaterial, setSelectedMaterial] = useState<string>('')
  const [quantity, setQuantity] = useState(1)

  const handleSizeChange = (size: string) => {
    onSizeChange?.(size);
  }

  const handleColorChange = (color: any) => {
    const colorVal = typeof color === 'string' ? color : color.name;
    onColorChange?.(colorVal);
  }

  const handleMaterialChange = (material: string) => {
    setSelectedMaterial(material)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
      onQuantityChange?.(newQuantity)
    }
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Sizes */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Size</h4>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`min-w-[50px] px-4 py-2 text-sm font-medium transition-all duration-200 border rounded-md
                  ${selectedSize === size
                    ? "bg-black text-white border-black shadow-md scale-105"
                    : "bg-white text-gray-700 border-gray-200 hover:border-black hover:text-black"
                  }
                `}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {product.colors && product.colors.length > 0 && (
        <div className="mb-8">
          <h3 className="font-medium text-black mb-4">Color</h3>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color, index) => {
              const colorName = typeof color === 'string' ? color : color.name;
              const colorValue = typeof color === 'string' ? color : color.value;
              const isSelected = selectedColor === colorName;

              return (
                <button
                  key={index}
                  onClick={() => handleColorChange(color)}
                  className={`group relative h-10 w-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center
                    ${isSelected ? "border-black scale-110 ring-2 ring-offset-2 ring-black" : "border-transparent hover:scale-105"}
                  `}
                  aria-label={`Select ${colorName}`}
                >
                  <span
                    className="h-full w-full rounded-full border border-gray-200 shadow-sm"
                    style={{ backgroundColor: colorValue }}
                  />
                  {isSelected && (
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {colorName}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Material */}
      {product.material && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Material</h4>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleMaterialChange(product.material)}
              className={`px-4 py-3 border-2 rounded-lg font-medium transition-all duration-200 ${selectedMaterial === product.material
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:border-gray-400 bg-white'
                }`}
            >
              {product.material}
            </button>
          </div>
        </div>
      )}

      {/* Style */}
      {product.style && (
        <div>
          <h4 className="text-lg font-medium text-danios-black mb-3">Style</h4>
          <div className="px-4 py-2 bg-danios-neutral rounded-lg">
            <span className="text-danios-text font-medium">{product.style}</span>
          </div>
        </div>
      )}

      {/* Season */}
      {product.season && product.season.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-danios-black mb-3">Season</h4>
          <div className="flex flex-wrap gap-2">
            {product.season.map((season) => (
              <span
                key={season}
                className="px-3 py-1 bg-danios-neutral text-danios-text text-sm rounded-full"
              >
                {typeof season === 'string' && season.length > 0
                  ? season.charAt(0).toUpperCase() + season.slice(1)
                  : String(season)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-danios-black mb-3">Features</h4>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-danios-accent/10 text-danios-accent text-sm rounded-full border border-danios-accent/20"
              >
                {typeof tag === 'string'
                  ? tag.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                  : String(tag)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h4 className="text-lg font-medium text-danios-black mb-3">Quantity</h4>
        <div className="flex items-center space-x-4">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-4 py-2 text-danios-text hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="px-6 py-2 font-medium bg-gray-50 text-black border-x border-gray-300 min-w-[60px] text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-4 py-2 text-danios-text hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>
          <div className="mb-6">
            <span className="text-sm text-gray-600">Availability: </span>
            <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>


    </div>
  )
}
