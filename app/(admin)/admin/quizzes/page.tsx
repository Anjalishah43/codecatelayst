"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search, Plus, Download, Filter, FileQuestion } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for quizzes
const quizzes = [
  {
    id: "quiz-1",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics.",
    difficulty: "Easy",
    questions: 10,
    status: "active",
    createdAt: new Date(Date.now() - 3000000000).toISOString(),
  },
  {
    id: "quiz-2",
    title: "React Concepts",
    description: "Quiz on React hooks, components, and state management.",
    difficulty: "Medium",
    questions: 15,
    status: "active",
    createdAt: new Date(Date.now() - 7000000000).toISOString(),
  },
  {
    id: "quiz-3",
    title: "Database Design",
    description: "Test your knowledge of database normalization and SQL.",
    difficulty: "Medium",
    questions: 12,
    status: "draft",
    createdAt: new Date(Date.now() - 9000000000).toISOString(),
  },
  {
    id: "quiz-4",
    title: "System Design",
    description: "Advanced concepts in distributed systems and architecture.",
    difficulty: "Hard",
    questions: 20,
    status: "active",
    createdAt: new Date(Date.now() - 12000000000).toISOString(),
  },
  {
    id: "quiz-5",
    title: "CSS and Responsive Design",
    description: "Test your knowledge of CSS and responsive design principles.",
    difficulty: "Easy",
    questions: 8,
    status: "active",
    createdAt: new Date(Date.now() - 2000000000).toISOString(),
  },
  {
    id: "quiz-6",
    title: "TypeScript Advanced",
    description: "Advanced TypeScript concepts and patterns.",
    difficulty: "Hard",
    questions: 18,
    status: "draft",
    createdAt: new Date(Date.now() - 5000000000).toISOString(),
  },
]

export default function QuizzesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
          <p className="text-muted-foreground">Create and manage auto-graded quizzes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Quiz</DialogTitle>
              <DialogDescription>Add a new quiz with multiple-choice questions.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Quiz title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Quiz description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select defaultValue="easy">
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="draft">
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="questions">Number of Questions</Label>
                <Input id="questions" type="number" placeholder="10" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Create Quiz</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Management</CardTitle>
          <CardDescription>Create and manage auto-graded quizzes for users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search quizzes..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuizzes.map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileQuestion className="h-4 w-4" />
                          <span className="font-medium">{quiz.title}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{quiz.description}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                          {quiz.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>{quiz.questions}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(quiz.status)}>
                          {quiz.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(quiz.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit Quiz</DropdownMenuItem>
                            <DropdownMenuItem>Add Questions</DropdownMenuItem>
                            <DropdownMenuItem>View Submissions</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>{quiz.status === "active" ? "Archive" : "Activate"}</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete Quiz</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
