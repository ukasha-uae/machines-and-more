import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground">How Machines & More handles your data.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              We collect contact details and product inquiry information to process requests and provide support.
            </p>
            <p>
              We also store listing details submitted through the seller flow for review and publication management.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How We Use Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Data is used for buyer communication, listing moderation, delivery coordination, and service improvement.
            </p>
            <p>
              We do not expose seller private contact data to buyers on product pages.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
