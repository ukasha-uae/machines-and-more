'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { getAllProducts, getProductsByCategory } from '@/lib/firebase/firestore';
import HeroCarousel from '@/components/home/HeroCarousel';
import ProductFilters from '@/components/products/ProductFilters';
import ProductCard from '@/components/products/ProductCard';
import { Loader2 } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await getAllProducts();
      setProducts(allProducts);
      setFilteredProducts(allProducts);
      // Select top 3 products from "Machines" category for carousel
      const machineProducts = allProducts
        .filter(p => p.category.main === 'Machines')
        .slice(0, 3);
      setFeaturedProducts(machineProducts.length > 0 ? machineProducts : allProducts.slice(0, 3));
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category.main === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.main.toLowerCase().includes(query) ||
          p.category.sub.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null); // Unselect if clicking the same category
    } else {
      setSelectedCategory(category);
    }
  };

  const handleFilterChange = async (filters: { mainCategory?: string; subCategory?: string }) => {
    try {
      setLoading(true);
      if (!filters.mainCategory) {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } else {
        const filtered = await getProductsByCategory(filters.mainCategory, filters.subCategory);
        setProducts(filtered);
      }
    } catch (error) {
      console.error('Error filtering products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <HeroCarousel products={featuredProducts} />

      {/* Featured Categories */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Machines', emoji: '🏗️' },
              { name: 'Vehicles', emoji: '🚗' },
              { name: 'Equipment', emoji: '⚙️' },
              { name: 'Parts', emoji: '🔧' },
              { name: 'Tools', emoji: '🔨' },
              { name: 'Accessories', emoji: '📦' },
            ].map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={`bg-white border-2 rounded-lg p-6 hover:shadow-lg hover:border-amazon-orange transition-all cursor-pointer text-center ${
                  selectedCategory === category.name
                    ? 'border-amazon-orange bg-amazon-orange/5'
                    : 'border-gray-200'
                }`}
              >
                <div className="text-4xl mb-2">{category.emoji}</div>
                <h3 className="font-semibold text-sm">{category.name}</h3>
              </button>
            ))}
          </div>
          {selectedCategory && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-sm text-amazon-orange hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold">Browse Our Products</h2>
          <p className="text-muted-foreground mt-1">
            {selectedCategory
              ? `Showing ${filteredProducts.length} ${selectedCategory} products`
              : searchQuery
              ? `Found ${filteredProducts.length} products matching "${searchQuery}"`
              : `Find the best machinery and equipment in Ghana (${filteredProducts.length} products)`}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-32">
              <ProductFilters onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center h-64 bg-white rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-amazon-orange" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-lg text-muted-foreground mb-2">No products found.</p>
                {(searchQuery || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory(null);
                    }}
                    className="text-amazon-orange hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-12 mt-8 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose Machines & More</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amazon-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="font-semibold mb-2">Verified Sellers</h3>
              <p className="text-sm text-muted-foreground">All our sellers are verified to ensure quality and reliability</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amazon-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="font-semibold mb-2">Nationwide Delivery</h3>
              <p className="text-sm text-muted-foreground">We deliver across Ghana with tracked shipping</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amazon-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="font-semibold mb-2">Expert Support</h3>
              <p className="text-sm text-muted-foreground">Our team is here to help with any questions</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
