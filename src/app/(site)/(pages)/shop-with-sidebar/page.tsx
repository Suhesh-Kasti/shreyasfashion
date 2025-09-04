import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import { getAllProducts, getAllCategories } from "../../../../../lib/sanity";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop | DANIOS Premium Streetwear",
  description: "Browse our collection of premium streetwear crafted in Nepal. Find sweatshirts, t-shirts, pants and more from DANIOS.",
  // other metadata
};

// Enable static generation for Vercel
export const revalidate = 60; // Revalidate every 60 seconds

const ShopWithSidebarPage = async () => {
  // Fetch products and categories from Sanity CMS
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories()
  ]);

  return (
    <main>
      <ShopWithSidebar products={products} categories={categories} />
    </main>
  );
};

export default ShopWithSidebarPage;
