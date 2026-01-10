import Image from "next/image";
import { PRODUCTS } from "@/lib/api/products";
import ProductCard from "@/components/shop/ProductCard";

// Mock collection data fetch
const getCollectionProducts = async (_slug: string) => {
    // In a real app, this would filter by slug
    return PRODUCTS; 
};

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getCollectionProducts(slug);

  // Dynamic hero image based on slug? Or just a random nice one for demo.
  // Using a light luxury texture/interior for black text visibility.
  const HERO_IMAGE = "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=2670&auto=format&fit=crop"; 

  return (
    <div className="min-h-screen bg-canvas text-primary">
       {/* Hero Section */}
       <div className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden mb-16 md:mb-24">
            <Image
                src={HERO_IMAGE}
                alt="Collection Hero"
                fill
                className="object-cover opacity-80"
                priority
            />
            <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />
            
            <div className="relative z-10 text-center max-w-4xl px-4">
                 <h1 className="font-display text-6xl md:text-9xl mb-4 capitalize tracking-tighter">
                    {slug.replace(/-/g, " ")}
                 </h1>
                 <p className="font-utility text-sm tracking-[0.2em] uppercase text-neutral-800">
                    Spring / Summer 2026
                 </p>
            </div>
       </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
            {products.map((product, i) => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    className={i % 3 === 0 ? "md:translate-y-12" : ""} // Simple stagger effect
                />
            ))}
        </div>
      </div>

  );
}
