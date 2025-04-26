"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { Code, FileQuestion, FolderKanban, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ChallengesPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("DSA")
  const [searchQuery, setSearchQuery] = useState("")
  const [challenges, setChallenges] = useState<any>({
    DSA: [],
    Quiz: [],
    Project: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchChallenges()
  }, [])

  const fetchChallenges = async () => {
    try {
      const response = await fetch("/api/challenges")
      if (response.ok) {
        const data = await response.json()

        // Group challenges by category
        const groupedChallenges = {
          DSA: data.challenges.filter((c: any) => c.category === "DSA"),
          Quiz: data.challenges.filter((c: any) => c.category === "Quiz"),
          Project: data.challenges.filter((c: any) => c.category === "Project"),
        }

        setChallenges(groupedChallenges)
      }
    } catch (error) {
      console.error("Failed to fetch challenges:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // In a real app, we would fetch the user's completed challenges
  // For now, we'll randomly mark some as completed if the user is logged in
  const getCompletedStatus = (id: string) => {
    if (!user) return false
    // Randomly mark some challenges as completed for demo purposes
    return Math.random() > 0.7
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
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

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
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

  const filteredChallenges =
    challenges[activeTab]?.filter(
      (challenge: any) =>
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  return (
    <div className="container py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Challenges</h1>
        <p className="mt-2 text-xl text-muted-foreground">
          Choose from a variety of challenges to test and improve your skills.
        </p>
      </div>

      <Tabs defaultValue="DSA" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="DSA" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span>DSA</span>
          </TabsTrigger>
          <TabsTrigger value="Quiz" className="flex items-center gap-2">
            <FileQuestion className="h-4 w-4" />
            <span>Quiz</span>
          </TabsTrigger>
          <TabsTrigger value="Project" className="flex items-center gap-2">
            <FolderKanban className="h-4 w-4" />
            <span>Projects</span>
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <TabsContent value={activeTab} className="mt-0">
            {filteredChallenges.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredChallenges.map((challenge: any) => {
                  const isCompleted = getCompletedStatus(challenge._id)
                  return (
                    <Card
                      key={challenge._id}
                      className={`overflow-hidden transition-all hover:shadow-md ${isCompleted ? "border-green-500/50" : ""}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={`${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </Badge>
                          <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
                            {challenge.points} pts
                          </Badge>
                        </div>
                        <CardTitle className="mt-2 flex items-center gap-2">
                          {getCategoryIcon(challenge.category)}
                          {challenge.title}
                        </CardTitle>
                        <CardDescription>{challenge.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between pt-3">
                        {isCompleted ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            Completed
                          </Badge>
                        ) : (
                          <span></span>
                        )}
                        <Button size="sm" className="gap-1" asChild>
                          <Link href={`/challenges/${challenge._id}`}>
                            Solve <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="flex justify-center">{getCategoryIcon(activeTab)}</div>
                <h3 className="mt-4 text-lg font-medium">No challenges found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery ? "Try a different search term" : "Check back later for new challenges"}
                </p>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
