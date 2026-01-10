import { getProductById } from "@/lib/api/products";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductInfo from "@/components/shop/ProductInfo";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-canvas pt-24">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-2">
        {/* Left: Gallery (Scrolls naturally) */}
        <div className="w-full">
            <ProductGallery images={product.images} />
        </div>

        {/* Right: Info (Sticky) */}
        <div className="w-full relative">
            <ProductInfo product={product} /> 
        </div>
      </div>
    </div>
  );
}
