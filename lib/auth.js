import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "./mongodb";
import User from "../models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });

        if (!user) throw new Error("Invalid Email or Password");

        // Verify OTP method
        if (credentials.password === "otp-verified") {
          if (user.isEmailVerified || user.loginMethod === 'email') {
            return { id: user._id.toString(), name: user.username, email: user.email, role: user.role };
          } else {
            throw new Error("Email not verified yet.");
          }
        }

        // Standard Password Check
        if (!user.password) throw new Error("Please use OAuth to login (Google/Apple) or use OTP.");

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordMatch) throw new Error("Invalid Email or Password");

        return { id: user._id.toString(), name: user.username, email: user.email, role: user.role };
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        await connectToDatabase();
        let existingUser = await User.findOne({ email: profile.email });

        if (!existingUser) {
          existingUser = new User({
            username: profile.name,
            email: profile.email,
            picture: profile.picture,
            loginMethod: "google",
            isEmailVerified: true
          });
          await existingUser.save();
        }

        user.id = existingUser._id.toString();
        user.role = existingUser.role;
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt"
  }
};
