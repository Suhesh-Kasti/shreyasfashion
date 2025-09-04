'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types/product'

interface ProductVariantsProps {
  product: Product
  onVariantChange?: (variant: any) => void
}

export default function ProductVariants({ product, onVariantChange }: ProductVariantsProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<any>(null)
  const [selectedMaterial, setSelectedMaterial] = useState<string>('')
  const [quantity, setQuantity] = useState(1)

  const handleSizeChange = (size: string) => {
    setSelectedSize(size)
    onVariantChange?.({
      size,
      color: selectedColor,
      material: selectedMaterial,
      quantity
    })
  }

  const handleColorChange = (color: any) => {
    setSelectedColor(color)
    onVariantChange?.({
      size: selectedSize,
      color,
      material: selectedMaterial,
      quantity
    })
  }

  const handleMaterialChange = (material: string) => {
    setSelectedMaterial(material)
    onVariantChange?.({
      size: selectedSize,
      color: selectedColor,
      material,
      quantity
    })
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
      onVariantChange?.({
        size: selectedSize,
        color: selectedColor,
        material: selectedMaterial,
        quantity: newQuantity
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Sizes */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-danios-black mb-3">Size</h4>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedSize === size
                    ? 'border-danios-black bg-danios-black text-white'
                    : 'border-gray-300 text-danios-text hover:border-danios-black'
                }`}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-danios-black mb-3">Color</h4>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color, index) => {
              const colorName = typeof color === 'string' ? color : color.name;
              const colorValue = typeof color === 'string' ? color.toLowerCase() : color.value;
              const isSelected = typeof selectedColor === 'string'
                ? selectedColor === colorName
                : selectedColor?.name === colorName;

              return (
                <button
                  key={index}
                  onClick={() => handleColorChange(typeof color === 'string' ? color : color)}
                  className={`px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 ${
                    isSelected
                      ? 'border-danios-black bg-danios-black text-white'
                      : 'border-gray-300 text-danios-text hover:border-danios-black'
                  }`}
                >
                  {colorName}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Material */}
      {product.material && (
        <div>
          <h4 className="text-lg font-medium text-danios-black mb-3">Material</h4>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleMaterialChange(product.material)}
              className={`px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 ${
                selectedMaterial === product.material
                  ? 'border-danios-black bg-danios-black text-white'
                  : 'border-gray-300 text-danios-text hover:border-danios-black'
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
                {season.charAt(0).toUpperCase() + season.slice(1)}
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
                {tag.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
            <span className="px-6 py-2 font-medium bg-gray-50 border-x border-gray-300 min-w-[60px] text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-4 py-2 text-danios-text hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>

      {/* Product Info - Only weight for clothing */}
      {product.weight && (
        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-lg font-medium text-danios-black mb-3">Product Details</h4>
          <div className="space-y-2 text-sm text-danios-text">
            <div className="flex justify-between">
              <span>Weight:</span>
              <span>{product.weight}g</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
