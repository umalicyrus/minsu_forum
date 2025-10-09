"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const links = [
    { href: "/admin/dashboard", label: "🏠 Dashboard" },
    { href: "/admin/users", label: "👥 Users" },
    { href: "/admin/posts", label: "📝 Posts" },
    { href: "/admin/categories", label: "🗂 Categories" },
    { href: "/admin/reports", label: "📊 Reports" },
    { href: "/admin/settings", label: "⚙️ Settings" },
  ];

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch (err) {
      // ignore network error for demo
    } finally {
      setIsLoggingOut(false);
      router.push("/auth/login");
    }
  }

  return (
    <motion.aside
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="
        fixed left-0 top-0 bottom-0 z-50
        w-60 flex flex-col justify-between
        bg-[#E8F5E9] border-r border-green-200
        shadow-sm px-4 py-5
        text-green-900
        md:static
      "
    >
      {/* Header */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-green-800">Admin Panel</h2>
          <p className="text-sm text-green-700 mt-1">Manage your system</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 overflow-y-auto">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`
                  flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold
                  transition-all duration-150
                  ${
                    isActive
                      ? "bg-green-500 text-white shadow-sm"
                      : "hover:bg-green-100 text-green-800"
                  }
                `}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-green-200 pt-3 mt-4 flex flex-col gap-3">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`
            w-full py-2.5 rounded-lg font-bold
            transition-all duration-150
            ${
              isLoggingOut
                ? "bg-red-300 cursor-not-allowed text-white"
                : "bg-red-500 hover:bg-red-600 text-white shadow-sm"
            }
          `}
        >
          {isLoggingOut ? "Logging out..." : "🚪 Logout"}
        </button>

        <div className="text-center text-xs text-green-700">
          © 2025 Admin Dashboard
        </div>
      </div>
    </motion.aside>
  );
}
