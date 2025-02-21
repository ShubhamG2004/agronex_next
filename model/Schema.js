import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String, 
    image: String,
    provider: String, 
});

export const Users = mongoose.models.Users || mongoose.model('Users', UserSchema);
