export interface MenuItem {
  label: string;
  href: string;
  featured?: boolean;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const MENU_DATA: MenuSection[] = [
  {
    title: "Collections",
    items: [
      { label: "New Arrivals", href: "/collections/new-arrivals", featured: true },
      { label: "Signature Bags", href: "/collections/signature" },
      { label: "Travel & Weekender", href: "/collections/travel" },
      { label: "Accessories", href: "/collections/accessories" },
    ],
  },
  {
    title: "Featured",
    items: [
      { label: "The Modern Edit", href: "/collections/modern-edit", featured: true },
      { label: "Sustainable Series", href: "/collections/sustainable" },
      { label: "Limited Edition", href: "/collections/limited" },
    ],
  },
  {
    title: "BegOnShop",
    items: [
      { label: "Our Story", href: "/about" },
      { label: "The Campaign", href: "/campaign" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Store Locator", href: "/stores" },
    ],
  },
];
