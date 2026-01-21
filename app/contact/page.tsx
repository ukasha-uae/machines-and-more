import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with our team for any inquiries or support
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a 
                      href="tel:+233XXXXXXXXX" 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      +233 XX XXX XXXX
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      Mon-Fri: 8:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a 
                      href="mailto:info@machinesandmore.gh" 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      info@machinesandmore.gh
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      We'll respond within 24 hours
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-muted-foreground">
                      Accra, Ghana
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Serving all regions of Ghana
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 3:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button size="lg" className="w-full" asChild>
                  <a href="tel:+233XXXXXXXXX" className="flex items-center gap-3">
                    <Phone className="h-5 w-5" />
                    Call Us Now
                  </a>
                </Button>

                <Button size="lg" className="w-full" variant="outline" asChild>
                  <a 
                    href="https://wa.me/233XXXXXXXXX" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Chat on WhatsApp
                  </a>
                </Button>

                <Button size="lg" className="w-full" variant="outline" asChild>
                  <a 
                    href="mailto:info@machinesandmore.gh"
                    className="flex items-center gap-3"
                  >
                    <Mail className="h-5 w-5" />
                    Send Email
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Why Choose Us?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full mt-2" />
                    <span className="text-sm">Verified sellers you can trust</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full mt-2" />
                    <span className="text-sm">Cash on Delivery available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full mt-2" />
                    <span className="text-sm">Nationwide delivery across Ghana</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full mt-2" />
                    <span className="text-sm">Professional customer support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full mt-2" />
                    <span className="text-sm">Wide selection of quality equipment</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
