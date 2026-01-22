'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/types';
import { GHANA_REGIONS, STOCK_STATUS, PRODUCT_CONDITION } from '@/types/locations';
import { addProduct } from '@/lib/firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUploader from '@/components/admin/ImageUploader';
import { useToast } from '@/hooks/use-toast';
import { createSlug } from '@/lib/utils';
import { ArrowLeft, Plus, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface UploadedImage {
  url: string;
  path: string;
  order: number;
}

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    mainCategory: '',
    subCategory: '',
    description: '',
    sellerName: '',
    sellerVerified: true,
    sellerContactPhone: '',
    sellerContactEmail: '',
    productLocation: '',
    stockStatus: 'in-stock' as const,
    condition: 'new' as const,
    deliveryFeeEstimate: '',
    deliveryNotes: '',
  });

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' },
  ]);

  // Generate temporary product ID for image uploads
  const [tempProductId] = useState(() => `temp-${Date.now()}`);

  const selectedCategory = formData.mainCategory
    ? CATEGORIES[formData.mainCategory as keyof typeof CATEGORIES]
    : null;

  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const updatedSpecs = [...specs];
    updatedSpecs[index][field] = value;
    setSpecs(updatedSpecs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast({
        title: 'Error',
        description: 'Please upload at least one image',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.productLocation) {
      toast({
        title: 'Error',
        description: 'Please select product location',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      const slug = createSlug(formData.name);
      const filteredSpecs = specs.filter(spec => spec.key && spec.value);

      await addProduct({
        slug,
        name: formData.name,
        price: parseFloat(formData.price),
        category: {
          main: selectedCategory?.label || '',
          sub: formData.subCategory,
        },
        description: formData.description,
        seller: {
          name: formData.sellerName,
          verified: formData.sellerVerified,
          contactPhone: formData.sellerContactPhone || undefined,
          contactEmail: formData.sellerContactEmail || undefined,
        },
        imageUrl: images[0].url,
        gallery: images,
        specs: filteredSpecs,
        productLocation: formData.productLocation,
        stockStatus: formData.stockStatus,
        condition: formData.condition,
        deliveryFeeEstimate: formData.deliveryFeeEstimate ? parseFloat(formData.deliveryFeeEstimate) : undefined,
        deliveryNotes: formData.deliveryNotes || undefined,
        createdAt: new Date().toISOString(),
      });

      toast({
        title: 'Success',
        description: 'Product added successfully!',
      });

      router.push('/admin');
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: 'Error',
        description: 'Failed to add product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh relative">
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <Button variant="ghost" asChild className="mb-4 glass-effect hover:bg-white/10">
              <Link href="/admin" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Seller Portal
              </Link>
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Add New Product
            </h1>
            <p className="text-muted-foreground">Fill in the product details below</p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          {/* Basic Information */}
          <Card className="glass-effect-strong depth-layer-1 border-0">
            <CardHeader>
              <CardTitle className="bg-gradient-primary bg-clip-text text-transparent">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Caterpillar Excavator 320D"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">Price (GHS) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  placeholder="e.g., 85000"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="mainCategory">Main Category *</Label>
                  <Select
                    value={formData.mainCategory}
                    onValueChange={(value) =>
                      setFormData({ ...formData, mainCategory: value, subCategory: '' })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORIES).map(([key, category]) => (
                        <SelectItem key={key} value={key}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCategory && (
                  <div className="grid gap-2">
                    <Label htmlFor="subCategory">Sub Category *</Label>
                    <Select
                      value={formData.subCategory}
                      onValueChange={(value) =>
                        setFormData({ ...formData, subCategory: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCategory.subcategories.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Detailed product description..."
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Seller Information */}
          <Card className="glass-effect-strong depth-layer-1 border-0">
            <CardHeader>
              <CardTitle className="bg-gradient-industrial bg-clip-text text-transparent">
                Seller Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="sellerName">Seller Name *</Label>
                <Input
                  id="sellerName"
                  value={formData.sellerName}
                  onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                  required
                  placeholder="e.g., Ghana Heavy Equipment Ltd."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sellerContactPhone">Contact Phone</Label>
                  <Input
                    id="sellerContactPhone"
                    type="tel"
                    value={formData.sellerContactPhone}
                    onChange={(e) => setFormData({ ...formData, sellerContactPhone: e.target.value })}
                    placeholder="e.g., +233 24 123 4567"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="sellerContactEmail">Contact Email</Label>
                  <Input
                    id="sellerContactEmail"
                    type="email"
                    value={formData.sellerContactEmail}
                    onChange={(e) => setFormData({ ...formData, sellerContactEmail: e.target.value })}
                    placeholder="e.g., seller@example.com"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={formData.sellerVerified}
                  onChange={(e) =>
                    setFormData({ ...formData, sellerVerified: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="verified" className="cursor-pointer">
                  Verified Seller
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Product Location & Delivery */}
          <Card className="glass-effect-strong depth-layer-1 border-0">
            <CardHeader>
              <CardTitle className="bg-gradient-industrial bg-clip-text text-transparent">
                Location & Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="productLocation">Product Location *</Label>
                  <Select
                    value={formData.productLocation}
                    onValueChange={(value) =>
                      setFormData({ ...formData, productLocation: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region where product is located" />
                    </SelectTrigger>
                    <SelectContent>
                      {GHANA_REGIONS.map((region) => (
                        <SelectItem key={region.value} value={region.label}>
                          {region.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Where is this product currently located? This helps buyers estimate delivery time.
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="deliveryFeeEstimate">Estimated Delivery Fee (GHS)</Label>
                  <Input
                    id="deliveryFeeEstimate"
                    type="number"
                    step="1"
                    value={formData.deliveryFeeEstimate}
                    onChange={(e) => setFormData({ ...formData, deliveryFeeEstimate: e.target.value })}
                    placeholder="e.g., 500"
                  />
                  <p className="text-xs text-muted-foreground">
                    Base delivery fee within Accra. Buyers pay for delivery.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="stockStatus">Stock Status *</Label>
                  <Select
                    value={formData.stockStatus}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, stockStatus: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STOCK_STATUS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="condition">Product Condition *</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, condition: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CONDITION.map((cond) => (
                        <SelectItem key={cond.value} value={cond.value}>
                          <div>
                            <div>{cond.label}</div>
                            <div className="text-xs text-muted-foreground">{cond.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="deliveryNotes">Delivery Notes (Optional)</Label>
                <Textarea
                  id="deliveryNotes"
                  value={formData.deliveryNotes}
                  onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                  placeholder="e.g., Requires flatbed truck for transport, assembly available for additional fee"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Special delivery requirements, installation services, or additional fees.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="glass-effect-strong depth-layer-1 border-0">
            <CardHeader>
              <CardTitle className="bg-gradient-primary bg-clip-text text-transparent">
                Product Images *
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                productId={tempProductId}
                images={images}
                onChange={setImages}
              />
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card className="glass-effect-strong depth-layer-1 border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="bg-gradient-industrial bg-clip-text text-transparent">
                  Specifications
                </CardTitle>
                <Button type="button" size="sm" onClick={handleAddSpec} className="glass-effect">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Spec
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {specs.map((spec, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1 grid gap-2">
                    <Label htmlFor={`spec-key-${index}`}>Key</Label>
                    <Input
                      id={`spec-key-${index}`}
                      value={spec.key}
                      onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                      placeholder="e.g., Engine Power"
                    />
                  </div>
                  <div className="flex-1 grid gap-2">
                    <Label htmlFor={`spec-value-${index}`}>Value</Label>
                    <Input
                      id={`spec-value-${index}`}
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                      placeholder="e.g., 105 kW"
                    />
                  </div>
                  {specs.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveSpec(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" asChild className="flex-1 glass-effect">
              <Link href="/admin">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 gradient-primary text-white interactive-glow">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Product...
                </>
              ) : (
                'Add Product'
              )}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
