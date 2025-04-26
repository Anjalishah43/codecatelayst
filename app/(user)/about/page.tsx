import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BotIcon as Robot, Code, Cpu, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold">About Code Catalyst</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Empowering developers through robot-inspired coding challenges and learning experiences.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Robot className="h-5 w-5 text-primary" />
              Our Mission
            </CardTitle>
            <CardDescription>What drives us forward</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              At Code Catalyst, our mission is to accelerate the growth of developers worldwide by providing a platform
              that combines challenging coding problems, interactive quizzes, and real-world projects. We believe in
              learning by doing, and our robot-inspired platform is designed to make the journey both educational and
              enjoyable.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              Our Approach
            </CardTitle>
            <CardDescription>How we help you learn</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We take a three-pronged approach to learning: algorithmic challenges to sharpen your problem-solving
              skills, quizzes to test your knowledge, and project-based learning to apply what you've learned in
              real-world scenarios. Our platform adapts to your skill level, providing increasingly difficult challenges
              as you progress.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center text-center p-6 border rounded-lg">
            <Cpu className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Innovation</h3>
            <p className="text-muted-foreground">
              We constantly evolve our platform with cutting-edge technologies and teaching methodologies to provide the
              best learning experience.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 border rounded-lg">
            <Award className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Excellence</h3>
            <p className="text-muted-foreground">
              We strive for excellence in everything we do, from the quality of our challenges to the feedback we
              provide on your submissions.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 border rounded-lg">
            <Robot className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p className="text-muted-foreground">
              We believe in the power of community and foster an environment where developers can learn from each other
              and grow together.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-muted p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
        <div className="grid gap-8 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Robot className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Team Member {i}</h3>
              <p className="text-sm text-muted-foreground">Position {i}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
