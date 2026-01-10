"use client";

import Image from "next/image";

export default function ProductGallery({ images }: { images: string[] }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {images.map((src, index) => (
        <div key={index} className="relative w-full aspect-[3/4] bg-neutral-100">
          <Image
            src={src}
            alt={`Product view ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}
