"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { handleLogin } from "@/services/auth"
import Navbar from "../../components/Navbar"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Login attempt with:", { email, password })
      const data = await handleLogin({ email, password })
      console.log("Login successful:", data)
      
      // Redirect based on user role
      if (data.user.role === "admin") {
        router.push("/rooms")
      } else if (data.user.role === "staff") {
        router.push("/staff/dashboard")
      } else if (data.user.role === "guest") {
        router.push("/dashboard")
      } else if (data.user.role === "receptionist") {
        router.push("/dashboard")
      } else {
        router.push("/")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "Failed to login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral font-roboto">
      <Navbar />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-medium text-center">Welcome Back</CardTitle>
                <CardDescription className="text-center">
                  Sign in to your account to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
              type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
              type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
                  {error && (
                    <div className="text-sm text-red-500 text-center">{error}</div>
                  )}
                  <Button
            type="submit"
                    className="w-full"
                    disabled={isLoading}
          >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
        </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-gray-500">
                  Don't have an account?{" "}
                  <a href="/register" className="text-primary hover:underline">
                    Sign up
                  </a>
                </div>
                <div className="text-sm text-center text-gray-500">
                  <a href="/forgot-password" className="text-primary hover:underline">
                    Forgot your password?
                  </a>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 