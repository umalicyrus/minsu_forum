import { NextResponse } from "next/server"

export async function POST() {
  // Clear the token cookie
  const response = NextResponse.json({ message: "Logged out" })
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0), // expire now
    path: "/",
  })
  return response
}
