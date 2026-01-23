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
  HERO_FALLBACK_IMAGE: "/products/product_saree_red_1768316591404.png", // Verify if we have a bag image fallback
  TOPBAR_TEXT: "COMPLIMENTARY SHIPPING & RETURNS ON ALL ORDERS",
};

// Add fallback image for bags if available, otherwise keep the placeholder
export const ASSETS = {
  FALLBACK_PRODUCT_IMAGE: "/placeholder-bag.png", // We might need to generate this or use an existing one
};
