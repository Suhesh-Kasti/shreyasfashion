"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import ShopDetails from "@/components/ShopDetails";

const ShopDetailsPage = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  if (!productId) {
    return (
      <main>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-8">No product ID provided.</p>
            <a
              href="/shop-collection"
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              Back to Shop
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <ShopDetails productId={productId} />
      </div>
    </main>
  );
};

export default ShopDetailsPage;
