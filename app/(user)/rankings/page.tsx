"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Trophy, Search, Medal, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

export default function RankingsPage() {
  const { user } = useAuth()
  const [rankings, setRankings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchRankings()
  }, [])

  const fetchRankings = async () => {
    try {
      const response = await fetch("/api/rankings")
      if (response.ok) {
        const data = await response.json()
        setRankings(data.rankings)
      }
    } catch (error) {
      console.error("Failed to fetch rankings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRankings = rankings.filter((rankedUser) =>
    rankedUser.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getRankIcon = (rank: number) => {
    if (rank === 1) {
      return <Trophy className="h-5 w-5 text-yellow-500" />
    } else if (rank === 2) {
      return <Medal className="h-5 w-5 text-gray-400" />
    } else if (rank === 3) {
      return <Medal className="h-5 w-5 text-amber-700" />
    } else {
      return <span className="font-mono text-muted-foreground">{rank}</span>
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Global Rankings</h1>
        <p className="mt-2 text-xl text-muted-foreground">See how you stack up against other coders on the platform.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>Rankings are based on total points earned from solving challenges.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Challenges Solved</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRankings.length > 0 ? (
                    filteredRankings.map((rankedUser) => (
                      <TableRow
                        key={rankedUser._id}
                        className={user && user.id === rankedUser._id ? "bg-primary/5" : ""}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center justify-center">{getRankIcon(rankedUser.rank)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <Link
                                href={user && user.id === rankedUser._id ? "/profile" : "#"}
                                className="font-medium hover:underline"
                              >
                                {rankedUser.name}
                              </Link>
                              {user && user.id === rankedUser._id && (
                                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">{rankedUser.score}</TableCell>
                        <TableCell className="text-right">{rankedUser.solvedChallenges?.length || 0}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <p className="text-muted-foreground">No users found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
