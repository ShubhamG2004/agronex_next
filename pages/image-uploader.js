import ImageUploader from "../components/ImageUploader";
import Navbar from "./Navbar";
import Footer from "./footer"; // Capitalized component name

export default function ImageUploaderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="w-full max-w-5xl mx-auto">
          <ImageUploader />
        </div>
      </main>
      <Footer />
    </div>
  );
}