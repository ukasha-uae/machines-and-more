import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-3">Returns Policy</h1>
          <p className="text-muted-foreground">Important information about acceptance and issue reporting.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inspection on Delivery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Buyers must inspect the machine at delivery before payment. This is the primary acceptance step for all orders.
            </p>
            <p>
              If the delivered product does not match the approved listing details, report it immediately to our team before payment.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>After Delivery Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              For post-delivery concerns, contact our support team at 0598178955 with your product details and issue summary.
            </p>
            <p>
              We review each case based on listing accuracy, delivery condition, and documented communication.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
