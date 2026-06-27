import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FAQS = [
  {
    question: 'How do I buy a machine?',
    answer:
      'Open any listing and click Request to Buy. Our team will contact you to confirm details and arrange delivery.',
  },
  {
    question: 'Do I pay online first?',
    answer:
      'No. We operate Cash on Delivery. You inspect the machine first, then pay if satisfied.',
  },
  {
    question: 'Can you deliver outside Accra?',
    answer:
      'Yes. We support nationwide delivery across Ghana. Delivery timing and fee depend on location and machine type.',
  },
  {
    question: 'How are listings verified?',
    answer:
      'All new listings go through team review before publication. Only approved products are shown publicly.',
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-3">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">Quick answers about buying, delivery, and approvals.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((item) => (
            <Card key={item.question}>
              <CardHeader>
                <CardTitle className="text-lg">{item.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
