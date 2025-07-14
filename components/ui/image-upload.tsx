'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, Eye, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUrlAdd = (url: string) => {
    if (url.trim() && images.length < maxImages) {
      onChange([...images, url.trim()]);
    }
  };

  const handleImageRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleImageReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <Label>Product Images ({images.length}/{maxImages})</Label>
      
      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group aspect-square border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 hover:border-blue-400 transition-colors"
          >
            <img
              src={image}
              alt={`Product image ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-product.jpg';
              }}
            />
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setPreviewImage(image)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                </DialogContent>
              </Dialog>
              
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleImageRemove(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Primary image indicator */}
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                Primary
              </div>
            )}
            
            {/* Image order number */}
            <div className="absolute top-2 right-2 bg-black/70 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
              {index + 1}
            </div>
          </div>
        ))}
        
        {/* Add new image */}
        {images.length < maxImages && (
          <AddImageCard onAdd={handleImageUrlAdd} />
        )}
      </div>
      
      {/* URL Input for adding images */}
      <div className="flex gap-2">
        <Input
          placeholder="Enter image URL"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const target = e.target as HTMLInputElement;
              handleImageUrlAdd(target.value);
              target.value = '';
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const input = document.querySelector('input[placeholder="Enter image URL"]') as HTMLInputElement;
            if (input?.value) {
              handleImageUrlAdd(input.value);
              input.value = '';
            }
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add URL
        </Button>
      </div>
      
      <p className="text-sm text-gray-500">
        Add up to {maxImages} images. The first image will be used as the primary product image.
      </p>
    </div>
  );
}

function AddImageCard({ onAdd }: { onAdd: (url: string) => void }) {
  const [url, setUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (url.trim()) {
      onAdd(url.trim());
      setUrl('');
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <div className="aspect-square border-2 border-dashed border-blue-400 rounded-lg p-4 flex flex-col justify-center space-y-2">
        <Input
          placeholder="Image URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          autoFocus
        />
        <div className="flex space-x-2">
          <Button size="sm" onClick={handleAdd}>
            Add
          </Button>
          <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsAdding(true)}
      className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors group"
    >
      <Plus className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
      <span className="text-sm font-medium">Add Image</span>
    </button>
  );
}