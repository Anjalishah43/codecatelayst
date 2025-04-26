import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Submission from "@/lib/models/Submission"
import User from "@/lib/models/User"
import Challenge from "@/lib/models/Challenge"

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const url = new URL(req.url)
    const challengeId = url.searchParams.get("challengeId")
    const userId = url.searchParams.get("userId")

    const query: any = {}

    if (challengeId) {
      query.challenge = challengeId
    }

    if (userId) {
      query.user = userId
    }

    const submissions = await Submission.find(query)
      .populate("user", "name email")
      .populate("challenge", "title category")
      .sort({ submittedAt: -1 })

    return NextResponse.json({ submissions }, { status: 200 })
  } catch (error) {
    console.error("Failed to fetch submissions:", error)
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const data = await req.json()
    const { userId, challengeId, submissionType, code, language, githubLink, notes, answers } = data

    // Validate challenge exists
    const challenge = await Challenge.findById(challengeId)
    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 })
    }

    // Create submission
    const submission = new Submission({
      user: userId,
      challenge: challengeId,
      submissionType,
      code,
      language,
      githubLink,
      notes,
      answers,
      status: "pending",
    })

    await submission.save()

    // Update user's in-progress challenges if not already solved
    const user = await User.findById(userId)
    const alreadySolved = user.solvedChallenges.some((sc: any) => sc.challenge.toString() === challengeId)

    if (!alreadySolved) {
      const inProgressIndex = user.inProgressChallenges.findIndex(
        (ipc: any) => ipc.challenge.toString() === challengeId,
      )

      if (inProgressIndex === -1) {
        user.inProgressChallenges.push({
          challenge: challengeId,
          startedAt: new Date(),
          lastAttempt: new Date(),
        })
      } else {
        user.inProgressChallenges[inProgressIndex].lastAttempt = new Date()
      }

      await user.save()
    }

    return NextResponse.json({ submission }, { status: 201 })
  } catch (error) {
    console.error("Failed to create submission:", error)
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 })
  }
}
