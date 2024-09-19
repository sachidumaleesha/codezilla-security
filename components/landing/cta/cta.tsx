import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTA() {
  return (
    <section
      id="contact"
      className="py-24 px-4 md:px-6 lg:px-8 bg-primary text-primary-foreground dark:bg-black dark:text-primary"
    >
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Boost Your Security Knowledge?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join our security awareness program today and take the first step
          towards a safer digital future.
        </p>
        <Link href="/register">
          <Button size="lg" variant="secondary">
            Enroll Now
          </Button>
        </Link>
      </div>
    </section>
  );
}
