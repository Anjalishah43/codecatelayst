import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const { name, email, password } = await req.json()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Check for admin email
    let role = "user"
    if (email === "adevraj934@gmail.com") {
      role = "admin"
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    })

    await user.save()

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

    return NextResponse.json({ user: userWithoutPassword, token }, { status: 201 })
  } catch (error) {
    console.error("Registration failed:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
