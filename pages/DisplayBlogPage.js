import DisplayBlog from "../components/DisplayBlogs";
import Navbar from "./Navbar";
import Footer from "./footer"; // Note: Capitalized to match typical component naming

export default function DisplayBlogs() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <DisplayBlog />
      </main>
      <Footer />
    </div>
  );
}