import React from "react";
import EnhancedCheckout from "@/components/Checkout/EnhancedCheckout";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Checkout - DANIOS Fashion Store",
  description: "Complete your order at DANIOS Fashion Store with secure payment options",
  // other metadata
};

const CheckoutPage = () => {
  return (
    <main>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="py-20 bg-gray-50">
        <EnhancedCheckout />
      </section>
    </main>
  );
};

export default CheckoutPage;
