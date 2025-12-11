import Home from "@/components/Home";
import { Metadata } from "next";
import { getAllProducts, getAllCategories } from "../../../lib/sanity";
import { getBrandTitle, getBrandDescription } from "@/config/brand";

export const metadata: Metadata = {
  title: getBrandTitle(),
  description: getBrandDescription(),
  // other metadata
};

// Disable static generation for debugging build error
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch data from Sanity CMS
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories()
  ]);

  return (
    <>
      <Home products={products} categories={categories} />
    </>
  );
}
