"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Mail, Lock, User, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role: "USER" }),
    })

    const data = await res.json()
    if (res.ok) {
      setMessage("✅ Registered successfully! You can now login.")
    } else {
      setMessage("❌ " + data.error)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 pb-16">
      <div className="container max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-gray-200 bg-white shadow-md">
            <CardHeader className="text-center space-y-1 pb-4">
              <CardTitle className="text-3xl font-bold text-gray-800">Create an Account</CardTitle>
              <CardDescription className="text-gray-500">Join our community</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Name */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••••••"
                      className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>

                {/* Submit */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
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
                        Registering...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <UserPlus className="mr-2 h-5 w-5" />
                        Register
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>

              {message && (
                <p className="mt-3 text-center text-sm text-gray-600">{message}</p>
              )}
            </CardContent>

            <CardFooter className="flex justify-center border-t border-gray-100 pt-4">
              <p className="text-gray-500 text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-green-600 font-medium hover:text-green-700">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
