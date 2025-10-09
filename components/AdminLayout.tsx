"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/settings", label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen bg-green-50">
      {/* Sidebar */}
      <aside className="w-64 bg-yellow-200 text-green-800 flex flex-col shadow-md">
        <div className="p-6 text-2xl font-bold border-b border-green-200">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-lg font-medium transition-colors ${
                pathname === link.href
                  ? "bg-green-600 text-white"
                  : "hover:bg-green-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-green-600 text-white p-4 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="text-sm font-medium">Welcome, Admin</div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
