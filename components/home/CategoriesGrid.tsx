'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Smartphone, Shirt, Home, Dumbbell, Book, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count: {
    products: number;
  };
}

const categoryIcons: Record<string, any> = {
  'electronics': Smartphone,
  'fashion': Shirt,
  'home': Home,
  'sports': Dumbbell,
  'books': Book,
  'deals': Zap,
};

const categoryColors: Record<string, string> = {
  'electronics': 'bg-blue-500',
  'fashion': 'bg-pink-500',
  'home': 'bg-green-500',
  'sports': 'bg-orange-500',
  'books': 'bg-purple-500',
  'deals': 'bg-red-500',
};

export default function CategoriesGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of categories to find exactly what you're looking for
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse h-48">
                <div className="h-full bg-gray-200" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of categories to find exactly what you're looking for
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.slug] || Smartphone;
              const colorClass = categoryColors[category.slug] || 'bg-gray-500';
              
              return (
                <Link key={category.id} href={`/${category.slug}`}>
                  <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 h-full bg-white">
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={category.image || 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Icon */}
                      <div className={`absolute top-4 left-4 w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>

                      {/* Content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-xl font-bold mb-1 group-hover:text-blue-300 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-gray-200 text-sm">
                          {category.description || `Explore ${category.name.toLowerCase()}`}
                        </p>
                        <p className="text-gray-300 text-xs mt-1">
                          {category._count.products} products
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* Special promotion banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            New Customer Special
          </h3>
          <p className="text-blue-100 mb-6 text-lg">
            Get 20% off your first order when you sign up for our newsletter
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 w-full sm:w-auto"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto">
              Get 20% Off
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}