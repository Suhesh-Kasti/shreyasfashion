import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import { getAllProducts, getAllCategories } from "../../../../../lib/sanity";
import { getBrandTitle, getBrandName } from "@/config/brand";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: getBrandTitle("Shop Collection"),
  description: `Browse our collection of premium fashion. Find sweatshirts, t-shirts, pants and more from ${getBrandName()}.`,
  // other metadata
};

// Disable static generation for debugging build error
export const dynamic = 'force-dynamic';

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
