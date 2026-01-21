'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Product } from '@/types';
import { getProductBySlug } from '@/lib/firebase/firestore';
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
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Image Gallery */}
          <div className="lg:sticky lg:top-32 h-fit">
            <ImageGallery images={galleryImages} productName={product.name} />
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            {/* Product Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-sm text-amazon-orange font-medium mb-2 uppercase tracking-wide">
                {product.category.main} • {product.category.sub}
              </div>
              <h1 className="text-3xl font-bold mb-4 text-gray-900">{product.name}</h1>
              
              {/* Mock Rating */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < 4 ? 'text-amazon-orange' : 'text-gray-300'}`}>★</span>
                  ))}
                </div>
                <span className="text-sm text-blue-600 hover:text-amazon-orange cursor-pointer">
                  124 ratings
                </span>
              </div>

              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-1">Price:</div>
                <div className="text-4xl font-bold text-amazon-dark">
                  {formatPrice(product.price)}
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2 mb-4 text-lg">
                <span className="text-green-700 font-semibold">In Stock</span>
              </div>
              
              {/* Seller Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <span className="text-gray-600">Sold by:</span>
                  <span className="font-semibold text-gray-900">{product.seller.name}</span>
                  {product.seller.verified && (
                    <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-semibold">
                      <BadgeCheck className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">Ships from Accra, Ghana</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full bg-amazon-orange hover:bg-amazon-hover text-white font-semibold text-base h-12"
                  onClick={() => setRequestDialogOpen(true)}
                >
                  Request to Buy
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button size="lg" variant="outline" className="border-2" asChild>
                    <a href="tel:+233XXXXXXXXX" className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Call Us
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50" asChild>
                    <a 
                      href="https://wa.me/233XXXXXXXXX" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="h-5 w-5" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">About this item</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications Card */}
            {product.specs.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Technical Specifications</h2>
                <div className="divide-y">
                  {product.specs.map((spec, index) => (
                    <div key={index} className="py-3 flex justify-between">
                      <dt className="font-medium text-gray-700">{spec.key}</dt>
                      <dd className="text-gray-900 font-semibold">{spec.value}</dd>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold mb-3 text-gray-900">Delivery Information</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-amazon-orange">✓</span>
                  <span>Delivery available across Ghana</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amazon-orange">✓</span>
                  <span>Cash on Delivery option available</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amazon-orange">✓</span>
                  <span>Warranty and after-sales support</span>
                </li>
              </ul>
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
