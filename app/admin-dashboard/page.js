"use client"; 

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useSession } from "next-auth/react"; // 🟢 FIX 1: NextAuth ka useSession import kiya
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

// 🟢 NAYA LOGIC: Static Data for 6 Cafes (API fetch hata diya)
const initialCafes = [
  { id: 1, name: "Green Leaf Cafe", owner: "Priya Singh", aiScore: 92, status: "Verified", wasteSavedKg: 150, hasFssai: true, hasGreenAudit: true },
  { id: 2, name: "Earth Kitchen", owner: "Rohan Das", aiScore: 88, status: "Verified", wasteSavedKg: 120, hasFssai: true, hasGreenAudit: false },
  { id: 3, name: "Sustainable Sips", owner: "Neha Gupta", aiScore: 95, status: "Verified", wasteSavedKg: 200, hasFssai: true, hasGreenAudit: true },
  { id: 4, name: "The Roast Cafe", owner: "Simran Kaur", aiScore: 81, status: "Pending Verification", wasteSavedKg: 85, hasFssai: false, hasGreenAudit: false },
  { id: 5, name: "Himalayan Roots", owner: "Satyam Saini", aiScore: 85, status: "Pending Verification", wasteSavedKg: 90, hasFssai: true, hasGreenAudit: false },
  { id: 6, name: "Zero Waste Bites", owner: "Amit Patel", aiScore: 90, status: "Verified", wasteSavedKg: 180, hasFssai: true, hasGreenAudit: true }
];

