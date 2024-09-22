import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Brain, ChevronRight } from "lucide-react";
import Image from "next/image";
import Footer from "@/components/landing/footer/footer";
import Header from "@/components/landing/header/header";
import Link from "next/link";

export default function AboutUs() {
  const teamMembers = [
    {
      name: "Senath Rajapakse",
      role: "Team Leader",
      imagePath: "/images/about-us/senath.jpg",
    },
    {
      name: "Sithija Nirmal",
      role: "Member",
      imagePath: "/images/about-us/Sithija.jpg",
    },
    {
      name: "Chandira Deshan",
      role: "Member",
      imagePath: "/images/about-us/chandira.jpg",
    },
    {
      name: "Kasuni Sewwandi",
      role: "Member",
      imagePath: "/images/about-us/kasuni.jpg",
    },
    {
      name: "Kajal Perera",
      role: "Member",
      imagePath: "/images/about-us/kajal.jpg",
    },
  ];

  return (
    <>
      <Header />
      <hr />
      <div className="container mx-auto px-4 py-16 space-y-16">
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-4">About Codezilla</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering individuals and organizations to navigate the digital
            landscape securely.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <Shield className="w-12 h-12 mb-4 text-primary" />
              <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
              <p className="text-muted-foreground">
                To create a safer digital world by providing top-notch security
                awareness training and resources.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Users className="w-12 h-12 mb-4 text-primary" />
              <h2 className="text-2xl font-semibold mb-2">Our Approach</h2>
              <p className="text-muted-foreground">
                We believe in practical, engaging, and up-to-date training that
                empowers users to recognize and mitigate cyber threats.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Brain className="w-12 h-12 mb-4 text-primary" />
              <h2 className="text-2xl font-semibold mb-2">Our Expertise</h2>
              <p className="text-muted-foreground">
                With years of experience in cybersecurity, our team brings
                real-world insights to every training session.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <Image
                  src={member.imagePath}
                  alt={member.name}
                  width={200}
                  height={200}
                  className="w-40 h-40 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Why Choose Codezilla?
          </h2>
          <div className="flex items-center justify-center bg-background p-4">
            <ul className="space-y-6 max-w-2xl w-full">
              <li className="flex items-start">
                <Shield className="w-6 h-6 mr-3 text-primary flex-shrink-0" />
                <span className="text-foreground">
                  Comprehensive curriculum covering all aspects of cybersecurity
                </span>
              </li>
              <li className="flex items-start">
                <Users className="w-6 h-6 mr-3 text-primary flex-shrink-0" />
                <span className="text-foreground">
                  Tailored programs for individuals and organizations of all
                  sizes
                </span>
              </li>
              <li className="flex items-start">
                <Brain className="w-6 h-6 mr-3 text-primary flex-shrink-0" />
                <span className="text-foreground">
                  Interactive learning experiences with real-world scenarios
                </span>
              </li>
              <li className="flex items-start">
                <Shield className="w-6 h-6 mr-3 text-primary flex-shrink-0" />
                <span className="text-foreground">
                  Regular updates to keep you informed about the latest threats
                </span>
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Security Awareness Program
          </h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Learn how to protect yourself and your organization from cyber
            threats. Our comprehensive program covers everything from basic
            security practices to advanced threat detection.
          </p>
          <Link href="/sign-up">
            <Button variant="secondary" size="lg">
              Get Started <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </section>
      </div>
      <Footer />
    </>
  );
}
