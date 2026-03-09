"use client"; 

import React, { useState } from "react";
// 🟢 FIX: 'Components' ka 'C' capital kar diya taaki Vercel par crash na ho
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thanks for reaching out, ${formData.name}! Our AI team will get back to you soon. 🌿`);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div style={styles.pageContainer}>
      <Navbar />
      
      <div style={styles.contentWrapper}>
        <div style={styles.headerSection}>
          <h1 style={styles.title}>Get in Touch</h1>
          <p style={styles.subtitle}>Have questions about our AI recommendations or surplus alerts? We're here to help.</p>
        </div>

        <div style={styles.contactGrid}>
          {/* LEFT: Contact Info */}
          <div style={styles.infoColumn}>
            <div style={styles.infoCard}>
              <div style={styles.iconBox}>📍</div>
              <div>
                <h4 style={styles.infoTitle}>Our Headquarters</h4>
                <p style={styles.infoText}>DIT University, Dehradun, Uttarakhand</p>
              </div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.iconBox}>📧</div>
              <div>
                <h4 style={styles.infoTitle}>Email Us</h4>
                <p style={styles.infoText}>support@ecokafe.ai</p>
              </div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.iconBox}>📱</div>
              <div>
                <h4 style={styles.infoTitle}>Call Us</h4>
                <p style={styles.infoText}>+91 98765 43210</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div style={styles.formCard}>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Rahul Sharma" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={styles.input} 
                    required 
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="rahul@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={styles.input} 
                    required 
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Subject</label>
                <input 
                  type="text" 
                  placeholder="How can we help?" 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  style={styles.input} 
                  required 
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Message</label>
                <textarea 
                  rows="5" 
                  placeholder="Tell us more about your inquiry..." 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  style={styles.textarea} 
                  required 
                />
              </div>

              <button type="submit" style={styles.submitBtn}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}

const styles = {
  pageContainer: { minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Inter', sans-serif" },
  contentWrapper: { maxWidth: "1100px", margin: "0 auto", padding: "120px 20px" },
  headerSection: { textAlign: "center", marginBottom: "60px" },
  title: { fontSize: "2.5rem", fontWeight: "800", color: "#0f172a", marginBottom: "15px" },
  subtitle: { fontSize: "1.1rem", color: "#64748b", maxWidth: "600px", margin: "0 auto" },
  contactGrid: { display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "50px", alignItems: "start" },
  infoColumn: { display: "flex", flexDirection: "column", gap: "25px" },
  infoCard: { display: "flex", alignItems: "center", gap: "20px", backgroundColor: "white", padding: "25px", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" },
  iconBox: { width: "50px", height: "50px", borderRadius: "12px", backgroundColor: "#f0fdfa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" },
  infoTitle: { margin: "0 0 5px 0", fontSize: "1.1rem", fontWeight: "700", color: "#0f172a" },
  infoText: { margin: 0, color: "#64748b", fontSize: "0.95rem" },
  formCard: { backgroundColor: "white", padding: "40px", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" },
  form: { display: "flex", flexDirection: "column", gap: "25px" },
  inputRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "0.9rem", fontWeight: "700", color: "#334155" },
  input: { padding: "14px", borderRadius: "12px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", fontSize: "1rem", outline: "none", transition: "border 0.2s" },
  textarea: { padding: "14px", borderRadius: "12px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", fontSize: "1rem", outline: "none", resize: "none" },
  submitBtn: { backgroundColor: "#00bfa5", color: "white", border: "none", padding: "16px", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "800", cursor: "pointer", transition: "transform 0.1s", boxShadow: "0 4px 12px rgba(0, 191, 165, 0.2)" }
};