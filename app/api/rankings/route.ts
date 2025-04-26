import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const url = new URL(req.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "100")

    const rankings = await User.find({ role: "user" })
      .select("name score rank solvedChallenges")
      .sort({ score: -1, name: 1 })
      .limit(limit)

    return NextResponse.json({ rankings }, { status: 200 })
  } catch (error) {
    console.error("Failed to fetch rankings:", error)
    return NextResponse.json({ error: "Failed to fetch rankings" }, { status: 500 })
  }
}
