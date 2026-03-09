"use client";

import React from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function TermsOfService() {
  return (
    <div style={styles.pageContainer}>
      <Navbar />
      <div style={styles.contentWrapper}>
        <h1 style={styles.title}>Terms of Service</h1>
        <p style={styles.subtitle}>Please read these terms carefully before using EcoKafe.</p>
        
        <div style={styles.card}>
          <h3 style={{color: "#1e293b"}}>1. Acceptance of Terms</h3>
          <p style={styles.text}>By accessing or using the EcoKafe platform, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>
          
          <h3 style={{color: "#1e293b"}}>2. Surplus Food Claims</h3>
          <p style={styles.text}>Surplus food is provided by partner cafes "as is". While we enforce strict quality eco-standards, the respective cafe owner is ultimately responsible for the freshness and safety of the food provided.</p>
          
          <h3 style={{color: "#1e293b"}}>3. Booking & Payments</h3>
          <p style={styles.text}>Table booking fees are processed securely via Razorpay. Cancellations made within 2 hours of the booking time may not be eligible for a refund.</p>
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