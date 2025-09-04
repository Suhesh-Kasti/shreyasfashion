export type Category = {
  title: string;
  id: string | number;
  img: string;
  slug?: string;
  products?: number;
  description?: string;
  bannerImage?: string;
  icon?: string;
  featured?: boolean;
  sortOrder?: number;
};
