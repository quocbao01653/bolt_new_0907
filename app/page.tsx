import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoriesGrid from '@/components/home/CategoriesGrid';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FloatingActionButton from '@/components/ui/floating-action-button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <CategoriesGrid />
        <TestimonialsSection />
      </main>
      <Footer />
      <FloatingActionButton />
    </div>
  );
}