"use client"; 

import { useRouter, useSearchParams } from "next/navigation"; 
import { useState, useEffect, Suspense } from "react"; // 🟢 FIX 1: Suspense import kiya
import { useSession } from "next-auth/react"; 
import Navbar from "../../Components/Navbar"; 
import Footer from "../../Components/Footer"; 

// 🟢 FIX 2: Original function ka naam badal kar DashboardContent kar diya
function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const { data: session } = useSession();
  
  const userName = session?.user?.name;

  const [activeTab, setActiveTab] = useState("home"); 
  const [points, setPoints] = useState(350);
  const [savedCafes, setSavedCafes] = useState([]);
  const [history, setHistory] = useState([]);
  const [availableDeals, setAvailableDeals] = useState([]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!userName) return;

    const storedPoints = localStorage.getItem(`points_${userName}`);
    if (storedPoints) setPoints(parseInt(storedPoints));

    const storedSaved = JSON.parse(localStorage.getItem(`saved_${userName}`));
    if (storedSaved) setSavedCafes(storedSaved);
    else setSavedCafes([{ id: 1, name: "Green Leaf Cafe", score: 92 }, { id: 2, name: "Sustainable Sip", score: 95 }]);

    const storedHistory = JSON.parse(localStorage.getItem(`history_${userName}`));
    if (storedHistory) setHistory(storedHistory);
    else setHistory([{ id: 1001, item: "Organic Coffee", cafe: "Eco Brew Hub", date: "Oct 24", pointsEarned: 10 }]);

    let realDeals = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("deals_")) {
        const ownerName = key.split("_")[1];
        const ownerDeals = JSON.parse(localStorage.getItem(key)) || [];
        ownerDeals.forEach(deal => {
          realDeals.push({ ...deal, cafeName: `${ownerName.toUpperCase()}'s Cafe` });
        });
      }
    }

    if (realDeals.length === 0) {
      realDeals = [
        { id: 901, item: "Vegan Wrap (2 left)", discount: "40% OFF", cafeName: "Green Leaf Cafe" },
        { id: 902, item: "Surplus Muffins", discount: "50% OFF", cafeName: "Eco Brew Hub" }
      ];
    }
    setAvailableDeals(realDeals);

  }, [userName]);

  const handleClaimDeal = (deal) => {
    if (window.confirm(`Do you want to claim ${deal.item} from ${deal.cafeName}?`)) {
      setAvailableDeals(availableDeals.filter(d => d.id !== deal.id));

      const newHistoryItem = {
        id: Date.now(),
        item: deal.item,
        cafe: deal.cafeName,
        date: new Date().toLocaleDateString(),
        pointsEarned: 50
      };
      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem(`history_${userName}`, JSON.stringify(updatedHistory));

      const newPoints = points + 50;
      setPoints(newPoints);
      localStorage.setItem(`points_${userName}`, newPoints);

      alert("🎉 Deal Claimed Successfully! +50 Eco Points earned.");
    }
  };

  const handleRemoveCafe = (cafeId) => {
    const updatedCafes = savedCafes.filter(c => c.id !== cafeId);
    setSavedCafes(updatedCafes);
    localStorage.setItem(`saved_${userName}`, JSON.stringify(updatedCafes));
  };

  if (!userName) return null; 

  return (
    <div style={styles.pageContainer}>
      <Navbar />

      <div style={styles.contentWrapper}>
        <div style={styles.dashboardContainer}>
          
          {activeTab !== "home" && (
            <button onClick={() => router.push("/user-dashboard?tab=home")} style={styles.backBtn}>
              ← Back to Profile
            </button>
          )}

          {activeTab === "home" && (
            <>
              <div style={styles.profileHeader}>
                <div style={styles.avatar}>
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </div>
                <h2 style={styles.userName}>{userName}</h2>
                <div style={styles.pointsBadge}>⭐ {points} Eco Points</div>
              </div>

              <div style={styles.menuCard}>
                <button style={styles.menuItem} onClick={() => router.push("/")}>
                  <div style={styles.iconBox}>🔍</div>
                  <div style={styles.menuText}>
                    <strong style={styles.menuTitle}>Explore Cafes</strong>
                    <span style={styles.menuSub}>Find sustainable spots near you</span>
                  </div>
                  <span style={styles.arrow}>➔</span>
                </button>

                <button style={styles.menuItem} onClick={() => router.push("/user-dashboard?tab=deals")}>
                  <div style={styles.iconBox}>🍱</div>
                  <div style={styles.menuText}>
                    <strong style={styles.menuTitle}>Live Surplus Deals</strong>
                    <span style={styles.menuSub}>Grab discounted food & save waste</span>
                  </div>
                  <span style={styles.badge}>{availableDeals.length} New</span>
                </button>

                <button style={styles.menuItem} onClick={() => router.push("/user-dashboard?tab=saved")}>
                  <div style={styles.iconBox}>💚</div>
                  <div style={styles.menuText}>
                    <strong style={styles.menuTitle}>Saved Cafes</strong>
                    <span style={styles.menuSub}>Your favorite eco-friendly spots</span>
                  </div>
                  <span style={styles.arrow}>➔</span>
                </button>

                <button style={{ ...styles.menuItem, borderBottom: "none" }} onClick={() => router.push("/user-dashboard?tab=history")}>
                  <div style={styles.iconBox}>📜</div>
                  <div style={styles.menuText}>
                    <strong style={styles.menuTitle}>Activity & History</strong>
                    <span style={styles.menuSub}>Track your past orders and impact</span>
                  </div>
                  <span style={styles.arrow}>➔</span>
                </button>
              </div>
            </>
          )}

          {activeTab === "deals" && (
            <div style={styles.tabSection}>
              <h2 style={styles.sectionTitle}>🍱 Active Food Alerts</h2>
              {availableDeals.length === 0 ? (
                <div style={styles.emptyState}>No active deals right now. Check back later!</div>
              ) : (
                availableDeals.map(deal => (
                  <div key={deal.id} style={styles.dealCard}>
                    <div style={styles.dealHeader}>
                      <div>
                        <h3 style={styles.dealItem}>{deal.item}</h3>
                        <p onClick={() => router.push(`/cafe/${deal.cafeName}`)} style={styles.dealCafe}>
                          📍 {deal.cafeName}
                        </p>
                      </div>
                      <span style={styles.discountBadge}>{deal.discount}</span>
                    </div>
                    <button onClick={() => handleClaimDeal(deal)} style={styles.claimBtn}>
                      Claim & Save Food (+50 Pts)
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "saved" && (
            <div style={styles.tabSection}>
              <h2 style={styles.sectionTitle}>💚 My Saved Cafes</h2>
              {savedCafes.length === 0 ? (
                <div style={styles.emptyState}>You haven't saved any cafes yet.</div>
              ) : (
                savedCafes.map(cafe => (
                  <div key={cafe.id} style={styles.savedCard}>
                    <div>
                      <strong onClick={() => router.push(`/cafe/${cafe.name}`)} style={styles.savedName}>
                        {cafe.name}
                      </strong>
                      <span style={styles.savedScore}>⭐ Eco Score: {cafe.score}</span>
                    </div>
                    <button onClick={() => handleRemoveCafe(cafe.id)} style={styles.removeBtn}>
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div style={styles.tabSection}>
              <h2 style={styles.sectionTitle}>📜 My Impact History</h2>
              {history.length === 0 ? (
                <div style={styles.emptyState}>No activity yet. Start claiming deals to save the planet!</div>
              ) : (
                history.map(item => (
                  <div key={item.id} style={styles.historyCard}>
                    <div>
                      <h4 style={styles.historyItem}>{item.item}</h4>
                      <p style={styles.historyMeta}>{item.cafe} • {item.date}</p>
                    </div>
                    <span style={styles.pointsGained}>+{item.pointsEarned} Pts</span>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
}

// 🟢 FIX 3: Naya component banaya jo originally export hoga aur Suspense provide karega
export default function UserDashboard() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "100px", fontSize: "1.2rem", color: "#00bfa5", marginTop: "100px" }}>Loading your dashboard... 🌿</div>}>
      <DashboardContent />
    </Suspense>
  );
}

const styles = {
  pageContainer: { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f4f7f6", fontFamily: "'Inter', sans-serif" },
  contentWrapper: { flex: 1, padding: "100px 20px 60px 20px" },
  dashboardContainer: { maxWidth: "650px", margin: "0 auto", width: "100%" },
  backBtn: { background: "white", color: "#00bfa5", border: "1px solid #00bfa5", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: "bold", fontSize: "0.95rem", marginBottom: "25px", display: "inline-flex", alignItems: "center", transition: "all 0.2s" },
  profileHeader: { textAlign: "center", marginBottom: "40px", backgroundColor: "white", padding: "40px", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" },
  avatar: { width: "85px", height: "85px", borderRadius: "50%", backgroundColor: "#00bfa5", color: "white", fontSize: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 15px auto", border: "4px solid #f0fdfa", boxShadow: "0 10px 20px rgba(0, 191, 165, 0.2)" },
  userName: { color: "#0f172a", margin: "0 0 10px 0", fontSize: "1.8rem", fontWeight: "800", letterSpacing: "-0.5px" },
  pointsBadge: { display: "inline-block", backgroundColor: "#fef3c7", color: "#d97706", padding: "8px 20px", borderRadius: "30px", fontWeight: "800", fontSize: "1.1rem", boxShadow: "0 4px 10px rgba(217, 119, 6, 0.15)" },
  menuCard: { backgroundColor: "white", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", overflow: "hidden" },
  menuItem: { width: "100%", display: "flex", alignItems: "center", padding: "20px 25px", backgroundColor: "white", border: "none", borderBottom: "1px solid #f1f5f9", cursor: "pointer", transition: "background 0.2s", textAlign: "left" },
  iconBox: { width: "45px", height: "45px", borderRadius: "12px", backgroundColor: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" },
  menuText: { flex: 1, marginLeft: "15px" },
  menuTitle: { display: "block", color: "#0f172a", fontSize: "1.1rem", fontWeight: "700", marginBottom: "3px" },
  menuSub: { color: "#64748b", fontSize: "0.9rem" },
  arrow: { color: "#cbd5e1", fontSize: "1.2rem", fontWeight: "bold" },
  badge: { backgroundColor: "#f5a623", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold" },
  tabSection: { animation: "fadeIn 0.3s ease" },
  sectionTitle: { color: "#0f172a", marginBottom: "25px", fontSize: "1.6rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "10px" },
  emptyState: { textAlign: "center", color: "#64748b", backgroundColor: "white", padding: "40px", borderRadius: "20px", fontSize: "1rem", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" },
  dealCard: { backgroundColor: "white", padding: "25px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", borderLeft: "6px solid #f5a623", marginBottom: "20px" },
  dealHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" },
  dealItem: { margin: "0 0 8px 0", color: "#0f172a", fontSize: "1.3rem", fontWeight: "800" },
  dealCafe: { margin: 0, color: "#475569", fontSize: "1rem", cursor: "pointer", fontWeight: "700", textDecoration: "underline" },
  discountBadge: { backgroundColor: "#fee2e2", color: "#ef4444", padding: "6px 14px", borderRadius: "12px", fontWeight: "800", fontSize: "0.95rem", border: "1px solid #fca5a5" },
  claimBtn: { width: "100%", padding: "14px", backgroundColor: "#f5a623", color: "white", border: "none", borderRadius: "14px", fontWeight: "800", cursor: "pointer", fontSize: "1.05rem", boxShadow: "0 4px 15px rgba(245, 166, 35, 0.3)", transition: "transform 0.1s" },
  savedCard: { display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", padding: "20px 25px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", marginBottom: "15px" },
  savedName: { display: "block", color: "#0f172a", fontSize: "1.15rem", cursor: "pointer", fontWeight: "800", textDecoration: "underline", marginBottom: "5px" },
  savedScore: { color: "#00bfa5", fontSize: "0.95rem", fontWeight: "700" },
  removeBtn: { background: "#fee2e2", color: "#ef4444", border: "none", padding: "10px 16px", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "0.9rem" },
  historyCard: { display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", padding: "20px 25px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", marginBottom: "15px", borderLeft: "6px solid #00bfa5" },
  historyItem: { margin: "0 0 5px 0", color: "#0f172a", fontSize: "1.1rem", fontWeight: "700" },
  historyMeta: { margin: 0, color: "#64748b", fontSize: "0.9rem" },
  pointsGained: { backgroundColor: "#f0fdfa", color: "#00bfa5", border: "1px solid #ccfbf1", padding: "8px 14px", borderRadius: "20px", fontWeight: "800", fontSize: "0.95rem" }
};