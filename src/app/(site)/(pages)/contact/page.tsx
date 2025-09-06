import Contact from "@/components/Contact";
import { getBrandTitle, getBrandName, BRAND_CONFIG } from "@/config/brand";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: getBrandTitle("Contact"),
  description: `Get in touch with ${getBrandName()}. Contact ${BRAND_CONFIG.founder} and the team for questions about our premium fashion collection.`,
  // other metadata
};

const ContactPage = () => {
  return (
    <main>
      <Contact />
    </main>
  );
};

export default ContactPage;
