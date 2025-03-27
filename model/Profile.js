import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    fullName: { type: String, required: true },
    bio: String,
    location: String,
    website: String,
    socialLinks: {
        twitter: String,
        linkedin: String,
        github: String
    },
    createdAt: { type: Date, default: Date.now }
});

export const Profile = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
