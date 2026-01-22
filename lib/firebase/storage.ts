import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot
} from 'firebase/storage';
import { storage } from './firebase';

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
  try {
    console.log('🔄 Starting upload:', { fileName: file.name, size: file.size, productId });
    
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `products/${productId}/${fileName}`);
    
    console.log('📦 Storage ref created:', storageRef.fullPath);
    
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('📊 Upload progress:', Math.round(progress) + '%');
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error('❌ Upload error:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          reject(error);
        },
        async () => {
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
