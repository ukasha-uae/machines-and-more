'use client';

import { useState, useEffect } from 'react';
import { Product, CATEGORIES } from '@/types';
import { getAllProducts, getProductsByCategory } from '@/lib/firebase/firestore';
import HeroCarousel from '@/components/home/HeroCarousel';
import ProductFilters from '@/components/products/ProductFilters';
import ProductCard from '@/components/products/ProductCard';
import { Loader2, ChevronRight, ArrowLeft } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery, setSearchQuery } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [showSubcategories, setShowSubcategories] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory, selectedSubCategory]);

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

    // Filter by subcategory
    if (selectedSubCategory) {
      filtered = filtered.filter(p => p.category.sub === selectedSubCategory);
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
      // Unselect if clicking the same category
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setShowSubcategories(false);
    } else {
      setSelectedCategory(category);
      setSelectedSubCategory(null);
      setShowSubcategories(true);
    }
  };

  const handleSubCategoryClick = (subCategory: string) => {
    if (selectedSubCategory === subCategory) {
      setSelectedSubCategory(null);
    } else {
      setSelectedSubCategory(subCategory);
    }
  };

  const handleBackToCategories = () => {
    setShowSubcategories(false);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
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
    <div className="min-h-screen bg-background gradient-mesh">
      {/* Hero Carousel */}
      <HeroCarousel products={featuredProducts} />

      {/* Featured Categories - Neo-glassmorphic cards */}
      <section className="relative py-12 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
              {showSubcategories ? `${selectedCategory}` : 'Shop by Category'}
            </h2>
            <p className="text-muted-foreground">
              {showSubcategories 
                ? `Choose a specific ${selectedCategory?.toLowerCase()} type` 
                : 'Explore our extensive range of industrial machinery'}
            </p>
          </div>

          {/* Back button when showing subcategories */}
          {showSubcategories && (
            <div className="mb-6 animate-in fade-in slide-in-from-left-2 duration-300">
              <Button
                onClick={handleBackToCategories}
                variant="outline"
                className="glass-effect border-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
              </Button>
            </div>
          )}
          
          {!showSubcategories ? (
            // Main Categories
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(CATEGORIES).map(([key, category], index) => (
                <button
                  key={key}
                  onClick={() => handleCategoryClick(category.label)}
                  className="glass-effect depth-layer-1 rounded-2xl p-6 interactive-lift cursor-pointer text-center border transition-all duration-300 border-white/20 hover:border-primary/30"
                >
                  <div className="text-5xl mb-3">{category.emoji}</div>
                  <h3 className="font-bold text-sm">{category.label}</h3>
                </button>
              ))}
            </div>
          ) : (
            // Subcategories for selected category
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-right-2 duration-500">
              {Object.entries(CATEGORIES)
                .find(([key, cat]) => cat.label === selectedCategory)?.[1]
                ?.subcategories.map((subCategory, index) => (
                  <button
                    key={subCategory}
                    onClick={() => handleSubCategoryClick(subCategory)}
                    className={`glass-effect depth-layer-2 rounded-xl p-5 interactive-lift cursor-pointer text-left border transition-all duration-500 ${
                      selectedSubCategory === subCategory
                        ? 'border-primary/50 bg-gradient-primary/10 scale-105'
                        : 'border-white/20 hover:border-primary/30'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-base">{subCategory}</h3>
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {products.filter(p => p.category.main === selectedCategory && p.category.sub === subCategory).length} products
                    </p>
                  </button>
                )) || []}
            </div>
          )}
          
          {(selectedCategory || selectedSubCategory) && !showSubcategories && (
            <div className="mt-6 text-center animate-in fade-in slide-in-from-top-2 duration-300">
              <button
                onClick={handleBackToCategories}
                className="glass-effect px-6 py-2 rounded-full text-sm font-medium border border-primary/30 hover:bg-primary/10 interactive-scale"
              >
                ✕ Clear filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Products Section - Enhanced glassmorphic layout */}
      <section className="container mx-auto px-4 py-8">
        <div className="glass-effect-strong depth-layer-2 rounded-2xl p-6 md:p-8 mb-8 border border-white/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-primary opacity-10 blur-3xl rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-industrial bg-clip-text text-transparent">
              {selectedSubCategory 
                ? selectedSubCategory
                : selectedCategory 
                ? `All ${selectedCategory}` 
                : 'Browse Our Products'}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              {selectedSubCategory
                ? `Showing ${filteredProducts.length} ${selectedSubCategory.toLowerCase()} in ${selectedCategory}`
                : selectedCategory
                ? `Showing ${filteredProducts.length} ${selectedCategory.toLowerCase()} products`
                : searchQuery
                ? `Found ${filteredProducts.length} products matching "${searchQuery}"`
                : `Find the best machinery and equipment in Ghana (${filteredProducts.length} products)`}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar - Glassmorphic */}
          <div className="lg:col-span-1">
            <div className="glass-effect-strong depth-layer-2 rounded-2xl p-5 sticky top-32 border border-white/20">
              <ProductFilters onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 glass-effect rounded-2xl border border-white/20">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">Loading amazing products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 glass-effect rounded-2xl border border-white/20">
                <div className="text-6xl mb-4 opacity-50">🔍</div>
                <p className="text-lg font-semibold mb-2">No products found</p>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                {(searchQuery || selectedCategory || selectedSubCategory) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory(null);
                      setSelectedSubCategory(null);
                      setShowSubcategories(false);
                    }}
                    className="glass-effect px-6 py-2.5 rounded-lg font-medium border border-primary/30 hover:bg-primary/10 interactive-scale"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Vibrant glassmorphic cards */}
      <section className="relative py-16 mt-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-secondary/5 to-transparent"></div>
        <div className="absolute inset-0 gradient-mesh opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
              Why Choose Machines & More
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your trusted partner for industrial machinery and equipment in Ghana
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-effect-strong depth-layer-3 rounded-2xl p-8 text-center interactive-lift border border-white/20 animate-pulse-glow group">
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 machine-glow group-hover:scale-110 transition-transform duration-500">
                <span className="text-4xl">✓</span>
              </div>
              <h3 className="font-bold text-xl mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Verified Sellers
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All our sellers are verified to ensure quality and reliability for your peace of mind
              </p>
            </div>
            
            <div className="glass-effect-strong depth-layer-3 rounded-2xl p-8 text-center interactive-lift border border-white/20 animate-pulse-glow-delay-1 group">
              <div className="w-20 h-20 bg-gradient-to-r from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 machine-glow group-hover:scale-110 transition-transform duration-500">
                <span className="text-4xl">🚚</span>
              </div>
              <h3 className="font-bold text-xl mb-3 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                Nationwide Delivery
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We deliver across Ghana with tracked shipping to get your equipment to you safely
              </p>
            </div>
            
            <div className="glass-effect-strong depth-layer-3 rounded-2xl p-8 text-center interactive-lift border border-white/20 animate-pulse-glow-delay-2 group">
              <div className="w-20 h-20 bg-gradient-industrial rounded-2xl flex items-center justify-center mx-auto mb-6 machine-glow group-hover:scale-110 transition-transform duration-500">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="font-bold text-xl mb-3 bg-gradient-industrial bg-clip-text text-transparent">
                Expert Support
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our team of experts is here to help with any questions or technical assistance you need
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
