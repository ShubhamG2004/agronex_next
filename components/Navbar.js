import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-indigo-500 p-5 shadow-md">
      
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo on the Left */}
        <h1 className="text-white text-xl font-bold">AgroNex</h1>

        {/* Mobile Menu Button (Shown on Small Screens) */}
        <button
          className="text-white md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation Links - Right Aligned */}
        <ul
          className={`absolute md:static top-16 right-0 w-full bg-indigo-600 md:bg-transparent md:flex md:space-x-6 px-4 py-4 md:p-0 transition-all duration-300 z-50 ${
            isOpen ? "block" : "hidden"
          } md:flex md:items-center md:justify-end`}
        >
          <li>
            <Link
              href="/"
              className="block text-white hover:underline py-2 md:py-0"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="block text-white hover:underline py-2 md:py-0"
            >
              Blogs
            </Link>
          </li>
          <li>
            <Link
              href="/image-uploader"
              className="block text-white hover:underline py-2 md:py-0"
            >
              Upload
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className="block text-white hover:underline py-2 md:py-0"
            >
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
