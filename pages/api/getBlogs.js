import connectMongo from "@/database/conn";
import Blog from "@/model/Blog";

export default async function handler(req, res) {
  try {
    await connectMongo();
    const blogs = await Blog.find({});

    res.status(200).json({ blogs });
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    res.status(500).json({ error: "Failed to fetch blogs." });
  }
}
