'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, Package, Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import WishlistButton from '@/components/ui/wishlist-button';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  sku: string;
  stock: number;
  averageRating: number;
  reviewCount: number;
}

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const discountPercentage = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      router.push('/auth/signin');
      return;
    }

    setAddingToCart(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      });

      if (response.ok) {
        toast({
          title: "Added to cart",
          description: `${quantity} item(s) added to your cart successfully.`,
        });
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to add item to cart.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Title with Animation */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>SKU: {product.sku}</span>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Package className="w-4 h-4" />
            <span>In Stock</span>
          </div>
        </div>
      </div>

      {/* Rating with Enhanced Animation */}
      <div className="flex items-center space-x-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 transition-all duration-300 hover:scale-125 ${
                star <= Math.floor(product.averageRating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-gray-700">
          {product.averageRating} ({product.reviewCount} reviews)
        </span>
        {product.reviewCount > 100 && (
          <Badge className="bg-green-100 text-green-800 animate-pulse">
            <Award className="w-3 h-3 mr-1" />
            Bestseller
          </Badge>
        )}
      </div>

      {/* Price with Enhanced Styling */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
            ${product.price}
          </span>
          {product.comparePrice && (
            <>
              <span className="text-xl text-gray-500 line-through">
                ${product.comparePrice}
              </span>
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse">
                <Zap className="w-3 h-3 mr-1" />
                {discountPercentage}% OFF
              </Badge>
            </>
          )}
        </div>
        {product.comparePrice && (
          <p className="text-sm text-green-600 font-medium">
            You save ${(product.comparePrice - product.price).toFixed(2)}!
          </p>
        )}
      </div>

      {/* Stock Status with Animation */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center space-x-2">
          <Badge 
            variant={product.stock > 0 ? 'default' : 'destructive'}
            className="animate-pulse"
          >
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </Badge>
          {product.stock > 0 && product.stock <= 10 && (
            <Badge variant="destructive" className="animate-bounce">
              Only {product.stock} left!
            </Badge>
          )}
        </div>
      </div>

      {/* Description with Better Typography */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Product Description</h3>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed text-base">{product.description}</p>
        </div>
      </div>

      <Separator />

      {/* Quantity and Add to Cart with Enhanced Styling */}
      <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-center space-x-6">
          <span className="font-medium text-gray-900 text-lg">Quantity:</span>
          <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors duration-300">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="h-12 w-12 hover:bg-gray-100 transition-all duration-300"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="px-6 py-3 min-w-[4rem] text-center font-semibold text-lg bg-gray-50">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= product.stock}
              className="h-12 w-12 hover:bg-gray-100 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addingToCart}
            className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            size="lg"
          >
            <ShoppingCart className="w-5 h-5 mr-3" />
            {addingToCart ? (
              <span className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Adding...
              </span>
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              `Add to Cart - $${(product.price * quantity).toFixed(2)}`
            )}
          </Button>
          <WishlistButton 
            productId={product.id} 
            size="lg"
            className="h-14 w-14 border-2 border-gray-200 hover:border-red-300 hover:bg-red-50"
          />
        </div>
      </div>

      <Separator />

      {/* Enhanced Features Section */}
      <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <h3 className="font-semibold text-gray-900 text-lg mb-4">Why Choose This Product?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-300">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Truck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">Free Shipping</p>
              <p className="text-sm text-green-600">On orders over $50</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-300">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-blue-800">Easy Returns</p>
              <p className="text-sm text-blue-600">30-day return policy</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-300">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-purple-800">Warranty</p>
              <p className="text-sm text-purple-600">2-year coverage included</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-300">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-orange-800">Quality Assured</p>
              <p className="text-sm text-orange-600">Premium materials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}