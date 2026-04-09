import Link from 'next/link';
import { Search, Bell, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              JobAlert India
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="hover:text-blue-200 transition">Home</Link>
            <Link href="/#latest-jobs" className="hover:text-blue-200 transition">Latest Jobs</Link>
            <Link href="/#results" className="hover:text-blue-200 transition">Results</Link>
            <Link href="/#admit-cards" className="hover:text-blue-200 transition">Admit Cards</Link>
            <Link href="/admin" className="hover:text-blue-200 transition">Admin Panel</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-blue-600 rounded-full transition">
              <Bell className="h-5 w-5" />
            </button>
            <div className="md:hidden">
              <button className="p-2 hover:bg-blue-600 rounded-full transition">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
