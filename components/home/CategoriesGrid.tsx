'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Smartphone, Shirt, Home, Dumbbell, Book, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  'electronics': 'from-blue-500 to-cyan-500',
  'fashion': 'from-pink-500 to-rose-500',
  'home': 'from-green-500 to-emerald-500',
  'sports': 'from-orange-500 to-red-500',
  'books': 'from-purple-500 to-indigo-500',
  'deals': 'from-yellow-500 to-orange-500',
};

export default function CategoriesGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCategories, setVisibleCategories] = useState<boolean[]>([]);
  const [email, setEmail] = useState('');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const categoryCards = entry.target.querySelectorAll('[data-category-card]');
            categoryCards.forEach((card, index) => {
              setTimeout(() => {
                setVisibleCategories(prev => {
                  const newVisible = [...prev];
                  newVisible[index] = true;
                  return newVisible;
                });
              }, index * 100);
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
  }, [categories]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
      setVisibleCategories(new Array(data.length).fill(false));
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
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded-lg max-w-2xl mx-auto animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse h-48">
                <div className="h-full bg-gradient-to-br from-gray-200 to-gray-300" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-16 bg-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-30 animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full opacity-30 animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full opacity-20 animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
            <span className="text-sm font-medium text-purple-800">Explore Categories</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {categories.map((category, index) => {
              const IconComponent = categoryIcons[category.slug] || Smartphone;
              const colorClass = categoryColors[category.slug] || 'from-gray-500 to-gray-600';
              
              return (
                <Link key={category.id} href={`/${category.slug}`}>
                  <Card 
                    data-category-card
                    className={`group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 h-full bg-white relative transform ${
                      visibleCategories[index] 
                        ? 'translate-y-0 opacity-100 scale-100' 
                        : 'translate-y-8 opacity-0 scale-95'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Animated border gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${colorClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`} style={{ padding: '2px' }}>
                      <div className="bg-white rounded-lg h-full w-full" />
                    </div>

                    <div className="relative overflow-hidden h-48">
                      <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700">
                        <img
                          src={category.image || 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&w=400'}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Animated gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-500" />
                      
                      {/* Floating particles effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full animate-float"
                            style={{
                              left: `${20 + Math.random() * 60}%`,
                              top: `${20 + Math.random() * 60}%`,
                              animationDelay: `${Math.random() * 2}s`,
                              animationDuration: `${2 + Math.random() * 2}s`,
                            }}
                          />
                        ))}
                      </div>
                      
                      {/* Enhanced Icon */}
                      <div className={`absolute top-4 left-4 w-12 h-12 bg-gradient-to-br ${colorClass} rounded-lg flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>

                      {/* Enhanced Content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 group-hover:bg-clip-text transition-all duration-500">
                            {category.name}
                          </h3>
                          <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 group-hover:scale-125 transition-all duration-500" />
                        </div>
                        <p className="text-gray-200 text-sm mb-2 group-hover:text-white transition-colors duration-500">
                          {category.description || `Explore ${category.name.toLowerCase()}`}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-300 text-xs group-hover:text-gray-100 transition-colors duration-500">
                            {category._count.products} products
                          </p>
                          <div className="w-8 h-1 bg-white/30 rounded-full overflow-hidden">
                            <div className="w-0 h-full bg-white rounded-full group-hover:w-full transition-all duration-1000" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* Enhanced special promotion banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-center text-white">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>

          <div className="relative">
            <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full mb-4">
              <Zap className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">Limited Time Offer</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              New Customer Special
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              Get 20% off your first order when you sign up for our newsletter
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <div className="relative flex-1 w-full sm:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                />
              </div>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto group">
                <span className="mr-2">Get 20% Off</span>
                <Sparkles className="w-4 h-4 group-hover:animate-spin" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}