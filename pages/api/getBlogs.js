import connectMongo from "@/database/conn";
import Blog from "@/model/Blog";
import Profile from "@/model/Profile"; // Ensure Profile model is used

export default async function handler(req, res) {
  await connectMongo(); // Connect to MongoDB

  if (!Blog) {
    console.error("Blog model is undefined");
    return res.status(500).json({ message: "Blog model is undefined" });
  }

  if (req.method === "GET") {
    try {
      console.log("Fetching blogs...");

      const blogs = await Blog.find({})
        .populate("userId", "fullName image") 
        .exec();

      // console.log("Fetched Blogs:", blogs);

      if (!blogs || blogs.length === 0) {
        return res.status(404).json({ message: "No blogs found" });
      }

      return res.status(200).json({ blogs });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
