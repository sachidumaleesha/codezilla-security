import CTA from "@/components/landing/cta/cta";
import FAQ from "@/components/landing/faq/faq";
import Footer from "@/components/landing/footer/footer";
import Header from "@/components/landing/header/header";
import Hero from "@/components/landing/hero-section/heroSection";
import Info from "@/components/landing/info/info";
import Testimonials from "@/components/landing/testimonials/testimonilas";

export default function Home() {
  return (
    <div>
      <Header/>
      <Hero/>
      <Info/>
      <Testimonials/>
      <FAQ/>
      <CTA/>
      <Footer/>
    </div>
  );
}
