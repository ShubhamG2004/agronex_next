import connectMongo from "@/database/conn";
import Blog from "@/model/Blog";
import multer from "multer";
import { promisify } from "util";
import fs from "fs";

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false, // Required for multer
  },
};

// Middleware function to handle file uploads
const uploadMiddleware = promisify(upload.single("image"));

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await uploadMiddleware(req, res);
    await connectMongo();

    const { title, description, content, scheduleDate, status } = req.body;

    if (!title || !description || !content || !scheduleDate || !status) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const newBlog = new Blog({
      title,
      description,
      content,
      scheduleDate,
      status,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await newBlog.save();
    res.status(201).json({ message: "✅ Blog uploaded successfully!", blog: newBlog });

  } catch (error) {
    console.error("❌ Blog Upload Error:", error);
    res.status(500).json({ error: "Failed to upload blog." });
  }
}
