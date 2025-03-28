import connectMongo from '@/database/conn';
import { Users } from '@/model/Schema';
import bcrypt from 'bcryptjs';
import { promisify } from 'util';

const hashPassword = promisify(bcrypt.hash);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectMongo();
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password using promisified bcrypt.hash
    const hashedPassword = await hashPassword(password, 10);

    // Create new user
    const newUser = new Users({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
