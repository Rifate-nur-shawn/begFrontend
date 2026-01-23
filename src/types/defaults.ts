export interface BackendMedia {
  images?: string[];
  videos?: string[];
}

export interface BackendProduct {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  salePrice?: number;
  slug?: string;
  media?: BackendMedia;
  stock?: number;
}

export interface BackendCartItem {
  id: string;
  productId: string;
  product: BackendProduct;
  quantity: number;
}

export interface BackendCartResponse {
  id: string;
  items: BackendCartItem[];
  userId?: string;
}
