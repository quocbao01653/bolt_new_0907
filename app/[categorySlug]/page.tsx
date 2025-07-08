import { notFound } from 'next/navigation';
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
  
  // Check if the category slug is valid
  if (!validCategories.includes(categorySlug)) {
    notFound();
  }

  // Format category name for display
  const categoryName = categorySlug === 'home' 
    ? 'Home & Garden' 
    : categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {categoryName}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Explore our {categoryName.toLowerCase()} collection
          </p>
          <div className="bg-gray-100 rounded-lg p-12">
            <p className="text-gray-500">
              Category page content coming soon...
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}