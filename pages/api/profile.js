import { getSession } from "next-auth/react";
import { Profile } from "@/model/Profile";
import { Users } from "@/model/Schema";
import connectMongo from "@/database/conn";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Configure Multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === "GET") {
    const { email } = req.query;

    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
      const user = await Users.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      let profile = await Profile.findOne({ userId: user._id });

      if (!profile) {
        profile = {
          fullName: user.name || "",
          email: user.email,
          image: user.image || "",
          bio: "",
          location: "",
          website: "",
          socialLinks: { twitter: "", linkedin: "", github: "" },
        };
      }

      return res.status(200).json({ profile });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  if (req.method === "POST") {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: "File upload error" });
      }

      const { email, fullName, bio, location, website, socialLinks } = req.body;

      if (!email) return res.status(400).json({ message: "Email is required" });

      try {
        const user = await Users.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        let profile = await Profile.findOne({ userId: user._id });

        let imageUrl = profile?.image || user.image || ""; // Preserve existing image

        if (req.file) {
          try {
            imageUrl = await new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "profile_images" },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result.secure_url);
                }
              );
              uploadStream.end(req.file.buffer);
            });
          } catch (uploadError) {
            return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
          }
        }

        profile = await Profile.findOneAndUpdate(
          { userId: user._id },
          {
            fullName,
            email,
            image: imageUrl, // Always use the correct image URL
            bio,
            location,
            website,
            socialLinks: JSON.parse(socialLinks || "{}"),
            userId: user._id,
          },
          { new: true, upsert: true }
        );

        return res.status(200).json({ message: "Profile updated successfully", profile });
      } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
      }
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
