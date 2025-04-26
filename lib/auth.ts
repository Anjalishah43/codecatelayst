import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { jwtVerify } from "jose"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      async authorize(credentials, req) {
        // Add your authentication logic here
        // Example:
        // const user = await verifyUser(credentials.email, credentials.password);
        // if (user) {
        //   return user;
        // } else {
        //   return null;
        // }
        // Replace with your actual authentication logic
        if (credentials?.email === "test@example.com" && credentials?.password === "password") {
          return { id: "1", name: "Test User", email: "test@example.com", role: "user" }
        }
        return null
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role as "admin" | "user"
      session.user.id = token.id as string
      return session
    },
  },
  secret: process.env.JWT_SECRET,
}

// Add the missing export that's required for deployment
export const verifyToken = async (token: string) => {
  if (!token) {
    throw new Error("No token provided")
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "")
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    throw new Error("Invalid token")
  }
}
