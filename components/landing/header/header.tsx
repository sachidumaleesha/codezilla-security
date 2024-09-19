import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheckIcon } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="py-4 px-4 md:px-6 lg:px-8 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div>
        <Link href="/" className="flex items-center space-x-2">
          <ShieldCheckIcon className="h-6 w-6" />
          <span className="font-bold text-xl">CodeZilla Security</span>
        </Link>
      </div>
      <nav className="hidden md:flex space-x-4">
        <Link href="#features" className="text-sm font-medium hover:underline">
          Features
        </Link>
        <Link
          href="#testimonials"
          className="text-sm font-medium hover:underline"
        >
          Testimonials
        </Link>
        <Link href="#contact" className="text-sm font-medium hover:underline">
          Contact
        </Link>
      </nav>
      <div className="flex items-center space-x-2">
        <ModeToggle />
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in">
            <Button className="w-24">Sign In</Button>
          </Link>
        </SignedOut>
      </div>
    </header>
  );
}
