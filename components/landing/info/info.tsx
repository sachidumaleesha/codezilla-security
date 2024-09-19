import { Clock, Shield, HeadphonesIcon, LockIcon, UsersIcon, DatabaseIcon } from 'lucide-react'
import Image from 'next/image'

interface FeatureBoxProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const FeatureBox = ({ icon: Icon, title, description }: FeatureBoxProps) => (
  <div className="flex flex-col items-center text-center p-4">
    <div className="bg-primary text-primary-foreground p-3 rounded-full mb-4">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
)

export default function Info() {
  return (
    <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureBox 
            icon={Clock}
            title="Real-Time Threat Updates"
            description="Stay informed about the latest security threats and vulnerabilities as they emerge."
          />
          <FeatureBox 
            icon={Shield}
            title="Comprehensive Protection"
            description="Learn techniques to secure all aspects of your digital life, from personal to professional."
          />
          <FeatureBox 
            icon={HeadphonesIcon}
            title="Expert Support"
            description="Access to security experts for guidance and answers to your cybersecurity questions."
          />
        </div>

        <div className="flex flex-col md:flex-row items-center mb-16">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-center md:text-left text-3xl font-bold mb-4">We empower your security knowledge</h2>
            <p className="text-center md:text-left text-muted-foreground">
              Our security awareness program provides you with the tools and knowledge to protect yourself and your organization from cyber threats. Stay one step ahead of potential risks.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image 
              src="/images/secure1.png" 
              width={400} 
              height={300} 
              alt="Security Illustration"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center mb-16">
          <div className="md:w-1/2 mb-8 md:mb-0 md:order-2">
            <h2 className="text-center md:text-left text-3xl font-bold mb-4">Secure collaboration and learning</h2>
            <p className="text-center md:text-left text-muted-foreground">
              Our platform ensures that your learning experience is not only effective but also secure. Collaborate with peers and experts in a protected environment.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center md:order-1">
            <Image 
              src="/images/secure2.png" 
              width={400} 
              height={300} 
              alt="Collaboration Illustration"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureBox 
            icon={LockIcon}
            title="Data Protection"
            description="Learn best practices for safeguarding sensitive information and preventing data breaches."
          />
          <FeatureBox 
            icon={UsersIcon}
            title="Social Engineering Defense"
            description="Recognize and defend against social engineering tactics used by cybercriminals."
          />
          <FeatureBox 
            icon={DatabaseIcon}
            title="Secure Data Exchange"
            description="Master the techniques for secure data transfer and storage in various environments."
          />
        </div>
      </div>
    </section>
  )
}