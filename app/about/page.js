"use client"; // 🟢 Next.js ke liye zaroori

import React from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function About() {
  return (
    <div style={styles.pageContainer}>
      <Navbar />
      
      <div style={styles.contentWrapper}>
        <div style={styles.heroSection}>
          <h1 style={styles.title}>About <span style={{ color: "#00bfa5" }}>EcoKafe</span></h1>
          <p style={styles.subtitle}>
            Revolutionizing the way we eat by connecting conscious foodies with sustainable cafes to reduce food waste.
          </p>
        </div>

        <div style={styles.gridSection}>
          <div style={styles.card}>
            <span style={styles.icon}>🌍</span>
            <h3 style={styles.cardTitle}>Our Mission</h3>
            <p style={styles.cardText}>
              To create a zero-waste ecosystem where surplus food finds a home instead of a landfill.
            </p>
          </div>
          <div style={styles.card}>
            <span style={styles.icon}>🤖</span>
            <h3 style={styles.cardTitle}>AI Recommendations</h3>
            <p style={styles.cardText}>
              We use AI to recommend cafes based on their real sustainability scores and eco-features.
            </p>
          </div>
          <div style={styles.card}>
            <span style={styles.icon}>🔔</span>
            <h3 style={styles.cardTitle}>Surplus Alerts</h3>
            <p style={styles.cardText}>
              Real-time notifications for surplus food deals, helping you save money and the planet.
            </p>
          </div>
        </div>

        <div style={styles.devSection}>
          <h2 style={styles.devTitle}>The Developer</h2>
          <div style={styles.devCard}>
            <div style={styles.devAvatar}>🎓</div>
            <p style={styles.devText}>
              Developed by a final-year B.Tech CSE student at DIT University, passionate about Tech and AI SaaS solutions.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  pageContainer: { minHeight: "100vh", backgroundColor: "#f4f7f6", fontFamily: "'Inter', sans-serif" },
  contentWrapper: { maxWidth: "1100px", margin: "0 auto", padding: "120px 20px 60px 20px" },
  heroSection: { textAlign: "center", marginBottom: "60px" },
  title: { fontSize: "3rem", fontWeight: "800", color: "#0f172a", marginBottom: "20px" },
  subtitle: { fontSize: "1.2rem", color: "#64748b", maxWidth: "700px", margin: "0 auto", lineHeight: "1.6" },
  gridSection: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", marginBottom: "80px" },
  card: { backgroundColor: "white", padding: "40px", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", textAlign: "center", border: "1px solid #e2e8f0" },
  icon: { fontSize: "3rem", marginBottom: "20px", display: "block" },
  cardTitle: { fontSize: "1.4rem", fontWeight: "700", color: "#0f172a", marginBottom: "15px" },
  cardText: { color: "#64748b", lineHeight: "1.6" },
  devSection: { textAlign: "center", padding: "60px", backgroundColor: "#0b1120", borderRadius: "30px", color: "white" },
  devTitle: { fontSize: "2rem", marginBottom: "30px" },
  devCard: { display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", flexWrap: "wrap" },
  devAvatar: { width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#00bfa5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" },
  devText: { maxWidth: "500px", fontSize: "1.1rem", lineHeight: "1.6", textAlign: "left" }
};