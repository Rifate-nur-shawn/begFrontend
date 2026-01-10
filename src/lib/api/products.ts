export interface ProductVariant {
  size: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  variants: ProductVariant[];
  isNew?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Arcadie Leather Bag",
    price: 3400,
    description: "The Arcadie bag, crafted from fine leather, reinterprets the iconic matelassé motif.",
    category: "Bags",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop"
    ],
    variants: [
      { size: "One Size", inStock: true }
    ],
    isNew: true,
  },
  {
    id: "p2",
    name: "Cotton Poplin Shirt",
    price: 1200,
    description: "Masculine cut shirt in varying proportions.",
    category: "Ready to Wear",
    images: [
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1888&auto=format&fit=crop"
    ],
    variants: [
      { size: "XS", inStock: true },
      { size: "S", inStock: true },
      { size: "M", inStock: true },
      { size: "L", inStock: false },
    ]
  }
];

export async function getProducts(): Promise<Product[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return PRODUCTS;
}

export async function getProductById(id: string): Promise<Product | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return PRODUCTS.find(p => p.id === id);
}
