import MyBlog from "../components/MyBlog";
import Navbar from "./Navbar";
import Profile from "./profile";
import Footer from "./footer"; 

export default function DisplayBlogs() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Main Content Container */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Section: Profile (45% Width on desktop, full width on mobile) */}
          <div className="lg:w-[45%] w-full">
            <div className="bg-white rounded-lg sticky top-6 shadow-sm p-6">
              <Profile />
            </div>
          </div>

          {/* Right Section: MyBlog (55% Width on desktop, full width on mobile) */}
          <div className="lg:w-[55%] w-full">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">My Blogs</h1>
              <MyBlog />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}