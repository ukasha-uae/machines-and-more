'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { approveProduct, getPendingProducts, rejectProduct } from '@/lib/firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle2, Clock, Eye, Loader2, XCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';

export default function ApprovalsPage() {
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [productToReject, setProductToReject] = useState<Product | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPendingProducts();
  }, []);

  const loadPendingProducts = async () => {
    try {
      setLoading(true);
      const pendingData = await getPendingProducts();
      setPendingProducts(pendingData);
    } catch (error) {
      console.error('Error loading pending products:', error);
      toast({ title: 'Error', description: 'Failed to load pending products', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (product: Product) => {
    setActionLoading(product.id);
    try {
      await approveProduct(product.id);
      toast({ title: 'Approved', description: `"${product.name}" is now live.` });
      await loadPendingProducts();
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
      await loadPendingProducts();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reject product', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh relative">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pointer-events-none" />

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="mb-6 md:mb-8">
          <Button variant="ghost" asChild className="mb-4 glass-effect hover:bg-white/10">
            <Link href="/admin" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Seller Portal
            </Link>
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-amber-600 flex items-center gap-2">
            <Clock className="h-8 w-8" /> Team Approvals
          </h1>
          <p className="text-muted-foreground">Review and approve listings before they go live.</p>
        </div>

        <Card className="glass-effect-strong depth-layer-1 border-0 border-l-4 border-l-amber-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <Clock className="h-5 w-5" />
              Pending Review ({pendingProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : pendingProducts.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                All caught up. There are no pending listings right now.
              </div>
            ) : (
              pendingProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  </div>

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

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" className="glass-effect" asChild>
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
              ))
            )}
          </CardContent>
        </Card>

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
