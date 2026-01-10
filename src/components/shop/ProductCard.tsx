"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/api/products";

export default function ProductCard({ product, className }: { product: Product; className?: string }) {
  return (
    <Link href={`/product/${product.id}`} className={`group block relative ${className}`}>
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.images[1] && (
            <Image
                src={product.images[1]}
                alt={product.name}
                fill
                className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100 absolute inset-0"
            />
        )}
        
        {/* Quick Add / Badge */}
        {product.isNew && (
            <span className="absolute top-2 left-2 bg-canvas text-primary text-[10px] uppercase tracking-widest px-2 py-1">
                New
            </span>
        )}
      </div>

      <div className="mt-3 flex justify-between items-start">
        <div>
            <h3 className="font-utility text-xs tracking-widest uppercase text-primary group-hover:underline underline-offset-4">
            {product.name}
            </h3>
            <p className="font-utility text-[10px] text-neutral-500 mt-1 uppercase">
                {product.category}
            </p>
        </div>
        <p className="font-utility text-xs text-primary">
          ${product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
