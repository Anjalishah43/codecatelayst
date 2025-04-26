"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { Loader2, ArrowLeft, Save, Trash } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function EditChallengePage() {
  const params = useParams()
  const { id } = params
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [challenge, setChallenge] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Form fields
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [points, setPoints] = useState("")
  const [status, setStatus] = useState("")

  useEffect(() => {
    if (id) {
      fetchChallenge()
    }
  }, [id])

  const fetchChallenge = async () => {
    try {
      const response = await fetch(`/api/challenges/${id}`)
      if (response.ok) {
        const data = await response.json()
        setChallenge(data.challenge)

        // Set form fields
        setTitle(data.challenge.title || "")
        setDescription(data.challenge.description || "")
        setCategory(data.challenge.category || "")
        setDifficulty(data.challenge.difficulty || "")
        setPoints(data.challenge.points?.toString() || "")
        setStatus(data.challenge.status || "active")
      }
    } catch (error) {
      console.error("Failed to fetch challenge:", error)
      toast({
        title: "Error",
        description: "Failed to fetch challenge details.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Permission denied",
        description: "You don't have permission to edit challenges.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/challenges/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          category,
          difficulty,
          points: Number.parseInt(points),
          status,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update challenge")
      }

      toast({
        title: "Challenge updated",
        description: "The challenge has been successfully updated.",
      })

      // Navigate back to challenges list
      router.push("/admin/challenges")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update challenge. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Permission denied",
        description: "You don't have permission to delete challenges.",
        variant: "destructive",
      })
      return
    }

    if (!confirm("Are you sure you want to delete this challenge? This action cannot be undone.")) {
      return
    }

    setIsSaving(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/challenges/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete challenge")
      }

      toast({
        title: "Challenge deleted",
        description: "The challenge has been successfully deleted.",
      })

      // Navigate back to challenges list
      router.push("/admin/challenges")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete challenge. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
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
            <a href="/admin/challenges">Back to Challenges</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Button variant="outline" className="mb-6" asChild>
        <a href="/admin/challenges">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Challenges
        </a>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Challenge title" />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Challenge description"
              className="min-h-[150px]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DSA">DSA</SelectItem>
                  <SelectItem value="Project">Project</SelectItem>
                  <SelectItem value="Quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="difficulty" className="text-sm font-medium">
                Difficulty
              </label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="points" className="text-sm font-medium">
                Points
              </label>
              <Input
                id="points"
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="Challenge points"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="destructive" onClick={handleDelete} disabled={isSaving}>
            <Trash className="mr-2 h-4 w-4" />
            Delete Challenge
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
