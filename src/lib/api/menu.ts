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

// Using Unsplash images for luxury bag categories
export const MENU_DATA: MenuSection[] = [
  {
    title: "Collections",
    items: [
      { label: "New Arrivals", href: "/collections/new-arrivals", featured: true, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop" },
      { label: "Totes", href: "/collections/totes", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop" },
      { label: "Shoulder Bags", href: "/collections/shoulder-bags", image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1887&auto=format&fit=crop" },
      { label: "Crossbody", href: "/collections/crossbody", image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=1963&auto=format&fit=crop" },
    ],
  },
  {
    title: "Featured",
    items: [
      { label: "Evening Clutches", href: "/collections/clutches", featured: true, image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1957&auto=format&fit=crop" },
      { label: "Mini Bags", href: "/collections/mini-bags", image: "https://images.unsplash.com/photo-1614179689702-355944cd0918?q=80&w=1887&auto=format&fit=crop" },
      { label: "Limited Edition", href: "/collections/limited", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1887&auto=format&fit=crop" },
    ],
  },
  {
    title: "Velancis",
    items: [
      { label: "Our Story", href: "/about", image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=1771&auto=format&fit=crop" },
      { label: "The Campaign", href: "/campaign", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1776&auto=format&fit=crop" },
      { label: "Sustainability", href: "/sustainability", image: "https://images.unsplash.com/photo-1575032617751-6ddec2089882?q=80&w=1964&auto=format&fit=crop" },
      { label: "Store Locator", href: "/stores", image: "https://images.unsplash.com/photo-1559563458-527698bf5295?q=80&w=1770&auto=format&fit=crop" },
    ],
  },
];
