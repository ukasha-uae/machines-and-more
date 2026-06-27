import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-3">Cookie Policy</h1>
          <p className="text-muted-foreground">How cookies are used on this website.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Why Cookies Are Used</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Cookies and similar technologies help with core site functionality, performance monitoring, and session behavior.
            </p>
            <p>
              These tools improve page reliability, navigation continuity, and service quality.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              You can control cookies through your browser settings, including clearing existing cookies or blocking new ones.
            </p>
            <p>
              Blocking essential cookies may impact some platform functionality.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
