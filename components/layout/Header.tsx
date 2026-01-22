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
    <header className="sticky top-0 z-50 w-full">
      {/* Glassmorphic backdrop with gradient overlay */}
      <div className="glass-effect-strong border-b border-white/10">
        {/* Top Bar - Gradient accent (hidden on mobile) */}
        <div className="relative overflow-hidden hidden md:block">
          <div className="absolute inset-0 bg-gradient-primary opacity-90"></div>
          <div className="absolute inset-0 gradient-mesh"></div>
          
          <div className="container mx-auto px-4 relative">
            <div className="flex items-center justify-between h-8 text-xs text-white/90">
              <div className="flex items-center gap-2 interactive-scale">
                <MapPin className="h-4 w-4 animate-pulse-glow" />
                <span className="font-medium">Available across <strong className="text-machine">Ghana</strong></span>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/contact" className="hover:text-machine transition-all duration-300 interactive-scale">
                  Customer Service
                </Link>
                <Link href="/admin" className="hover:text-machine transition-all duration-300 interactive-scale">
                  Seller Portal
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header - Neo-glassmorphic surface */}
        <div className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 md:gap-4 py-2 md:py-3">
              {/* Logo with glow effect */}
              <Link href="/" className="flex items-center shrink-0 group">
                <div className="text-base md:text-xl lg:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-pulse-glow">
                  Machines <span className="text-machine animate-pulse-glow-delay-1">&</span> More
                </div>
              </Link>

              {/* Search Bar - Glassmorphic input */}
              <div className="hidden md:flex flex-1 max-w-3xl">
                <form onSubmit={handleSearch} className="relative w-full group">
                  <div className="glass-effect rounded-xl overflow-hidden depth-layer-2 interactive-glow">
                    <Input
                      type="search"
                      placeholder="Search for machinery, vehicles, equipment..."
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      className="w-full h-10 pr-12 bg-white/50 dark:bg-black/20 backdrop-blur-xl border-0 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-300"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="absolute right-1 top-1 h-8 px-3 bg-gradient-primary hover:shadow-lg hover:shadow-primary/50 text-white rounded-lg transition-all duration-300 interactive-scale">
                      <Search className="h-4 w-4" />
                      <Search className="h-5 w-5" />
                    </Button>
                  </div>
                </form>
              </div>

              {/* Contact Buttons - Micro-interactions */}
              <div className="hidden lg:flex items-center gap-2 shrink-0">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="glass-effect border-white/20 text-foreground hover:bg-primary/10 hover:border-primary/30 interactive-scale depth-layer-1" 
                  asChild
                >
                  <a href="tel:+233XXXXXXXXX" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span className="hidden xl:inline font-medium">Call</span>
                  </a>
                </Button>
                <Button 
                  size="sm" 
                  className="bg-gradient-industrial hover:shadow-lg hover:shadow-industrial/50 text-white interactive-scale depth-layer-2" 
                  asChild
                >
                  <a href="https://wa.me/233XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span className="hidden xl:inline font-medium">WhatsApp</span>
                  </a>
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-foreground glass-effect p-2 rounded-lg interactive-scale"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden pb-2">
              <form onSubmit={handleSearch} className="relative w-full group">
                <div className="glass-effect rounded-lg overflow-hidden depth-layer-1">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="w-full h-9 pr-11 text-sm bg-white/50 dark:bg-black/20 backdrop-blur-xl border-0"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-1 top-1 h-7 px-2.5 bg-gradient-primary text-white rounded-md interactive-scale">
                    <Search className="h-3.5 w-3.5" />
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Glassmorphic nav */}
      <div className="relative border-t border-white/10 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <nav className="hidden md:flex items-center h-10 space-x-4 lg:space-x-6 text-xs lg:text-sm font-medium">
            <Link href="/" className="relative group py-3">
              <span className="relative z-10 transition-colors duration-300 group-hover:text-primary">
                All Products
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/testimonials" className="relative group py-3">
              <span className="relative z-10 transition-colors duration-300 group-hover:text-secondary">
                Testimonials
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/delivery-terms" className="relative group py-3">
              <span className="relative z-10 transition-colors duration-300 group-hover:text-accent">
                Delivery & Terms
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/contact" className="relative group py-3">
              <span className="relative z-10 transition-colors duration-300 group-hover:text-industrial">
                Contact Us
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-industrial transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu - Enhanced glassmorphic dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-effect-strong border-t border-white/10 depth-layer-3 animate-in slide-in-from-top-2 duration-300">
          <nav className="container mx-auto px-4 py-6 flex flex-col space-y-1">
            <Link 
              href="/" 
              className="text-sm font-medium py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 transition-all duration-300 interactive-scale"
            >
              All Products
            </Link>
            <Link 
              href="/testimonials" 
              className="text-sm font-medium py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-secondary/10 hover:to-accent/10 transition-all duration-300 interactive-scale"
            >
              Testimonials
            </Link>
            <Link 
              href="/delivery-terms" 
              className="text-sm font-medium py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-accent/10 hover:to-industrial/10 transition-all duration-300 interactive-scale"
            >
              Delivery & Terms
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-medium py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-industrial/10 hover:to-primary/10 transition-all duration-300 interactive-scale"
            >
              Contact Us
            </Link>
            <Link 
              href="/admin" 
              className="text-sm font-medium py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-all duration-300 interactive-scale"
            >
              Seller Portal
            </Link>
            
            <div className="flex flex-col space-y-3 pt-4 mt-4 border-t border-white/10">
              <Button 
                size="sm" 
                variant="outline" 
                className="glass-effect border-primary/20 hover:bg-primary/10 interactive-scale depth-layer-1" 
                asChild
              >
                <a href="tel:+233XXXXXXXXX" className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">Call Us</span>
                </a>
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-industrial hover:shadow-lg hover:shadow-industrial/50 text-white interactive-scale depth-layer-2" 
                asChild
              >
                <a href="https://wa.me/233XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="font-medium">WhatsApp</span>
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
