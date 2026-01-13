export interface MenuItem {
  label: string;
  href: string;
  featured?: boolean;
  image?: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

// Using local product images from the database/public folder
export const MENU_DATA: MenuSection[] = [
  {
    title: "Collections",
    items: [
      { label: "New Arrivals", href: "/collections/sarees", featured: true, image: "/products/product_saree_red_1768316591404.png" },
      { label: "Sarees", href: "/collections/sarees", image: "/products/product_saree_blue_1768316611419.png" },
      { label: "Traditional Wear", href: "/collections/sarees", image: "/products/product_saree_green_1768316636847.png" },
      { label: "Festive Collection", href: "/collections/sarees", image: "/products/product_saree_pink_1768316654746.png" },
    ],
  },
  {
    title: "Featured",
    items: [
      { label: "The Modern Edit", href: "/collections/sarees", featured: true, image: "/products/product_saree_purple_1768316672988.png" },
      { label: "Bridal Collection", href: "/collections/sarees", image: "/products/product_saree_red_1768316591404.png" },
      { label: "Limited Edition", href: "/collections/sarees", image: "/products/product_saree_pink_1768316654746.png" },
    ],
  },
  {
    title: "Velancis",
    items: [
      { label: "Our Story", href: "/about", image: "/products/product_saree_blue_1768316611419.png" },
      { label: "The Campaign", href: "/campaign", image: "/products/product_saree_green_1768316636847.png" },
      { label: "Sustainability", href: "/sustainability", image: "/products/product_saree_purple_1768316672988.png" },
      { label: "Store Locator", href: "/stores", image: "/products/product_saree_red_1768316591404.png" },
    ],
  },
];
