import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectMongo from '@/database/conn';
import { Users } from '@/model/Schema';
import { compare } from 'bcryptjs';

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        CredentialsProvider({
            name: 'Credentials',
            async authorize(credentials) {
                await connectMongo();

                // Check if user exists
                const user = await Users.findOne({ email: credentials.email });
                if (!user) {
                    throw new Error('No user found! Please Sign Up!');
                }

                // Compare password
                const isValidPassword = await compare(credentials.password, user.password);
                if (!isValidPassword) {
                    throw new Error('Username or Password is incorrect!');
                }

                return { id: user._id.toString(), name: user.name, email: user.email };
            },
        }),
    ],

    session: {
        strategy: "jwt", 
        maxAge: 365 * 24 * 60 * 60, 
        updateAge: 24 * 60 * 60, 
    },

    callbacks: {
        async signIn({ user, account }) {
            await connectMongo();

            if (account.provider === 'google' || account.provider === 'github') {
                const existingUser = await Users.findOne({ email: user.email });

                if (!existingUser) {
                    const newUser = new Users({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        provider: account.provider,
                    });
                    await newUser.save();
                }
            }
            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id || user._id.toString();
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
            }
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: '/login', 
    },

    debug: process.env.NODE_ENV === 'development', 
});
