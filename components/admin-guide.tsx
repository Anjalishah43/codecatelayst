import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Users, BarChart3, FileText } from "lucide-react"
import Link from "next/link"

export function AdminGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Quick Actions</CardTitle>
        <CardDescription>Manage your platform with these quick actions</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-4 rounded-md border p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <PlusCircle className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Create Challenge</h3>
            <p className="text-sm text-muted-foreground">Add a new DSA problem, quiz, or project challenge</p>
          </div>
          <Button size="sm" asChild>
            <Link href="/admin/challenges/create">Create</Link>
          </Button>
        </div>

        <div className="flex items-center gap-4 rounded-md border p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Manage Users</h3>
            <p className="text-sm text-muted-foreground">View and manage user accounts</p>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href="/admin/users">View</Link>
          </Button>
        </div>

        <div className="flex items-center gap-4 rounded-md border p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Review Submissions</h3>
            <p className="text-sm text-muted-foreground">Review and grade pending submissions</p>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href="/admin/submissions">Review</Link>
          </Button>
        </div>

        <div className="flex items-center gap-4 rounded-md border p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Dashboard</h3>
            <p className="text-sm text-muted-foreground">View platform analytics and metrics</p>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href="/admin">View</Link>
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          You're logged in as an administrator. You have full access to all platform features.
        </p>
      </CardFooter>
    </Card>
  )
}
