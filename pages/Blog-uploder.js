import BlogUploder from "../components/Blog-upload";
import Navbar from "@/components/Navbar";

export default function ImageUploaderPage() {
  return (
    <div className="min-h-screen  items-center justify-center gap-4  bg-green-100 text-white">
      <Navbar />
      <BlogUploder />
    </div>
  );
}
