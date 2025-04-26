"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { Loader2, Check, X, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ChallengeSubmissionsPage() {
  const params = useParams()
  const { id } = params
  const { user } = useAuth()
  const { toast } = useToast()

  const [challenge, setChallenge] = useState<any>(null)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      fetchChallenge()
      fetchSubmissions()
    }
  }, [id])

  const fetchChallenge = async () => {
    try {
      const response = await fetch(`/api/challenges/${id}`)
      if (response.ok) {
        const data = await response.json()
        setChallenge(data.challenge)
      }
    } catch (error) {
      console.error("Failed to fetch challenge:", error)
    }
  }

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/submissions?challengeId=${id}`, {
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
    } finally {
      setIsLoading(false)
    }
  }

  const handleReviewSubmission = async (submissionId: string, status: "accepted" | "rejected") => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Permission denied",
        description: "You don't have permission to review submissions.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/submissions/${submissionId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          feedback,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to review submission")
      }

      toast({
        title: "Submission reviewed",
        description: `The submission has been marked as ${status}.`,
      })

      // Refresh submissions
      fetchSubmissions()
      setSelectedSubmission(null)
      setFeedback("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to review submission. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-lg">Loading submissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Button variant="outline" className="mb-4" asChild>
          <a href="/admin/challenges">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Challenges
          </a>
        </Button>

        <h1 className="text-3xl font-bold">{challenge ? challenge.title : "Challenge"} Submissions</h1>
        <p className="text-muted-foreground">Review and manage user submissions for this challenge.</p>
      </div>

      {submissions.length > 0 ? (
        <div className="space-y-6">
          {submissions.map((submission) => (
            <Card key={submission._id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{submission.user?.username || "Anonymous User"}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Submitted on {new Date(submission.submittedAt).toLocaleString()}
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
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="submission" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="submission">Submission</TabsTrigger>
                    <TabsTrigger value="review">Review</TabsTrigger>
                  </TabsList>
                  <TabsContent value="submission">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Submission Type</h3>
                        <p>{submission.submissionType === "code" ? "Code Solution" : "GitHub Repository"}</p>
                      </div>

                      {submission.submissionType === "code" ? (
                        <div>
                          <h3 className="font-medium mb-2">Code ({submission.language})</h3>
                          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                            <code>{submission.code}</code>
                          </pre>
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-medium mb-2">GitHub Link</h3>
                          <a
                            href={submission.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {submission.githubLink}
                          </a>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="review">
                    <div className="space-y-4">
                      {submission.status !== "pending" ? (
                        <div>
                          <h3 className="font-medium mb-2">Review Status</h3>
                          <Badge
                            variant="outline"
                            className={
                              submission.status === "accepted"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-red-500/10 text-red-500"
                            }
                          >
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </Badge>

                          {submission.feedback && (
                            <div className="mt-4">
                              <h3 className="font-medium mb-2">Feedback</h3>
                              <div className="bg-muted p-4 rounded-md">
                                <p>{submission.feedback}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-medium mb-2">Provide Feedback</h3>
                          <Textarea
                            placeholder="Enter your feedback for this submission..."
                            className="min-h-[150px]"
                            value={selectedSubmission === submission._id ? feedback : ""}
                            onChange={(e) => {
                              setSelectedSubmission(submission._id)
                              setFeedback(e.target.value)
                            }}
                          />
                          <div className="flex gap-2 mt-4">
                            <Button
                              onClick={() => handleReviewSubmission(submission._id, "accepted")}
                              disabled={isSubmitting}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Accept
                            </Button>
                            <Button
                              onClick={() => handleReviewSubmission(submission._id, "rejected")}
                              disabled={isSubmitting}
                              variant="destructive"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <h2 className="text-xl font-medium">No submissions yet</h2>
          <p className="text-muted-foreground mt-2">There are no submissions for this challenge yet.</p>
        </div>
      )}
    </div>
  )
}
