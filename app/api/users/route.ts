import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import bcrypt from "bcryptjs"

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    // In a real app, you would validate the user is an admin here

    const users = await User.find().select("name email role score rank solvedChallenges createdAt").sort({ score: -1 })

    return NextResponse.json({ users }, { status: 200 })
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const { name, email, password, role = "user" } = await req.json()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
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

    // Don't return the password
    const userWithoutPassword = { ...user.toObject(), password: undefined }

    return NextResponse.json({ user: userWithoutPassword }, { status: 201 })
  } catch (error) {
    console.error("Failed to create user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
