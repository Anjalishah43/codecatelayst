import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Challenge from "@/lib/models/Challenge"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const challenge = await Challenge.findById(params.id)

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 })
    }

    return NextResponse.json({ challenge }, { status: 200 })
  } catch (error) {
    console.error("Failed to fetch challenge:", error)
    return NextResponse.json({ error: "Failed to fetch challenge" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const data = await req.json()

    // In a real app, you would validate the user is an admin here

    const challenge = await Challenge.findByIdAndUpdate(params.id, { ...data, updatedAt: new Date() }, { new: true })

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 })
    }

    return NextResponse.json({ challenge }, { status: 200 })
  } catch (error) {
    console.error("Failed to update challenge:", error)
    return NextResponse.json({ error: "Failed to update challenge" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    // In a real app, you would validate the user is an admin here

    const challenge = await Challenge.findByIdAndDelete(params.id)

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Challenge deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Failed to delete challenge:", error)
    return NextResponse.json({ error: "Failed to delete challenge" }, { status: 500 })
  }
}
