'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  item: {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      slug: string;
      price: number;
      images: string[];
      stock: number;
      category: {
        name: string;
      };
    };
  };
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity } = item;
  const subtotal = product.price * quantity;

  return (
    <div className="p-6">
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <Link href={`/products/${product.slug}`}>
          <img
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-20 h-20 object-cover rounded-md border"
          />
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1">{product.category.name}</p>
          <p className="text-lg font-semibold text-gray-900 mt-2">
            ${product.price}
          </p>
          
          {/* Stock Warning */}
          {product.stock <= 5 && (
            <p className="text-sm text-orange-600 mt-1">
              Only {product.stock} left in stock
            </p>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onUpdateQuantity(item.id, quantity - 1)}
              disabled={quantity <= 1}
              className="h-8 w-8"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="px-3 py-1 min-w-[2rem] text-center text-sm">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onUpdateQuantity(item.id, quantity + 1)}
              disabled={quantity >= product.stock}
              className="h-8 w-8"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Subtotal */}
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900">
            ${subtotal.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}