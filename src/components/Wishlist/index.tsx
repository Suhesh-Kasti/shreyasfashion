"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { removeItemFromWishlist } from "@/redux/features/wishlist-slice";
import Image from "next/image";
import Link from "next/link";
import { client } from "../../../lib/sanity";

const Wishlist = () => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);
  const [liveProducts, setLiveProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch live product data from Sanity
  useEffect(() => {
    const fetchLiveData = async () => {
      if (wishlistItems.length === 0) {
        setLiveProducts([]);
        setLoading(false);
        return;
      }

      try {
        const productIds = wishlistItems.map(item => item.id);
        const query = `*[_type == "product" && _id in $ids] {
          _id,
          title,
          price,
          discountedPrice,
          inStock,
          quantity,
          "image": imgs.thumbnails[0].asset->url,
          slug
        }`;

        const products = await client.fetch(query, { ids: productIds });
        setLiveProducts(products);
      } catch (error) {
        console.error('Failed to fetch wishlist products:', error);
        setLiveProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveData();
  }, [wishlistItems]);

  const handleRemove = (id: string | number) => {
    dispatch(removeItemFromWishlist(id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (liveProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h2>
          <Link href="/shop-collection" className="text-blue-600 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Wishlist ({liveProducts.length})</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {liveProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Product Image */}
              <div className="relative h-64 bg-gray-100">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2 line-clamp-2">{product.title}</h3>

                {/* Price */}
                <div className="mb-3">
                  {product.discountedPrice && product.discountedPrice < product.price ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        NPR {product.discountedPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        NPR {product.price.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      NPR {product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Stock Status - LIVE DATA */}
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Status: </span>
                  <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/shop-collection`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    View Product
                  </Link>
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Wishlist;
