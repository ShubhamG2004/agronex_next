import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Simulate checking authentication status (replace with actual auth check)
    const user = localStorage.getItem("userToken"); // Assuming JWT token is stored
    setIsLoggedIn(!!user);
  }, []);

  return (
    <nav className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Brand Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 relative">
            <Image 
              src="/assets/logo.png" 
              alt="AgroNex Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">AgroNex</h1>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="text-white md:hidden p-2 rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation Links */}
        <ul
          className={`absolute md:static top-20 left-0 w-full md:w-auto bg-indigo-700 md:bg-transparent md:flex md:space-x-6 px-6 py-3 md:p-0 transition-all duration-300 z-50 shadow-lg md:shadow-none ${
            isOpen ? "block" : "hidden"
          } md:flex md:items-center md:justify-end`}
        >
          <li>
            <Link 
              href="/" 
              className="block text-white hover:text-indigo-100 font-medium py-3 md:py-0 border-b border-indigo-500 md:border-none transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              href="/DisplayBlogPage" 
              className="block text-white hover:text-indigo-100 font-medium py-3 md:py-0 border-b border-indigo-500 md:border-none transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Blogs
            </Link>
          </li>
          <li>
            <Link 
              href="/image-uploader" 
              className="block text-white hover:text-indigo-100 font-medium py-3 md:py-0 border-b border-indigo-500 md:border-none transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Upload
            </Link>
          </li>
          <li className="pt-2 md:pt-0">
            {!isLoggedIn ? (
              <Link 
                href="/ProfileSection" 
                className="block text-white hover:bg-indigo-600 bg-indigo-800 px-4 py-2 rounded-md font-semibold transition-colors text-center"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="block text-white hover:bg-green-600 bg-green-500 px-4 py-2 rounded-md font-semibold transition-colors text-center"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}