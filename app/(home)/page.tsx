import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center px-10 gap-5">
      <SignedOut>
      <Link href="/sign-up">Sign-Up</Link>
      <Link href="/sign-in">Sign-In</Link>
      </SignedOut>
      <SignedIn>
        <UserButton/>
      </SignedIn>
    </div>
  );
}
