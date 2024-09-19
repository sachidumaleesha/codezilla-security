import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ShieldIcon, LockIcon, AlertTriangleIcon } from 'lucide-react'

const features = [
  {
    icon: ShieldIcon,
    title: "Comprehensive Protection",
    description: "Learn about various security measures to safeguard your digital assets."
  },
  {
    icon: LockIcon,
    title: "Password Security",
    description: "Master the art of creating and managing strong, unique passwords."
  },
  {
    icon: AlertTriangleIcon,
    title: "Threat Awareness",
    description: "Stay informed about the latest cyber threats and how to recognize them."
  }
]

export default function Features() {
  return (
    <section id="features" className="py-24 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="h-10 w-10 mb-4 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
