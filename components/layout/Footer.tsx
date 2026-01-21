import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-primary/10"></div>
      <div className="absolute inset-0 gradient-mesh opacity-30"></div>
      
      {/* Main Footer */}
      <div className="relative glass-effect-strong py-12 border-t border-white/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Machines <span className="text-machine">&</span> More
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ghana's premier marketplace for industrial machines, vehicles, and equipment. 
                Connecting buyers with verified sellers nationwide.
              </p>
              <div className="flex gap-3 mt-4">
                <a href="#" className="glass-effect w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-all border border-white/10 interactive-scale">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" className="glass-effect w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary/20 transition-all border border-white/10 interactive-scale">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="glass-effect w-10 h-10 rounded-full flex items-center justify-center hover:bg-accent/20 transition-all border border-white/10 interactive-scale">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href="#" className="glass-effect w-10 h-10 rounded-full flex items-center justify-center hover:bg-industrial/20 transition-all border border-white/10 interactive-scale">
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Get to Know Us */}
            <div>
              <h4 className="font-bold mb-5 text-base bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Get to Know Us</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm hover:text-primary transition-all interactive-scale inline-block">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/testimonials" className="text-sm hover:text-secondary transition-all interactive-scale inline-block">
                    Customer Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm hover:text-accent transition-all interactive-scale inline-block">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-sm hover:text-industrial transition-all interactive-scale inline-block">
                    Become a Seller
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-bold mb-5 text-base bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Customer Service</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/delivery-terms" className="text-sm hover:text-primary transition-all interactive-scale inline-block">
                    Delivery Information
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-sm hover:text-secondary transition-all interactive-scale inline-block">
                    Returns Policy
                  </Link>
                </li>
                <li>
                  <Link href="/warranty" className="text-sm hover:text-accent transition-all interactive-scale inline-block">
                    Warranty Information
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm hover:text-industrial transition-all interactive-scale inline-block">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold mb-5 text-base bg-gradient-industrial bg-clip-text text-transparent">Contact Us</h4>
              <ul className="space-y-4">
                <li className="glass-effect p-3 rounded-lg border border-white/10">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Call us</p>
                      <a href="tel:+233XXXXXXXXX" className="text-sm font-medium hover:text-primary transition-colors">
                        +233 XX XXX XXXX
                      </a>
                    </div>
                  </div>
                </li>
                <li className="glass-effect p-3 rounded-lg border border-white/10">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 mt-0.5 text-secondary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Email us</p>
                      <a href="mailto:info@machinesandmore.gh" className="text-sm font-medium hover:text-secondary transition-colors break-all">
                        info@machinesandmore.gh
                      </a>
                    </div>
                  </div>
                </li>
                <li className="glass-effect p-3 rounded-lg border border-white/10">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-0.5 text-accent flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Location</p>
                      <p className="text-sm font-medium">Accra, Ghana</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative glass-effect-strong py-6 border-t border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-muted-foreground font-medium">
              &copy; {currentYear} Machines & More. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-all interactive-scale">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-secondary transition-all interactive-scale">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-accent transition-all interactive-scale">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
