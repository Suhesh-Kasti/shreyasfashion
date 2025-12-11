export type Product = {
  title: string;
  reviews: number;
  price: number;
  discountedPrice: number;
  id: string | number;
  description?: string;
  category?: string;
  slug?: string;
  imgs?: {
    thumbnails: string[];
    previews: string[];
    gallery?: string[];
  };
  inStock?: boolean;
  quantity?: number;
  featured?: boolean;
  gender?: string;
  sizes?: string[];
  colors?: Array<{
    name: string;
    value: string;
    image?: string;
  }> | string[];
  material?: string;
  style?: string;
  season?: string[];
  tags?: string[];
  priceRange?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  additionalInfo?: {
    brand?: string;
    fit?: string;
    gender?: string;
    origin?: string;
    careInstructions?: string[];
    sustainability?: string[];
  };
  createdAt?: string;
};
