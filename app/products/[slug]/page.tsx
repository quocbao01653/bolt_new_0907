'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import ProductInfo from '@/components/products/ProductInfo';
import ProductReviews from '@/components/products/ProductReviews';
import RelatedProducts from '@/components/products/RelatedProducts';
import ProductSpecifications from '@/components/products/ProductSpecifications';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Truck, Shield, RotateCcw, Award } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  sku: string;
  stock: number;
  images: string[];
  status: string;
  featured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  averageRating: number;
  reviewCount: number;
  reviews: Array<{
    id: string;
    rating: number;
    title?: string;
    comment?: string;
    createdAt: string;
    verified: boolean;
    user: {
      name: string;
      image?: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.slug) {
      fetchProduct(params.slug as string);
    }
  }, [params.slug]);

  const fetchProduct = async (slug: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // First try to find by slug
      const response = await fetch(`/api/products?search=${slug}&limit=1`);
      const data = await response.json();
      
      if (data.products && data.products.length > 0) {
        const foundProduct = data.products.find((p: Product) => p.slug === slug);
        if (foundProduct) {
          // Fetch full product details
          const detailResponse = await fetch(`/api/products/${foundProduct.id}`);
          if (detailResponse.ok) {
            const productDetail = await detailResponse.json();
            setProduct(productDetail);
          } else {
            setError('Product not found');
          }
        } else {
          setError('Product not found');
        }
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-6 bg-gray-200 rounded w-1/4" />
                <div className="h-20 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${product.category.slug}`}>
                {product.category.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Product Status Badges */}
        <div className="flex items-center space-x-2 mb-6">
          {product.featured && (
            <Badge className="bg-blue-500 hover:bg-blue-600">Featured</Badge>
          )}
          {product.comparePrice && product.comparePrice > product.price && (
            <Badge className="bg-red-500 hover:bg-red-600">
              {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
            </Badge>
          )}
          {product.stock <= 10 && product.stock > 0 && (
            <Badge variant="destructive">Low Stock</Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <ProductImageGallery images={product.images} productName={product.name} />
          <ProductInfo product={product} />
        </div>

        {/* Trust Indicators */}
        <div className="bg-gray-50 rounded-lg p-6 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                <p className="text-sm text-gray-600">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Easy Returns</h3>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Warranty</h3>
                <p className="text-sm text-gray-600">2-year coverage</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Quality Assured</h3>
                <p className="text-sm text-gray-600">Premium materials</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <ProductSpecifications product={product} />

        <Separator className="my-16" />

        {/* Product Reviews */}
        <ProductReviews 
          productId={product.id}
          reviews={product.reviews}
          averageRating={product.averageRating}
          reviewCount={product.reviewCount}
        />

        {/* Related Products */}
        <RelatedProducts 
          categoryId={product.category.id}
          currentProductId={product.id}
        />
      </main>

      <Footer />
    </div>
  );
}