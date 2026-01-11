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

export const MENU_DATA: MenuSection[] = [
  {
    title: "Collections",
    items: [
      { label: "New Arrivals", href: "/collections/new-arrivals", featured: true, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069" },
      { label: "Signature Bags", href: "/collections/signature", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1888" },
      { label: "Travel & Weekender", href: "/collections/travel", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1974" },
      { label: "Accessories", href: "/collections/accessories", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974" },
    ],
  },
  {
    title: "Featured",
    items: [
      { label: "The Modern Edit", href: "/collections/modern-edit", featured: true, image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1888" },
      { label: "Sustainable Series", href: "/collections/sustainable", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070" },
      { label: "Limited Edition", href: "/collections/limited", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964" },
    ],
  },
  {
    title: "Velancis",
    items: [
      { label: "Our Story", href: "/about", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070" },
      { label: "The Campaign", href: "/campaign", image: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=2070" },
      { label: "Sustainability", href: "/sustainability", image: "https://images.unsplash.com/photo-1518558997970-4ddc236affcd?q=80&w=2070" },
      { label: "Store Locator", href: "/stores", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070" },
    ],
  },
];
