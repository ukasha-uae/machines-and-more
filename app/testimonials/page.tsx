import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    author: 'Kwame Mensah',
    location: 'Accra',
    rating: 5,
    quote: 'Excellent service! Bought a Caterpillar excavator and the whole process was smooth. The team was professional and the machine arrived on time.'
  },
  {
    id: 2,
    author: 'Abena Osei',
    location: 'Kumasi',
    rating: 5,
    quote: 'Very impressed with the quality of the John Deere tractor. The verified seller badge gave me confidence, and they delivered exactly what was promised.'
  },
  {
    id: 3,
    author: 'Kojo Asante',
    location: 'Tema',
    rating: 5,
    quote: 'Best place to find industrial equipment in Ghana. Transparent pricing, verified sellers, and responsive customer service. Highly recommended!'
  },
  {
    id: 4,
    author: 'Ama Darko',
    location: 'Takoradi',
    rating: 5,
    quote: 'Purchased a Mercedes truck for my logistics business. The cash on delivery option made the transaction secure. Very satisfied!'
  },
  {
    id: 5,
    author: 'Yaw Boateng',
    location: 'Sunyani',
    rating: 5,
    quote: 'Great selection of machinery. Found exactly what I needed for my construction company. The response time was quick and professional.'
  },
  {
    id: 6,
    author: 'Efua Adjei',
    location: 'Cape Coast',
    rating: 5,
    quote: 'Trustworthy platform with genuine sellers. Bought agricultural equipment and received excellent after-sales support.'
  }
];

export default function TestimonialsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Customer Testimonials</h1>
          <p className="text-lg text-muted-foreground">
            See what our satisfied customers have to say about Machines & More
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="border-t pt-4">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
