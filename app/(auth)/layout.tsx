import { ModeToggle } from "@/components/ui/mode-toggle";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="absolute top-5 left-5">
        <div>
          <Link
            href="/"
            className="flex gap-1 items-center md:bg-slate-300 py-1 px-2 rounded-lg"
          >
            <Image src="/images/logo.svg" alt="Logo" width="40" height="40" />
            <p className="font-semibold">CodeZilla Security</p>
          </Link>
        </div>
      </div>
      <div className="absolute top-5 right-5">
        <ModeToggle />
      </div>
      <div className="w-full lg:grid lg:grid-cols-2 h-screen">
        <div className="hidden bg-muted lg:block">
          <Image
            src="/images/auth-banner.jpeg"
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center justify-center py-12 h-screen mx-5">
          {children}
        </div>
      </div>
    </div>
  );
}
