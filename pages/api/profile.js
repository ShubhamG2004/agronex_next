import { getSession } from 'next-auth/react';
import { Profile } from '@/model/Profile';
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

            let profile = await Profile.findOne({ userId: user._id });

            if (!profile) {
                profile = {
                    fullName: user.name || '',
                    email: user.email,
                    image: user.image || '',
                    bio: '',
                    location: '',
                    website: '',
                    socialLinks: { twitter: '', linkedin: '', github: '' },
                };
            }

            return res.status(200).json({ profile });
        } catch (error) {
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    if (req.method === 'POST') {
        const { email, ...profileData } = req.body;

        if (!email) return res.status(400).json({ message: "Email is required" });

        try {
            const user = await Users.findOne({ email });
            if (!user) return res.status(404).json({ message: "User not found" });

            let profile = await Profile.findOneAndUpdate(
                { userId: user._id },
                { ...profileData, userId: user._id },
                { new: true, upsert: true }
            );

            return res.status(200).json({ message: "Profile updated successfully", profile });
        } catch (error) {
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    res.status(405).json({ message: "Method not allowed" });
}
