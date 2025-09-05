"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronDown, ArrowRight, BookOpen, ShoppingCart, Users, Zap } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-amber-50"></div>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(16,185,129,0.2) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          ></div>

          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-green-200/30 blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl"
            animate={{ x: [0, -70, 0], y: [0, 50, 0], scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          />
        </div>

        <div className="container relative z-20 text-center px-4 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-block mb-6 px-6 py-2 border border-green-500/30 rounded-full bg-green-50 text-green-800 text-sm font-medium">
              Mindoro State University's Student Marketplace
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Connect, Trade, and{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-amber-600">Thrive</span>{" "}
              with MinSU
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Your campus marketplace and forum. Buy, sell, ask questions, and connect with fellow students.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link href="/auth/register">
              <Button className="text-lg px-8 py-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all hover:scale-105 shadow-lg shadow-green-700/20">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button className="text-lg px-8 py-6 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-xl transition-all hover:scale-105 shadow-sm">
                Log In
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[
              { label: "Active Users", value: "1,200+", icon: <Users className="h-5 w-5 text-green-600" /> },
              { label: "Items Listed", value: "3,500+", icon: <ShoppingCart className="h-5 w-5 text-amber-600" /> },
              { label: "Questions Answered", value: "8,700+", icon: <BookOpen className="h-5 w-5 text-green-600" /> },
              { label: "Avg. Response Time", value: "15 min", icon: <Zap className="h-5 w-5 text-amber-600" /> },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 rounded-xl bg-white border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 mb-3">
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="h-10 w-10 text-gray-400" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium border border-green-200">
              Platform Features
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need in One Place</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with your campus community through our integrated platform designed specifically for college
              students
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Marketplace",
                description: "Buy and sell college essentials, from textbooks to electronics.",
                icon: "🛒",
                color: "from-green-500 to-green-600",
              },
              {
                title: "Forum",
                description: "Ask questions, share knowledge, and connect with peers.",
                icon: "❓",
                color: "from-amber-500 to-amber-600",
              },
              {
                title: "Rewards",
                description: "Earn points and ranks as you contribute to the community.",
                icon: "🏆",
                color: "from-green-500 to-amber-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-br ${feature.color} p-0.5 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-white p-8 rounded-2xl h-full">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
                
              </motion.div>
              
            ))}
            
          </div>
          
        </div>
      </section>
            {/* Popular Items Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <div className="inline-block mb-4 px-4 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium border border-amber-200">
                Marketplace
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Popular Items</h2>
            </div>
            <Link href="/marketplace">
              <Button className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 group mt-4 md:mt-0">
                View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Calculus Textbook", price: "₱650", image: "/placeholder.svg?height=300&width=300" },
              { name: "Scientific Calculator", price: "₱950", image: "/placeholder.svg?height=300&width=300" },
              { name: "Study Desk", price: "₱1,200", image: "/placeholder.svg?height=300&width=300" },
              { name: "Wireless Headphones", price: "₱800", image: "/placeholder.svg?height=300&width=300" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="h-48 relative">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill style={{ objectFit: "cover" }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                  <p className="text-green-600 font-bold">{item.price}</p>
                  <Link href="/auth/login" className="mt-3 block">
                    <Button className="w-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200">
                      View Details
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Forum Topics */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <div className="inline-block mb-4 px-4 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium border border-green-200">
                Forum
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Hot Topics</h2>
            </div>
            <Link href="/forum">
              <Button className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 group mt-4 md:mt-0">
                Browse Forum <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="space-y-6">
            {[
              { title: "Tips for Calculus Final Exam?", replies: 24, upvotes: 45 },
              { title: "Looking for study group for Chemistry", replies: 17, upvotes: 32 },
              { title: "Best affordable laptops for CompSci students?", replies: 36, upvotes: 81 },
            ].map((topic, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <Link href="/auth/login">
                  <h3 className="text-xl font-medium text-gray-800 hover:text-green-600 transition-colors">
                    {topic.title}
                  </h3>
                </Link>
                <div className="flex mt-3 text-sm text-gray-500">
                  <p className="mr-6">{topic.replies} replies</p>
                  <p>{topic.upvotes} upvotes</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-amber-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">Ready to Join MinSU Marketplace & Forum?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Create an account today and start connecting with your campus community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button className="text-lg px-8 py-6 bg-white text-green-700 hover:bg-gray-100 rounded-xl transition-all hover:scale-105 shadow-lg shadow-green-900/20">
                  Create Account
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button className="text-lg px-8 py-6 bg-transparent text-white border-2 border-white hover:bg-white/10 rounded-xl transition-all hover:scale-105">
                  Log In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-bold mb-4 text-white">MinSU</h2>
              <p className="max-w-xs">
                The ultimate marketplace and forum platform for Mindoro State University students.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Marketplace</h3>
                <ul className="space-y-2">
                  <li><Link href="/marketplace" className="hover:text-white transition-colors">All Products</Link></li>
                  <li><Link href="/marketplace/categories" className="hover:text-white transition-colors">Categories</Link></li>
                  <li><Link href="/marketplace/deals" className="hover:text-white transition-colors">Hot Deals</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Forum</h3>
                <ul className="space-y-2">
                  <li><Link href="/forum" className="hover:text-white transition-colors">All Questions</Link></li>
                  <li><Link href="/forum/topics" className="hover:text-white transition-colors">Popular Topics</Link></li>
                  <li>
                    <Link href="/forum/leaderboard" className="hover:text-white transition-colors">
                      Leaderboard
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Account</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/auth/login" className="hover:text-white transition-colors">
                      Log In
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/register" className="hover:text-white transition-colors">
                      Register
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500">
            <p>© 2025 Rumie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}



      {/* Additional sections like Popular Items, Hot Topics, CTA, and Footer */}
      
      {/* Are preserved in your original structure and work exactly the same */}
      {/* You can continue this pattern for them, or I can paste the rest too if needed */}