export default function AdminDashboard() {
  const router = useRouter(); 
  
  // 🟢 FIX 2: NextAuth se session nikala
  const { data: session, status } = useSession(); 
  // Map session user to admin object matching old logic
  const admin = session?.user ? { ...session.user, username: session.user.name } : null;
  
  // 🟢 Ab database ki jagah static array use kar rahe hain
  const [cafes, setCafes] = useState(initialCafes);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState(null);

  useEffect(() => {
    // 🟢 FIX 3: localStorage ki jagah ab NextAuth status handle kar raha hai
    if (status === "unauthenticated") {
      router.push("/login"); 
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      // Agar user login hai par admin nahi hai, toh home pe fek do
      router.push("/"); 
    }
  }, [status, session, router]);

  const openManageModal = (cafe) => {
    setSelectedCafe(cafe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCafe(null);
  };

  const handleVerify = () => {
    if (selectedCafe) {
      // 🟢 _id ki jagah id kar diya gaya hai
      const updatedCafes = cafes.map(c => 
        c.id === selectedCafe.id ? { ...c, status: "Verified" } : c
      );
      setCafes(updatedCafes);
      alert(`✅ ${selectedCafe.name} has been verified!`);
      closeModal();
    }
  };

  const handleUnverify = () => {
    if (selectedCafe) {
      const isSure = window.confirm(`⚠️ Are you sure you want to revoke verification for ${selectedCafe.name}?`);
      if (isSure) {
        const updatedCafes = cafes.map(c => 
          c.id === selectedCafe.id ? { ...c, status: "Pending Verification" } : c
        );
        setCafes(updatedCafes);
        alert(`⚠️ ${selectedCafe.name} has been moved back to Pending Verification.`);
        closeModal();
      }
    }
  };

  const handleRemove = () => {
    if (selectedCafe) {
      const isSure = window.confirm(`Are you sure you want to completely remove ${selectedCafe.name}?`);
      if (isSure) {
        const updatedCafes = cafes.filter(c => c.id !== selectedCafe.id);
        setCafes(updatedCafes);
        alert(`🗑️ ${selectedCafe.name} has been removed.`);
        closeModal();
      }
    }
  };

  const handlePreviewDoc = (docName) => {
    const samplePdfUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    window.open(samplePdfUrl, "_blank");
  };

  const impactData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Waste Saved (kg)',
      data: [120, 210, 350, 480, 700, 920],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const userStats = {
    labels: ['Users', 'Owners', 'Staff'],
    datasets: [{
      data: [1100, 180, 15],
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
      borderRadius: 8
    }]
  };

  // Wait for session to load before rendering
  if (status === "loading" || !admin) return null;

  return (
    <div style={styles.pageContainer}>
      <Navbar />
      <div style={styles.contentWrapper}>
        <div style={styles.topFlex}>
          <div>
            <h1 style={styles.heroTitle}>Overview</h1>
            <p style={styles.heroSubtitle}>Platform performance and sustainability metrics.</p>
          </div>
          <div style={styles.dateBadge}>Last updated: Today</div>
        </div>

        <div style={styles.metricsRow}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Waste Saved</p>
            <h2 style={styles.statValue}>920.4 <span style={styles.statUnit}>kg</span></h2>
            <p style={styles.statChange}>↑ 12% vs last month</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Active Partners</p>
            <h2 style={styles.statValue}>142</h2>
            <p style={styles.statChange}>↑ 5 new this week</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>CO2 Offset</p>
            <h2 style={styles.statValue}>2.4 <span style={styles.statUnit}>tons</span></h2>
            <p style={styles.statChange}>Target: 5.0 tons</p>
          </div>
        </div>

        <div style={styles.analyticsGrid}>
          <div style={styles.mainChart}>
            <h3 style={styles.cardTitle}>Impact Growth</h3>
            <div style={{ height: "250px" }}><Line data={impactData} options={{ maintainAspectRatio: false }} /></div>
          </div>
          <div style={styles.sideChart}>
            <h3 style={styles.cardTitle}>User Base</h3>
            <div style={{ height: "250px" }}><Bar data={userStats} options={{ maintainAspectRatio: false }} /></div>
          </div>
        </div>

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h3 style={styles.cardTitle}>Pending Verifications</h3>
            <button style={styles.viewAllBtn} onClick={() => alert("All Requests page is under development! 🚧")}>View All</button>
          </div>
          
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Cafe Name</th>
                <th style={styles.th}>Owner</th>
                <th style={styles.th}>AI Score</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cafes.map((cafe) => (
                <tr key={cafe.id} style={styles.tr}>
                  <td style={styles.tdName}>{cafe.name}</td>
                  <td style={styles.td}>{cafe.owner}</td>
                  <td style={styles.td}><span style={styles.scoreBadge}>{cafe.aiScore}%</span></td>
                  <td style={styles.td}>
                    <span style={cafe.status === "Verified" ? styles.statusVerified : styles.statusPending}>{cafe.status}</span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.actionBtn} onClick={() => openManageModal(cafe)}>Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />

      {isModalOpen && selectedCafe && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#0f172a" }}>Manage Cafe</h2>
              <button onClick={closeModal} style={styles.closeModalBtn}>✖</button>
            </div>
            
            <div style={styles.modalDetails}>
              <p><strong>Cafe Name:</strong> {selectedCafe.name}</p>
              <p><strong>Owner:</strong> {selectedCafe.owner}</p>
              <p><strong>AI Score:</strong> {selectedCafe.aiScore}%</p>
              <p><strong>Waste Saved:</strong> {selectedCafe.wasteSavedKg} kg</p>
              <p><strong>Current Status:</strong> <span style={selectedCafe.status === "Verified" ? styles.statusVerified : styles.statusPending}>{selectedCafe.status}</span></p>
            </div>

            <div style={styles.certificateBox}>
              <h4 style={{ margin: "0 0 10px 0", color: "#334155" }}>Attached Documents</h4>
              
              <div style={styles.docItem}>
                <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "#475569" }}>
                  {selectedCafe.hasFssai ? "✅ FSSAI_Certificate.pdf" : "❌ No FSSAI Uploaded"}
                </span>
                {selectedCafe.hasFssai && <button style={styles.previewBtn} onClick={() => handlePreviewDoc('fssai')}>Preview 👁️</button>}
              </div>
              
              <div style={styles.docItem}>
                <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "#475569" }}>
                  {selectedCafe.hasGreenAudit ? "✅ Green_Audit_Report.pdf" : "❌ No Audit Report"}
                </span>
                {selectedCafe.hasGreenAudit && <button style={styles.previewBtn} onClick={() => handlePreviewDoc('audit')}>Preview 👁️</button>}
              </div>
            </div>

            <div style={styles.modalActions}>
              {selectedCafe.status !== "Verified" ? (
                <button style={styles.verifyBtn} onClick={handleVerify}>Approve & Verify</button>
              ) : (
                <button style={styles.unverifyBtn} onClick={handleUnverify}>Revoke Verification ⚠️</button>
              )}
              <button style={styles.removeBtn} onClick={handleRemove}>Remove Cafe</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  pageContainer: { minHeight: "100vh", backgroundColor: "#f8fafc", color: "#0f172a", position: "relative" },
  contentWrapper: { maxWidth: "1200px", margin: "0 auto", padding: "120px 24px" },
  topFlex: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" },
  heroTitle: { fontSize: "2.2rem", fontWeight: "800", margin: 0 },
  heroSubtitle: { color: "#64748b", fontSize: "1.1rem" },
  dateBadge: { backgroundColor: "white", padding: "8px 16px", borderRadius: "10px", fontSize: "0.9rem", border: "1px solid #e2e8f0" },
  metricsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "30px" },
  statCard: { backgroundColor: "white", padding: "24px", borderRadius: "20px", border: "1px solid #e2e8f0" },
  statLabel: { color: "#64748b", fontSize: "0.9rem", fontWeight: "600" },
  statValue: { fontSize: "1.8rem", fontWeight: "800" },
  statUnit: { fontSize: "1rem", color: "#94a3b8" },
  statChange: { color: "#10b981", fontSize: "0.85rem", fontWeight: "700" },
  analyticsGrid: { display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "24px", marginBottom: "30px" },
  mainChart: { backgroundColor: "white", padding: "24px", borderRadius: "24px", border: "1px solid #e2e8f0" },
  sideChart: { backgroundColor: "white", padding: "24px", borderRadius: "24px", border: "1px solid #e2e8f0" },
  cardTitle: { fontSize: "1.1rem", fontWeight: "700", margin: "0 0 20px 0" },
  tableCard: { backgroundColor: "white", borderRadius: "24px", border: "1px solid #e2e8f0", overflow: "hidden" },
  tableHeader: { padding: "24px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9" },
  viewAllBtn: { color: "#6366f1", background: "none", border: "none", fontWeight: "700", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" },
  thRow: { backgroundColor: "#f8fafc" },
  th: { padding: "16px 24px", textAlign: "left", fontSize: "0.85rem", color: "#64748b", textTransform: "uppercase" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "16px 24px", fontSize: "0.95rem" },
  tdName: { padding: "16px 24px", fontWeight: "700" },
  scoreBadge: { backgroundColor: "#f1f5f9", padding: "4px 8px", borderRadius: "6px" },
  statusVerified: { color: "#10b981", backgroundColor: "#ecfdf5", padding: "4px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "700" },
  statusPending: { color: "#f59e0b", backgroundColor: "#fffbeb", padding: "4px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "700" },
  actionBtn: { padding: "6px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#0f172a", color: "white", cursor: "pointer", fontWeight: "600", transition: "all 0.2s" },

  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modalCard: { backgroundColor: "white", padding: "30px", borderRadius: "20px", width: "100%", maxWidth: "480px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" },
  closeModalBtn: { background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748b" },
  modalDetails: { backgroundColor: "#f8fafc", padding: "15px", borderRadius: "10px", marginBottom: "20px", fontSize: "0.95rem", lineHeight: "1.6" },
  certificateBox: { border: "1px dashed #cbd5e1", padding: "15px", borderRadius: "10px", marginBottom: "25px", backgroundColor: "#f8fafc" },
  
  docItem: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.95rem", padding: "8px 0", borderBottom: "1px solid #e2e8f0" },
  previewBtn: { padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "white", color: "#0f172a", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "5px" },
  
  modalActions: { display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" },
  verifyBtn: { padding: "10px 20px", borderRadius: "8px", border: "none", backgroundColor: "#10b981", color: "white", cursor: "pointer", fontWeight: "600" },
  unverifyBtn: { padding: "10px 20px", borderRadius: "8px", border: "none", backgroundColor: "teal", color: "white", cursor: "pointer", fontWeight: "600" },
  removeBtn: { padding: "10px 20px", borderRadius: "8px", border: "1px solid #ef4444", backgroundColor: "white", color: "#ef4444", cursor: "pointer", fontWeight: "600" }
};