import connectMongo from "@/database/conn";
import Blog from "@/model/Blog";
import { Users } from "@/model/Schema";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { promisify } from "util";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Convert cloudinary.upload to a promise
const uploadToCloudinary = promisify(cloudinary.uploader.upload);

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ storage: multer.memoryStorage() });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await connectMongo().catch(err => {
    return res.status(500).json({ error: "❌ Database connection failed" });
  });

  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: "❌ File upload error: " + err.message });
    }

    try {
      const { 
        email, 
        title, 
        description, 
        content, 
        scheduleDate, 
        status, 
        category 
      } = req.body;

      // Validate required fields
      if (!email) {
        return res.status(400).json({ error: "❌ Email is required. Please log in." });
      }
      if (!title || !description || !content) {
        return res.status(400).json({ error: "❌ Title, description, and content are required" });
      }
      if (!req.file) {
        return res.status(400).json({ error: "❌ Image is required" });
      }

      // Find user by email to get userId
      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "❌ User not found." });
      }

      const userId = user._id;

      // Upload Image to Cloudinary
      const buffer = req.file.buffer;
      const result = await uploadToCloudinary(
        `data:${req.file.mimetype};base64,${buffer.toString("base64")}`, 
        {
          folder: "blog_images",
          resource_type: "auto",
        }
      ).catch(err => {
        throw new Error("Cloudinary upload failed: " + err.message);
      });

      // Create and save blog post
      const blog = new Blog({
        userId,
        title,
        description,
        content,
        scheduleDate: scheduleDate || new Date(),
        status: status || "draft",
        category: category || "Uncategorized",
        imageUrl: result.secure_url,
        imagePublicId: result.public_id, // Store public_id for future management
      });

      await blog.save();

      return res.status(201).json({ 
        message: "✅ Blog uploaded successfully!",
        blogId: blog._id 
      });
    } catch (error) {
      console.error("Error processing blog upload:", error);
      
      // Clean up uploaded image if blog creation failed
      if (req.file && req.file.buffer) {
        try {
          await cloudinary.uploader.destroy(result.public_id);
        } catch (cleanupError) {
          console.error("Failed to cleanup Cloudinary image:", cleanupError);
        }
      }

      return res.status(500).json({ 
        error: "❌ Internal Server Error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }
  });
}