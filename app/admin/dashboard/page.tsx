"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  const SIDEBAR_WIDTH = "240px"; // match AdminSidebar SIDEBAR_WIDTH

  const mainStyle: React.CSSProperties = {
    flex: 1,
    marginLeft: SIDEBAR_WIDTH,
    minHeight: "100vh",
    background: "#F0FFF4", // light green background
    padding: 28,
    boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />

      <main style={mainStyle}>
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 style={{ color: "#14532D", margin: 0, fontSize: 34, fontWeight: 800 }}>
            Welcome to the Admin Dashboard 🌿
          </h1>
          <p style={{ color: "#166534", marginTop: 8 }}>
            All primary actions are in the sidebar — click any button to go to that section.
          </p>

          <div style={{ marginTop: 28 }}>
            {/* simple stats area */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{
                flex: "1 1 200px",
                background: "#FFFBEB",
                padding: 16,
                borderRadius: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
              }}>
                <div style={{ fontSize: 12, color: "#14532D", fontWeight: 700 }}>Users</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#16a34a" }}>120</div>
              </div>

              <div style={{
                flex: "1 1 200px",
                background: "#ECFDF5",
                padding: 16,
                borderRadius: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
              }}>
                <div style={{ fontSize: 12, color: "#14532D", fontWeight: 700 }}>Posts</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#16a34a" }}>85</div>
              </div>

              <div style={{
                flex: "1 1 200px",
                background: "#FFFBEB",
                padding: 16,
                borderRadius: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
              }}>
                <div style={{ fontSize: 12, color: "#14532D", fontWeight: 700 }}>Categories</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#16a34a" }}>12</div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
