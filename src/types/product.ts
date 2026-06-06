export interface Product {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  category: string;
  material: string;
  price: number | { base: number; discounted: number; currency?: string };
  originalPrice: number;
  discount: number;
  rating: number | { average: number; count: number };
  reviewCount: number;
  images: (string | { url: string })[];
  tags: string[];
  occasion: string;
  inStock: boolean;
  isNew: boolean;
  isBestseller: boolean;
  description: string;
  variants: {
    size?: string[];
    color?: string[];
    metal?: string[];
  };
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Category {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  image: string;
  count: number;
}
