import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="py-6 px-4 md:px-6 lg:px-8 bg-primary dark:bg-black dark:text-primary border-t border-gray-700">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-white dark:text-gray-200">© 2023 CodeZilla Security. All rights reserved.</p>
        </div>
        <nav className="flex space-x-4 ">
          <Link href="/privacy" className="text-sm text-white hover:underline dark:text-gray-200">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-white hover:underline dark:text-gray-200">
            Terms of Service
          </Link>
          <Link href="/about-us" className="text-sm text-white hover:underline dark:text-gray-200">
            About Us
          </Link>
          <Link href="/contact-us" className="text-sm text-white hover:underline dark:text-gray-200">
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  )
}
