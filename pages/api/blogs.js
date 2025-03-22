import connectMongo from "@/database/conn";
import Blog from "@/model/Blog";
import { getSession } from "next-auth/react";
import { z } from "zod";

export default async function handler(req, res) {
  await connectMongo();

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (req.method === "POST") {
    try {
      // Blog Schema Validation
      const BlogSchema = z.object({
        title: z.string().min(5, "Title should be at least 5 characters"),
        description: z.string().optional(),
        content: z.string().min(10, "Content should be at least 10 characters"),
        image: z.string().url().optional(),
        status: z.enum(["draft", "published"]).default("draft"),
        scheduleDate: z.string().optional(),
      });

      const validatedData = BlogSchema.parse(req.body);

      const newBlog = await Blog.create({
        ...validatedData,
        author: session.user.email,
        createdAt: new Date(),
      });

      res.status(201).json({ success: true, data: newBlog });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const blogs = await Blog.find({});
      res.status(200).json({ success: true, data: blogs });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
