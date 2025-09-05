"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function DashboardPage() {
  const [userData, setUserData] = useState<{ id?: string; role?: string }>({})
  const [message, setMessage] = useState("Loading...")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user", { credentials: "include" })
        const data = await res.json()

        if (!res.ok) {
          setMessage(data.error || "Unauthorized")
          router.push("/auth/login")
        } else {
          setUserData(data)
          setMessage(`Welcome, ${data.role || "User"}!`)
        }
      } catch {
        setMessage("Error connecting to server")
      }
    }
    fetchUser()
  }, [router])

  async function handleLogout() {
    setIsLoading(true)
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    setIsLoading(false)
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-16 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-4xl space-y-6">
        
        {/* Welcome Card */}
        <Card className="border-gray-200 bg-white shadow-md">
          <CardHeader className="text-center space-y-1 pb-4">
            <CardTitle className="text-3xl font-bold text-gray-800">{message}</CardTitle>
            <CardDescription className="text-gray-500">
              This is your dashboard where you can manage your account and actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-gray-200 shadow-sm hover:shadow-lg transition p-4">
                <CardTitle className="text-lg font-semibold text-gray-700">User ID</CardTitle>
                <CardDescription className="text-gray-500">{userData.id || "-"}</CardDescription>
              </Card>
              <Card className="border-gray-200 shadow-sm hover:shadow-lg transition p-4">
                <CardTitle className="text-lg font-semibold text-gray-700">Role</CardTitle>
                <CardDescription className="text-gray-500">{userData.role || "-"}</CardDescription>
              </Card>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-100 pt-4">
            <Button
              onClick={handleLogout}
              className="w-full h-11 bg-red-500 hover:bg-red-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Logging out..." : "Logout"}
            </Button>
          </CardFooter>
        </Card>

        {/* Actions / Quick Links Card */}
        <Card className="border-gray-200 bg-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-gray-800">Quick Actions</CardTitle>
            <CardDescription className="text-gray-500">Access your main dashboard actions</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button className="bg-green-600 hover:bg-green-700 text-white w-full h-11">Profile Settings</Button>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white w-full h-11">View Reports</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full h-11">Notifications</Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full h-11">Support</Button>
          </CardContent>
        </Card>

      </motion.div>
    </div>
  )
}
