import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Log initialization status
if (typeof window !== 'undefined') {
  console.log('🔥 Firebase initialized');
  console.log('📦 Storage bucket:', firebaseConfig.storageBucket);
  console.log('🗄️ Project ID:', firebaseConfig.projectId);
}

export default app;
