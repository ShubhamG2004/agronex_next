import connectMongo from "@/database/conn";
import { Users } from "@/model/Schema";
import { hash } from "bcryptjs";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed. Only POST is accepted." });
    }

    try {
        
        await connectMongo();

        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Missing required fields: username, email, password." });
        }

        console.log("Searching for email:", email);

        // Check if user already exists    
        const userExists = await Users.findOne({ email });

        console.log("User found:", userExists);

        if (userExists) {
            return res.status(422).json({ error: "User already exists." });
        }

        // Hash password and create user
        const hashedPassword = await hash(password, 12);
        const newUser = await Users.create({ username, email, password: hashedPassword });

        return res.status(201).json({ success: true, user: newUser });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
