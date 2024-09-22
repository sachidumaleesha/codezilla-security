// app/contact/page.tsx
import Header from "@/components/landing/header/header";
import Footer from "@/components/landing/footer/footer";
import ContactForm from "@/components/ContactForm";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <hr />
      <div className="flex justify-center items-center grow w-full max-w-[700px] mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>
              If you have any questions or suggestions, please contact us.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
