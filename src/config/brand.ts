// Brand Configuration
// Change these values to rebrand the entire site

export const BRAND_CONFIG = {
  // Basic Brand Info
  name: "Shreya's Fashion",
  tagline: "Premium streetwear crafted in Nepal",
  description: "Premium streetwear crafted in Nepal by Shreya Ghimire. Quality clothing that celebrates heritage while embracing modernity.",
  
  // Founder/Company Info
  founder: "Shreya Ghimire",
  country: "Nepal",
  
  // Contact & Social
  email: "hello@shreyasfashion.com",
  phone: "+977-9763623022",
  address: "Kathmandu, Nepal",
  
  // Social Media
  social: {
    instagram: "https://instagram.com/shreyasfashion",
    facebook: "https://facebook.com/shreyasfashion",
    twitter: "https://twitter.com/shreyasfashion",
    tiktok: "https://tiktok.com/@shreyasfashion",
  },
  
  // SEO & Meta
  seo: {
    title: "Premium Streetwear. Made in Nepal",
    description: "Discover premium streetwear crafted in Nepal. Quality clothing that celebrates heritage while embracing modernity.",
    keywords: "streetwear, nepal, fashion, premium, clothing",
  },
  
  // Hero Section Defaults
  hero: {
    title: "Elevate Your Everyday",
    subtitle: "Premium streetwear that defines your style.",
    ctaText: "Shop Collection",
    secondaryCtaText: "Our Story",
  },
  
  // Brand Stats/Features
  features: [
    { value: "100%", label: "Premium Cotton" },
    { value: "Made", label: "in Nepal" },
    { value: "Free", label: "Shipping" },
  ],
  
  // Navigation Menu
  navigation: [
    { name: "Shop", href: "/shop-with-sidebar" },
    { name: "Wishlist", href: "/wishlist" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  
  // Footer Links
  footerLinks: {
    help: [
      { name: "Customer Support", href: "/support" },
      { name: "Delivery Details", href: "/delivery" },
      { name: "Terms & Conditions", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Story", href: "/story" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
    ],
    shop: [
      { name: "All Products", href: "/shop-with-sidebar" },
      { name: "New Arrivals", href: "/shop-with-sidebar?filter=new" },
      { name: "Best Sellers", href: "/shop-with-sidebar?filter=popular" },
      { name: "Sale", href: "/shop-with-sidebar?filter=sale" },
    ],
  },
  
  // Payment Methods
  paymentMethods: [
    { name: "e-Sewa", icon: "esewa", color: "green" },
    { name: "Khalti", icon: "khalti", color: "purple" },
    { name: "Cash on Delivery", icon: "cod", color: "blue" },
  ],
  
  // PWA Configuration
  pwa: {
    name: "Shreya's Fashion",
    shortName: "Shreya's",
    description: "Premium fashion store",
    themeColor: "#000000",
    backgroundColor: "#ffffff",
    startUrl: "/",
    display: "standalone",
    orientation: "portrait",
  },
  
  // Theme Colors (for CSS variables)
  colors: {
    primary: "#000000",
    secondary: "#ffffff", 
    accent: "#f5f5f5",
    text: "#333333",
    textLight: "#666666",
    border: "#e5e5e5",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  },
};

// Helper function to get brand name
export const getBrandName = () => BRAND_CONFIG.name;

// Helper function to get full brand title
export const getBrandTitle = (suffix?: string) => {
  const base = `${BRAND_CONFIG.name} | ${BRAND_CONFIG.seo.title}`;
  return suffix ? `${suffix} | ${base}` : base;
};

// Helper function to get brand description
export const getBrandDescription = () => BRAND_CONFIG.seo.description;

// Helper function to get social links
export const getSocialLinks = () => BRAND_CONFIG.social;

// Helper function to get navigation items
export const getNavigation = () => BRAND_CONFIG.navigation;

// Helper function to get footer links
export const getFooterLinks = () => BRAND_CONFIG.footerLinks;

// Helper function to get brand colors
export const getBrandColors = () => BRAND_CONFIG.colors;

// Helper function to get contact information
export const getContactInfo = () => ({
  email: BRAND_CONFIG.email,
  phone: BRAND_CONFIG.phone,
  address: BRAND_CONFIG.address,
});

// Helper function to get brand email
export const getBrandEmail = () => BRAND_CONFIG.email;

// Helper function to get brand phone
export const getBrandPhone = () => BRAND_CONFIG.phone;

// Helper function to get brand address
export const getBrandAddress = () => BRAND_CONFIG.address;
