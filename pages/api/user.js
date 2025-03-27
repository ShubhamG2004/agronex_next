import { getSession } from 'next-auth/react';
import { Users } from '@/model/Schema';
import connectMongo from '@/database/conn';

export default async function handler(req, res) {
    await connectMongo();
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const user = await Users.findOne({ email: session.user.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ email: user.email, name: user.name, image: user.image });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
