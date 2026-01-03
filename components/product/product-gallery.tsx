"use client"

import { useState } from "react"
import Image from "next/image"
import type { ProductImage } from "@/lib/api/products"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: ProductImage[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  if (!images.length) {
    return (
      <div className="aspect-[3/4] bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">No images available</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-4 overflow-auto no-scrollbar">
        {images.map((image, idx) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(idx)}
            className={cn(
              "relative aspect-[3/4] w-20 flex-shrink-0 border-2 transition-all",
              selectedImage === idx ? "border-primary" : "border-transparent opacity-60 hover:opacity-100",
            )}
          >
            <Image
              src={image.url || "/placeholder.svg"}
              alt={image.alt_text || "Product thumbnail"}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative aspect-[3/4] flex-1 bg-muted overflow-hidden">
        <Image
          src={images[selectedImage]?.url || "/placeholder.svg"}
          alt={images[selectedImage]?.alt_text || "Product image"}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  )
}
