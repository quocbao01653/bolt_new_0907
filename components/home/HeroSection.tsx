'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const slides = [
  {
    id: 1,
    title: "Summer Collection 2025",
    subtitle: "Discover the latest trends",
    description: "Up to 50% off on selected items. Free shipping on orders over $50.",
    cta: "Shop Now",
    bgImage: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=1200",
    badge: "Limited Time"
  },
  {
    id: 2,
    title: "Electronics Sale",
    subtitle: "Tech at unbeatable prices",
    description: "Smartphones, laptops, and accessories with warranty included.",
    cta: "Explore Deals",
    bgImage: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1200",
    badge: "Best Seller"
  },
  {
    id: 3,
    title: "Home & Garden",
    subtitle: "Transform your space",
    description: "Quality furniture and decor to make your house a home.",
    cta: "Browse Collection",
    bgImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
    badge: "New Arrivals"
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-gray-900">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-105'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[8000ms] ease-out"
            style={{ 
              backgroundImage: `url(${slide.bgImage})`,
              transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl text-white">
                <Badge 
                  className={`mb-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 transform transition-all duration-700 ${
                    index === currentSlide && isLoaded
                      ? 'translate-y-0 opacity-100 scale-100'
                      : 'translate-y-8 opacity-0 scale-95'
                  }`}
                  style={{ transitionDelay: '200ms' }}
                >
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span>{slide.badge}</span>
                  </div>
                </Badge>
                
                <h1 
                  className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent transform transition-all duration-700 ${
                    index === currentSlide && isLoaded
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-12 opacity-0'
                  }`}
                  style={{ transitionDelay: '400ms' }}
                >
                  {slide.title}
                </h1>
                
                <p 
                  className={`text-xl md:text-2xl mb-2 text-gray-200 transform transition-all duration-700 ${
                    index === currentSlide && isLoaded
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: '600ms' }}
                >
                  {slide.subtitle}
                </p>
                
                <p 
                  className={`text-lg mb-8 text-gray-300 leading-relaxed transform transition-all duration-700 ${
                    index === currentSlide && isLoaded
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: '800ms' }}
                >
                  {slide.description}
                </p>
                
                <div 
                  className={`flex items-center space-x-4 transform transition-all duration-700 ${
                    index === currentSlide && isLoaded
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: '1000ms' }}
                >
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    <span className="mr-2">{slide.cta}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="lg"
                    className="text-white border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300 group"
                  >
                    <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    Watch Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation buttons with enhanced animations */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm transition-all duration-300 hover:scale-110 group"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm transition-all duration-300 hover:scale-110 group"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
      </Button>

      {/* Enhanced slide indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`relative overflow-hidden rounded-full transition-all duration-500 ${
              index === currentSlide 
                ? 'w-8 h-3 bg-white' 
                : 'w-3 h-3 bg-white/40 hover:bg-white/60'
            }`}
            onClick={() => setCurrentSlide(index)}
          >
            {index === currentSlide && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Enhanced trust indicators */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-white/95 via-white/98 to-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center md:justify-around items-center text-sm text-gray-600 space-y-2 md:space-y-0">
            <div className="flex items-center space-x-2 group hover:text-yellow-600 transition-colors duration-300">
              <Star className="w-4 h-4 text-yellow-500 fill-current group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium">4.8/5 Rating</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-gray-300" />
            <div className="group hover:text-green-600 transition-colors duration-300">
              <span className="font-medium">Free Shipping Over $50</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-gray-300" />
            <div className="group hover:text-blue-600 transition-colors duration-300">
              <span className="font-medium">30-Day Returns</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-gray-300" />
            <div className="group hover:text-purple-600 transition-colors duration-300">
              <span className="font-medium">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}