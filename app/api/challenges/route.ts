import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Challenge from "@/lib/models/Challenge"

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const url = new URL(req.url)
    const category = url.searchParams.get("category")
    const status = url.searchParams.get("status") || "active"

    const query: any = { status }
    if (category) {
      query.category = category
    }

    const challenges = await Challenge.find(query).sort({ createdAt: -1 })

    return NextResponse.json({ challenges }, { status: 200 })
  } catch (error) {
    console.error("Failed to fetch challenges:", error)
    return NextResponse.json({ error: "Failed to fetch challenges" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const data = await req.json()

    // In a real app, you would validate the user is an admin here

    const challenge = new Challenge({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await challenge.save()

    return NextResponse.json({ challenge }, { status: 201 })
  } catch (error) {
    console.error("Failed to create challenge:", error)
    return NextResponse.json({ error: "Failed to create challenge" }, { status: 500 })
  }
}
