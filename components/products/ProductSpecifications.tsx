'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  status: string;
  featured: boolean;
}

interface ProductSpecificationsProps {
  product: Product;
}

export default function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const specifications = [
    { label: 'SKU', value: product.sku },
    { label: 'Category', value: product.category.name },
    { label: 'Status', value: product.status },
    { label: 'Featured', value: product.featured ? 'Yes' : 'No' },
    { 
      label: 'Date Added', 
      value: new Date(product.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    { 
      label: 'Last Updated', 
      value: new Date(product.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
  ];

  return (
    <Card className="mb-16">
      <CardHeader>
        <CardTitle>Product Specifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specifications.map((spec, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-700">{spec.label}:</span>
              <span className="text-gray-900">
                {spec.label === 'Status' ? (
                  <Badge variant={spec.value === 'ACTIVE' ? 'default' : 'secondary'}>
                    {spec.value}
                  </Badge>
                ) : spec.label === 'Featured' ? (
                  <Badge variant={spec.value === 'Yes' ? 'default' : 'secondary'}>
                    {spec.value}
                  </Badge>
                ) : (
                  spec.value
                )}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}