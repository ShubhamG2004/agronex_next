import connectMongo from "@/database/conn";
import Blog from "@/model/Blog";

export default async function handler(req, res) {
  try {
    await connectMongo();
    const testBlog = await Blog.create({
      title: "Test Blog",
      description: "This is a test blog entry",
      content: "Testing MongoDB connection",
      image: "https://via.placeholder.com/600",
      status: "published",
      author: "test@example.com",
    });

    return res.status(201).json({ success: true, data: testBlog });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
