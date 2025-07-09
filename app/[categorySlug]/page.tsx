import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Define valid category slugs
const validCategories = [
  'electronics',
  'fashion', 
  'home',
  'sports',
  'books',
  'deals',
  'categories'
];

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>;
}

// Generate static params for all valid categories
export async function generateStaticParams() {
  return validCategories.map((categorySlug) => ({
    categorySlug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  
  // Redirect to products page with category filter
  redirect(`/products?category=${categorySlug}`);
}