import React from "react";
import Link from "next/link";
import DaniosProductCard from "@/components/ProductCard/DaniosProductCard";
import { Product } from "@/types/product";

interface BestSellerProps {
  products: Product[];
}

const DaniosBestSeller = ({ products }: BestSellerProps) => {
  // Get products with discounts as "best sellers"
  const bestSellers = products
    .filter(product => product.price > product.discountedPrice)
    .slice(0, 8);

  return (
    <section className="py-12 lg:py-16 bg-danios-neutral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-danios-accent font-medium text-sm uppercase tracking-wider mb-2 block">
              Customer Favorites
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-danios-black">
              Best Sellers
            </h2>
          </div>

          <Link
            href="/shop-with-sidebar"
            className="inline-flex items-center text-danios-black font-medium hover:text-danios-accent transition-colors duration-300 group"
          >
            View All
            <svg
              className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {bestSellers.map((product) => (
            <DaniosProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {bestSellers.length === 0 && (
          <div className="text-center py-16">
            <div className="text-danios-text-muted text-lg mb-4">
              No best sellers available at the moment.
            </div>
            <Link
              href="/shop-with-sidebar"
              className="inline-flex items-center text-danios-black font-medium hover:text-danios-accent transition-colors duration-300"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default DaniosBestSeller;
