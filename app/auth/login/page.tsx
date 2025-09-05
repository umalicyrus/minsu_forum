"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Optional: Check if already logged in (JWT in localStorage, etc.)
    // If so, redirect
  }, [])

  const validateEmail = (email: string) => {
    setIsEmailValid(email.includes("@")) // loosened for general login
    return email.includes("@")
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    if (newEmail) validateEmail(newEmail)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await res.json()

      if (!res.ok) {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Login successful! Redirecting...",
        })
        router.push("/user") // or reload if needed
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 pb-16">
      <div className="container max-w-md px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-gray-200 bg-white shadow-md">
            <CardHeader className="text-center space-y-1 pb-4">
              <CardTitle className="text-3xl font-bold text-gray-800">Welcome Back</CardTitle>
              <CardDescription className="text-gray-500">Log in to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className={`pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500 ${
                        !isEmailValid ? "border-red-500 focus:ring-red-500" : ""
                      }`}
                      value={email}
                      onChange={handleEmailChange}
                      required
                    />
                  </div>
                  {!isEmailValid && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      Please enter a valid email
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex justify-between">
                    <Label htmlFor="password" className="text-gray-700">
                      Password
                    </Label>
                    <Link href="/auth/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      className="pl-10 pr-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Logging in...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <LogIn className="mr-2 h-5 w-5" />
                        Log In
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-gray-100 pt-4">
              <p className="text-gray-500 text-sm">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-green-600 font-medium hover:text-green-700">
                  Register here
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
