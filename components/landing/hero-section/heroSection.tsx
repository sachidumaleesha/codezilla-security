import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="py-24 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Secure Your Digital World
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Join our security awareness program and learn how to protect yourself and your organization from cyber threats.
        </p>
        <div className="space-x-4">
          <Button size="lg" variant="secondary">
            Learn More
          </Button>

          <SignedIn>
            <Link href="/user-dashboard"><Button>Go to Dashboard</Button></Link>
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in"><Button className='px-9 py-[22px]'>Sign In</Button></Link>
          </SignedOut>
        </div>
      </div>
    </section>
  )
}