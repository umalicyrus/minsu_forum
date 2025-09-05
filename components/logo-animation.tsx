"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function LogoAnimation() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Hide the animation after 2 seconds
    const timer = setTimeout(() => {
      setShow(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-white z-[9999]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-5xl font-bold bg-gradient-to-r from-green-600 to-amber-600 bg-clip-text text-transparent mb-4"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              MinSU
            </motion.div>

            <motion.div
              className="flex space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {["C", "o", "n", "n", "e", "c", "t", " ", "&", " ", "T", "h", "r", "i", "v", "e"].map((letter, index) => (
                <motion.span
                  key={index}
                  className="text-lg text-gray-600"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              className="mt-8 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <motion.div className="h-1 w-32 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-600 to-amber-600"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 1.5 }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
