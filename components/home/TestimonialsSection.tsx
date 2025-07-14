'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Users, Award, TrendingUp, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: '1',
    name: "Sarah Johnson",
    role: "Verified Customer",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 5,
    comment: "Amazing quality products and super fast delivery! I've been shopping here for over a year and never had a bad experience. Highly recommend!",
    date: "2 weeks ago"
  },
  {
    id: '2',
    name: "Michael Chen",
    role: "Verified Customer",
    avatar: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 5,
    comment: "The customer service is outstanding. When I had an issue with my order, they resolved it within hours. The product quality exceeded my expectations.",
    date: "1 month ago"
  },
  {
    id: '3',
    name: "Emily Rodriguez",
    role: "Verified Customer",
    avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 5,
    comment: "Love the variety of products available. Found exactly what I was looking for at a great price. The website is easy to navigate too!",
    date: "3 weeks ago"
  }
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [visibleTestimonials, setVisibleTestimonials] = useState<boolean[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const [stats, setStats] = useState({
    customers: '250K+',
    rating: '4.8★',
    productsSold: '50K+',
    satisfaction: '99.5%'
  });

  useEffect(() => {
    fetchTestimonials();
    fetchStats();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const testimonialCards = entry.target.querySelectorAll('[data-testimonial-card]');
            testimonialCards.forEach((card, index) => {
              setTimeout(() => {
                setVisibleTestimonials(prev => {
                  const newVisible = [...prev];
                  newVisible[index] = true;
                  return newVisible;
                });
              }, index * 200);
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
  }, [testimonials]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
        setVisibleTestimonials(new Array(data.length).fill(false));
      } else {
        setTestimonials(fallbackTestimonials);
        setVisibleTestimonials(new Array(fallbackTestimonials.length).fill(false));
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials(fallbackTestimonials);
      setVisibleTestimonials(new Array(fallbackTestimonials.length).fill(false));
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded-lg max-w-2xl mx-auto animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-sm animate-pulse">
                <CardContent className="p-6">
                  <div className="h-8 bg-gray-200 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded mb-4" />
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-1" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
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
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full opacity-30 animate-float" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-br from-green-100 to-blue-100 rounded-full opacity-30 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-20 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full mb-4">
            <Heart className="w-4 h-4 text-green-600 animate-pulse" />
            <span className="text-sm font-medium text-green-800">Customer Love</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-900 to-blue-900 bg-clip-text text-transparent mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from thousands of satisfied customers
          </p>
        </div>

        {/* Featured Testimonial Carousel */}
        <div className="relative mb-16">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="text-center">
                  <Quote className="w-12 h-12 text-blue-500 mx-auto mb-6 animate-pulse" />
                  
                  <div className="relative h-32 mb-6">
                    {testimonials.map((testimonial, index) => (
                      <div
                        key={testimonial.id}
                        className={`absolute inset-0 transition-all duration-700 ${
                          index === currentTestimonial
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-4'
                        }`}
                      >
                        <p className="text-lg md:text-xl text-gray-700 leading-relaxed italic">
                          "{testimonial.comment}"
                        </p>
                      </div>
                    ))}
                  </div>

                  {testimonials[currentTestimonial] && (
                    <div className="flex items-center justify-center space-x-4">
                      <img
                        src={testimonials[currentTestimonial].avatar}
                        alt={testimonials[currentTestimonial].name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900">
                          {testimonials[currentTestimonial].name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {testimonials[currentTestimonial].role}
                        </p>
                        <div className="flex items-center mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= testimonials[currentTestimonial].rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-center items-center space-x-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full hover:scale-110 transition-transform duration-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-blue-500 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full hover:scale-110 transition-transform duration-300"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* All Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              data-testimonial-card
              className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white relative overflow-hidden group transform ${
                visibleTestimonials[index] 
                  ? 'translate-y-0 opacity-100 scale-100' 
                  : 'translate-y-8 opacity-0 scale-95'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Animated border gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" style={{ padding: '1px' }}>
                <div className="bg-white rounded-lg h-full w-full" />
              </div>

              <CardContent className="p-6 relative">
                {/* Quote icon with animation */}
                <div className="mb-4 relative">
                  <Quote className="w-8 h-8 text-blue-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
                  <div className="absolute inset-0 bg-blue-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-ping" />
                </div>

                {/* Rating with hover animation */}
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 transition-all duration-300 ${
                        star <= testimonial.rating
                          ? 'text-yellow-400 fill-current group-hover:scale-125'
                          : 'text-gray-300'
                      }`}
                      style={{ transitionDelay: `${star * 50}ms` }}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-700 mb-6 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                  "{testimonial.comment}"
                </p>

                {/* Customer info */}
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {testimonial.name}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{testimonial.role}</span>
                      <span>•</span>
                      <span>{testimonial.date}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced stats section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: Users, label: 'Happy Customers', value: stats.customers, color: 'from-blue-500 to-cyan-500' },
            { icon: Star, label: 'Average Rating', value: stats.rating, color: 'from-yellow-500 to-orange-500' },
            { icon: TrendingUp, label: 'Products Sold', value: stats.productsSold, color: 'from-green-500 to-emerald-500' },
            { icon: Award, label: 'Customer Satisfaction', value: stats.satisfaction, color: 'from-purple-500 to-pink-500' },
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className={`group transform transition-all duration-500 hover:scale-110 ${
                visibleTestimonials[0] 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100 + 600}ms` }}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300`}>
                <stat.icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {stat.value}
              </div>
              <div className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}