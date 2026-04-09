import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">JobAlert India</h3>
            <p className="text-gray-400">
              Your trusted source for the latest government jobs, results, and admit cards.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex flex-col space-y-3">
              <a href="#" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-center transition flex items-center justify-center">
                Join Telegram Channel
              </a>
              <a href="#" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-center transition flex items-center justify-center">
                Join WhatsApp Group
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} JobAlert India. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
