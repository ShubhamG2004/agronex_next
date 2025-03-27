import MyBlog from "../components/MyBlog";
import Navbar from "./Navbar";
import Profile from "./profile";

export default function DisplayBlogs() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 text-black">
      <Navbar/>
      <div className="mt-6 w-full max-w-5xl">
        <Profile/>
        <MyBlog/>
      </div>
    </div>
  );
}
