import BlogUploder from "../components/Blog-upload";
import Navbar from "@/components/Navbar";

export default function ImageUploaderPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 text-black">
      <Navbar />
      <div className="mt-6 w-full max-w-5xl">
        <BlogUploder />
      </div>
    </div>
  );
}
