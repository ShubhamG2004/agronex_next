import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("userToken"); 
      setIsLoggedIn(!!user);
    }
  }, []);

  return (
    <nav className="w-full bg-indigo-500 p-5 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo on the Left */}
        <h1 className="text-white text-xl font-bold">AgroNex</h1>

        {/* Mobile Menu Button */}
        <button className="text-white md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation Links */}
        <ul
          className={`absolute md:static top-16 right-0 w-full bg-indigo-600 md:bg-transparent md:flex md:space-x-6 px-4 py-4 md:p-0 transition-all duration-300 z-50 ${
            isOpen ? "block" : "hidden"
          } md:flex md:items-center md:justify-end`}
        >
          <li>
            <Link href="/" className="block text-white hover:underline py-2 md:py-0">
              Home
            </Link>
          </li>
          <li>
            <Link href="/blogs" className="block text-white hover:underline py-2 md:py-0">
              Blogs
            </Link>
          </li>
          <li>
            <Link href="/image-uploader" className="block text-white hover:underline py-2 md:py-0">
              Upload
            </Link>
          </li>
          <li>
            {isLoggedIn ? (
              <Link href="/profile" className="block text-white hover:underline py-2 md:py-0">
                Profile
              </Link>
            ) : (
              <Link href="/login" className="block text-white bg-green-500 px-4 py-2 rounded-md font-semibold">
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
