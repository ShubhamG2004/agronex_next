import connectMongo from "@/database/conn";
import { Profile } from "@/model/Profile";

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ message: "User ID is required" });

    try {
      const profile = await Profile.findOne({ userId });
      if (!profile) return res.status(404).json({ message: "User not found" });

      return res.status(200).json({ profile });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
