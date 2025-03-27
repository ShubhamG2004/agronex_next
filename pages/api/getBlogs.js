import connectMongo from "@/database/conn";
import Blog from "@/model/Blog";
import { Users } from "@/model/Schema";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectMongo();
    
    const blogs = await Blog.find({})
      .populate("userId", "name profileImage") // Fetch uploader details
      .sort({ createdAt: -1 });

    res.status(200).json({ blogs });
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    res.status(500).json({ error: "Failed to fetch blogs." });
  }
}
