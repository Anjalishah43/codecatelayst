import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Challenge from "@/lib/models/Challenge"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { code, language } = await request.json()

    // Verify authentication
    const token = request.headers.get("Authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Connect to database
    await connectToDatabase()

    // Find the challenge
    const challenge = await Challenge.findById(id)
    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 })
    }

    // In a real application, you would execute the code against test cases
    // For this demo, we'll simulate test case execution
    const testResults = challenge.testCases.map((testCase: any) => {
      // Simulate test execution (random success/failure for demo)
      const passed = Math.random() > 0.3
      return {
        testCase: {
          input: testCase.input,
          output: testCase.output,
          isHidden: testCase.isHidden,
        },
        passed: passed || testCase.isHidden, // Always "pass" hidden test cases in the demo
        output: passed ? testCase.output : "Incorrect output",
      }
    })

    // Filter out hidden test cases for the response
    const visibleResults = testResults.filter((result: any) => !result.testCase.isHidden)

    // Check if all tests passed
    const allPassed = testResults.every((result: any) => result.passed)

    return NextResponse.json({
      results: visibleResults,
      allPassed,
      message: allPassed ? "All test cases passed!" : "Some test cases failed. Please review your solution.",
    })
  } catch (error) {
    console.error("Error validating code:", error)
    return NextResponse.json({ error: "Failed to validate code" }, { status: 500 })
  }
}
