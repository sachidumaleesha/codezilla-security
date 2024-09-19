import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const testimonials = [
  {
    name: "Alex Johnson",
    role: "IT Manager",
    content: "This program has significantly improved our company's security posture. Highly recommended!",
    avatar: "/images/avatar1.webp"
  },
  {
    name: "Sarah Lee",
    role: "Software Developer",
    content: "I've learned so much about personal cybersecurity. It's been eye-opening and empowering.",
    avatar: "/images/avatar2.jpg"
  },
  {
    name: "Michael Chen",
    role: "Small Business Owner",
    content: "The knowledge gained from this program has been invaluable in protecting my business from cyber threats.",
    avatar: "/images/avatar3.jpeg"
  }
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-4 max-w-7xl mx-auto">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Participants Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
