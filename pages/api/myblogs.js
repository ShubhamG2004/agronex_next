import { getSession } from "next-auth/react";
import connectMongo from "@/database/conn";
import Blog from "@/model/Blog";
import { Profile } from "@/model/Profile";

export default async function handler(req, res) {
    try {
        await connectMongo();
        console.log("✅ DB Connected");

        const session = await getSession({ req });
        if (!session || !session.user?.email) {
            console.error("❌ Unauthorized: No session found");
            return res.status(401).json({ error: "Unauthorized: Please log in" });
        }

        console.log("🔍 Fetching profile for email:", session.user.email);
        const userProfile = await Profile.findOne({ email: session.user.email });

        if (!userProfile) {
            console.error("❌ No profile found for:", session.user.email);
            return res.status(404).json({ error: "User profile not found" });
        }

        console.log("🔍 Fetching blogs for userId:", userProfile.userId);
        const userBlogs = await Blog.find({ userId: userProfile.userId }).sort({ createdAt: -1 });

        if (userBlogs.length === 0) {
            console.warn("⚠️ No blogs found for userId:", userProfile.userId);
            return res.status(404).json({ error: "No blogs found" });
        }

        console.log("✅ Blogs fetched:", userBlogs.length);
        return res.status(200).json({ blogs: userBlogs });

    } catch (error) {
        console.error("❌ API Error:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}
