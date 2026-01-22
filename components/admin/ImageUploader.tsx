'use client';

import { useState, useRef } from 'react';
import { uploadProductImage, deleteProductImage } from '@/lib/firebase/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, GripVertical, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface UploadedImage {
  url: string;
  path: string;
  order: number;
  uploading?: boolean;
  progress?: number;
}

interface ImageUploaderProps {
  productId: string;
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}

export default function ImageUploader({ productId, images, onChange }: ImageUploaderProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Create initial image placeholders
    const newImages: UploadedImage[] = Array.from(files).map((file, index) => ({
      url: URL.createObjectURL(file),
      path: '',
      order: images.length + index,
      uploading: true,
      progress: 0,
    }));

    // Update state with placeholders
    let currentImages = [...images, ...newImages];
    onChange(currentImages);

    // Upload files one by one
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageIndex = images.length + i;

      try {
        const result = await uploadProductImage(file, productId, (progress) => {
          // Update progress for this specific image
          const updatedImages = [...currentImages];
          if (updatedImages[imageIndex]) {
            updatedImages[imageIndex] = {
              ...updatedImages[imageIndex],
              progress,
            };
            currentImages = updatedImages;
            onChange(updatedImages);
          }
        });

        // Update with final uploaded image
        const updatedImages = [...currentImages];
        if (updatedImages[imageIndex]) {
          updatedImages[imageIndex] = {
            url: result.url,
            path: result.path,
            order: imageIndex,
            uploading: false,
          };
          currentImages = updatedImages;
          onChange(updatedImages);
        }
      } catch (error) {
        console.error('Upload failed:', error);
        // Remove failed upload
        const updatedImages = currentImages
          .filter((_, idx) => idx !== imageIndex)
          .map((img, i) => ({ ...img, order: i }));
        currentImages = updatedImages;
        onChange(updatedImages);
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = async (index: number) => {
    const image = images[index];
    if (image.path) {
      try {
        await deleteProductImage(image.path);
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }
    const updatedImages = images.filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, order: i }));
    onChange(updatedImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    
    // Update orders
    const updatedImages = newImages.map((img, i) => ({ ...img, order: i }));
    onChange(updatedImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Images
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Upload multiple images. The first image will be the main product image.
        </p>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card
              key={index}
              draggable={!image.uploading}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative cursor-move ${draggedIndex === index ? 'opacity-50' : ''}`}
            >
              <CardContent className="p-2">
                <div className="relative aspect-square">
                  {image.uploading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <span className="text-sm">{Math.round(image.progress || 0)}%</span>
                    </div>
                  ) : (
                    <Image
                      src={image.url}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover rounded"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}
                  
                  {/* Badge for first image */}
                  {index === 0 && !image.uploading && (
                    <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Main
                    </div>
                  )}
                  
                  {/* Drag Handle */}
                  {!image.uploading && (
                    <div className="absolute top-1 right-8 bg-white/80 p-1 rounded cursor-move">
                      <GripVertical className="h-4 w-4" />
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  {!image.uploading && (
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
