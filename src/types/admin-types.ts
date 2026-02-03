// Admin Types - Matching Backend Domain Models

// Product Types
export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  salePrice?: number | null;
  stockStatus: string;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  media: string[];
  images?: string[];
  attributes?: Record<string, unknown>;
  specifications?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  variants: AdminVariant[];
  categories: AdminCategory[];
  collections: AdminCollection[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  ogImage?: string;
  brand?: string;
  tags?: string[];
  warrantyInfo?: Record<string, unknown>;
}

export interface AdminVariant {
  id: string;
  productId: string;
  name: string;
  stock: number;
  sku?: string;
  attributes?: Record<string, unknown>;
  price?: number | null;
  salePrice?: number | null;
  images?: string[];
  weight?: number | null;
  dimensions?: Record<string, unknown>;
  barcode?: string;
  lowStockThreshold: number;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  children?: AdminCategory[];
  orderIndex: number;
  icon?: string;
  image?: string;
  isFeatured: boolean;
  isActive: boolean;
  showInNav: boolean;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}

export interface AdminCollection {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  story?: string;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  ogImage?: string;
  products?: AdminProduct[];
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  outOfStock: number;
  lowStock: number;
  totalInventoryValue: number;
}

export interface InventoryLog {
  id: number;
  productId: string;
  variantId?: string;
  changeAmount: number;
  reason: string;
  referenceId: string;
  createdAt: string;
}

export interface VariantWithProduct extends AdminVariant {
  productName: string;
  productSlug: string;
  productBasePrice: number;
  productImage?: string;
}

// Request Payloads
export interface CreateProductPayload {
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  salePrice?: number | null;
  isFeatured?: boolean;
  isActive?: boolean;
  images?: string[];  // Backend expects 'images', not 'media'
  categoryIds?: string[];
  collectionIds?: string[];
  variants?: Omit<AdminVariant, 'id' | 'productId'>[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  brand?: string;
  tags?: string[];
}

export interface UpdateProductPayload extends CreateProductPayload {
  id: string;
}

export interface AdjustStockPayload {
  variantId: string;
  changeAmount: number;
  reason: string;
}

// Filter Types
export interface ProductFilter {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: 'true' | 'false' | 'all';
  sort?: string;
}

// Order Types
export interface AdminOrderUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface AdminOrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: AdminProduct;
  variantId?: string;
  quantity: number;
  price: number;
}

export interface AdminOrder {
  id: string;
  userId: string;
  user: AdminOrderUser;
  status: OrderStatus;
  totalAmount: number;
  shippingFee: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paidAmount: number;
  refundedAmount: number;
  paymentDetails?: Record<string, unknown>;
  isPreOrder: boolean;
  items: AdminOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  district?: string;
  postalCode?: string;
  country?: string;
}

export interface OrderHistory {
  id: string;
  orderId: string;
  previousStatus?: string;
  newStatus: string;
  reason?: string;
  createdBy?: string;
  createdName?: string;
  createdAt: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'verified' 
  | 'failed' 
  | 'refunded' 
  | 'partial_refund';

export interface OrderFilter {
  page?: number;
  limit?: number;
  status?: OrderStatus | '';
  payment_status?: PaymentStatus | '';
  search?: string;
  is_preorder?: boolean;
}

export interface OrdersResponse {
  orders: AdminOrder[];
  total: number;
  page: number;
  limit: number;
}

// Order Action Payloads
export interface UpdateOrderStatusPayload {
  status: OrderStatus;
  note?: string;
}

export interface UpdatePaymentStatusPayload {
  status: PaymentStatus;
}

export interface RefundPayload {
  amount: number;
  reason: string;
  restock: boolean;
}
