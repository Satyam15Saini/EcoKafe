"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; 
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function SurplusAlertsFeed() {
  const router = useRouter();
  const { data: session } = useSession(); 
  const isOwner = session?.user?.role === "owner"; 

  const [groupedCafes, setGroupedCafes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let liveCafes = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith("deals_")) {
        const ownerName = key.split("_")[1]; 
        const ownerDeals = JSON.parse(localStorage.getItem(key)) || [];
        
        if (ownerDeals.length > 0) {
          liveCafes.push({
            cafeName: `${ownerName.toUpperCase()}'s Cafe`,
            image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=600",
            deals: ownerDeals 
          });
        }
      }
    }

    setGroupedCafes(liveCafes);
    setLoading(false);
  }, []);

  // 🟢 NAYA FIX: Security Check added for Card Click
  const handleCardClick = () => {
    if (!session?.user) {
      alert("Please log in to view and claim these deals! 🌿");
      router.push("/login");
    } else if (!isOwner) {
      router.push("/user-dashboard?tab=deals");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <Navbar />

      <div style={styles.heroSection}>
        <h1 style={styles.heroTitle}>🌍 Live Surplus Alerts</h1>
        <p style={styles.heroSubtitle}>Save delicious food from going to waste and earn Eco Points!</p>
      </div>

      <div style={styles.contentWrapper}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px", fontSize: "1.2rem", color: "#64748b" }}>
            Scanning for live deals... 🔍
          </div>
        ) : groupedCafes.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={{ fontSize: "3rem", display: "block", marginBottom: "15px" }}>🍃</span>
            <h3>No Active Deals Right Now</h3>
            <p>Cafes in your area have sold out their surplus food. Check back later!</p>
            <button onClick={() => router.push("/")} style={styles.backBtn}>Explore Cafes</button>
          </div>
        ) : (
          <div style={styles.gridContainer}>
            {groupedCafes.map((cafe, index) => (
              <div 
                key={index} 
                style={{
                  ...styles.dealCard, 
                  cursor: isOwner ? "not-allowed" : "pointer" 
                }}
                onClick={handleCardClick}
              >
                
                <div style={{...styles.cardImage, backgroundImage: `url(${cafe.image})`}}>
                  <div style={styles.activeDealsBadge}>{cafe.deals.length} Active Deals</div>
                </div>
                
                <div style={styles.cardBody}>
                  <h2 style={styles.cafeName}>📍 {cafe.cafeName}</h2>
                  
                  <p style={styles.summaryText}>
                    Tap to view {cafe.deals.length} delicious surplus items at heavily discounted prices!
                  </p>

                  {/* 🟢 NAYA FIX: 3-Way Authentication Check for Button */}
                  {!session?.user ? (
                    <button 
                      style={styles.claimBtn} 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        alert("Please log in to claim deals! 🌿"); 
                        router.push("/login"); 
                      }}
                    >
                      Login to Claim ➔
                    </button>
                  ) : isOwner ? (
                    <button disabled style={styles.disabledBtn} onClick={(e) => e.stopPropagation()}>
                      🔒 Owners Cannot Claim Deals
                    </button>
                  ) : (
                    <button style={styles.claimBtn}>
                      View Deals & Claim ➔
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  pageContainer: { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8fafc", fontFamily: "'Inter', sans-serif" },
  heroSection: { backgroundColor: "#1e293b", padding: "120px 20px 60px 20px", textAlign: "center", color: "white" },
  heroTitle: { fontSize: "2.8rem", fontWeight: "900", margin: "0 0 10px 0", letterSpacing: "-1px" },
  heroSubtitle: { color: "#cbd5e1", fontSize: "1.1rem" },
  contentWrapper: { flex: 1, maxWidth: "1200px", margin: "0 auto", padding: "40px 20px", width: "100%", boxSizing: "border-box" },
  
  gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px" },
  dealCard: { backgroundColor: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", transition: "transform 0.2s, box-shadow 0.2s" },
  cardImage: { height: "180px", backgroundSize: "cover", backgroundPosition: "center", position: "relative" },
  
  activeDealsBadge: { position: "absolute", top: "15px", right: "15px", backgroundColor: "#ef4444", color: "white", padding: "6px 14px", borderRadius: "10px", fontWeight: "800", fontSize: "0.95rem", boxShadow: "0 4px 10px rgba(239, 68, 68, 0.4)" },
  
  cardBody: { padding: "25px", textAlign: "center" },
  cafeName: { margin: "0 0 10px 0", fontSize: "1.5rem", fontWeight: "900", color: "#0f172a" },
  summaryText: { color: "#64748b", fontSize: "1.05rem", lineHeight: "1.5", marginBottom: "25px" },
  
  claimBtn: { width: "100%", backgroundColor: "#00bfa5", color: "white", border: "none", padding: "14px", borderRadius: "12px", fontSize: "1.05rem", fontWeight: "800", cursor: "pointer", boxShadow: "0 4px 15px rgba(0, 191, 165, 0.2)", transition: "background 0.2s" },
  disabledBtn: { width: "100%", backgroundColor: "#e2e8f0", color: "#94a3b8", border: "none", padding: "14px", borderRadius: "12px", fontSize: "1rem", fontWeight: "700", cursor: "not-allowed" },
  
  emptyState: { textAlign: "center", padding: "60px 20px", backgroundColor: "white", borderRadius: "24px", border: "1px dashed #cbd5e1" },
  backBtn: { marginTop: "20px", backgroundColor: "#1e293b", color: "white", border: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" }
};