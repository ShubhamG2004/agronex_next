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
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          await connectMongo();

          // Check if user exists
          const user = await Users.findOne({ email: credentials.email });
          if (!user) {
            throw new Error('No user found with this email address');
          }

          // Check if user has password (OAuth users might not have one)
          if (!user.password) {
            throw new Error('Please sign in with the provider you used to register');
          }

          // Compare password
          const isValidPassword = await compare(credentials.password, user.password);
          if (!isValidPassword) {
            throw new Error('Incorrect password');
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image
          };
        } catch (error) {
          console.error('Authorization error:', error.message);
          throw new Error('Authentication failed');
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectMongo();

        if (account.provider === 'google' || account.provider === 'github') {
          const existingUser = await Users.findOne({ email: user.email });

          if (!existingUser) {
            const newUser = new Users({
              name: user.name || profile?.name,
              email: user.email,
              image: user.image || profile?.picture,
              provider: account.provider,
              verified: true // Mark OAuth users as verified
            });
            await newUser.save();
          } else if (!existingUser.provider) {
            // Update existing user with provider info if missing
            existingUser.provider = account.provider;
            existingUser.image = existingUser.image || user.image || profile?.picture;
            await existingUser.save();
          }
        }
        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.provider = user.provider;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.provider = token.provider;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/login',
    error: '/login', 
  },

  debug: process.env.NODE_ENV === 'production',
  
  // Security settings
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
});