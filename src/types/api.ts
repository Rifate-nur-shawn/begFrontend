export interface User {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  id: string;
  userId: string;
  type: 'billing' | 'shipping';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  image?: string;
  description?: string;
  isActive: boolean;
  isFeatured: boolean;
  children?: Category[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  salePrice?: number;
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  isFeatured: boolean;
  isActive: boolean;
  media?: string[];
  images?: string[];
  attributes?: Record<string, unknown>;
  specifications?: Record<string, unknown>;
  brand?: string;
  tags?: string[];
  variants?: {
      id: string;
      productId: string;
      name: string;
      stock: number;
      price?: number;
      salePrice?: number;
      images?: string[];
      attributes?: Record<string, string>;
  }[];
  // Helper fields for frontend (backend might not send these directly, but useful for UI fallback)
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  isNew?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Variant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  salePrice?: number;
  attributes?: Record<string, string>;
  images?: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product: Product;
  variant?: Variant;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  items?: OrderItem[];
  shippingFee: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  user?: User;
  createdAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  items: Product[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number; // Backend uses 'limit', typically
    totalPages?: number; // Backend curl response didn't show totalPages, might be missing or calculated. logic usually needs total.
    size?: number; // checks curl output... "size": 50 in hook, but curl showed "limit".
  };
}
