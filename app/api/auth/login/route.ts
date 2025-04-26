import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const { email, password } = await req.json()

    // Check for admin credentials (hardcoded for demo)
    if (email === "adevraj934@gmail.com" && password === "adminpassword123") {
      const token = jwt.sign(
        {
          id: "admin-1",
          email,
          name: "Admin User",
          role: "admin",
        },
        process.env.JWT_SECRET || "your_jwt_secret_key_here",
        { expiresIn: "7d" },
      )

      return NextResponse.json(
        {
          user: {
            id: "admin-1",
            email,
            name: "Admin User",
            role: "admin",
            score: 0,
            solvedChallenges: 0,
          },
          token,
        },
        { status: 200 },
      )
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
      { expiresIn: "7d" },
    )

    // Don't return the password
    const userWithoutPassword = { ...user.toObject(), password: undefined }

    return NextResponse.json({ user: userWithoutPassword, token }, { status: 200 })
  } catch (error) {
    console.error("Login failed:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
