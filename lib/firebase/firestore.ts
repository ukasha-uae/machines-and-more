import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  deleteDoc,
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
  
  // Filter by subcategory on client side
  if (subCategory) {
    products = products.filter(p => p.category.sub === subCategory);
  }
  
  return products;
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<string> {
  const docRef = await addDoc(productsCollection, {
    ...productData,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function deleteProduct(productId: string): Promise<void> {
  await deleteDoc(doc(db, 'products', productId));
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
