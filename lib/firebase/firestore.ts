import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, PurchaseRequest } from '@/types';

// Products Collection
export const productsCollection = collection(db, 'products');

export async function getAllProducts(): Promise<Product[]> {
  const snapshot = await getDocs(query(productsCollection, orderBy('createdAt', 'desc')));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Product));
}

// Testing mode: show all products except rejected ones
export async function getApprovedProducts(): Promise<Product[]> {
  const snapshot = await getDocs(query(productsCollection, orderBy('createdAt', 'desc')));
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Product))
    .filter(p => p.status !== 'rejected');
}

// Only pending products — shown to admin for review
export async function getPendingProducts(): Promise<Product[]> {
  const q = query(productsCollection, where('status', '==', 'pending'));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Product))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function approveProduct(productId: string): Promise<void> {
  const res = await fetch(`/api/admin/products/${productId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'approved' }),
  });

  if (!res.ok) {
    throw new Error('Failed to approve product');
  }
}

export async function rejectProduct(productId: string, reason?: string): Promise<void> {
  const res = await fetch(`/api/admin/products/${productId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'rejected',
      ...(reason ? { rejectionReason: reason } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to reject product');
  }
}

export async function setProductFeatured(productId: string, featured: boolean): Promise<void> {
  const res = await fetch(`/api/admin/products/${productId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ featured }),
  });

  if (!res.ok) {
    throw new Error('Failed to update featured status');
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
  const ref = doc(db, 'products', productId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Product;
}

export async function updateProduct(productId: string, productData: Partial<Omit<Product, 'id'>>): Promise<void> {
  const res = await fetch(`/api/admin/products/${productId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    throw new Error('Failed to update product');
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const q = query(productsCollection, where('slug', '==', slug));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  } as Product;
}

export async function getProductsByCategory(mainCategory?: string, subCategory?: string): Promise<Product[]> {
  let q = query(productsCollection, orderBy('createdAt', 'desc'));
  
  if (mainCategory) {
    q = query(productsCollection, where('category.main', '==', mainCategory), orderBy('createdAt', 'desc'));
  }
  
  const snapshot = await getDocs(q);
  let products = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Product));

  // Keep category browsing aligned with homepage visibility rules in testing mode.
  products = products.filter(p => p.status !== 'rejected');
  
  // Filter by subcategory on client side
  if (subCategory) {
    products = products.filter(p => p.category.sub === subCategory);
  }
  
  return products;
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<string> {
  try {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      throw new Error('Failed to create product');
    }

    const payload = (await res.json()) as { id?: string };
    if (!payload.id) {
      throw new Error('Product creation response did not include id');
    }

    return payload.id;
  } catch (error) {
    console.error('❌ Error in addProduct:', error);
    throw error;
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  const res = await fetch(`/api/admin/products/${productId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete product');
  }
}

// Purchase Requests Collection
export const purchaseRequestsCollection = collection(db, 'purchase_requests');

export async function createPurchaseRequest(requestData: Omit<PurchaseRequest, 'id'>): Promise<string> {
  const docRef = await addDoc(purchaseRequestsCollection, {
    ...requestData,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function getAllPurchaseRequests(): Promise<PurchaseRequest[]> {
  const snapshot = await getDocs(query(purchaseRequestsCollection, orderBy('createdAt', 'desc')));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as PurchaseRequest));
}
