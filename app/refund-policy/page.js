import React from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function RefundPolicy() {
  return (
    <div style={styles.pageContainer}>
      <Navbar />
      <div style={styles.contentWrapper}>
        <h1 style={styles.mainTitle}>Cancellation & Refund Policy</h1>
        <p style={styles.lastUpdated}>Last Updated: March 2026</p>

        <div style={styles.policyCard}>
          <p style={styles.introText}>
            Thank you for choosing EcoKafe. We strive to provide a seamless and sustainable dining experience. This Cancellation and Refund Policy outlines the terms under which cancellations and refunds are processed for Table Reservations and Surplus Food claims made via our platform (www.ecokafe.com).
          </p>

          <h2 style={styles.sectionTitle}>1. Table Reservations</h2>
          <ul style={styles.list}>
            <li style={styles.listItem}><strong>Cancellation by User:</strong> You can cancel your table reservation up to <strong>2 hours</strong> before your scheduled booking time. If cancelled within this window, a full refund of your reservation fee (e.g., ₹100) will be initiated.</li>
            <li style={styles.listItem}><strong>Late Cancellations & No-Shows:</strong> Cancellations made less than 2 hours before the booking time, or failure to arrive at the cafe (no-show), will not be eligible for a refund.</li>
            <li style={styles.listItem}><strong>Cancellation by Cafe:</strong> In the rare event that a partner cafe cannot fulfill your reservation due to unforeseen circumstances, you will be notified immediately and a 100% refund will be processed.</li>
          </ul>

          <h2 style={styles.sectionTitle}>2. Surplus Food Reservations</h2>
          <ul style={styles.list}>
            <li style={styles.listItem}><strong>Time-Sensitive Nature:</strong> Surplus food reservations are highly time-sensitive to prevent food waste.</li>
            <li style={styles.listItem}><strong>Cancellations:</strong> You may cancel a surplus food reservation up to <strong>1 hour</strong> before the designated pickup window for a full refund. Cancellations made after this period are non-refundable, as the food is packed and reserved specifically for you.</li>
            <li style={styles.listItem}><strong>Quality Issues:</strong> If you find any genuine quality issues with the surplus food at the time of pickup, please report it to the cafe staff immediately. Approved claims will be refunded in full.</li>
          </ul>

          <h2 style={styles.sectionTitle}>3. Refund Processing</h2>
          <ul style={styles.list}>
            <li style={styles.listItem}><strong>Timeline:</strong> All approved refunds will be credited back to the <strong>original method of payment</strong> (Credit/Debit Card, UPI, Net Banking, etc.) within <strong>5 to 7 business days</strong>.</li>
            <li style={styles.listItem}><strong>Processing Fees:</strong> Standard cancellations do not incur any processing fees.</li>
          </ul>

          <h2 style={styles.sectionTitle}>4. Contact Us</h2>
          <p style={styles.contactText}>
            If you have any questions or face issues regarding your booking or refund, please reach out to our support team:
            <br />
            <strong>Email:</strong> support@ecokafe.com
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  pageContainer: { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8fafc", fontFamily: "'Inter', sans-serif" },
  contentWrapper: { flex: 1, maxWidth: "900px", margin: "0 auto", padding: "120px 20px 60px 20px", width: "100%", boxSizing: "border-box" },
  mainTitle: { color: "#0f172a", fontSize: "2.5rem", fontWeight: "800", marginBottom: "10px", textAlign: "center" },
  lastUpdated: { color: "#64748b", textAlign: "center", marginBottom: "40px", fontSize: "1rem" },
  policyCard: { backgroundColor: "white", padding: "40px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" },
  introText: { color: "#475569", fontSize: "1.05rem", lineHeight: "1.7", marginBottom: "30px" },
  sectionTitle: { color: "#1e293b", fontSize: "1.5rem", fontWeight: "700", marginTop: "30px", marginBottom: "15px", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px" },
  list: { paddingLeft: "20px", color: "#475569", margin: "0 0 20px 0" },
  listItem: { marginBottom: "12px", lineHeight: "1.6", fontSize: "1.05rem" },
  contactText: { color: "#475569", fontSize: "1.05rem", lineHeight: "1.7", marginTop: "10px" }
};