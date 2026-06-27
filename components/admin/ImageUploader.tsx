'use client';

import { useState, useRef } from 'react';
import { uploadProductImage, deleteProductImage } from '@/lib/firebase/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, GripVertical, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

interface UploadedImage {
  id: string;
  url: string;
  path: string;
  order: number;
  uploading?: boolean;
  progress?: number;
  error?: string;
}

interface ImageUploaderProps {
  productId: string;
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}

export default function ImageUploader({ productId, images, onChange }: ImageUploaderProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return `File too large. Max 10MB (${(file.size / 1024 / 1024).toFixed(1)}MB)`;
    }
    if (!file.type.startsWith('image/')) {
      return 'Only image files allowed';
    }
    return null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    processFiles(Array.from(files));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDropFiles = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files) {
      processFiles(Array.from(files));
    }
  };

  const processFiles = async (files: File[]) => {
    const validFiles: File[] = [];
    const errors: { name: string; error: string }[] = [];

    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        errors.push({ name: file.name, error });
      } else {
        validFiles.push(file);
      }
    }

    // Show validation errors
    if (errors.length > 0) {
      const errorMsg = errors.map(e => `${e.name}: ${e.error}`).join('\n');
      console.warn('File validation errors:\n' + errorMsg);
    }

    if (validFiles.length === 0) return;

    const newImages: UploadedImage[] = validFiles.map((file, index) => ({
      id: `upload-${Date.now()}-${index}-${file.name}`,
      url: URL.createObjectURL(file),
      path: '',
      order: images.length + index,
      uploading: true,
      progress: 1,
    }));

    let currentImages = [...images, ...newImages];
    onChange(currentImages);

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const placeholderId = newImages[i].id;

      const updatePlaceholder = (update: Partial<UploadedImage>) => {
        const updatedImages = currentImages.map((image) =>
          image.id === placeholderId ? { ...image, ...update } : image
        );
        currentImages = updatedImages;
        onChange(updatedImages);
      };

      try {
        const result = await uploadProductImage(file, productId, (progress) => {
          updatePlaceholder({ progress });
        });

        updatePlaceholder({
          url: result.url,
          path: result.path,
          uploading: false,
          progress: 100,
        });
      } catch (error) {
        console.error('Upload failed:', error);
        const errorMsg = error instanceof Error ? error.message : 'Upload failed';
        updatePlaceholder({
          uploading: false,
          error: errorMsg,
        });
      }
    }

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

  const handleRetryUpload = async (index: number) => {
    // For now, just remove and let user re-upload
    handleRemove(index);
  };

  const handleCardDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleCardDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    
    const updatedImages = newImages.map((img, i) => ({ ...img, order: i }));
    onChange(updatedImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDropFiles}
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold">Drag images here or click to upload</h3>
            <p className="text-sm text-muted-foreground mt-1">
              PNG, JPG up to 10MB each. Upload multiple at once.
            </p>
          </div>
          <Button
            type="button"
            variant="default"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2"
          >
            <Upload className="mr-2 h-4 w-4" />
            Select Images
          </Button>
        </div>
      </div>

      {/* Image Count */}
      {images.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {images.length} image{images.length !== 1 ? 's' : ''} uploaded
          {images.some(img => img.uploading) && ' (uploading...)'}
        </p>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card
              key={image.id}
              draggable={!image.uploading && !image.error}
              onDragStart={() => handleCardDragStart(index)}
              onDragOver={(e) => handleCardDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative overflow-hidden transition-all ${
                draggedIndex === index ? 'opacity-50' : ''
              } ${image.error ? 'border-red-500' : ''}`}
            >
              <CardContent className="p-2">
                <div className="relative aspect-square">
                  {image.uploading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <span className="text-xs font-semibold">
                        {Math.round(image.progress || 0)}%
                      </span>
                    </div>
                  ) : image.error ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 p-2">
                      <AlertCircle className="h-6 w-6 text-red-500 mb-1" />
                      <span className="text-xs text-red-600 text-center">{image.error}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="mt-2 h-7 text-xs"
                        onClick={() => handleRetryUpload(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Image
                        src={image.url}
                        alt={`Product image ${index + 1}`}
                        fill
                        unoptimized
                        className="object-cover rounded"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <CheckCircle2 className="absolute bottom-1 left-1 h-5 w-5 text-green-500 bg-white rounded-full" />
                    </>
                  )}
                  
                  {/* Badge for first image */}
                  {index === 0 && !image.uploading && !image.error && (
                    <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded font-semibold">
                      Main
                    </div>
                  )}
                  
                  {/* Drag Handle */}
                  {!image.uploading && !image.error && (
                    <div className="absolute top-1 right-8 bg-white/90 p-1 rounded cursor-move hover:bg-white transition-colors">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  {!image.uploading && (
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                      title="Remove image"
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
