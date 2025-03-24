import connectMongo from "@/database/conn";
import Blog from "@/model/Blog";
import multer from "multer";
import cloudinary from "cloudinary";
import { promisify } from "util";

// ✅ Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Configure Multer (Memory Storage)
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Convert Multer to Promise-based
const uploadMiddleware = promisify(upload.single("image"));

// ✅ Next.js API Route
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
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

    // ✅ Upload Image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder: "blogs" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // ✅ Save Blog Post in MongoDB
    const newBlog = new Blog({
      title,
      description,
      content,
      scheduleDate,
      status,
      imageUrl: uploadResult.secure_url, // Save Cloudinary URL
    });

    await newBlog.save();

    res.status(201).json({ message: "✅ Blog uploaded successfully!", blog: newBlog });
  } catch (error) {
    console.error("❌ Blog Upload Error:", error);
    res.status(500).json({ error: "Failed to upload blog." });
  }
}

// ✅ Disable Next.js Body Parser (Required for Multer)
export const config = {
  api: { bodyParser: false },
};
