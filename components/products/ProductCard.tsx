'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200 bg-white group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.seller.verified && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
              <BadgeCheck className="h-3 w-3" />
              Verified
            </div>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          <div className="text-xs text-amazon-orange font-medium mb-1 uppercase tracking-wide">
            {product.category.main}
          </div>
          <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[40px] hover:text-amazon-orange transition-colors">
            {product.name}
          </h3>
          
          {/* Mock Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < 4 ? 'fill-amazon-orange text-amazon-orange' : 'fill-gray-300 text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">(124)</span>
          </div>

          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </p>
          </div>
          
          <p className="text-xs text-green-700 mt-1 font-medium">In Stock</p>
        </Link>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          asChild 
          className="w-full bg-amazon-orange hover:bg-amazon-hover text-white font-medium shadow-sm"
        >
          <Link href={`/products/${product.slug}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
