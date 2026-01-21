import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Package, Shield, Clock } from 'lucide-react';

export default function DeliveryTermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Delivery Terms</h1>
          <p className="text-lg text-muted-foreground">
            Understanding our Cash on Delivery process and service regions
          </p>
        </div>

        <div className="space-y-8">
          {/* Cash on Delivery */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                <CardTitle>Cash on Delivery</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                At Machines & More, we prioritize trust and security. Our Cash on Delivery (COD) 
                system ensures that you only pay when your machinery or vehicle is delivered to your 
                specified location.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">How It Works:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Submit a "Request to Buy" for your chosen product</li>
                  <li>Our sales team contacts you to confirm details</li>
                  <li>We arrange delivery to your location</li>
                  <li>Inspect the product upon arrival</li>
                  <li>Pay in cash if you're satisfied with the condition</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Regions */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                <CardTitle>Service Regions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                We deliver to all major regions across Ghana:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    Greater Accra Region
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    Ashanti Region
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    Western Region
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    Eastern Region
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    Central Region
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    Northern Region
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    Volta Region
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    All Other Regions
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary" />
                <CardTitle>Delivery Timeline</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="font-semibold min-w-[120px]">Accra/Tema:</div>
                  <div>1-3 business days</div>
                </div>
                <div className="flex gap-4">
                  <div className="font-semibold min-w-[120px]">Major Cities:</div>
                  <div>3-5 business days</div>
                </div>
                <div className="flex gap-4">
                  <div className="font-semibold min-w-[120px]">Rural Areas:</div>
                  <div>5-7 business days</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                *Delivery times may vary depending on product availability and location accessibility.
              </p>
            </CardContent>
          </Card>

          {/* Product Inspection */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-primary" />
                <CardTitle>Product Inspection</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Before accepting delivery and making payment:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                  <span>Thoroughly inspect the machinery or vehicle</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                  <span>Verify specifications match the product description</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                  <span>Check for any visible damage or defects</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                  <span>Test functionality (if applicable)</span>
                </li>
              </ul>
              <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                <p className="text-sm font-semibold text-yellow-800">
                  Important: Only pay after you're completely satisfied with the product condition.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
