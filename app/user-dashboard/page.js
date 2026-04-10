"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Loading state
  if (status === "loading") {
    return <div style={styles.loader}>Loading your green journey... 🌿</div>;
  }

  // Protection: Agar login nahi hai toh wapas bhej do
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const user = session?.user;

  return (
    <div style={styles.pageContainer}>
      <Navbar />
      
      <div style={styles.contentWrapper}>
        {/* TOP USER PROFILE HEADER */}
        <div style={styles.headerCard}>
          <div style={styles.profileInfo}>
            <img 
              src={user?.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
              alt="Profile" 
              style={styles.avatar} 
            />
            <div style={styles.nameSection}>
              <h1 style={styles.userName}>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
              <p style={styles.userEmail}>{user?.email}</p>
            </div>
          </div>
          <div style={styles.ecoBadge}>
            <span style={styles.badgeIcon}>🌱</span>
            <div>
              <p style={styles.badgeLabel}>Eco Points</p>
              <p style={styles.badgeValue}>120 Points</p>
            </div>
          </div>
        </div>

        {/* QUICK ACTION SECTION */}
        <div style={styles.quickActionCard}>
          <div style={styles.quickActionContent}>
            <div>
              <h2 style={styles.quickActionTitle}>🌿 Ready to Explore?</h2>
              <p style={styles.quickActionText}>Discover sustainable cafes near you, make bookings, and claim surplus food!</p>
            </div>
            <button onClick={() => router.push("/")} style={styles.quickActionBtn}>Browse Cafes →</button>
          </div>
        </div>

        {/* QUICK STATS CARDS */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Bookings</p>
            <p style={styles.statValue}>0</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Spent</p>
            <p style={styles.statValue}>₹0</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Food Items Saved</p>
            <p style={styles.statValue}>0</p>
          </div>
        </div>

        {/* MAIN DASHBOARD CONTENT WITH TABS */}
        <div style={styles.mainCard}>
          <div style={styles.tabBar}>
            <button 
              onClick={() => setActiveTab("overview")} 
              style={activeTab === "overview" ? styles.activeTab : styles.tab}
            >
              📊 Overview
            </button>
            <button 
              onClick={() => setActiveTab("history")} 
              style={activeTab === "history" ? styles.activeTab : styles.tab}
            >
              📜 Booking History
            </button>
            <button 
              onClick={() => setActiveTab("impact")} 
              style={activeTab === "impact" ? styles.activeTab : styles.tab}
            >
              🌎 My Eco Impact
            </button>
          </div>

          <div style={styles.tabContent}>
            {activeTab === "overview" && (
              <div style={styles.emptyState}>
                <img src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" style={styles.emptyIcon} />
                <h3 style={styles.emptyStateTitle}>No recent activity yet!</h3>
                <p style={styles.emptyStateText}>Start your sustainable journey by exploring cafes near you. Book a table or claim surplus food to make a difference!</p>
              </div>
            )}
            
            {activeTab === "history" && (
              <div style={styles.emptyState}>
                <img src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" style={styles.emptyIcon} />
                <h3 style={styles.emptyStateTitle}>No bookings yet!</h3>
                <p style={styles.emptyStateText}>Your booking history will appear here once you reserve a table or claim surplus food at any of our partner cafes.</p>
              </div>
            )}

            {activeTab === "impact" && (
              <div style={styles.impactBox}>
                <h3 style={styles.impactTitle}>🌍 You're Making a Real Difference!</h3>
                <p style={styles.impactText}>By using EcoKafe, you've helped save <strong>0 meals</strong> from waste and reduced <strong>0kg of CO2</strong> emissions. Every action counts towards a sustainable future!</p>
                <div style={styles.progressBar}><div style={{...styles.progress, width: "10%"}}></div></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  pageContainer: { minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc 0%, #ecf9f7 100%)", display: "flex", flexDirection: "column" },
  contentWrapper: { flex: 1, maxWidth: "1100px", margin: "0 auto", padding: "110px 20px 50px 20px", width: "100%", boxSizing: "border-box" },
  headerCard: { background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)", padding: "30px", borderRadius: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 10px 30px rgba(0, 191, 165, 0.08)", marginBottom: "30px", border: "2px solid rgba(0, 191, 165, 0.1)", backdropFilter: "blur(10px)" },
  profileInfo: { display: "flex", alignItems: "center", gap: "20px" },
  avatar: { width: "75px", height: "75px", borderRadius: "50%", border: "3px solid #00bfa5", boxShadow: "0 8px 20px rgba(0, 191, 165, 0.2)", objectFit: "cover" },
  nameSection: { display: "flex", flexDirection: "column", gap: "5px" },
  userName: { margin: 0, fontSize: "1.3rem", color: "#0f172a", fontWeight: "700", letterSpacing: "-0.3px" },
  userEmail: { margin: 0, color: "#64748b", fontSize: "0.85rem", fontWeight: "500" },
  ecoBadge: { background: "linear-gradient(135deg, #dcfce7 0%, #ccfbf1 100%)", padding: "15px 22px", borderRadius: "18px", display: "flex", alignItems: "center", gap: "14px", border: "2px solid #86efac", boxShadow: "0 8px 20px rgba(0, 191, 165, 0.15)" },
  badgeIcon: { fontSize: "2rem", display: "flex", alignItems: "center" },
  badgeLabel: { margin: 0, color: "#166534", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.3px" },
  badgeValue: { margin: 0, color: "#15803d", fontSize: "1.2rem", fontWeight: "800" },
  quickActionCard: { background: "linear-gradient(135deg, #00bfa5 0%, #00897b 100%)", borderRadius: "20px", padding: "32px 35px", marginBottom: "32px", boxShadow: "0 15px 40px rgba(0, 191, 165, 0.3)", border: "2px solid rgba(255, 255, 255, 0.2)" },
  quickActionContent: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "30px" },
  quickActionTitle: { margin: "0 0 12px 0", fontSize: "1.3rem", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.3px" },
  quickActionText: { margin: 0, fontSize: "0.95rem", color: "#ffffff", fontWeight: "600", lineHeight: "1.6", maxWidth: "450px" },
  quickActionBtn: { background: "white", color: "#00bfa5", padding: "14px 35px", borderRadius: "12px", border: "none", fontWeight: "800", cursor: "pointer", fontSize: "0.95rem", transition: "all 0.3s ease", boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.5px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px", marginBottom: "30px" },
  statCard: { background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)", padding: "25px", borderRadius: "20px", textAlign: "center", boxShadow: "0 6px 20px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", transition: "all 0.3s ease", cursor: "pointer", position: "relative", overflow: "hidden" },
  statCardHover: { transform: "translateY(-5px)", boxShadow: "0 12px 30px rgba(0, 191, 165, 0.15)", borderColor: "#ccfbf1" },
  statLabel: { color: "#64748b", fontSize: "0.85rem", marginBottom: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.2px" },
  statValue: { color: "#0f172a", fontSize: "1.6rem", fontWeight: "800", margin: 0, background: "linear-gradient(135deg, #00bfa5 0%, #00897b 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" },
  mainCard: { background: "#ffffff", borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9", padding: "25px" },
  tabBar: { display: "flex", borderBottom: "none", backgroundColor: "#f0fdf4", padding: "8px 10px", gap: "10px", borderRadius: "12px", marginBottom: "20px", boxShadow: "inset 0 2px 8px rgba(0, 191, 165, 0.05)" },
  tab: { flex: 1, padding: "11px 14px", borderRadius: "10px", borderTop: "none", borderLeft: "none", borderRight: "none", borderBottom: "none", background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)", cursor: "pointer", color: "#64748b", fontWeight: "700", fontSize: "0.88rem", transition: "all 0.25s ease", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", border: "none" },
  activeTab: { color: "#ffffff", background: "linear-gradient(135deg, #00bfa5 0%, #00897b 100%)", borderRadius: "10px", borderTop: "none", borderLeft: "none", borderRight: "none", borderBottom: "none", fontWeight: "700", boxShadow: "0 6px 15px rgba(0, 191, 165, 0.35)", border: "none" },
  tabContent: { padding: "30px 15px", minHeight: "300px", display: "flex", flexDirection: "column", justifyContent: "center" },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" },
  emptyIcon: { width: "80px", height: "80px", opacity: 0.6, filter: "drop-shadow(0 4px 10px rgba(0, 191, 165, 0.1))" },
  emptyStateTitle: { fontSize: "1.1rem", fontWeight: "700", color: "#0f172a", margin: 0 },
  emptyStateText: { fontSize: "0.9rem", color: "#64748b", margin: 0, maxWidth: "400px", textAlign: "center", lineHeight: "1.5" },
  exploreBtn: { background: "linear-gradient(135deg, #00bfa5 0%, #00897b 100%)", color: "white", padding: "12px 28px", borderRadius: "12px", border: "none", fontWeight: "700", marginTop: "15px", cursor: "pointer", fontSize: "0.85rem", transition: "all 0.3s ease", boxShadow: "0 8px 20px rgba(0, 191, 165, 0.3)", textTransform: "uppercase", letterSpacing: "0.4px" },
  exploreBtnHover: { transform: "translateY(-3px)", boxShadow: "0 12px 30px rgba(0, 191, 165, 0.4)" },
  impactBox: { background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)", padding: "30px", borderRadius: "20px", textAlign: "left", border: "2px solid #a7f3d0", boxShadow: "0 8px 20px rgba(0, 191, 165, 0.1)" },
  impactTitle: { fontSize: "1.1rem", fontWeight: "800", color: "#059669", margin: "0 0 12px 0" },
  impactText: { fontSize: "0.9rem", color: "#047857", margin: 0, lineHeight: "1.6", fontWeight: "500" },
  progressBar: { height: "10px", backgroundColor: "#a7f3d0", borderRadius: "10px", marginTop: "18px", overflow: "hidden", boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)" },
  progress: { height: "100%", backgroundColor: "linear-gradient(90deg, #00bfa5, #059669)", borderRadius: "12px", transition: "width 0.5s ease" },
  loader: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.2rem", color: "#00bfa5", fontWeight: "bold" }
};