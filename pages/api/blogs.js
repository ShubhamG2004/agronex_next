import { Blogs } from '@/model/Blog';
import { Users } from '@/model/Schema';
import connectMongo from '@/database/conn';

export default async function handler(req, res) {
    await connectMongo();

    if (req.method === 'GET') {
        const { email } = req.query;
        if (!email) return res.status(400).json({ message: "Email is required" });

        try {
            const user = await Users.findOne({ email });
            if (!user) return res.status(404).json({ message: "User not found" });

            // Fetch only blogs where `userId` matches the logged-in user
            const blogs = await Blogs.find({ userId: user._id }).sort({ createdAt: -1 });

            return res.status(200).json({ blogs });
        } catch (error) {
            console.error("Error fetching blogs:", error);
            return res.status(500).json({ message: "Server error", error });
        }
    }

    res.status(405).json({ message: "Method not allowed" });
}
