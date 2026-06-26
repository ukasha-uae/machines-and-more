'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react';
import { CATEGORIES, Product } from '@/types';
import { GHANA_REGIONS, PRODUCT_CONDITION, STOCK_STATUS } from '@/types/locations';
import { getProductById, updateProduct } from '@/lib/firebase/firestore';
import { createSlug } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import ImageUploader from '@/components/admin/ImageUploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface UploadedImage {
  id: string;
  url: string;
  path: string;
  order: number;
}

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const productId = typeof params?.id === 'string' ? params.id : '';

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    mainCategory: '',
    subCategory: '',
    description: '',
    featured: false,
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
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);

  const selectedCategory = formData.mainCategory
    ? CATEGORIES[formData.mainCategory as keyof typeof CATEGORIES]
    : null;

  useEffect(() => {
    if (!productId) return;
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setInitialLoading(true);
      const data = await getProductById(productId);

      if (!data) {
        toast({ title: 'Not found', description: 'Product not found', variant: 'destructive' });
        router.push('/admin');
        return;
      }

      setProduct(data);

      const categoryKey = Object.entries(CATEGORIES).find(([, cat]) => cat.label === data.category.main)?.[0] || '';
      const sourceImages = data.gallery?.length
        ? data.gallery
        : [{ url: data.imageUrl, path: '', order: 0 }];

      setFormData({
        name: data.name || '',
        price: data.price?.toString() || '',
        mainCategory: categoryKey,
        subCategory: data.category?.sub || '',
        description: data.description || '',
        featured: Boolean(data.featured),
        sellerName: data.seller?.name || '',
        sellerVerified: Boolean(data.seller?.verified),
        sellerContactPhone: data.seller?.contactPhone || '',
        sellerContactEmail: data.seller?.contactEmail || '',
        productLocation: data.productLocation || '',
        stockStatus: (data.stockStatus || 'in-stock') as any,
        condition: (data.condition || 'new') as any,
        deliveryFeeEstimate:
          typeof data.deliveryFeeEstimate === 'number' ? String(data.deliveryFeeEstimate) : '',
        deliveryNotes: data.deliveryNotes || '',
      });

      setImages(
        sourceImages
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((image, index) => ({
            id: `${productId}-${index}`,
            url: image.url,
            path: image.path,
            order: image.order,
          }))
      );

      setSpecs(data.specs?.length ? data.specs : [{ key: '', value: '' }]);
    } catch (error) {
      console.error('Error loading product:', error);
      toast({ title: 'Error', description: 'Failed to load product', variant: 'destructive' });
    } finally {
      setInitialLoading(false);
    }
  };

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

    if (!product) return;

    if (images.length === 0) {
      toast({ title: 'Error', description: 'Please upload at least one image', variant: 'destructive' });
      return;
    }

    if (!formData.productLocation) {
      toast({ title: 'Error', description: 'Please select product location', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);

      const filteredSpecs = specs.filter((spec) => spec.key && spec.value);
      const galleryImages = images
        .map(({ url, path, order }) => ({ url, path, order }))
        .sort((a, b) => a.order - b.order);

      const seller: any = {
        name: formData.sellerName,
        verified: formData.sellerVerified,
      };
      if (formData.sellerContactPhone) seller.contactPhone = formData.sellerContactPhone;
      if (formData.sellerContactEmail) seller.contactEmail = formData.sellerContactEmail;

      const updatedProduct: any = {
        slug: product.slug || createSlug(formData.name),
        name: formData.name,
        featured: formData.featured,
        price: parseFloat(formData.price),
        category: {
          main: selectedCategory?.label || '',
          sub: formData.subCategory,
        },
        description: formData.description,
        seller,
        imageUrl: galleryImages[0].url,
        gallery: galleryImages,
        specs: filteredSpecs,
        productLocation: formData.productLocation,
        stockStatus: formData.stockStatus,
        condition: formData.condition,
        deliveryNotes: formData.deliveryNotes,
      };

      if (formData.deliveryFeeEstimate) {
        updatedProduct.deliveryFeeEstimate = parseFloat(formData.deliveryFeeEstimate);
      } else {
        updatedProduct.deliveryFeeEstimate = null;
      }

      await updateProduct(productId, updatedProduct);

      toast({ title: 'Saved', description: 'Product updated successfully' });
      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: `Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-mesh flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-mesh relative">
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
              Edit Product
            </h1>
            <p className="text-muted-foreground">Update product details and save changes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <Card className="glass-effect-strong depth-layer-1 border-0">
              <CardHeader>
                <CardTitle className="bg-gradient-primary bg-clip-text text-transparent">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
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
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="mainCategory">Main Category *</Label>
                    <Select
                      value={formData.mainCategory}
                      onValueChange={(value) => setFormData({ ...formData, mainCategory: value, subCategory: '' })}
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
                        onValueChange={(value) => setFormData({ ...formData, subCategory: value })}
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
                    rows={5}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Mark as Featured (show in homepage hero)
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect-strong depth-layer-1 border-0">
              <CardHeader>
                <CardTitle className="bg-gradient-industrial bg-clip-text text-transparent">Seller Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="sellerName">Seller Name *</Label>
                  <Input
                    id="sellerName"
                    value={formData.sellerName}
                    onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                    required
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
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="sellerContactEmail">Contact Email</Label>
                    <Input
                      id="sellerContactEmail"
                      type="email"
                      value={formData.sellerContactEmail}
                      onChange={(e) => setFormData({ ...formData, sellerContactEmail: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={formData.sellerVerified}
                    onChange={(e) => setFormData({ ...formData, sellerVerified: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="verified" className="cursor-pointer">
                    Verified Seller
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect-strong depth-layer-1 border-0">
              <CardHeader>
                <CardTitle className="bg-gradient-industrial bg-clip-text text-transparent">Location & Delivery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="productLocation">Product Location *</Label>
                    <Select
                      value={formData.productLocation}
                      onValueChange={(value) => setFormData({ ...formData, productLocation: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {GHANA_REGIONS.map((region) => (
                          <SelectItem key={region.value} value={region.label}>
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="deliveryFeeEstimate">Estimated Delivery Fee (GHS)</Label>
                    <Input
                      id="deliveryFeeEstimate"
                      type="number"
                      step="1"
                      value={formData.deliveryFeeEstimate}
                      onChange={(e) => setFormData({ ...formData, deliveryFeeEstimate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="stockStatus">Stock Status *</Label>
                    <Select
                      value={formData.stockStatus}
                      onValueChange={(value: any) => setFormData({ ...formData, stockStatus: value })}
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
                      onValueChange={(value: any) => setFormData({ ...formData, condition: value })}
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
                  <Label htmlFor="deliveryNotes">Delivery Notes</Label>
                  <Textarea
                    id="deliveryNotes"
                    value={formData.deliveryNotes}
                    onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect-strong depth-layer-1 border-0">
              <CardHeader>
                <CardTitle className="bg-gradient-primary bg-clip-text text-transparent">Product Images *</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploader productId={productId} images={images} onChange={setImages} />
              </CardContent>
            </Card>

            <Card className="glass-effect-strong depth-layer-1 border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="bg-gradient-industrial bg-clip-text text-transparent">Specifications</CardTitle>
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
                      />
                    </div>
                    <div className="flex-1 grid gap-2">
                      <Label htmlFor={`spec-value-${index}`}>Value</Label>
                      <Input
                        id={`spec-value-${index}`}
                        value={spec.value}
                        onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                      />
                    </div>
                    {specs.length > 1 && (
                      <Button type="button" size="sm" variant="destructive" onClick={() => handleRemoveSpec(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button type="button" variant="outline" asChild className="flex-1 glass-effect">
                <Link href="/admin">Cancel</Link>
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 gradient-primary text-white interactive-glow">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
