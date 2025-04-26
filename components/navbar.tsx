"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, BotIcon as Robot } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (path: string) => {
    return pathname === path
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md robot-border">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Robot className="h-8 w-8 text-primary animate-robot-pulse" />
            <span className="hidden font-bold text-xl sm:inline-block">Code Catalyst</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/") ? "text-primary" : "text-foreground/60"
            }`}
          >
            Home
          </Link>
          <Link
            href="/challenges"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/challenges") ? "text-primary" : "text-foreground/60"
            }`}
          >
            Challenges
          </Link>
          <Link
            href="/contact"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/contact") ? "text-primary" : "text-foreground/60"
            }`}
          >
            Contact
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/about") ? "text-primary" : "text-foreground/60"
            }`}
          >
            About
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" size="sm">
              <Link href="/login">Login</Link>
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background md:hidden">
          <div className="container flex flex-col gap-6 p-6">
            <Link
              href="/"
              className={`text-lg font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-foreground/60"
              }`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              href="/challenges"
              className={`text-lg font-medium transition-colors hover:text-primary ${
                isActive("/challenges") ? "text-primary" : "text-foreground/60"
              }`}
              onClick={closeMenu}
            >
              Challenges
            </Link>
            <Link
              href="/contact"
              className={`text-lg font-medium transition-colors hover:text-primary ${
                isActive("/contact") ? "text-primary" : "text-foreground/60"
              }`}
              onClick={closeMenu}
            >
              Contact
            </Link>
            <Link
              href="/about"
              className={`text-lg font-medium transition-colors hover:text-primary ${
                isActive("/about") ? "text-primary" : "text-foreground/60"
              }`}
              onClick={closeMenu}
            >
              About
            </Link>
            {!user && (
              <Link href="/login" className="text-lg font-medium text-primary" onClick={closeMenu}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
