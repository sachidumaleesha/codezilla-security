// app/contact/page.tsx
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/landing/footer/footer";
import Header from "@/components/landing/header/header";
import { Card } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <hr />
      <div className="flex justify-center items-center grow w-full max-w-[700px] mx-auto">
        <Card className="w-full px-5 py-7">
          <ContactForm />
        </Card>
      </div>
      <Footer />
    </div>
  );
}
