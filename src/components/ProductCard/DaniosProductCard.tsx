"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { useAppDispatch } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist, removeItemFromWishlist } from "@/redux/features/wishlist-slice";
import { useAppSelector } from "@/redux/store";
import { formatPrice, calculateDiscount } from "@/utils/currency";
import { getBrandName } from "@/config/brand";
import toast from "react-hot-toast";

interface DaniosProductCardProps {
  product: Product;
  className?: string;
}

const DaniosProductCard = ({ product, className = "" }: DaniosProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const dispatch = useAppDispatch();

  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);
  const productId = product?._id || product?.id;
  const isInWishlist = wishlistItems.some((item) => item?.id === productId);

  // Early return if product is null or undefined
  if (!product || (!product._id && !product.id) || !product.title) {
    return null;
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      addItemToCart({
        id: productId,
        title: product.title,
        price: product.price,
        discountedPrice: product.discountedPrice,
        quantity: 1,
        imgs: product.imgs,
      })
    );

    toast.success(`${product.title} added to cart!`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist) {
      dispatch(removeItemFromWishlist(productId));
    } else {
      dispatch(
        addItemToWishlist({
          id: productId,
          title: product.title,
          price: product.price,
          discountedPrice: product.discountedPrice,
          quantity: 1,
          imgs: product.imgs,
          status: product.inStock ? 'In Stock' : 'Out of Stock',
        })
      );
    }
  };

  const discountPercentage = calculateDiscount(product.price, product.discountedPrice);

  return (
    <div className={`group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
      <Link href={`/shop-details?id=${productId}`}>
        <div
          className="relative overflow-hidden bg-gray-50 rounded-t-lg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Product Image */}
          <div className="relative aspect-[3/4] overflow-hidden">
            {product.imgs?.thumbnails?.[0] && product.imgs.thumbnails[0] !== '/images/placeholder.jpg' ? (
              <Image
                src={product.imgs.thumbnails[0]}
                alt={`${product.title} - ${getBrandName()} premium fashion`}
                fill
                className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-4xl text-gray-300 font-bold">
                  {product?.title?.charAt(0) || 'P'}
                </span>
              </div>
            )}

            {/* Secondary Image on Hover */}
            {product.imgs?.thumbnails?.[1] && product.imgs.thumbnails[1] !== '/images/placeholder.jpg' && (
              <Image
                src={product.imgs.thumbnails[1]}
                alt={`${product.title} - Alternative view - ${getBrandName()} premium fashion`}
                fill
                className={`object-cover transition-all duration-700 ${
                  isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}

            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-sm font-medium">
                -{discountPercentage}%
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
                isInWishlist
                  ? "bg-black text-white"
                  : "bg-white/80 text-gray-600 hover:bg-black hover:text-white"
              } ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>

            {/* Quick Add to Cart */}
            <div
              className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
                isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
                </svg>
                Add to Cart
              </button>
            </div>

            {/* Hover Overlay */}
            <div
              className={`absolute inset-0 bg-danios-black/10 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-gray-900 font-medium text-base mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-900 font-bold text-lg">
              {formatPrice(product.discountedPrice)}
            </span>
            {product.price > product.discountedPrice && (
              <span className="text-gray-400 line-through text-sm">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Reviews Count (if available) */}
          {product.reviews > 0 && (
            <div className="flex items-center">
              <span className="text-gray-500 text-sm">
                ({product.reviews} reviews)
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default DaniosProductCard;
