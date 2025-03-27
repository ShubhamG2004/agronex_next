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

  await connectMongo();

  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: "File upload error" });
    }

    const { email, title, description, content, scheduleDate, status } = req.body;

    if (!email) {
      return res.status(400).json({ error: "❌ Email is required. Please log in." });
    }

    try {
      // Find user by email to get userId
      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "❌ User not found." });
      }

      const userId = user._id; // Extract userId

      // Upload Image to Cloudinary
      let imageUrl = null;
      if (req.file) {
        const buffer = req.file.buffer;
        const result = await uploadToCloudinary(`data:image/png;base64,${buffer.toString("base64")}`, {
          folder: "blog_images",
        });

        imageUrl = result.secure_url;
      }

      // Create and save blog post
      const blog = new Blog({
        userId,
        title,
        description,
        content,
        scheduleDate,
        status,
        imageUrl, // Store Cloudinary URL
      });

      await blog.save();

      return res.status(200).json({ message: "✅ Blog uploaded successfully!" });
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "❌ Internal Server Error" });
    }
  });
}
