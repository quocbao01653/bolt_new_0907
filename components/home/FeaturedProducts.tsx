'use client';

import { Star, Heart, ShoppingCart, Zap } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  averageRating: number;
  reviewCount: number;
  stock: number;
  featured: boolean;
}

export default function FeaturedProducts() {
  const { data: session } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [visibleProducts, setVisibleProducts] = useState<boolean[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const productCards = entry.target.querySelectorAll('[data-product-card]');
            productCards.forEach((card, index) => {
              setTimeout(() => {
                setVisibleProducts(prev => {
                  const newVisible = [...prev];
                  newVisible[index] = true;
                  return newVisible;
                });
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [products]);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?featured=true&limit=4');
      const data = await response.json();
      
      if (data.products) {
        setProducts(data.products);
        setVisibleProducts(new Array(data.products.length).fill(false));
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
      try {
        const response = await fetch('/api/products?limit=4');
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
          setVisibleProducts(new Array(data.products.length).fill(false));
        }
      } catch (fallbackError) {
        console.error('Error fetching fallback products:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      router.push('/auth/signin');
      return;
    }

    setAddingToCart(productId);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId,
          quantity: 1,
        }),
      });

      if (response.ok) {
        toast({
          title: "Added to cart",
          description: "Item has been added to your cart successfully.",
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
      setAddingToCart(null);
    }
  };

  const getBadgeText = (product: Product) => {
    if (product.comparePrice && product.comparePrice > product.price) {
      const discount = Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);
      return `${discount}% OFF`;
    }
    if (product.featured) {
      return "Featured";
    }
    if (product.reviewCount > 100) {
      return "Best Seller";
    }
    return "New";
  };

  const getBadgeColor = (product: Product) => {
    if (product.comparePrice && product.comparePrice > product.price) {
      return 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600';
    }
    if (product.featured) {
      return 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600';
    }
    if (product.reviewCount > 100) {
      return 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600';
    }
    return 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600';
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded-lg max-w-2xl mx-auto animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-50 animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full opacity-50 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-4">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Featured Collection</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of trending products that our customers love most
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <Card 
                key={product.id} 
                data-product-card
                className={`group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white relative transform ${
                  visibleProducts[index] 
                    ? 'translate-y-0 opacity-100 scale-100' 
                    : 'translate-y-8 opacity-0 scale-95'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Animated border gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" style={{ padding: '2px' }}>
                  <div className="bg-white rounded-lg h-full w-full" />
                </div>

                <div className="relative overflow-hidden">
                  <div className="relative overflow-hidden group-hover:scale-110 transition-transform duration-700">
                    <img
                      src={product.images[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    
                    {/* Animated overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  </div>
                  
                  {/* Enhanced Badge */}
                  <Badge 
                    className={`absolute top-3 left-3 ${getBadgeColor(product)} text-white border-0 shadow-lg transform group-hover:scale-110 transition-all duration-300`}
                  >
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="font-medium">{getBadgeText(product)}</span>
                    </div>
                  </Badge>

                  {/* Enhanced Wishlist button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 shadow-lg border border-gray-200"
                  >
                    <Heart className="w-4 h-4 transition-transform duration-300 hover:scale-125" />
                  </Button>

                  {/* Enhanced Quick add to cart */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-full group-hover:translate-y-0">
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 transition-all duration-300 shadow-lg group/btn border border-white/20"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={addingToCart === product.id || product.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
                      {addingToCart === product.id ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4 relative">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    {product.name}
                  </h3>
                  
                  {/* Enhanced Rating */}
                  <div className="flex items-center space-x-1 mb-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 transition-all duration-300 ${
                            star <= Math.floor(product.averageRating)
                              ? 'text-yellow-400 fill-current transform hover:scale-125'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      {product.averageRating} ({product.reviewCount})
                    </span>
                  </div>

                  {/* Enhanced Price */}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                      ${product.price}
                    </span>
                    {product.comparePrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.comparePrice}
                      </span>
                    )}
                  </div>

                  {/* Animated stock indicator */}
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`} />
                      <span className="text-xs text-gray-600">
                        {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 group" 
            asChild
          >
            <a href="/products">
              <span className="mr-2">View All Products</span>
              <Zap className="w-4 h-4 group-hover:animate-pulse" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}