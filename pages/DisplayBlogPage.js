import DisplayBlog from "../components/DisplayBlogs";
import Navbar from "./Navbar";

export default function DisplayBlogs() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 text-black">
      <Navbar/>
      <div className="w-full max-w-full px-10 py-19 mt-5">
        <DisplayBlog/>
      </div>
    </div>
  );
}
