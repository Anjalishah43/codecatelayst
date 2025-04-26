"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { User, Award, Code, FileQuestion, FolderKanban, Clock, CheckCircle, XCircle, Clock3 } from "lucide-react"
import Link from "next/link"

export default function UserDetailPage() {
  const params = useParams()
  const { id } = params

  const [userData, setUserData] = useState<any>(null)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchUserData()
      fetchUserSubmissions()
    }
  }, [id])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/${id}`)
      if (response.ok) {
        const data = await response.json()
        setUserData(data.user)
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserSubmissions = async () => {
    try {
      const response = await fetch(`/api/submissions?userId=${id}`)
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions)
      }
    } catch (error) {
      console.error("Failed to fetch user submissions:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">User not found</h2>
        <p className="text-muted-foreground mt-2">The requested user could not be found.</p>
        <Button className="mt-4" asChild>
          <Link href="/admin/users">Back to Users</Link>
        </Button>
      </div>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case "dsa":
        return <Code className="h-5 w-5" />
      case "quiz":
        return <FileQuestion className="h-5 w-5" />
      case "project":
        return <FolderKanban className="h-5 w-5" />
      default:
        return <Code className="h-5 w-5" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock3 className="h-5 w-5 text-yellow-500" />
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
          <p className="text-muted-foreground">Detailed information about {userData.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit User</Button>
          <Button variant="destructive">Delete User</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle>{userData.name}</CardTitle>
              <CardDescription>{userData.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Role</span>
                <Badge variant={userData.role === "admin" ? "default" : "outline"}>{userData.role}</Badge>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Score</span>
                  <span className="text-sm font-medium">{userData.score} points</span>
                </div>
                <Progress value={Math.min((userData.score / 1000) * 100, 100)} className="mt-2" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Challenges Solved</span>
                  <span className="text-sm font-medium">{userData.solvedChallenges?.length || 0}</span>
                </div>
                <Progress
                  value={Math.min(((userData.solvedChallenges?.length || 0) / 50) * 100, 100)}
                  className="mt-2"
                />
              </div>

              <div className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Global Rank</span>
                  <span className="text-sm font-medium">#{userData.rank || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Joined</span>
                  <span className="text-sm font-medium">{new Date(userData.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="solved">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="solved">Solved Challenges</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
            </TabsList>

            <TabsContent value="solved" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Solved Challenges</CardTitle>
                  <CardDescription>Challenges this user has successfully completed</CardDescription>
                </CardHeader>
                <CardContent>
                  {userData.solvedChallenges?.length > 0 ? (
                    <div className="space-y-4">
                      {userData.solvedChallenges.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              {getCategoryIcon(item.challenge.category)}
                            </div>
                            <div>
                              <Link
                                href={`/admin/challenges/${item.challenge._id}`}
                                className="font-medium hover:underline"
                              >
                                {item.challenge.title}
                              </Link>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className={getDifficultyColor(item.challenge.difficulty)}>
                                  {item.challenge.difficulty}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Solved on {new Date(item.solvedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-primary" />
                            <span>{item.score || item.challenge.points} pts</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No solved challenges yet</h3>
                      <p className="text-muted-foreground mt-1">This user hasn't solved any challenges</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="in-progress" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>In-Progress Challenges</CardTitle>
                  <CardDescription>Challenges this user has started but not yet completed</CardDescription>
                </CardHeader>
                <CardContent>
                  {userData.inProgressChallenges?.length > 0 ? (
                    <div className="space-y-4">
                      {userData.inProgressChallenges.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              {getCategoryIcon(item.challenge.category)}
                            </div>
                            <div>
                              <Link
                                href={`/admin/challenges/${item.challenge._id}`}
                                className="font-medium hover:underline"
                              >
                                {item.challenge.title}
                              </Link>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className={getDifficultyColor(item.challenge.difficulty)}>
                                  {item.challenge.difficulty}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Started on {new Date(item.startedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-muted-foreground">
                              Last activity: {new Date(item.lastAttempt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No in-progress challenges</h3>
                      <p className="text-muted-foreground mt-1">This user hasn't started any challenges</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="submissions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Submission History</CardTitle>
                  <CardDescription>All submissions made by this user</CardDescription>
                </CardHeader>
                <CardContent>
                  {submissions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Challenge</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((submission: any) => (
                          <TableRow key={submission._id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getCategoryIcon(submission.challenge.category)}
                                <span className="font-medium">{submission.challenge.title}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {submission.submissionType === "code"
                                  ? "Code"
                                  : submission.submissionType === "github"
                                    ? "GitHub"
                                    : "Quiz"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(submission.status)}
                                <span className="capitalize">{submission.status}</span>
                              </div>
                            </TableCell>
                            <TableCell>{submission.score}</TableCell>
                            <TableCell>{new Date(submission.submittedAt).toLocaleString()}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/admin/submissions/${submission._id}`}>Review</Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No submissions yet</h3>
                      <p className="text-muted-foreground mt-1">This user hasn't submitted any solutions</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
