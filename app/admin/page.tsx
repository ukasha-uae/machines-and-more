'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import {
  getAllProducts,
  getPendingProducts,
  approveProduct,
  rejectProduct,
  deleteProduct,
} from '@/lib/firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Loader2, Trash2, Database, CheckCircle2, XCircle, Clock, Eye } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToReject, setProductToReject] = useState<Product | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [allData, pendingData] = await Promise.all([getAllProducts(), getPendingProducts()]);
      setProducts(allData.filter(p => !p.status || p.status === 'approved'));
      setPendingProducts(pendingData);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({ title: 'Error', description: 'Failed to load products', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (product: Product) => {
    setActionLoading(product.id);
    try {
      await approveProduct(product.id);
      toast({ title: '✅ Approved!', description: `"${product.name}" is now live.` });
      await loadAll();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to approve product', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectClick = (product: Product) => {
    setProductToReject(product);
    setRejectReason('');
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!productToReject) return;
    setActionLoading(productToReject.id);
    try {
      await rejectProduct(productToReject.id, rejectReason);
      toast({ title: 'Rejected', description: `"${productToReject.name}" has been rejected.` });
      setRejectDialogOpen(false);
      setProductToReject(null);
      await loadAll();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reject product', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      toast({ title: 'Success', description: 'Product deleted successfully' });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      await loadAll();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete product', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh relative">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pointer-events-none" />

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Seller Portal
          </h1>
          <p className="text-muted-foreground">Manage products, approvals and inventory</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="glass-effect-strong depth-layer-1 border-0 interactive-scale">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Live Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">{products.length}</p>
            </CardContent>
          </Card>
          <Card className="glass-effect-strong depth-layer-1 border-0 interactive-scale border-l-4 border-l-amber-400">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4 text-amber-500" /> Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-500">{pendingProducts.length}</p>
            </CardContent>
          </Card>
          <Card className="glass-effect-strong depth-layer-1 border-0 interactive-scale">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold bg-gradient-industrial bg-clip-text text-transparent">
                {new Set(products.map(p => p.category.main)).size}
              </p>
            </CardContent>
          </Card>
          <Card className="glass-effect-strong depth-layer-1 border-0 interactive-scale">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Verified Sellers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {products.filter(p => p.seller.verified).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-8">
          <Button size="lg" className="gradient-primary text-white interactive-glow" asChild>
            <Link href="/admin/add-product" className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Product
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="glass-effect interactive-scale" asChild>
            <Link href="/admin/seed" className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Tools
            </Link>
          </Button>
        </div>

        {/* Pending Review Section */}
        {loading ? null : pendingProducts.length > 0 && (
          <Card className="glass-effect-strong depth-layer-1 border-0 mb-6 md:mb-8 border-l-4 border-l-amber-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600">
                <Clock className="h-5 w-5" />
                Pending Review ({pendingProducts.length})
                <span className="ml-2 text-xs font-normal text-muted-foreground">Review and approve before items go live</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50"
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.category.main} › {product.category.sub}
                    </p>
                    <p className="text-sm font-medium text-primary">{formatPrice(product.price)}</p>
                    <p className="text-sm text-muted-foreground">
                      📍 {product.productLocation} · 👤 {product.seller.name}
                      {product.seller.contactPhone && ` · 📞 ${product.seller.contactPhone}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="glass-effect"
                      asChild
                    >
                      <Link href={`/products/${product.slug}`} target="_blank">
                        <Eye className="h-4 w-4 mr-1" /> Preview
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={actionLoading === product.id}
                      onClick={() => handleApprove(product)}
                    >
                      {actionLoading === product.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <><CheckCircle2 className="h-4 w-4 mr-1" /> Approve</>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={actionLoading === product.id}
                      onClick={() => handleRejectClick(product)}
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Live Products Table */}
        <Card className="glass-effect-strong depth-layer-1 border-0">
          <CardHeader>
            <CardTitle className="bg-gradient-primary bg-clip-text text-transparent">
              Live Products ({products.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Database className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">No live products yet</p>
                <p className="text-muted-foreground mb-4">
                  Approve pending products above or add products via the button.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" className="glass-effect" asChild>
                    <Link href="/admin/seed">Seed Database</Link>
                  </Button>
                  <Button className="gradient-primary text-white" asChild>
                    <Link href="/admin/add-product">Add Product</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} className="hover:bg-white/5">
                        <TableCell className="font-medium">
                          <Link
                            href={`/products/${product.slug}`}
                            className="hover:text-primary transition-colors"
                          >
                            {product.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {product.category.main} • {product.category.sub}
                        </TableCell>
                        <TableCell className="font-semibold">{formatPrice(product.price)}</TableCell>
                        <TableCell>
                          {product.seller.name}
                          {product.seller.verified && (
                            <span className="ml-1 text-green-600 text-xs">✓</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClick(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Confirmation Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Product</DialogTitle>
              <DialogDescription>
                Reject "{productToReject?.name}"? You can optionally provide a reason.
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <textarea
                className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="Reason for rejection (optional)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
              <Button
                variant="destructive"
                disabled={actionLoading === productToReject?.id}
                onClick={handleRejectConfirm}
              >
                {actionLoading === productToReject?.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reject'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
