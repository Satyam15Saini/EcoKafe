"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useSession } from "next-auth/react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function OwnerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter(); 
  
  // 🟢 FIX 1: Sirf string extract kar rahe hain (No object creation inside component body)
  const userName = session?.user?.name;

  const [itemName, setItemName] = useState("");
  const [discount, setDiscount] = useState("");
  const [deals, setDeals] = useState([]);

  // 🟢 FIX 2: Check status for redirect (Best practice for NextAuth)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 🟢 FIX 3: LocalStorage logic ab sirf 'userName' string par depend karega
  useEffect(() => {
    if (!userName) return;
    
    const storedDeals = JSON.parse(localStorage.getItem(`deals_${userName}`)) || [];
    setDeals(storedDeals);
  }, [userName]); // Removed 'router' and 'user' object from dependencies

  const handlePublish = (e) => {
    e.preventDefault();
    if (!itemName || !discount || !userName) return;

    let finalDiscount = discount.trim();
    if (/^\d+$/.test(finalDiscount)) {
      finalDiscount = `${finalDiscount}% OFF`;
    }

    const newDeal = {
      id: Date.now(),
      item: itemName,
      discount: finalDiscount,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedDeals = [newDeal, ...deals];
    setDeals(updatedDeals);
    localStorage.setItem(`deals_${userName}`, JSON.stringify(updatedDeals));

    setItemName("");
    setDiscount("");
  };

  const handleSoldOut = (id) => {
    const updatedDeals = deals.filter(d => d.id !== id);
    setDeals(updatedDeals);
    localStorage.setItem(`deals_${userName}`, JSON.stringify(updatedDeals));
  };

  // Wait for session to load
  if (status === "loading" || !userName) return null;

  return (
    <div style={styles.pageContainer}>
      <Navbar />

      <div style={styles.contentWrapper}>
        <div style={styles.topFlex}>
          <div>
            <h1 style={styles.heroTitle}>🏪 {userName}'s Portal</h1>
            <p style={styles.heroSubtitle}>Track your surplus inventory and environmental impact.</p>
          </div>
          <div style={styles.dateBadge}>Business Status: Active 🟢</div>
        </div>

        <div style={styles.metricsRow}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Active Surplus Deals</p>
            <h2 style={styles.statValue}>{deals.length}</h2>
            <p style={styles.statChange}>Live on platform</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Food Waste Recovered</p>
            <h2 style={styles.statValue}>42.5 <span style={styles.statUnit}>kg</span></h2>
            <p style={styles.statChange}>↑ 8% this week</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Estimated Savings</p>
            <h2 style={styles.statValue}>₹4,200</h2>
            <p style={{ ...styles.statChange, color: '#10b981' }}>Recovered Revenue</p>
          </div>
        </div>

        <div style={styles.gridContainer}>
          <div style={styles.glassCard}>
            <h2 style={styles.cardTitle}>Publish New Alert</h2>
            <p style={styles.cardSubtitle}>Instantly notify nearby eco-conscious customers.</p>

            <form onSubmit={handlePublish} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Item Name</label>
                <input type="text" placeholder="e.g. 5 Paneer Patties" value={itemName} onChange={(e) => setItemName(e.target.value)} style={styles.input} required />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Discount Value</label>
                <input type="text" placeholder="e.g. 70" value={discount} onChange={(e) => setDiscount(e.target.value)} style={styles.input} required />
              </div>

              <button type="submit" style={styles.publishBtn}>
                Publish Deal
              </button>
            </form>
          </div>

          <div style={styles.inventorySection}>
            <h2 style={styles.cardTitle}>Live Inventory Status</h2>
            {deals.length === 0 ? (
              <div style={styles.emptyState}>No active broadcasts. Start saving food!</div>
            ) : (
              <div style={styles.dealsList}>
                {deals.map(deal => (
                  <div key={deal.id} style={styles.dealItem}>
                    <div style={styles.dealInfo}>
                      <h4 style={styles.itemName}>{deal.item}</h4>
                      <div style={styles.itemMeta}>
                        <span style={styles.discountTag}>{deal.discount}</span>
                        <span style={styles.timeTag}>🕒 {deal.time}</span>
                      </div>
                    </div>
                    <button onClick={() => handleSoldOut(deal.id)} style={styles.soldBtn}>
                      Mark Sold
                    </button>
                  </div>
                ))}
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
  pageContainer: { minHeight: "100vh", backgroundColor: "#f8fafc", color: "#0f172a" },
  contentWrapper: { maxWidth: "1200px", margin: "0 auto", padding: "120px 24px" },
  topFlex: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" },
  heroTitle: { fontSize: "2.2rem", fontWeight: "800", margin: 0, letterSpacing: "-1px" },
  heroSubtitle: { color: "#64748b", fontSize: "1.1rem", margin: "5px 0 0 0" },
  dateBadge: { backgroundColor: "white", padding: "8px 16px", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "700", color: "#10b981", border: "1px solid #e2e8f0" },
  metricsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "30px" },
  statCard: { backgroundColor: "white", padding: "24px", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" },
  statLabel: { color: "#64748b", fontSize: "0.9rem", fontWeight: "600", marginBottom: "10px" },
  statValue: { fontSize: "1.8rem", fontWeight: "800", margin: 0 },
  statUnit: { fontSize: "1rem", color: "#94a3b8" },
  statChange: { fontSize: "0.85rem", fontWeight: "500", marginTop: "8px", color: "#64748b" },
  gridContainer: { display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "30px", alignItems: "start" },
  glassCard: { backgroundColor: "white", padding: "35px", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" },
  cardTitle: { fontSize: "1.3rem", fontWeight: "800", margin: "0 0 10px 0" },
  cardSubtitle: { color: "#64748b", fontSize: "0.95rem", marginBottom: "30px" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "0.9rem", fontWeight: "700", color: "#334155" },
  input: { padding: "14px", borderRadius: "12px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", fontSize: "1rem", outline: "none" },
  publishBtn: { backgroundColor: "#f5a623", color: "white", border: "none", padding: "16px", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "800", cursor: "pointer", boxShadow: "0 4px 12px rgba(245, 166, 35, 0.2)" },
  inventorySection: { backgroundColor: "white", padding: "30px", borderRadius: "24px", border: "1px solid #e2e8f0" },
  dealsList: { display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" },
  dealItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px", borderRadius: "16px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" },
  itemName: { margin: "0 0 5px 0", fontSize: "1.1rem", fontWeight: "700" },
  itemMeta: { display: "flex", gap: "12px", alignItems: "center" },
  discountTag: { color: "#ef4444", fontWeight: "800", fontSize: "0.9rem", backgroundColor: "#fee2e2", padding: "2px 8px", borderRadius: "6px" },
  timeTag: { color: "#94a3b8", fontSize: "0.85rem", fontWeight: "600" },
  soldBtn: { backgroundColor: "white", border: "1px solid #e2e8f0", padding: "8px 16px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", color: "#64748b" },
  emptyState: { padding: "40px", textAlign: "center", color: "#94a3b8", border: "2px dashed #e2e8f0", borderRadius: "20px" }
};