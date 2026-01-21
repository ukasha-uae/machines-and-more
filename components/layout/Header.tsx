'use client';

import Link from 'next/link';
import { Phone, MessageCircle, Menu, Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();
  const [localSearch, setLocalSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* Top Bar */}
      <div className="bg-amazon-dark text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Deliver to <strong>Ghana</strong></span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/contact" className="hover:text-amazon-orange transition-colors">
                Customer Service
              </Link>
              <Link href="/admin" className="hover:text-amazon-orange transition-colors">
                Seller Portal
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-amazon-light text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <div className="text-xl md:text-2xl font-bold">
                Machines <span className="text-amazon-orange">&</span> More
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-3xl">
              <form onSubmit={handleSearch} className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search for machinery, vehicles, equipment..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full h-10 pr-12 bg-white text-gray-900 border-0 focus-visible:ring-amazon-orange"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-0 top-0 h-10 px-4 bg-amazon-orange hover:bg-amazon-hover text-white rounded-l-none"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </form>
            </div>

            {/* Contact Buttons */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <Button size="sm" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                <a href="tel:+233XXXXXXXXX" className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span className="hidden xl:inline">Call</span>
                </a>
              </Button>
              <Button size="sm" className="bg-amazon-orange hover:bg-amazon-hover" asChild>
                <a href="https://wa.me/233XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden xl:inline">WhatsApp</span>
                </a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="search"
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full h-10 pr-12 bg-white text-gray-900 border-0"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-0 top-0 h-10 px-4 bg-amazon-orange hover:bg-amazon-hover text-white rounded-l-none"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-amazon-dark text-white border-t border-white/10">
        <div className="container mx-auto px-4">
          <nav className="hidden md:flex items-center h-10 space-x-6 text-sm">
            <Link href="/" className="hover:text-amazon-orange transition-colors font-medium">
              All Products
            </Link>
            <Link href="/testimonials" className="hover:text-amazon-orange transition-colors">
              Testimonials
            </Link>
            <Link href="/delivery-terms" className="hover:text-amazon-orange transition-colors">
              Delivery & Terms
            </Link>
            <Link href="/contact" className="hover:text-amazon-orange transition-colors">
              Contact Us
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            <Link href="/" className="text-sm font-medium text-gray-900 hover:text-amazon-orange transition-colors py-2">
              All Products
            </Link>
            <Link href="/testimonials" className="text-sm font-medium text-gray-900 hover:text-amazon-orange transition-colors py-2">
              Testimonials
            </Link>
            <Link href="/delivery-terms" className="text-sm font-medium text-gray-900 hover:text-amazon-orange transition-colors py-2">
              Delivery & Terms
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-900 hover:text-amazon-orange transition-colors py-2">
              Contact Us
            </Link>
            <Link href="/admin" className="text-sm font-medium text-gray-900 hover:text-amazon-orange transition-colors py-2">
              Seller Portal
            </Link>
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Button size="sm" variant="outline" asChild>
                <a href="tel:+233XXXXXXXXX" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Call Us
                </a>
              </Button>
              <Button size="sm" className="bg-amazon-orange hover:bg-amazon-hover" asChild>
                <a href="https://wa.me/233XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
