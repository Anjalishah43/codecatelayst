"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { Code, Github, Play, Check, AlertCircle, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function ChallengePage() {
  const params = useParams()
  const { id } = params
  const { user } = useAuth()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("description")
  const [submissionTab, setSubmissionTab] = useState("code")
  const [code, setCode] = useState(
    "// Write your solution here\n\nfunction twoSum(nums, target) {\n  // Your code here\n}",
  )
  const [githubLink, setGithubLink] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<null | { status: "success" | "error"; message: string }>(null)
  const [challenge, setChallenge] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [testResults, setTestResults] = useState<any[]>([])
  const [allTestsPassed, setAllTestsPassed] = useState(false)

  useEffect(() => {
    if (id) {
      fetchChallenge()
      if (user) {
        fetchSubmissions()
      }
    }
  }, [id, user])

  const fetchChallenge = async () => {
    try {
      const response = await fetch(`/api/challenges/${id}`)
      if (response.ok) {
        const data = await response.json()
        setChallenge(data.challenge)

        // Set default code based on challenge type
        if (data.challenge.category === "DSA") {
          setCode(
            `// Write your solution for ${data.challenge.title}\n\nfunction solution(input) {\n  // Your code here\n}`,
          )
        }
      }
    } catch (error) {
      console.error("Failed to fetch challenge:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/submissions?challengeId=${id}&userId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions)
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error)
    }
  }

  const runCode = async () => {
    if (!challenge) return

    setIsRunning(true)
    setTestResults([])
    setAllTestsPassed(false)

    try {
      // For demonstration purposes, we'll simulate running the code against test cases
      // In a real application, you would send the code to a backend service for execution

      // Simulate test case execution
      const results = challenge.testCases
        ? challenge.testCases
            .filter((tc: any) => !tc.isHidden)
            .map((testCase: any, index: number) => {
              // Simulate test execution (random success/failure for demo)
              const passed = Math.random() > 0.3
              return {
                testCase,
                passed,
                output: passed ? testCase.output : "Incorrect output",
              }
            })
        : []

      setTestResults(results)

      // Check if all tests passed
      const allPassed = results.every((result: any) => result.passed)
      setAllTestsPassed(allPassed)

      if (allPassed) {
        setResult({
          status: "success",
          message: "All test cases passed! You can now submit your solution.",
        })
      } else {
        setResult({
          status: "error",
          message: "Some test cases failed. Please review your solution.",
        })
      }
    } catch (error) {
      setResult({
        status: "error",
        message: "Failed to run code. Please try again.",
      })
    } finally {
      setIsRunning(false)
    }
  }

  const handleCodeSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit your solution.",
        variant: "destructive",
      })
      return
    }

    // Run the code first if not already run
    if (!testResults.length) {
      await runCode()
      // If tests failed, don't submit
      if (!allTestsPassed) return
    }

    setIsSubmitting(true)
    setResult(null)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          challengeId: id,
          submissionType: "code",
          code,
          language,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit solution")
      }

      // Refresh submissions
      fetchSubmissions()

      setResult({
        status: "success",
        message: "Your solution has been submitted and will be reviewed soon.",
      })
    } catch (error) {
      setResult({
        status: "error",
        message: "Failed to submit solution. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGithubSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit your solution.",
        variant: "destructive",
      })
      return
    }

    if (!githubLink) {
      toast({
        title: "GitHub link required",
        description: "Please provide a GitHub link to your solution.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setResult(null)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          challengeId: id,
          submissionType: "github",
          githubLink,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit GitHub link")
      }

      // Refresh submissions
      fetchSubmissions()

      setResult({
        status: "success",
        message: "Your GitHub submission has been received and will be reviewed soon.",
      })
    } catch (error) {
      setResult({
        status: "error",
        message: "Failed to submit GitHub link. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "hard":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
      case "expert":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default:
        return "bg-primary/10 text-primary hover:bg-primary/20"
    }
  }

  if (isLoading) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-lg">Loading challenge...</p>
        </div>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Challenge not found</h2>
          <p className="mt-2 text-muted-foreground">
            The challenge you're looking for doesn't exist or has been removed.
          </p>
          <Button className="mt-4" asChild>
            <a href="/challenges">Back to Challenges</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{challenge.title}</h1>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                {challenge.difficulty}
              </Badge>
              <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
                {challenge.points} pts
              </Badge>
              <Badge variant="outline">{challenge.category}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="submissions">Submissions</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="description" className="mt-0">
                  <div className="space-y-4">
                    <p>{challenge.description}</p>

                    {challenge.category === "DSA" && (
                      <>
                        <div>
                          <h3 className="font-bold">Examples:</h3>
                          <div className="mt-2 space-y-3">
                            {challenge.examples?.map((example: any, index: number) => (
                              <div key={index} className="rounded-md bg-muted p-3">
                                <p className="font-mono text-sm">Input: {example.input}</p>
                                <p className="font-mono text-sm">Output: {example.output}</p>
                                {example.explanation && (
                                  <p className="text-sm text-muted-foreground">Explanation: {example.explanation}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold">Constraints:</h3>
                          <ul className="ml-6 mt-2 list-disc space-y-1">
                            {challenge.constraints?.map((constraint: string, index: number) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                {constraint}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}

                    {challenge.category === "Project" && (
                      <div>
                        <h3 className="font-bold">Requirements:</h3>
                        <ul className="ml-6 mt-2 list-disc space-y-1">
                          {challenge.requirements?.map((req: string, index: number) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="submissions" className="mt-0">
                  <div className="space-y-4">
                    {user ? (
                      submissions.length > 0 ? (
                        <div className="space-y-4">
                          {submissions.map((submission: any, index: number) => (
                            <div key={index} className="rounded-md border p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">Submission #{index + 1}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(submission.submittedAt).toLocaleString()}
                                  </p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={
                                    submission.status === "accepted"
                                      ? "bg-green-500/10 text-green-500"
                                      : submission.status === "rejected"
                                        ? "bg-red-500/10 text-red-500"
                                        : "bg-yellow-500/10 text-yellow-500"
                                  }
                                >
                                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                </Badge>
                              </div>
                              {submission.feedback && (
                                <div className="mt-2 rounded-md bg-muted p-2 text-sm">
                                  <p className="font-medium">Feedback:</p>
                                  <p>{submission.feedback}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-md border p-4 text-center">
                          <p>No submissions yet</p>
                        </div>
                      )
                    ) : (
                      <div className="rounded-md border p-4 text-center">
                        <p>Please log in to view your submissions</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <Tabs defaultValue="code" value={submissionTab} onValueChange={setSubmissionTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="code" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <span>Code Solution</span>
                  </TabsTrigger>
                  <TabsTrigger value="github" className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    <span>GitHub Link</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <Tabs value={submissionTab} onValueChange={setSubmissionTab}>
                <TabsContent value="code" className="mt-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm" className="gap-2" onClick={runCode} disabled={isRunning}>
                      {isRunning ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Running
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Run Code
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="relative min-h-[300px] rounded-md border">
                    <Textarea
                      className="font-mono min-h-[300px] resize-none p-4"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Write your solution here..."
                    />
                  </div>

                  {testResults.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Test Results:</h3>
                      <div className="space-y-2">
                        {testResults.map((result, index) => (
                          <div
                            key={index}
                            className={`rounded-md p-3 ${result.passed ? "bg-green-500/10" : "bg-red-500/10"}`}
                          >
                            <div className="flex items-start gap-2">
                              {result.passed ? (
                                <Check className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              )}
                              <div>
                                <p className="font-medium">Test Case {index + 1}</p>
                                <p className="text-sm font-mono">Input: {result.testCase.input}</p>
                                <p className="text-sm font-mono">Expected: {result.testCase.output}</p>
                                {!result.passed && (
                                  <p className="text-sm font-mono text-red-500">Your output: {result.output}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result && (
                    <div
                      className={`rounded-md p-4 ${
                        result.status === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {result.status === "success" ? (
                          <Check className="h-5 w-5 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-5 w-5 mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium">{result.status === "success" ? "Success!" : "Error"}</p>
                          <p className="text-sm">{result.message}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="github" className="mt-0 space-y-4">
                  <div>
                    <p className="mb-4 text-muted-foreground">
                      Submit a link to your GitHub repository with your solution.
                    </p>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Input
                          placeholder="https://github.com/username/repository"
                          value={githubLink}
                          onChange={(e) => setGithubLink(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Make sure your repository is public so our reviewers can access it.
                        </p>
                      </div>

                      <Textarea
                        placeholder="Additional notes or comments about your solution (optional)"
                        className="min-h-[150px]"
                      />
                    </div>
                  </div>

                  {result && (
                    <div
                      className={`rounded-md p-4 ${
                        result.status === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {result.status === "success" ? (
                          <Check className="h-5 w-5 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-5 w-5 mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium">{result.status === "success" ? "Success!" : "Error"}</p>
                          <p className="text-sm">{result.message}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              {submissionTab === "code" ? (
                <Button
                  className="w-full gap-2"
                  onClick={handleCodeSubmit}
                  disabled={isSubmitting || (!allTestsPassed && testResults.length > 0)}
                >
                  {isSubmitting ? "Submitting..." : "Submit Solution"}
                </Button>
              ) : (
                <Button className="w-full gap-2" onClick={handleGithubSubmit} disabled={isSubmitting || !githubLink}>
                  {isSubmitting ? "Submitting..." : "Submit GitHub Link"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
