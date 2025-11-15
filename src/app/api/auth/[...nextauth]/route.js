// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import  dbConnect  from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const authOptions = {
  providers: [
    // 🔑 Credentials (email + password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          return null;
        }
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }
        
        const token = jwt.sign(
          { user_id: user._id, name: user.name, image:user.image, email: user.email, role:user.role  },
          process.env.JWT_SECRET,
          
          { expiresIn: 60*60 }
        );
        
       return { user_id: user._id, name:user.name,image:user.image, email: user.email, role: user.role, token: token};
      },
    }),

    // 🔑 Google login
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),

    // 🔑 GitHub login
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],

  session: { strategy: "jwt", maxAge: 60*60 },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.user_id;
        token.name = user.name;
        token.image = user.image;
        token.email = user.email;
        token.role = user.role || "user"; // default role
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.image = token.image;
        session.user.email = token.email;
        session.user.role = token.role || "user";
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      await dbConnect();

      // If login via OAuth (Google/GitHub)
      if (account?.provider !== "credentials") {
        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // Create new user with default role
          existingUser = await User.create({
            name: user.name || profile?.login,
            email: user.email,
            role: "user",
            image:'/images/user/owner.jpg',
            password: "", // no password for OAuth
            plain_password:"",
            
          });
        }

        user.role = existingUser.role;
      }

      return true;
    },
  },

  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };