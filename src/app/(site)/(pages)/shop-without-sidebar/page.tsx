import React from "react";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { getAllProducts, getAllCategories } from "../../../../../lib/sanity";
import { getBrandTitle, getBrandName } from "@/config/brand";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: getBrandTitle("Shop"),
  description: `Browse our collection of premium streetwear crafted in Nepal. Find sweatshirts, t-shirts, pants and more from ${getBrandName()}.`,
  // other metadata
};

// Enable static generation for Vercel
export const revalidate = 60; // Revalidate every 60 seconds

const ShopWithoutSidebarPage = async () => {
  // Fetch products and categories from Sanity CMS
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories()
  ]);

  return (
    <main>
      <ShopWithoutSidebar products={products} categories={categories} />
    </main>
  );
};

export default ShopWithoutSidebarPage;
