"use client"
import { useEffect, useState } from "react"

export default function AuthPage() {
  const [message, setMessage] = useState("Loading...")

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user", {
          credentials: "include", // send cookie automatically
        })

        const data = await res.json()

        if (!res.ok) {
          setMessage(data.error || "Unauthorized - Please login")
        } else {
          setMessage(`Welcome, ${data.role}! (ID: ${data.id})`)
        }
      } catch {
        setMessage("Error connecting to server")
      }
    }

    fetchUser()
  }, [])

  return <h1>{message}</h1>
}
