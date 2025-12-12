"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown, ArrowRight, BookOpen, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button"
import { MessageCircle, ArrowUp, Clock } from "lucide-react";

interface Feature {
  title: string
  description: string
  image: string
  link: string
  gradient: string
  glow: string
}
function TiltCard({ feature, index }: any) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({ x: y / 20, y: -x / 20 });
  };

  const resetTilt = () => setRotate({ x: 0, y: 0 });

  return (
    <Link href={feature.link ?? "#"}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        animate={{ rotateX: rotate.x, rotateY: rotate.y }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
        whileHover={{ scale: 1.03 }}
        className="relative rounded-2xl cursor-pointer perspective-1000"
      >
        {/* Card with transparent background and gradient border on hover */}
        <div className="relative p-10 rounded-2xl h-full flex flex-col items-center text-center
                        bg-transparent border-2 border-gray-300 hover:border-0
                        hover:bg-[conic-gradient(from_180deg_at_50%_50%,#d9f0e6,#fef3c7,#d9f0e6)] 
                        transition-all duration-300">
          {/* Floating icon */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative mb-6"
          >
            <img
              src={feature.image}
              alt={feature.title}
              className="w-24 h-24 relative z-10 object-contain drop-shadow-md"
            />
          </motion.div>

          {/* Text */}
          <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
          <p className="text-gray-600 leading-relaxed">{feature.description}</p>
        </div>
      </motion.div>
    </Link>
  );
}

export function PopularQuestionsPreview() {
  const questions = [
    {
      id: 1,
      user: {
        name: "John Dela Cruz",
        avatar: "/uploads/homepage/man1.jpg",
      },
      question:
        "How can I fix Prisma authentication error when connecting to MySQL in Laragon?",
      answers: 14,
      upvotes: 52,
      time: "2 hours ago",
    },
    {
      id: 2,
      user: {
        name: "Sarah Villanueva",
        avatar: "/uploads/homepage/woman1.jpg",
      },
      question:
        "What are the academic requirements for shifting courses inside MinSU?",
      answers: 6,
      upvotes: 27,
      time: "5 hours ago",
    },
    {
      id: 3,
      user: {
        name: "Carlos Gomez",
        avatar: "/uploads/homepage/man2.jpg",
      },
      question:
        "Any tips or reviewers for passing the Civil Service Examination?",
      answers: 19,
      upvotes: 61,
      time: "1 day ago",
    },
    {
      id: 4,
      user: {
        name: "Jenny Rose",
        avatar: "/uploads/homepage/woman2.jpg",
      },
      question:
        "How to deploy a Next.js app with Prisma and MySQL database?",
      answers: 9,
      upvotes: 33,
      time: "3 hours ago",
    },
  ];

  return (
    <section className="mt-20 px-4 md:px-8 lg:px-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Popular Questions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {questions.map((q) => (
          <div
            key={q.id}
            className="
              group relative
              pt-16 pb-8 px-6
              rounded-3xl 
              bg-[#f7f7f2]
              border-2 border-transparent
              hover:outline hover:outline-[3px]
              hover:outline-[conic-gradient(from_180deg_at_50%_50%,#bbf7d0,#fef3c7,#bbf7d0)]
              transition-all duration-300
              shadow-md hover:shadow-2xl
              min-h-[340px]
              text-center
              mx-4
              flex flex-col
            "
          >
            {/* USER AVATAR HALF-OUTSIDE */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
              <img
                src={q.user.avatar}
                className="
                  w-20 h-20 
                  rounded-full object-cover 
                  border-4 border-white shadow-lg
                "
                alt={q.user.name}
              />
            </div>

            <p className="font-semibold text-gray-800 text-lg mt-2">
              {q.user.name}
            </p>

            <p className="text-gray-900 font-medium mt-4 mb-6 leading-snug text-sm">
              {q.question}
            </p>

            {/* FOOTER ICONS */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mt-auto">
              
              {/* Answers */}
              <div className="flex items-center gap-3">
                <img
                  src="/uploads/homepage/answer.png"
                  className="w-6 h-6"
                  alt="answers"
                />
                <span className="text-gray-700 font-medium">{q.answers} Answers</span>
              </div>

              {/* Upvotes */}
              <div className="flex items-center gap-3">
                <img
                  src="/uploads/homepage/like.png"
                  className="w-6 h-6"
                  alt="upvotes"
                />
                <span className="text-gray-700 font-medium">{q.upvotes} Upvotes</span>
              </div>

              {/* Time */}
              <div className="text-gray-500 text-sm">{q.time}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


export function FeatureSection() {
const cards = [
  {
    title: "Forum",
    description: "Ask questions, share knowledge, and connect with peers.",
    image: "/uploads/homepage/question-mark.png",
    link: "/forum",
    gradient: "from-green-200 to-green-400", // softer green
    glow: "from-green-100 to-green-300",
  },
  {
    title: "Groups",
    description: "Join study groups, clubs, and department channels for collaboration.",
    image: "/uploads/homepage/diversity.png",
    link: "/groups",
    gradient: "from-teal-200 to-teal-400", // softer teal
    glow: "from-teal-100 to-teal-300",
  },
  {
    title: "Recognition",
    description: "Earn points, ranks, and badges for helpful contributions.",
    image: "/uploads/homepage/trophy.png",
    link: "/achievements",
    gradient: "from-yellow-200 to-yellow-400", // softer yellow/amber
    glow: "from-yellow-100 to-yellow-300",
  },
]


  return (
    <section className="py-20 ">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-0 left-1/4 w-64 h-64 rounded-full"
        animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl"
        animate={{ x: [0, -70, 0], y: [0, 50, 0], scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium border border-green-200">
            Platform Features
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need in One Place
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with your campus community through our integrated forum designed specifically for MinSU students.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {cards.map((feature, index) => (
            <TiltCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}


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
              Mindoro State University's Student Forum
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Ask, Learn, and <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-amber-600">Connect</span> with MinSUForum
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              A friendly campus forum to ask questions, share knowledge, join groups, and help one another succeed.
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
              { label: "Questions Posted", value: "3,500+", icon: <BookOpen className="h-5 w-5 text-amber-600" /> },
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

< FeatureSection/>

      {/* Popular Questions Preview (replaces Marketplace) */}
< PopularQuestionsPreview/>

      {/* Hot Forum Topics */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <div className="inline-block mb-4 px-4 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium border border-green-200">
                Forum
              </div>
              <h2 className="text-3xl font-bold mb-8 text-center">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="font-bold text-lg mb-2">💻 IT & Computer Science</h3>
            <p className="text-gray-300 text-sm">Topics: coding, DSA, SQL, networking</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="font-bold text-lg mb-2">📚 General Education</h3>
            <p className="text-gray-300 text-sm">Math, English, Science</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="font-bold text-lg mb-2">🧪 Engineering</h3>
            <p className="text-gray-300 text-sm">CE, EE, ME</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="font-bold text-lg mb-2">🎓 Student Life</h3>
            <p className="text-gray-300 text-sm">Campus concerns</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="font-bold text-lg mb-2">💼 Careers & Jobs</h3>
            <p className="text-gray-300 text-sm">Exams, resumes, interviews</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="font-bold text-lg mb-2">❓ Miscellaneous</h3>
            <p className="text-gray-300 text-sm">Others</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-8 text-center">Hot Topics</h2>
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
                <Link href="/forum">
                  <h3 className="text-xl font-medium text-gray-800 hover:text-green-600 transition-colors">{topic.title}</h3>
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
            <h2 className="text-4xl font-bold mb-6 text-white">Ready to Join MinSU Forum?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Create an account today and start asking, answering, and connecting with your campus community.
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
                The official forum platform for Mindoro State University students — ask questions, share knowledge, and grow together.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Forum</h3>
                <ul className="space-y-2">
                  <li><Link href="/forum" className="hover:text-white transition-colors">All Questions</Link></li>
                  <li><Link href="/forum/topics" className="hover:text-white transition-colors">Popular Topics</Link></li>
                  <li><Link href="/forum/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Groups</h3>
                <ul className="space-y-2">
                  <li><Link href="/groups" className="hover:text-white transition-colors">All Groups</Link></li>
                  <li><Link href="/groups/create" className="hover:text-white transition-colors">Create Group</Link></li>
                  <li><Link href="/groups/joined" className="hover:text-white transition-colors">My Groups</Link></li>
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
            <p>© 2025 MinSU. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
