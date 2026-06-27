import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-3">Terms of Service</h1>
          <p className="text-muted-foreground">Guidelines for using Machines & More services.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Platform Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Machines & More operates as a marketplace and coordination platform for machinery and vehicle transactions.
            </p>
            <p>
              Product listings are reviewed by our team before publication, and buyer support is handled centrally.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buyer and Seller Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Buyers should inspect products before payment. Sellers must provide accurate and lawful listing information.
            </p>
            <p>
              Misleading listings or abuse of platform workflows may result in listing removal.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
