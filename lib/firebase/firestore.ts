import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  deleteDoc,
  updateDoc,
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

// Only approved products (or old products without a status field) — shown to public
export async function getApprovedProducts(): Promise<Product[]> {
  const snapshot = await getDocs(query(productsCollection, orderBy('createdAt', 'desc')));
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Product))
    .filter(p => !p.status || p.status === 'approved');
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
  await updateDoc(doc(db, 'products', productId), { status: 'approved' });
}

export async function rejectProduct(productId: string, reason?: string): Promise<void> {
  await updateDoc(doc(db, 'products', productId), {
    status: 'rejected',
    ...(reason ? { rejectionReason: reason } : {}),
  });
}

export async function setProductFeatured(productId: string, featured: boolean): Promise<void> {
  await updateDoc(doc(db, 'products', productId), { featured });
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
  await updateDoc(doc(db, 'products', productId), productData);
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
  try {
    console.log('� Calling addDoc to Firestore...');

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore write timed out after 10s — likely a security rules permission issue. Check Firebase Console → Firestore → Rules.')), 10000)
    );

    const writePromise = addDoc(productsCollection, {
      ...productData,
      createdAt: serverTimestamp()
    });

    const docRef = await Promise.race([writePromise, timeoutPromise]);
    console.log('✅ Product saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error in addProduct:', error);
    throw error;
  }
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
