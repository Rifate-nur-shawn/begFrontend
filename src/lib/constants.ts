export const APP_CONFIG = {
  BRAND_NAME: "BEG",
  DESCRIPTION: "Modern Luxury Bag E-commerce",
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
  CONTACT_EMAIL: "concierge@beg.com",
};

export const ROUTES = {
  HOME: "/",
  SHOP: "/collections/all",
  COLLECTIONS: "/collections",
  PRODUCT: (slug: string) => `/products/${slug}`,
  CART: "/cart",
  CHECKOUT: "/checkout",
  LOGIN: "/login",
  ACCOUNT: "/account",
};

export const UI_CONSTANTS = {
  HERO_TITLE: "The New Era",
  HERO_SUBTITLE: "Redefining modern luxury through craftsmanship",
  HERO_BUTTON_TEXT: "Explore Collection",
  // Updated to a bag image from Unsplash (matches "Arcadie Leather Tote" style)
  HERO_FALLBACK_IMAGE: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop",
  TOPBAR_TEXT: "COMPLIMENTARY SHIPPING & RETURNS ON ALL ORDERS",
};

export const ASSETS = {
  FALLBACK_PRODUCT_IMAGE: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1957&auto=format&fit=crop",
};
