"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Code, FileQuestion, FolderKanban, Trophy, User, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchProfileData()
    }
  }, [user])

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`/api/users/${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setProfileData(data)
      }
    } catch (error) {
      console.error("Failed to fetch profile data:", error)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  if (isLoading || isLoadingProfile) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const solvedChallenges = profileData?.user?.solvedChallenges || []
  const inProgressChallenges = profileData?.user?.inProgressChallenges || []
  const recentSubmissions = profileData?.recentSubmissions || []

  // Calculate unsolved challenges (mock data for now)
  const unsolvedChallenges = [
    {
      challenge: {
        _id: "unsolved-1",
        title: "Binary Search Tree",
        category: "DSA",
        difficulty: "Medium",
        points: 150,
      },
    },
    {
      challenge: {
        _id: "unsolved-2",
        title: "CSS Flexbox Quiz",
        category: "Quiz",
        difficulty: "Easy",
        points: 50,
      },
    },
  ]

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
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Summary */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Score</span>
                  <span className="text-sm font-medium">{user.score} points</span>
                </div>
                <Progress value={Math.min((user.score / 1000) * 100, 100)} className="mt-2" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Challenges Solved</span>
                  <span className="text-sm font-medium">{solvedChallenges.length}</span>
                </div>
                <Progress value={Math.min((solvedChallenges.length / 50) * 100, 100)} className="mt-2" />
              </div>
              <div className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Global Rank</span>
                  <span className="text-sm font-medium">#{user.rank || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Joined</span>
                  <span className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </div>
              {user.role === "admin" && (
                <div className="pt-2">
                  <Button className="w-full" asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="solved">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="solved">Solved</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="unsolved">Recommended</TabsTrigger>
            </TabsList>
            <TabsContent value="solved" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Solved Challenges</CardTitle>
                  <CardDescription>Challenges you have successfully completed</CardDescription>
                </CardHeader>
                <CardContent>
                  {solvedChallenges.length > 0 ? (
                    <div className="space-y-4">
                      {solvedChallenges.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              {getCategoryIcon(item.challenge.category)}
                            </div>
                            <div>
                              <Link href={`/challenges/${item.challenge._id}`} className="font-medium hover:underline">
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
                      <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No solved challenges yet</h3>
                      <p className="text-muted-foreground mt-1">Start solving challenges to see them here</p>
                      <Button className="mt-4" asChild>
                        <Link href="/challenges">Browse Challenges</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="in-progress" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>In-Progress Challenges</CardTitle>
                  <CardDescription>Challenges you have started but not yet completed</CardDescription>
                </CardHeader>
                <CardContent>
                  {inProgressChallenges.length > 0 ? (
                    <div className="space-y-4">
                      {inProgressChallenges.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              {getCategoryIcon(item.challenge.category)}
                            </div>
                            <div>
                              <Link href={`/challenges/${item.challenge._id}`} className="font-medium hover:underline">
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
                          <Button size="sm" asChild>
                            <Link href={`/challenges/${item.challenge._id}`}>Continue</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No in-progress challenges</h3>
                      <p className="text-muted-foreground mt-1">Start working on challenges to see them here</p>
                      <Button className="mt-4" asChild>
                        <Link href="/challenges">Browse Challenges</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="unsolved" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Challenges</CardTitle>
                  <CardDescription>Challenges you might want to try next</CardDescription>
                </CardHeader>
                <CardContent>
                  {unsolvedChallenges.length > 0 ? (
                    <div className="space-y-4">
                      {unsolvedChallenges.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              {getCategoryIcon(item.challenge.category)}
                            </div>
                            <div>
                              <Link href={`/challenges/${item.challenge._id}`} className="font-medium hover:underline">
                                {item.challenge.title}
                              </Link>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className={getDifficultyColor(item.challenge.difficulty)}>
                                  {item.challenge.difficulty}
                                </Badge>
                                <Badge variant="outline" className="bg-primary/10 text-primary">
                                  {item.challenge.points} pts
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" asChild>
                            <Link href={`/challenges/${item.challenge._id}`}>Start</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No recommended challenges</h3>
                      <p className="text-muted-foreground mt-1">You've completed all available challenges!</p>
                      <Button className="mt-4" asChild>
                        <Link href="/challenges">Browse All Challenges</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent submissions and progress</CardDescription>
            </CardHeader>
            <CardContent>
              {recentSubmissions.length > 0 ? (
                <div className="space-y-6">
                  {recentSubmissions.map((submission: any, index: number) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        {getCategoryIcon(submission.challenge.category)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Submitted solution for{" "}
                          <Link href={`/challenges/${submission.challenge._id}`} className="hover:underline">
                            {submission.challenge.title}
                          </Link>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Status:{" "}
                          {submission.status === "accepted" ? (
                            <span className="text-green-500">Accepted</span>
                          ) : submission.status === "rejected" ? (
                            <span className="text-red-500">Rejected</span>
                          ) : (
                            <span className="text-yellow-500">Pending Review</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
