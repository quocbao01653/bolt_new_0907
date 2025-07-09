'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Search, Menu, X, ShoppingBag, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      fetchCartCount();
    }

    // Listen for cart updates
    const handleCartUpdate = () => {
      if (session) {
        fetchCartCount();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [session]);

  const fetchCartCount = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCartCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="hidden md:flex items-center justify-between py-2 text-sm text-muted-foreground border-b">
          <div className="flex items-center space-x-6">
            <span>Free shipping on orders over $50</span>
            <span>•</span>
            <span>24/7 Customer Support</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/help" className="hover:text-foreground transition-colors">Help</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">ShopFlow</span>
          </Link>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 pr-4 w-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="w-5 h-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : session ? (
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-600">Hi, {session.user?.name?.split(' ')[0]}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-sm"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-8 py-4 border-t">
          <Link href="/products" className="text-foreground hover:text-blue-500 font-medium transition-colors">
            All Categories
          </Link>
          <Link href="/electronics" className="text-muted-foreground hover:text-foreground transition-colors">
            Electronics
          </Link>
          <Link href="/fashion" className="text-muted-foreground hover:text-foreground transition-colors">
            Fashion
          </Link>
          <Link href="/home" className="text-muted-foreground hover:text-foreground transition-colors">
            Home & Garden
          </Link>
          <Link href="/sports" className="text-muted-foreground hover:text-foreground transition-colors">
            Sports
          </Link>
          <Link href="/books" className="text-muted-foreground hover:text-foreground transition-colors">
            Books
          </Link>
          <Link href="/deals" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
            Special Deals
          </Link>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            {/* Mobile search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search products..." className="pl-10 pr-4 w-full" />
              </div>
            </div>
            
            {/* Mobile navigation */}
            <nav className="space-y-2">
              <Link href="/products" className="block py-2 text-foreground font-medium">
                All Categories
              </Link>
              <Link href="/electronics" className="block py-2 text-muted-foreground">
                Electronics
              </Link>
              <Link href="/fashion" className="block py-2 text-muted-foreground">
                Fashion
              </Link>
              <Link href="/home" className="block py-2 text-muted-foreground">
                Home & Garden
              </Link>
              <Link href="/sports" className="block py-2 text-muted-foreground">
                Sports
              </Link>
              <Link href="/books" className="block py-2 text-muted-foreground">
                Books
              </Link>
              <Link href="/deals" className="block py-2 text-orange-500 font-medium">
                Special Deals
              </Link>
              <div className="pt-4 border-t space-y-2">
                {session ? (
                  <>
                    <span className="block py-2 text-sm text-gray-600">Hi, {session.user?.name}</span>
                    <button
                      onClick={() => signOut()}
                      className="block py-2 text-muted-foreground w-full text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin" className="block py-2 text-muted-foreground">
                      Sign In
                    </Link>
                    <Link href="/auth/signup" className="block py-2 text-muted-foreground">
                      Sign Up
                    </Link>
                  </>
                )}
                <Link href="/wishlist" className="block py-2 text-muted-foreground">
                  Wishlist
                </Link>
                {session && (
                  <Link href="/dashboard" className="block py-2 text-muted-foreground">
                    My Account
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}