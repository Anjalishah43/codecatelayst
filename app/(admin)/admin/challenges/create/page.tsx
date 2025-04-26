"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function CreateChallengePage() {
  const router = useRouter()
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [challengeType, setChallengeType] = useState("DSA")

  // Common fields
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [difficulty, setDifficulty] = useState("Easy")
  const [points, setPoints] = useState(50)
  const [status, setStatus] = useState("draft")

  // DSA fields
  const [examples, setExamples] = useState([{ input: "", output: "", explanation: "" }])
  const [constraints, setConstraints] = useState([""])
  const [testCases, setTestCases] = useState([{ input: "", output: "", isHidden: false }])

  // Quiz fields
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], answer: "" }])

  // Project fields
  const [requirements, setRequirements] = useState([""])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!title || !description) {
        throw new Error("Title and description are required")
      }

      // Get user from localStorage
      const storedUser = localStorage.getItem("user")
      if (!storedUser) {
        throw new Error("You must be logged in to create a challenge")
      }

      const user = JSON.parse(storedUser)

      // Prepare challenge data based on type
      const challengeData: any = {
        title,
        description,
        category: challengeType,
        difficulty,
        points,
        status,
        createdBy: user.id,
      }

      if (challengeType === "DSA") {
        challengeData.examples = examples.filter((ex) => ex.input && ex.output)
        challengeData.constraints = constraints.filter((c) => c)
        challengeData.testCases = testCases.filter((tc) => tc.input && tc.output)
      } else if (challengeType === "Quiz") {
        challengeData.questions = questions.filter((q) => q.question && q.answer)
      } else if (challengeType === "Project") {
        challengeData.requirements = requirements.filter((r) => r)
      }

      // Submit to API
      const token = localStorage.getItem("token")
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(challengeData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create challenge")
      }

      toast({
        title: "Challenge created",
        description: "Your challenge has been created successfully.",
        variant: "default",
      })

      // Redirect to challenges list
      router.push("/admin/challenges")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper functions for array fields
  const addExample = () => {
    setExamples([...examples, { input: "", output: "", explanation: "" }])
  }

  const updateExample = (index: number, field: string, value: string) => {
    const newExamples = [...examples]
    newExamples[index] = { ...newExamples[index], [field]: value }
    setExamples(newExamples)
  }

  const removeExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index))
  }

  const addConstraint = () => {
    setConstraints([...constraints, ""])
  }

  const updateConstraint = (index: number, value: string) => {
    const newConstraints = [...constraints]
    newConstraints[index] = value
    setConstraints(newConstraints)
  }

  const removeConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index))
  }

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", output: "", isHidden: false }])
  }

  const updateTestCase = (index: number, field: string, value: any) => {
    const newTestCases = [...testCases]
    newTestCases[index] = { ...newTestCases[index], [field]: value }
    setTestCases(newTestCases)
  }

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index))
  }

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: "" }])
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions]
    if (field === "option") {
      const [optionIndex, optionValue] = value
      newQuestions[index].options[optionIndex] = optionValue
    } else {
      newQuestions[index] = { ...newQuestions[index], [field]: value }
    }
    setQuestions(newQuestions)
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const addRequirement = () => {
    setRequirements([...requirements, ""])
  }

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...requirements]
    newRequirements[index] = value
    setRequirements(newRequirements)
  }

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Challenge</h1>
          <p className="text-muted-foreground">Create a new challenge for users to solve.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Challenge Type</CardTitle>
              <CardDescription>Select the type of challenge you want to create.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="DSA" value={challengeType} onValueChange={setChallengeType}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="DSA">DSA Problem</TabsTrigger>
                  <TabsTrigger value="Quiz">Quiz</TabsTrigger>
                  <TabsTrigger value="Project">Project</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details of the challenge.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Challenge title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Challenge description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger id="difficulty">
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
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    min="10"
                    max="1000"
                    value={points}
                    onChange={(e) => setPoints(Number.parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
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
            </CardContent>
          </Card>

          {/* DSA-specific fields */}
          {challengeType === "DSA" && (
            <Card>
              <CardHeader>
                <CardTitle>DSA Problem Details</CardTitle>
                <CardDescription>Add examples, constraints, and test cases for the DSA problem.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Examples</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addExample}>
                      <Plus className="h-4 w-4 mr-2" /> Add Example
                    </Button>
                  </div>

                  {examples.map((example, index) => (
                    <div key={index} className="space-y-4 p-4 border rounded-md">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Example {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExample(index)}
                          disabled={examples.length === 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="example-input">Input</Label>
                        <Textarea
                          id="example-input"
                          placeholder="Example input"
                          value={example.input}
                          onChange={(e) => updateExample(index, "input", e.target.value)}
                          className="font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="example-output">Output</Label>
                        <Textarea
                          id="example-output"
                          placeholder="Example output"
                          value={example.output}
                          onChange={(e) => updateExample(index, "output", e.target.value)}
                          className="font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="example-explanation">Explanation (Optional)</Label>
                        <Textarea
                          id="example-explanation"
                          placeholder="Explanation of the example"
                          value={example.explanation}
                          onChange={(e) => updateExample(index, "explanation", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Constraints</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addConstraint}>
                      <Plus className="h-4 w-4 mr-2" /> Add Constraint
                    </Button>
                  </div>

                  {constraints.map((constraint, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="e.g., 1 <= n <= 10^5"
                        value={constraint}
                        onChange={(e) => updateConstraint(index, e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeConstraint(index)}
                        disabled={constraints.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Test Cases</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addTestCase}>
                      <Plus className="h-4 w-4 mr-2" /> Add Test Case
                    </Button>
                  </div>

                  {testCases.map((testCase, index) => (
                    <div key={index} className="space-y-4 p-4 border rounded-md">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Test Case {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTestCase(index)}
                          disabled={testCases.length === 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`test-input-${index}`}>Input</Label>
                        <Textarea
                          id={`test-input-${index}`}
                          placeholder="Test case input"
                          value={testCase.input}
                          onChange={(e) => updateTestCase(index, "input", e.target.value)}
                          className="font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`test-output-${index}`}>Expected Output</Label>
                        <Textarea
                          id={`test-output-${index}`}
                          placeholder="Expected output"
                          value={testCase.output}
                          onChange={(e) => updateTestCase(index, "output", e.target.value)}
                          className="font-mono"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`test-hidden-${index}`}
                          checked={testCase.isHidden}
                          onChange={(e) => updateTestCase(index, "isHidden", e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor={`test-hidden-${index}`}>Hidden test case (not shown to users)</Label>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quiz-specific fields */}
          {challengeType === "Quiz" && (
            <Card>
              <CardHeader>
                <CardTitle>Quiz Questions</CardTitle>
                <CardDescription>Add multiple-choice questions for the quiz.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Questions</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                      <Plus className="h-4 w-4 mr-2" /> Add Question
                    </Button>
                  </div>

                  {questions.map((question, index) => (
                    <div key={index} className="space-y-4 p-4 border rounded-md">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(index)}
                          disabled={questions.length === 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`question-${index}`}>Question</Label>
                        <Textarea
                          id={`question-${index}`}
                          placeholder="Enter your question"
                          value={question.question}
                          onChange={(e) => updateQuestion(index, "question", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Options</Label>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-2">
                            <Input
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) => updateQuestion(index, "option", [optionIndex, e.target.value])}
                            />
                            <input
                              type="radio"
                              name={`correct-answer-${index}`}
                              checked={question.answer === option}
                              onChange={() => updateQuestion(index, "answer", option)}
                              className="h-4 w-4"
                              disabled={!option}
                            />
                            <Label>Correct</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project-specific fields */}
          {challengeType === "Project" && (
            <Card>
              <CardHeader>
                <CardTitle>Project Requirements</CardTitle>
                <CardDescription>Add requirements for the project challenge.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Requirements</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addRequirement}>
                      <Plus className="h-4 w-4 mr-2" /> Add Requirement
                    </Button>
                  </div>

                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="e.g., Implement user authentication"
                        value={requirement}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                        disabled={requirements.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Challenge"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
