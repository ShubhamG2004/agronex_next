import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-indigo-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">AgroNex</h1>
        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="text-white hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/profile" className="text-white hover:underline">
              Profile
            </Link>
          </li>
          <li>
            <Link href="/image-uploader" className="text-white hover:underline">
              Upload
            </Link>
          </li>
          <li>
            <Link href="/login" className="text-white hover:underline">
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
