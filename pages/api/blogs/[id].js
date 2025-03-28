import dbConnect from "@/database/conn";
import Blog from "@/model/Blog";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { promisify } from "util";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Convert Cloudinary upload to promise
const uploadToCloudinary = promisify(cloudinary.uploader.upload);

export const config = {
  api: {
    bodyParser: false, // Disables Next.js default bodyParser to use multer
  },
};

// Multer Configuration
const upload = multer({ storage: multer.memoryStorage() });

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  try {
    if (req.method === "GET") {
      const blog = await Blog.findById(id);
      if (!blog) return res.status(404).json({ error: "Blog not found" });
      return res.status(200).json({ success: true, blog });
    }

    else if (req.method === "PUT") {
      upload.single("image")(req, res, async (err) => {
        if (err) return res.status(500).json({ error: "File upload error" });

        const { title, description, content } = req.body;
        let imageUrl = null;

        if (req.file) {
          try {
            const buffer = req.file.buffer;
            const result = await uploadToCloudinary(`data:image/png;base64,${buffer.toString("base64")}`, {
              folder: "blog_images",
            });
            imageUrl = result.secure_url;
          } catch (uploadError) {
            return res.status(500).json({ error: "Image upload failed", details: uploadError.message });
          }
        }

        // Update Blog
        const updatedData = { title, description, content };
        if (imageUrl) updatedData.imageUrl = imageUrl;

        const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
        if (!updatedBlog) return res.status(404).json({ error: "Blog not found" });

        return res.status(200).json({ success: true, blog: updatedBlog });
      });
    }

    else if (req.method === "DELETE") {
      const deletedBlog = await Blog.findByIdAndDelete(id);
      if (!deletedBlog) return res.status(404).json({ error: "Blog not found" });
      return res.status(200).json({ success: true, message: "Blog deleted successfully" });
    }

    else {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
