'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Product } from '@/types';
import { getProductBySlug } from '@/lib/firebase/firestore';
import { getStockStatusDisplay, getConditionDisplay } from '@/lib/product-helpers';
import ImageGallery from '@/components/products/ImageGallery';
import RequestBuyDialog from '@/components/products/RequestBuyDialog';
import AiResponseDialog from '@/components/products/AiResponseDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeCheck, Phone, MessageCircle, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  useEffect(() => {
    loadProduct();
  }, [params.slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductBySlug(params.slug);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSuccess = (response: string) => {
    setAiResponse(response);
    setAiDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background gradient-mesh">
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const galleryImages = [
    { url: product.imageUrl, order: 0 },
    ...product.gallery
  ].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-background gradient-mesh">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Image Gallery */}
          <div className="lg:sticky lg:top-32 h-fit">
            <ImageGallery images={galleryImages} productName={product.name} />
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            {/* Product Info Card */}
            <div className="glass-effect-strong depth-layer-3 rounded-2xl p-6 md:p-8 border border-white/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-primary opacity-5 blur-3xl"></div>
              <div className="relative z-10">
                <div className="inline-block mb-3">
                  <div className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-gradient-primary text-white">
                    {product.category.main} • {product.category.sub}
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-industrial bg-clip-text text-transparent">{product.name}</h1>
              
                {/* Mock Rating */}
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/20">
                  <div className="glass-effect px-4 py-2 rounded-lg inline-flex items-center gap-2 border border-white/10">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < 4 ? 'text-machine' : 'text-muted-foreground'}`}>★</span>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">
                      (124)
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-sm text-muted-foreground mb-2">Price:</div>
                  <div className="text-5xl font-bold bg-gradient-industrial bg-clip-text text-transparent">
                    {formatPrice(product.price)}
                  </div>
                </div>

                {/* Availability & Condition */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className={`inline-flex items-center gap-2 glass-effect px-4 py-2 rounded-lg border ${
                    product.stockStatus === 'in-stock' ? 'border-green-500/20' :
                    product.stockStatus === 'limited' ? 'border-amber-500/20' :
                    product.stockStatus === 'on-order' ? 'border-blue-500/20' :
                    'border-red-500/20'
                  }`}>
                    <div className={`h-2.5 w-2.5 rounded-full ${
                      product.stockStatus === 'in-stock' ? 'bg-green-400 animate-pulse-glow' :
                      product.stockStatus === 'limited' ? 'bg-amber-400 animate-pulse-glow' :
                      product.stockStatus === 'on-order' ? 'bg-blue-400' :
                      'bg-red-400'
                    }`}></div>
                    <span className={`font-semibold ${
                      product.stockStatus === 'in-stock' ? 'text-green-600 dark:text-green-400' :
                      product.stockStatus === 'limited' ? 'text-amber-600 dark:text-amber-400' :
                      product.stockStatus === 'on-order' ? 'text-blue-600 dark:text-blue-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {getStockStatusDisplay(product.stockStatus).label}
                    </span>
                  </div>
                  
                  <div className="inline-flex items-center gap-2 glass-effect px-4 py-2 rounded-lg border border-white/10">
                    <span className="font-semibold text-foreground">
                      {getConditionDisplay(product.condition).label}
                    </span>
                  </div>
                </div>
              
                {/* Seller Info */}
                <div className="glass-effect rounded-xl p-5 mb-6 border border-white/10">
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <span className="text-muted-foreground">Sold by:</span>
                    <span className="font-bold">{product.seller.name}</span>
                    {product.seller.verified && (
                      <span className="flex items-center gap-1.5 glass-effect-strong border border-green-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
                        <BadgeCheck className="h-3.5 w-3.5 text-green-400" />
                        <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">Verified</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    📍 Product located in {product.productLocation}
                  </p>
                  {(product.seller.contactPhone || product.seller.contactEmail) && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
                      {product.seller.contactPhone && (
                        <p className="text-xs text-muted-foreground">📞 {product.seller.contactPhone}</p>
                      )}
                      {product.seller.contactEmail && (
                        <p className="text-xs text-muted-foreground">✉️ {product.seller.contactEmail}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    variant="industrial"
                    className="w-full font-bold text-base h-14 text-lg relative overflow-hidden group/btn"
                    onClick={() => setRequestDialogOpen(true)}
                  >
                    <span className="relative z-10">Request to Buy</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button size="lg" variant="outline" className="glass-effect border-white/20 hover:bg-primary/10 h-12" asChild>
                      <a href="tel:+233XXXXXXXXX" className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        <span className="font-semibold">Call Us</span>
                      </a>
                    </Button>
                    <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-600/50 text-white h-12" asChild>
                      <a 
                        href="https://wa.me/233XXXXXXXXX" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span className="font-semibold">WhatsApp</span>
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="glass-effect-strong depth-layer-2 rounded-2xl p-6 md:p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">About this item</h2>
              <p className="text-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications Card */}
            {product.specs.length > 0 && (
              <div className="glass-effect-strong depth-layer-2 rounded-2xl p-6 md:p-8 border border-white/20">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">Technical Specifications</h2>
                <div className="space-y-4">
                  {product.specs.map((spec, index) => (
                    <div key={index} className="glass-effect rounded-lg p-4 flex justify-between items-center border border-white/10 interactive-scale">
                      <dt className="font-semibold text-muted-foreground">{spec.key}</dt>
                      <dd className="font-bold text-foreground">{spec.value}</dd>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Info */}
            <div className="glass-effect-strong rounded-2xl p-6 md:p-8 border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-primary opacity-10 blur-3xl"></div>
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-4 bg-gradient-primary bg-clip-text text-transparent">Delivery & Service</h3>
                
                {product.deliveryFeeEstimate && (
                  <div className="glass-effect-strong rounded-xl p-4 mb-4 border border-machine/20">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Estimated Delivery Fee:</span>
                      <span className="text-xl font-bold bg-gradient-industrial bg-clip-text text-transparent">
                        {formatPrice(product.deliveryFeeEstimate)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      📍 Base fee from {product.productLocation} to Accra. Final cost varies by destination.
                    </p>
                  </div>
                )}

                {product.deliveryNotes && (
                  <div className="glass-effect rounded-xl p-4 mb-4 border border-amber-500/20">
                    <p className="text-sm font-medium mb-1">⚠️ Delivery Notes:</p>
                    <p className="text-sm text-muted-foreground">{product.deliveryNotes}</p>
                  </div>
                )}
                
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3 glass-effect p-3 rounded-lg border border-white/10">
                    <span className="text-machine text-xl">✓</span>
                    <div>
                      <span className="font-medium block">Available across Ghana</span>
                      <span className="text-xs text-muted-foreground">We deliver to major cities and regions. Buyer pays delivery fee.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 glass-effect p-3 rounded-lg border border-white/10">
                    <span className="text-machine text-xl">✓</span>
                    <div>
                      <span className="font-medium block">Flexible Payment Options</span>
                      <span className="text-xs text-muted-foreground">Cash on delivery, bank transfer, mobile money (MTN, Vodafone, AirtelTigo)</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 glass-effect p-3 rounded-lg border border-white/10">
                    <span className="text-machine text-xl">✓</span>
                    <div>
                      <span className="font-medium block">Pickup Available</span>
                      <span className="text-xs text-muted-foreground">Product located in {product.productLocation}. Contact seller for pickup arrangements.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 glass-effect p-3 rounded-lg border border-white/10">
                    <span className="text-machine text-xl">✓</span>
                    <div>
                      <span className="font-medium block">Quality Assurance</span>
                      <span className="text-xs text-muted-foreground">Warranty and after-sales support included from verified sellers</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <RequestBuyDialog
        open={requestDialogOpen}
        onOpenChange={setRequestDialogOpen}
        productId={product.id}
        productName={product.name}
        onSuccess={handleRequestSuccess}
      />

      <AiResponseDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        response={aiResponse}
      />
    </div>
  );
}
