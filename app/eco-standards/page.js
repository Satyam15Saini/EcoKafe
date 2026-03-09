"use client";

import React from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function EcoStandards() {
  return (
    <div style={styles.pageContainer}>
      <Navbar />
      <div style={styles.contentWrapper}>
        <h1 style={styles.title}>Our Eco-Standards</h1>
        <p style={styles.subtitle}>How we evaluate and score cafes on EcoKafe.</p>
        
        <div style={styles.card}>
          <ul style={{ paddingLeft: "20px", color: "#475569", lineHeight: "1.8", fontSize: "1.05rem" }}>
            <li><strong style={{color:"#0f172a"}}>🌱 Zero Single-Use Plastic:</strong> Cafes must use biodegradable or reusable packaging.</li>
            <li><strong style={{color:"#0f172a"}}>🍱 Surplus Food Management:</strong> Active participation in preventing food waste by offering discounted surplus meals.</li>
            <li><strong style={{color:"#0f172a"}}>♻️ Composting:</strong> Proper disposal and composting of organic wet waste.</li>
            <li><strong style={{color:"#0f172a"}}>⚡ Energy Efficiency:</strong> Use of solar panels or energy-efficient appliances boosts the AI Score.</li>
            <li><strong style={{color:"#0f172a"}}>🥗 Vegan & Organic Options:</strong> Promoting plant-based diets to reduce carbon footprint.</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  pageContainer: { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8fafc" },
  contentWrapper: { flex: 1, maxWidth: "800px", margin: "0 auto", padding: "120px 20px 60px", width: "100%" },
  title: { fontSize: "2.5rem", color: "#0f172a", marginBottom: "10px", fontWeight: "800" },
  subtitle: { color: "#64748b", fontSize: "1.1rem", marginBottom: "40px" },
  card: { backgroundColor: "white", padding: "40px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" },
};