import React from "react";
import Wishlist from "@/components/Wishlist";
import { getBrandTitle, getBrandName } from "@/config/brand";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: getBrandTitle("Wishlist"),
  description: `Your saved items from ${getBrandName()} premium fashion collection. Keep track of your favorite pieces.`,
};

const WishlistPage = () => {
  return (
    <main>
      <Wishlist />
    </main>
  );
};

export default WishlistPage;
