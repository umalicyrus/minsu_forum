"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingBag, MessageSquare, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm py-3">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="text-2xl font-bold text-green-700"
              whileHover={{ scale: 1.05 }}
            >
              MinSU
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink href="/" label="Home" />
            <NavLink href="/marketplace" label="Following" />
            <NavLink href="/questions/ask" label="Answer" />
            <NavLink href="/forum" label="Forum" />

            {/* Search Bar (static) */}
            <div className="relative ml-2">
              <Input
                type="text"
                placeholder="Search users..."
                className="pl-8 pr-4 py-1 w-[200px] rounded-full text-sm bg-gray-100 border-gray-200 text-gray-800"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Static User Menu */}
            <div className="flex items-center gap-3 ml-2">
              <Button size="sm" variant="ghost" className="rounded-full text-gray-700 hover:bg-gray-100">
                <ShoppingBag className="h-5 w-5" />
              </Button>
              <Button size="sm" variant="ghost" className="rounded-full text-gray-700 hover:bg-gray-100">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button size="sm" variant="ghost" className="rounded-full text-gray-700 hover:bg-gray-100">
                <Bell className="h-5 w-5" />
              </Button>

              {/* Avatar (static) */}
              <Avatar className="h-8 w-8 bg-[#004D40] text-white">
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#004D40]"
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
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>

              <div className="flex flex-col space-y-3">
                <Link href="/" className="px-4 py-2 text-[#004D40] hover:bg-gray-100 rounded-lg">
                  Home
                </Link>
                <Link href="/marketplace" className="px-4 py-2 text-[#004D40] hover:bg-gray-100 rounded-lg">
                  Following
                </Link>
                <Link href="/forum" className="px-4 py-2 text-[#004D40] hover:bg-gray-100 rounded-lg">
                  Answer
                </Link>
                <Link href="/profile" className="px-4 py-2 text-[#004D40] hover:bg-gray-100 rounded-lg">
                  
                </Link>
                <button className="px-4 py-2 text-red-600 hover:bg-gray-100 rounded-lg text-left">
                  Log Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href}>
      <div className="relative px-3 py-2 rounded-lg transition-all text-gray-700 hover:text-[#004D40]">
        {label}
      </div>
    </Link>
  )
}
