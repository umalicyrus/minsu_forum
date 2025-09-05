"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { Menu, X, ShoppingBag, MessageSquare, Bell, Search } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // State to control navbar visibility
  const [showNavbar, setShowNavbar] = useState(true)

  useEffect(() => {
    // Add this check to hide the navbar on admin routes
    setShowNavbar(!pathname.startsWith("/admin"))
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const query = searchQuery.toLowerCase()
    const results = allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.campus.toLowerCase().includes(query) ||
        user.rank.toLowerCase().includes(query),
    )

    setSearchResults(results)
    setShowSearchResults(true)
  }, [searchQuery])

  // Handle clicks outside of search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Determine if we're on the landing page
  const isLandingPage = pathname === "/"
  // Use transparent background only on landing page when not scrolled
  const useTransparentBg = isLandingPage && !isScrolled

  if (!showNavbar) {
    return null
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        useTransparentBg ? "bg-transparent py-4" : "bg-white shadow-sm py-3"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"}>
            <motion.div
              className={`text-2xl font-bold ${useTransparentBg ? "text-white" : "text-green-700"}`}
              whileHover={{ scale: 1.05 }}
            >
              MinSU
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink
              href={user ? "/dashboard" : "/"}
              label="Home"
              isTransparent={useTransparentBg}
              pathname={pathname}
              isActive={user ? pathname === "/dashboard" : pathname === "/"}
            />
            <NavLink href="/marketplace" label="Marketplace" isTransparent={useTransparentBg} pathname={pathname} />
            <NavLink href="/forum" label="Forum" isTransparent={useTransparentBg} pathname={pathname} />

            {/* Search Bar */}
            <div className="relative ml-2" ref={searchRef} style={{ zIndex: 9999 }}>
              <Input
                type="text"
                placeholder="Search users..."
                className={`pl-8 pr-4 py-1 w-[200px] rounded-full text-sm ${
                  useTransparentBg
                    ? "bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    : "bg-gray-100 border-gray-200 text-gray-800"
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setShowSearchResults(true)
                  }
                }}
              />
              <Search
                className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 ${
                  useTransparentBg ? "text-white/70" : "text-gray-400"
                }`}
              />
              {searchQuery && (
                <button
                  className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 ${
                    useTransparentBg ? "text-white/70 hover:text-white" : "text-gray-400 hover:text-gray-600"
                  }`}
                  onClick={() => {
                    setSearchQuery("")
                    setShowSearchResults(false)
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <>
                  {/* Overlay to ensure dropdown appears above everything */}
                  <div className="fixed inset-0 bg-transparent z-[9998]" onClick={() => setShowSearchResults(false)} />

                  {/* Dropdown positioned absolutely */}
                  <div
                    className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl max-h-60 overflow-y-auto z-[9999]"
                    style={{
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {searchResults.length > 0 ? (
                      <div className="py-2">
                        {searchResults.map((result) => (
                          <Link href={`/user/${result.id}`} key={result.id} onClick={() => setShowSearchResults(false)}>
                            <div className="px-4 py-2 hover:bg-gray-100 flex items-center gap-3">
                              <Avatar className="h-6 w-6 bg-[#004D40] text-white">
                                <AvatarFallback>{result.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-800 text-sm">{result.name}</p>
                                <p className="text-xs text-gray-500">
                                  {result.campus} • {result.rank}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-center text-gray-500 text-sm">No users found</div>
                    )}
                  </div>
                </>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <Link href="/marketplace/sell">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`rounded-full ${
                      useTransparentBg ? "text-white hover:bg-white/20" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ShoppingBag className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/messages">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`rounded-full ${
                      useTransparentBg ? "text-white hover:bg-white/20" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/notifications">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`rounded-full ${
                      useTransparentBg ? "text-white hover:bg-white/20" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Bell className="h-5 w-5" />
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`rounded-full p-0 ${
                        useTransparentBg ? "text-white hover:bg-white/20" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Avatar className="h-8 w-8 bg-[#004D40] text-white">
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user.name}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/dashboard">
                      <DropdownMenuItem className="cursor-pointer">Dashboard</DropdownMenuItem>
                    </Link>
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                    </Link>
                    <Link href="/settings">
                      <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={logout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center ml-4 space-x-3">
                <Link href="/auth/login">
                  <Button variant={useTransparentBg ? "secondary" : "outline"} className="rounded-lg transition-all">
                    Log In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    className={`rounded-lg transition-all ${
                      useTransparentBg
                        ? "bg-white text-[#004D40] hover:bg-gray-100"
                        : "bg-[#004D40] hover:bg-[#00352C] text-white"
                    }`}
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg ${useTransparentBg ? "text-white" : "text-[#004D40]"}`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="container mx-auto px-4 py-4">
              {/* Mobile Search Bar */}
              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 w-full rounded-lg border-gray-200 bg-gray-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setSearchQuery("")
                      setShowSearchResults(false)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-col space-y-3">
                <Link
                  href={user ? "/dashboard" : "/"}
                  className="px-4 py-2 text-[#004D40] hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/marketplace"
                  className="px-4 py-2 text-[#004D40] hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Marketplace
                </Link>
                <Link
                  href="/forum"
                  className="px-4 py-2 text-[#004D40] hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Forum
                </Link>
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="px-4 py-2 text-[#004D40] hover:bg-gray-100 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                      className="px-4 py-2 text-red-600 hover:bg-gray-100 rounded-lg text-left"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 pt-2">
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-[#004D40] hover:bg-[#00352C]">Register</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// Mock user data for search
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@minsu.edu.ph",
    rank: "Expert",
    campus: "Main Campus",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@minsu.edu.ph",
    rank: "Helper",
    campus: "Calapan Campus",
  },
  {
    id: "3",
    name: "Alex Johnson",
    email: "alex.johnson@minsu.edu.ph",
    rank: "Newbie",
    campus: "Bongabong Campus",
  },
]

const allUsers = [
  ...mockUsers,
  {
    id: "4",
    name: "Maria Santos",
    email: "santos.maria@minsu.edu.ph",
    rank: "Helper",
    campus: "Main Campus",
  },
  {
    id: "5",
    name: "David Lee",
    email: "lee.david@minsu.edu.ph",
    rank: "Expert",
    campus: "Bongabong Campus",
  },
  {
    id: "6",
    name: "Sarah Garcia",
    email: "garcia.sarah@minsu.edu.ph",
    rank: "Newbie",
    campus: "Calapan Campus",
  },
  {
    id: "7",
    name: "Michael Tan",
    email: "tan.michael@minsu.edu.ph",
    rank: "Helper",
    campus: "Main Campus",
  },
  {
    id: "8",
    name: "Emma Reyes",
    email: "reyes.emma@minsu.edu.ph",
    rank: "Newbie",
    campus: "Main Campus",
  },
]

function NavLink({
  href,
  label,
  isTransparent,
  pathname,
  isActive: forcedActive,
}: {
  href: string
  label: string
  isTransparent: boolean
  pathname: string
  isActive?: boolean
}) {
  const isActive = forcedActive !== undefined ? forcedActive : pathname === href

  return (
    <Link href={href}>
      <div className="relative px-3 py-2 rounded-lg transition-all">
        <span
          className={`${
            isTransparent
              ? isActive
                ? "text-white font-medium"
                : "text-white/90 hover:text-white"
              : isActive
                ? "text-[#004D40] font-medium"
                : "text-gray-700 hover:text-[#004D40]"
          }`}
        >
          {label}
        </span>
        {isActive && (
          <motion.div
            className={`absolute bottom-0 left-0 right-0 h-0.5 ${isTransparent ? "bg-white" : "bg-[#FFD700]"}`}
            layoutId="navbar-indicator"
          />
        )}
      </div>
    </Link>
  )
}
