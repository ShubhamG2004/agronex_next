import connectMongo from "@/database/conn";
import Blog from "@/model/Blog";

export default async function handler(req, res) {
  try {
    await connectMongo(); // Connect to MongoDB
    const blogs = await Blog.find({});

    const formattedBlogs = blogs.map(blog => ({
      ...blog._doc,
      image: blog.image
        ? `data:${blog.image.contentType};base64,${blog.image.data.toString("base64")}`
        : null, // Handle missing image
    }));

    res.status(200).json({ blogs: formattedBlogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Failed to fetch blogs." });
  }
}
