"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"
import { Loader2, Plus, MoreVertical, Edit, Eye, Archive, Trash } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function AdminChallengesPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [challenges, setChallenges] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchChallenges()
  }, [])

  const fetchChallenges = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/challenges", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setChallenges(data.challenges)
      }
    } catch (error) {
      console.error("Failed to fetch challenges:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (challengeId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/challenges/${challengeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: "Status updated",
          description: `Challenge status changed to ${newStatus}.`,
        })
        fetchChallenges()
      } else {
        throw new Error("Failed to update status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update challenge status.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteChallenge = async (challengeId: string) => {
    if (!confirm("Are you sure you want to delete this challenge? This action cannot be undone.")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/challenges/${challengeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast({
          title: "Challenge deleted",
          description: "The challenge has been successfully deleted.",
        })
        fetchChallenges()
      } else {
        throw new Error("Failed to delete challenge")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete challenge.",
        variant: "destructive",
      })
    }
  }

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || challenge.category === categoryFilter
    const matchesStatus = statusFilter === "all" || challenge.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "draft":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "archived":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
      default:
        return "bg-primary/10 text-primary hover:bg-primary/20"
    }
  }

  if (isLoading) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-lg">Loading challenges...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Challenges</h1>
          <p className="text-muted-foreground">Manage coding challenges, projects, and quizzes.</p>
        </div>
        <Button asChild>
          <a href="/admin/challenges/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Challenge
          </a>
        </Button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div>
          <Input
            placeholder="Search challenges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="DSA">DSA</SelectItem>
              <SelectItem value="Project">Project</SelectItem>
              <SelectItem value="Quiz">Quiz</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredChallenges.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredChallenges.map((challenge) => (
            <Card key={challenge._id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <a href={`/admin/challenges/${challenge._id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={`/admin/challenges/${challenge._id}/submissions`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Submissions
                        </a>
                      </DropdownMenuItem>
                      {challenge.status !== "archived" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(challenge._id, "archived")}>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                      )}
                      {challenge.status === "archived" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(challenge._id, "active")}>
                          <Archive className="mr-2 h-4 w-4" />
                          Restore
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleDeleteChallenge(challenge._id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
                    {challenge.points} pts
                  </Badge>
                  <Badge variant="outline">{challenge.category}</Badge>
                  <Badge variant="outline" className={getStatusColor(challenge.status)}>
                    {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                  </Badge>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/admin/challenges/${challenge._id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/admin/challenges/${challenge._id}/submissions`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Submissions
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <h2 className="text-xl font-medium">No challenges found</h2>
          <p className="text-muted-foreground mt-2">
            {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your filters to find what you're looking for."
              : "Get started by creating your first challenge."}
          </p>
          {!searchQuery && categoryFilter === "all" && statusFilter === "all" && (
            <Button className="mt-4" asChild>
              <a href="/admin/challenges/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Challenge
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
