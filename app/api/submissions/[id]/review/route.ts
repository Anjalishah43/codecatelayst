import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Submission from "@/lib/models/Submission"
import User from "@/lib/models/User"
import Challenge from "@/lib/models/Challenge"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    // In a real app, you would validate the user is an admin here

    const { status, score, feedback } = await req.json()

    const submission = await Submission.findById(params.id)
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    // Update submission
    submission.status = status
    submission.score = score
    submission.feedback = feedback
    await submission.save()

    // If accepted, update user's solved challenges and score
    if (status === "accepted") {
      const user = await User.findById(submission.user)
      const challenge = await Challenge.findById(submission.challenge)

      // Check if already solved
      const alreadySolved = user.solvedChallenges.some(
        (sc: any) => sc.challenge.toString() === submission.challenge.toString(),
      )

      if (!alreadySolved) {
        // Add to solved challenges
        user.solvedChallenges.push({
          challenge: submission.challenge,
          solvedAt: new Date(),
          score,
        })

        // Remove from in-progress if present
        user.inProgressChallenges = user.inProgressChallenges.filter(
          (ipc: any) => ipc.challenge.toString() !== submission.challenge.toString(),
        )

        // Update total score
        user.score += score

        await user.save()

        // Update rankings for all users
        await updateRankings()
      }
    }

    return NextResponse.json({ submission }, { status: 200 })
  } catch (error) {
    console.error("Failed to review submission:", error)
    return NextResponse.json({ error: "Failed to review submission" }, { status: 500 })
  }
}

async function updateRankings() {
  // Get all users sorted by score
  const users = await User.find().sort({ score: -1 })

  // Update ranks
  for (let i = 0; i < users.length; i++) {
    users[i].rank = i + 1
    await users[i].save()
  }
}
