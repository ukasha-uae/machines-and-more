import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot
} from 'firebase/storage';
import { storage } from './firebase';
import { firebaseConfig } from './config';

export interface UploadProgress {
  progress: number;
  downloadURL?: string;
  error?: string;
}

export async function uploadProductImage(
  file: File,
  productId: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string; path: string }> {
  if (!firebaseConfig.storageBucket || firebaseConfig.storageBucket.includes('your-storage-bucket')) {
    throw new Error(
      'Firebase storage bucket is not configured. Set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in your environment variables.'
    );
  }

  try {
    console.log('🔄 Starting upload:', { fileName: file.name, size: file.size, productId });
    
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `products/${productId}/${fileName}`);
    
    console.log('📦 Storage ref created:', storageRef.fullPath);
    
    const uploadTask = uploadBytesResumable(storageRef, file, { contentType: file.type });
    
    return new Promise((resolve, reject) => {
      const unsubscribe = uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progress === 0 && snapshot.bytesTransferred > 0) {
            progress = 1;
          }
          console.log('📊 Upload progress:', Math.round(progress) + '%');
          if (onProgress) onProgress(progress);
        },
        (error) => {
          unsubscribe();
          console.error('❌ Upload error:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          reject(error);
        },
        async () => {
          unsubscribe();
          try {
            console.log('✅ Upload completed, getting download URL...');
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('✅ Download URL obtained:', downloadURL);
            resolve({
              url: downloadURL,
              path: storageRef.fullPath
            });
          } catch (urlError) {
            console.error('❌ Error getting download URL:', urlError);
            reject(urlError);
          }
        }
      );
    });
  } catch (error) {
    console.error('❌ Upload initialization failed:', error);
    throw error;
  }
}

export async function deleteProductImage(imagePath: string): Promise<void> {
  const imageRef = ref(storage, imagePath);
  await deleteObject(imageRef);
}
