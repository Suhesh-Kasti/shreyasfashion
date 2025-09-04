import React from "react";
import HeroBanner from "./HeroBanner";
import CategoryTiles from "./CategoryTiles";
import NewArrivals from "./NewArrivals";
import BestSeller from "./BestSeller";
import Newsletter from "../Common/Newsletter";
import { Product } from "@/types/product";
import { Category } from "@/types/category";

interface HomeProps {
  products: Product[];
  categories: Category[];
}

const Home = ({ products, categories }: HomeProps) => {
  return (
    <main className="pt-16 lg:pt-20 bg-white">
      <HeroBanner />
      <CategoryTiles categories={categories} />
      <NewArrivals products={products} />
      <BestSeller products={products} />
      <Newsletter />
    </main>
  );
};

export default Home;
