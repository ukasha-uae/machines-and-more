import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-amazon-dark text-gray-300 mt-auto">
      {/* Main Footer */}
      <div className="bg-amazon-light py-8 border-t-2 border-amazon-orange/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                Machines <span className="text-amazon-orange">&</span> More
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Ghana's premier marketplace for industrial machines, vehicles, and equipment. 
                Connecting buyers with verified sellers nationwide.
              </p>
              <div className="flex gap-3 mt-4">
                <a href="#" className="w-9 h-9 bg-amazon-dark rounded-full flex items-center justify-center hover:bg-amazon-orange transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" className="w-9 h-9 bg-amazon-dark rounded-full flex items-center justify-center hover:bg-amazon-orange transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="w-9 h-9 bg-amazon-dark rounded-full flex items-center justify-center hover:bg-amazon-orange transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href="#" className="w-9 h-9 bg-amazon-dark rounded-full flex items-center justify-center hover:bg-amazon-orange transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Get to Know Us */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-base">Get to Know Us</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/about" className="text-sm hover:text-amazon-orange transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/testimonials" className="text-sm hover:text-amazon-orange transition-colors">
                    Customer Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm hover:text-amazon-orange transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-sm hover:text-amazon-orange transition-colors">
                    Become a Seller
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-base">Customer Service</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/delivery-terms" className="text-sm hover:text-amazon-orange transition-colors">
                    Delivery Information
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-sm hover:text-amazon-orange transition-colors">
                    Returns Policy
                  </Link>
                </li>
                <li>
                  <Link href="/warranty" className="text-sm hover:text-amazon-orange transition-colors">
                    Warranty Information
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm hover:text-amazon-orange transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-base">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 mt-0.5 text-amazon-orange flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Call us</p>
                    <a href="tel:+233XXXXXXXXX" className="text-sm hover:text-amazon-orange transition-colors">
                      +233 XX XXX XXXX
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 mt-0.5 text-amazon-orange flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Email us</p>
                    <a href="mailto:info@machinesandmore.gh" className="text-sm hover:text-amazon-orange transition-colors break-all">
                      info@machinesandmore.gh
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 text-amazon-orange flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Location</p>
                    <p className="text-sm">Accra, Ghana</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-amazon-dark py-6 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-400">
              &copy; {currentYear} Machines & More. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-gray-400">
              <Link href="/privacy" className="hover:text-amazon-orange transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-amazon-orange transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-amazon-orange transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
