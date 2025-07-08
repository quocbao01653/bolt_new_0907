'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Truck, Shield } from 'lucide-react';

interface CartSummaryProps {
  cart: {
    items: any[];
    total: number;
    count: number;
  };
}

export default function CartSummary({ cart }: CartSummaryProps) {
  const subtotal = cart.total;
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Details */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({cart.count} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>
              {shipping === 0 ? (
                <span className="text-green-600 font-medium">FREE</span>
              ) : (
                `$${shipping.toFixed(2)}`
              )}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Free Shipping Notice */}
        {shipping > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              Add ${(50 - subtotal).toFixed(2)} more for free shipping!
            </p>
          </div>
        )}

        {/* Checkout Button */}
        <Link href="/checkout" className="block">
          <Button className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        </Link>

        {/* Security Features */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Truck className="w-4 h-4 text-blue-600" />
            <span>Free returns within 30 days</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600 mb-2">We accept:</p>
          <div className="flex space-x-2">
            <div className="w-8 h-5 bg-gray-200 rounded text-xs flex items-center justify-center">
              VISA
            </div>
            <div className="w-8 h-5 bg-gray-200 rounded text-xs flex items-center justify-center">
              MC
            </div>
            <div className="w-8 h-5 bg-gray-200 rounded text-xs flex items-center justify-center">
              AMEX
            </div>
            <div className="w-8 h-5 bg-gray-200 rounded text-xs flex items-center justify-center">
              PP
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}