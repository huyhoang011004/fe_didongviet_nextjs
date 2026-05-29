export interface Branch {
  _id: string;
  id?: string;
  name: string;
  address: string;
  phone: string;
  managerName?: string;
  isActive?: boolean;
  location?: {
    type: 'Point';
    coordinates: number[];
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  id?: string;
  name: string;
  slug?: string;
  parentCategory?: string | Category | null;
  image?: string;
  description?: string;
  brands?: string[];
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariant {
  _id?: string;
  id?: string;
  color: string;
  ram?: string;
  rom?: string;
  price: number | string;
  salePrice?: number | string;
  inventory?: Array<{
    branch: string | Branch;
    stock: number;
  }>;
  sku?: string;
  variantImage?: string | null;
}

export interface Product {
  _id: string;
  id?: string;
  name: string;
  images: Array<{
    url: string;
    isThumbnail?: boolean;
    order?: number;
    alt?: string;
    _id?: string;
  }>;
  video?: string | null;
  category: string | any;
  brand: string;
  description?: string;
  ratingsAverage?: number;
  ratingsCount?: number;
  slug?: string;
  variants?: ProductVariant[];
  isUsed?: boolean;
  discountDMember?: number;
  tradeInBonus?: number;
  isActive?: boolean;
  // Virtuals
  imageUrl?: string | null;
  priceRange?: { min: number; max: number } | null;
  totalStock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  _id: string;
  id?: string;
  product: string | Product;
  user: string | any; // Có thể import User từ auth.d.ts
  parentId?: string | Review | null;
  rating?: number;
  content: string;
  images?: string[];
  isApproved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
