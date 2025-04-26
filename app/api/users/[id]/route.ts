import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import Submission from "@/lib/models/Submission"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const user = await User.findById(params.id)
      .select("-password")
      .populate("solvedChallenges.challenge", "title category difficulty points")
      .populate("inProgressChallenges.challenge", "title category difficulty points")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get recent submissions
    const recentSubmissions = await Submission.find({ user: params.id })
      .populate("challenge", "title category")
      .sort({ submittedAt: -1 })
      .limit(5)

    return NextResponse.json({ user, recentSubmissions }, { status: 200 })
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const data = await req.json()

    // Don't allow password updates through this route
    delete data.password

    const user = await User.findByIdAndUpdate(params.id, data, { new: true }).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error("Failed to update user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
