import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WarrantyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-3">Warranty Information</h1>
          <p className="text-muted-foreground">Warranty terms vary by product type and seller agreement.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Warranty Scope</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Warranty availability depends on the listing details and any supporting documents provided at sale.
            </p>
            <p>
              Always confirm warranty coverage, duration, and exclusions with our team before final payment.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Claim Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              To initiate a warranty-related claim, contact 0598178955 with your product name, purchase date, and issue description.
            </p>
            <p>
              Our team will guide you through verification and next steps based on the applicable terms.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
