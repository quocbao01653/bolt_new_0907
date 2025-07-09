'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Truck, Shield, RotateCcw } from 'lucide-react';

interface OrderSummaryProps {
  cart: {
    items: Array<{
      id: string;
      quantity: number;
      product: {
        id: string;
        name: string;
        price: number;
        images: string[];
      };
    }>;
    total: number;
    count: number;
  };
}

export default function OrderSummary({ cart }: OrderSummaryProps) {
  const subtotal = cart.total;
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="space-y-6">
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Order Items */}
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={item.product.images[0] || '/placeholder-product.jpg'}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded border"
                  />
                  <Badge 
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {item.quantity}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${item.product.price} × {item.quantity}
                  </p>
                </div>
                <div className="text-sm font-medium">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Order Totals */}
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
              <span>Tax (8%)</span>
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
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <RotateCcw className="w-4 h-4 text-purple-600" />
              <span>2-year warranty included</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}