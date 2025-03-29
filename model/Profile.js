import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  fullName: String,
  email: { type: String, unique: true, required: true },
  image: { type: String, default: "" }, // Store Cloudinary URL here
  bio: String,
  location: String,
  website: String,
  socialLinks: {
    twitter: String,
    linkedin: String,
    github: String,
    instagram: { type: String, default: "" } 
  },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }]
});

export const Profile = mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
