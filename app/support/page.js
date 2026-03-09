"use client";

import React from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function PartnerSupport() {
  return (
    <div style={styles.pageContainer}>
      <Navbar />
      <div style={styles.contentWrapper}>
        <h1 style={styles.title}>Partner Support</h1>
        <p style={styles.subtitle}>We're here to help our EcoKafe partners grow sustainably.</p>
        
        <div style={styles.card}>
          <h2 style={{marginTop: 0, color: "#1e293b"}}>Contact the Helpdesk</h2>
          <p style={{color: "#475569", lineHeight: "1.6"}}>
            Having trouble with your cafe dashboard, menu updates, or surplus food alerts? Our team is available 24/7.
          </p>
          <div style={styles.contactInfo}>
            <p>📧 <strong>Email:</strong> partnersupport@ecokafe.com</p>
            <p>📞 <strong>Phone:</strong> +91 98765 43210 (Toll-Free)</p>
          </div>
          <button style={styles.primaryBtn} onClick={() => alert("Support ticket raised! We will contact you shortly.")}>Raise a Ticket</button>
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
  contactInfo: { backgroundColor: "#f1f5f9", padding: "20px", borderRadius: "10px", margin: "20px 0" },
  primaryBtn: { backgroundColor: "#00bfa5", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer" }
};