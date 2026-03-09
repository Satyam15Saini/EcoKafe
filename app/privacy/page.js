"use client";

import React from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function PrivacyPolicy() {
  return (
    <div style={styles.pageContainer}>
      <Navbar />
      <div style={styles.contentWrapper}>
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.subtitle}>Last updated: March 2026</p>
        
        <div style={styles.card}>
          <h3 style={{color: "#1e293b"}}>1. Information We Collect</h3>
          <p style={styles.text}>We collect information you provide directly to us when you create an account, such as your name, email address, and location (to show nearby cafes). Our AI Chatbot processes queries to give you better recommendations but does not store personal conversational data.</p>
          
          <h3 style={{color: "#1e293b"}}>2. How We Use Your Information</h3>
          <p style={styles.text}>We use the information to operate the EcoKafe platform, manage surplus food claims, process table bookings via Razorpay, and improve our AI recommendation engine.</p>
          
          <h3 style={{color: "#1e293b"}}>3. Sharing of Information</h3>
          <p style={styles.text}>We only share your booking details with the specific cafe you booked. We do not sell your personal data to third-party marketers.</p>
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
  text: { color: "#475569", lineHeight: "1.8", marginBottom: "20px" }
};