import Contact from "@/components/Contact";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact | DANIOS",
  description: "Get in touch with DANIOS. Contact Shreya Ghimire and the team for questions about our premium streetwear collection.",
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
