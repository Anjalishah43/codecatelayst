import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Code, Cpu, Zap, Award, ArrowRight, BotIcon as Robot } from "lucide-react"

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden robot-pattern py-20 md:py-32">
        <div className="container relative z-10">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                Futuristic Coding Challenges
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Accelerate Your <span className="text-primary">Coding Skills</span> with AI-Powered Challenges
              </h1>
              <p className="text-xl text-muted-foreground">
                Join our robot-inspired platform to solve challenges, earn points, and become a coding master.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/challenges">
                    Start Solving <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px] animate-robot-float">
              <div className="absolute inset-0 flex items-center justify-center">
                <Robot className="h-64 w-64 text-primary" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-3xl opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 robot-grid">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Supercharge Your Coding Journey
            </h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform offers a variety of challenges to help you improve your coding skills.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary transition-colors">
              <div className="mb-4 text-primary">
                <Code className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold">Data Structures & Algorithms</h3>
              <p className="mt-2 text-muted-foreground">
                Solve challenging DSA problems and improve your algorithmic thinking with our curated collection.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary transition-colors">
              <div className="mb-4 text-primary">
                <Cpu className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold">Interactive Quizzes</h3>
              <p className="mt-2 text-muted-foreground">
                Test your knowledge with our auto-graded quizzes covering various programming concepts.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary transition-colors">
              <div className="mb-4 text-primary">
                <Zap className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold">Project Challenges</h3>
              <p className="mt-2 text-muted-foreground">
                Build real-world projects that are reviewed by our experts to enhance your portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container">
          <div className="rounded-lg border bg-card p-8 shadow-sm">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold">Ready to Level Up?</h2>
                <p className="mt-4 text-muted-foreground">
                  Join thousands of developers who are accelerating their careers with Code Catalyst.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg">
                    <Link href="/register">Sign Up Now</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/challenges">Browse Challenges</Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative h-[200px] w-[200px]">
                  <Award className="h-full w-full text-primary animate-robot-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
