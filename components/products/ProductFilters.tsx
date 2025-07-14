'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    products: number;
  };
}

interface ProductFiltersProps {
  filters: {
    category: string;
    search: string;
    minPrice: string;
    maxPrice: string;
    sortBy: string;
    sortOrder: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function ProductFilters({ filters, onFilterChange }: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    filters.category ? [filters.category] : []
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (filters.minPrice || filters.maxPrice) {
      setPriceRange([
        parseInt(filters.minPrice) || 0,
        parseInt(filters.maxPrice) || 1000
      ]);
    }
  }, [filters.minPrice, filters.maxPrice]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    let newCategories;
    if (checked) {
      newCategories = [...selectedCategories, categorySlug];
    } else {
      newCategories = selectedCategories.filter(c => c !== categorySlug);
    }
    setSelectedCategories(newCategories);
    onFilterChange({ category: newCategories[0] || '' });
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    onFilterChange({
      minPrice: value[0].toString(),
      maxPrice: value[1].toString()
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    onFilterChange({
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div>
            <Label htmlFor="search" className="text-sm font-medium">
              Search Products
            </Label>
            <Input
              id="search"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="mt-1"
            />
          </div>

          <Separator />

          {/* Categories */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Categories</Label>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.slug}
                    checked={selectedCategories.includes(category.slug)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category.slug, checked as boolean)
                    }
                    className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 dark:border-gray-600"
                  />
                  <Label
                    htmlFor={category.slug}
                    className="text-sm font-normal cursor-pointer flex-1 text-gray-700 dark:text-gray-200"
                  >
                    {category.name}
                  </Label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({category._count.products})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          <div>
            <Label className="text-sm font-medium mb-3 block text-gray-700 dark:text-gray-200">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </Label>
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={1000}
              min={0}
              step={10}
              className="mt-2 [&_[role=slider]]:bg-blue-600 [&_[role=slider]]:border-blue-600"
            />
            <div className="flex items-center space-x-2 mt-3">
              <Input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="w-20 border-gray-300 dark:border-gray-600"
              />
              <span className="text-gray-500 dark:text-gray-400">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value) || 1000])}
                className="w-20 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          <Separator />

          {/* Rating Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block text-gray-700 dark:text-gray-200">Minimum Rating</Label>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`rating-${rating}`} 
                    className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 dark:border-gray-600"
                  />
                  <Label htmlFor={`rating-${rating}`} className="text-sm font-normal cursor-pointer text-gray-700 dark:text-gray-200">
                    {rating}+ Stars
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Availability */}
          <div>
            <Label className="text-sm font-medium mb-3 block text-gray-700 dark:text-gray-200">Availability</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="in-stock" 
                  className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 dark:border-gray-600"
                />
                <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer text-gray-700 dark:text-gray-200">
                  In Stock
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="on-sale" 
                  className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 dark:border-gray-600"
                />
                <Label htmlFor="on-sale" className="text-sm font-normal cursor-pointer text-gray-700 dark:text-gray-200">
                  On Sale
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}