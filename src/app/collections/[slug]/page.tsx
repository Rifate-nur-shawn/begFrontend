import { PRODUCTS } from "@/lib/api/products";
import ProductCard from "@/components/shop/ProductCard";

// Mock collection data fetch
const getCollectionProducts = async (slug: string) => {
    // In a real app, this would filter by slug
    return PRODUCTS; 
};

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getCollectionProducts(slug);

  return (
    <div className="min-h-screen bg-canvas pt-32 pb-24 px-4 md:px-12">
      <div className="max-w-[1920px] mx-auto">
        
        {/* Collection Header */}
        <div className="mb-16 md:mb-24 text-center">
            <h1 className="font-display text-5xl md:text-8xl mb-6 capitalize">{slug.replace(/-/g, " ")}</h1>
            <p className="font-utility text-xs tracking-widest uppercase max-w-sm mx-auto text-neutral-500">
                A curated selection of the finest pieces for the modern wardrobe.
            </p>
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
    </div>
  );
}
