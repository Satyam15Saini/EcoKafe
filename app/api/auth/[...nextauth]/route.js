import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "../../../../lib/mongodb";
import User from "../../../../models/User";
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

        // 🟢 NAYA FIX: OTP Verification Bypass
        // Jab user OTP screen par verify kar leta hai, frontend se ye keyword aata hai
        if (credentials.password === "otp-verified") {
           if(user.isEmailVerified || user.loginMethod === 'email') {
               // Login allowed via OTP
               return { id: user._id.toString(), name: user.username, email: user.email, role: user.role };
           } else {
               throw new Error("Email not verified yet.");
           }
        }

        // Standard Password Check (For normal email/password login)
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
      await connectToDatabase();

      if (account?.provider === "google") {
        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          // Create new user from OAuth
          dbUser = await User.create({
            username: user.name || user.email.split("@")[0],
            email: user.email,
            role: "user",
            isEmailVerified: true,
            loginMethod: account.provider,
            ...(account.provider === "google" && { googleId: account.providerAccountId }),
          });
        } else {
          // Update existing user with OAuth ID if not already set
          if (account.provider === "google" && !dbUser.googleId) {
            dbUser.googleId = account.providerAccountId;
            dbUser.isEmailVerified = true;
          }
          await dbUser.save();
        }

        user.id = dbUser._id.toString();
        user.role = dbUser.role;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };