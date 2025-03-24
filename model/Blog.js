import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  scheduleDate: { type: Date, required: true },
  status: { type: String, enum: ["draft", "published"], required: true },
  imageUrl: { type: String, required: true }, // ✅ Store Cloudinary URL
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;
