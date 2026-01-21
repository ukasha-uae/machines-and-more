'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Star, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden glass-effect depth-layer-2 interactive-lift group border-white/20 hover:border-primary/30 transition-all duration-500 relative">
      {/* Gradient glow on hover */}
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl pointer-events-none"></div>
      
      <Link href={`/products/${product.slug}`} className="block relative z-10">
        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-muted/50 to-muted rounded-t-xl">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Gradient overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {product.seller.verified && (
            <div className="absolute top-3 right-3 glass-effect-strong px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/20 animate-pulse-glow">
              <BadgeCheck className="h-3.5 w-3.5 text-green-400" />
              <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">Verified</span>
            </div>
          )}
          
          {/* Industrial machine sparkle indicator */}
          <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <Sparkles className="h-5 w-5 text-machine animate-pulse-glow-delay-1" />
          </div>
        </div>
      </Link>
      
      <CardContent className="p-5 relative z-10">
        <Link href={`/products/${product.slug}`}>
          <div className="inline-block mb-2">
            <div className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-gradient-primary text-white animate-shimmer">
              {product.category.main}
            </div>
          </div>
          
          <h3 className="font-semibold text-base line-clamp-2 mb-3 min-h-[48px] group-hover:bg-gradient-primary group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {product.name}
          </h3>
          
          {/* Mock Rating with glassmorphic background */}
          <div className="flex items-center gap-2 mb-3 glass-effect px-3 py-1.5 rounded-lg inline-flex border border-white/10">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 transition-all duration-300 ${
                    i < 4 
                      ? 'fill-machine text-machine group-hover:scale-110' 
                      : 'fill-muted text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-medium">(124)</span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-3xl font-bold bg-gradient-industrial bg-clip-text text-transparent">
              {formatPrice(product.price)}
            </p>
          </div>
          
          <div className="inline-flex items-center gap-1.5 glass-effect px-2.5 py-1 rounded-md border border-green-500/20">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse-glow"></div>
            <p className="text-xs text-green-600 dark:text-green-400 font-semibold">In Stock</p>
          </div>
        </Link>
      </CardContent>
      
      <CardFooter className="p-5 pt-0 relative z-10">
        <Button 
          asChild 
          className="w-full bg-gradient-industrial hover:shadow-xl hover:shadow-industrial/40 text-white font-semibold interactive-scale depth-layer-1 h-11 text-sm relative overflow-hidden group/btn"
        >
          <Link href={`/products/${product.slug}`}>
            <span className="relative z-10">View Details</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
