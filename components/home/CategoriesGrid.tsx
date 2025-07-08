import Link from 'next/link';
import { Smartphone, Shirt, Home, Dumbbell, Book, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  {
    id: 1,
    name: "Electronics",
    description: "Latest gadgets & tech",
    icon: Smartphone,
    image: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400",
    href: "/electronics",
    color: "bg-blue-500"
  },
  {
    id: 2,
    name: "Fashion",
    description: "Trendy clothing & accessories",
    icon: Shirt,
    image: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400",
    href: "/fashion",
    color: "bg-pink-500"
  },
  {
    id: 3,
    name: "Home & Garden",
    description: "Furniture & decor",
    icon: Home,
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400",
    href: "/home",
    color: "bg-green-500"
  },
  {
    id: 4,
    name: "Sports & Fitness",
    description: "Equipment & activewear",
    icon: Dumbbell,
    image: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=400",
    href: "/sports",
    color: "bg-orange-500"
  },
  {
    id: 5,
    name: "Books",
    description: "Knowledge & entertainment",
    icon: Book,
    image: "https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg?auto=compress&cs=tinysrgb&w=400",
    href: "/books",
    color: "bg-purple-500"
  },
  {
    id: 6,
    name: "Special Deals",
    description: "Limited time offers",
    icon: Zap,
    image: "https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&w=400",
    href: "/deals",
    color: "bg-red-500"
  }
];

export default function CategoriesGrid() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of categories to find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={category.href}>
              <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 h-full bg-white">
                <div className="relative overflow-hidden h-48">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Icon */}
                  <div className={`absolute top-4 left-4 w-12 h-12 ${category.color} rounded-lg flex items-center justify-center shadow-lg`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-1 group-hover:text-blue-300 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-200 text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Special promotion banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            New Customer Special
          </h3>
          <p className="text-blue-100 mb-6 text-lg">
            Get 20% off your first order when you sign up for our newsletter
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 w-full sm:w-auto"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto">
              Get 20% Off
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}