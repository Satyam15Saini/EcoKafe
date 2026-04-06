"use client"; 

import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react"; 

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user ? { ...session.user, username: session.user.name } : null;

  const router = useRouter(); 
  const pathname = usePathname(); 
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const dropdownRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMobileMenuOpen(false); 
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false); 
    if (user?.role === "user") router.push("/user-dashboard?tab=home");
    else if (user?.role === "owner") router.push("/owner-dashboard");
    else router.push("/admin-dashboard");
  };

  const handleCafesClick = () => {
    setMobileMenuOpen(false);
    if (pathname === "/") {
      document.getElementById("cafes-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/");
      setTimeout(() => {
        document.getElementById("cafes-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your feedback! 💚");
    setFeedbackText("");
    setIsFeedbackOpen(false);
  };

  return (
    <>
      <nav style={styles.nav}>
        <div onClick={() => router.push("/")} style={styles.logoContainer}>
          <img src="/Logo.png" alt="EcoKafe Logo" style={styles.logoImage} />
          <span style={styles.logoText}>EcoKafe</span>
        </div>
        
        {isMobile && (
          <button style={styles.hamburgerBtn} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? "✖" : "☰"}
          </button>
        )}

        {!isMobile && (
          <div style={styles.navLinks}>
            <button onClick={() => router.push("/")} style={styles.link}>Home</button>
            <button onClick={handleCafesClick} style={styles.link}>Cafes</button>
            <button onClick={() => router.push("/about")} style={styles.link}>About</button>
            
            {/* 🟢 NAYA FIX: AI Recommendations Feature */}
            <button onClick={() => router.push("/ai-recommendations")} style={styles.link}>
              🤖 AI Guide
            </button>
            
            {/* 🟢 NAYA FIX: Navbar mein Login Guard laga diya */}
            <button onClick={() => {
              if (!user) {
                alert("Please log in to view Surplus Alerts! 🌿");
                router.push("/login");
              } else {
                router.push("/surplus-alerts");
              }
            }} style={styles.link}>
              🔔 Surplus Alerts
            </button>
            
            {!user ? (
              <button onClick={() => router.push("/login")} style={styles.loginBtn}>Login</button>
            ) : (
              <div ref={dropdownRef} style={{ position: "relative" }}>
                <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{...styles.avatar, boxShadow: dropdownOpen ? "0 0 0 3px rgba(0, 191, 165, 0.3)" : "none"}}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                {dropdownOpen && (
                  <div style={styles.dropdown}>
                    <div style={styles.userInfo}>
                      <div style={styles.headerAvatar}>{user.username.charAt(0).toUpperCase()}</div>
                      <div style={{ textAlign: "left" }}>
                        <div style={styles.userName}>{user.username}</div>
                        <div style={styles.userTag}>@{user.username.toLowerCase().replace(/\s/g, '')}</div>
                      </div>
                    </div>
                    <div style={styles.divider} />
                    <div onClick={handleProfileClick} style={styles.menuItem}>👤 My Profile</div>
                    <div onClick={() => { setDropdownOpen(false); setIsFeedbackOpen(true); }} style={styles.menuItem}>💬 Feedback</div>
                    <button onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: '/' }); }} style={styles.logoutBtn}>Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </nav>

      {isMobile && mobileMenuOpen && (
        <div style={styles.mobileMenu}>
          <button onClick={() => { setMobileMenuOpen(false); router.push("/"); }} style={styles.mobileLink}>Home</button>
          <button onClick={handleCafesClick} style={styles.mobileLink}>Cafes</button>
          <button onClick={() => { setMobileMenuOpen(false); router.push("/about"); }} style={styles.mobileLink}>About</button>
          
          {/* 🟢 NAYA FIX: Mobile menu mein bhi Login Guard laga diya */}
          <button onClick={() => { 
            setMobileMenuOpen(false); 
            if (!user) {
              alert("Please log in to view Surplus Alerts! 🌿");
              router.push("/login");
            } else {
              router.push("/surplus-alerts");
            }
          }} style={styles.mobileLink}>🔔 Surplus Alerts</button>
          
          <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(255,255,255,0.1)", margin: "15px 0" }}></div>
          
          {!user ? (
            <button onClick={() => { setMobileMenuOpen(false); router.push("/login"); }} style={styles.mobileLoginBtn}>Login</button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%", alignItems: "center" }}>
              <div style={styles.userInfoMobile}>
                <div style={styles.headerAvatar}>{user.username.charAt(0).toUpperCase()}</div>
                <div>
                  <div style={{...styles.userName, color: "white"}}>{user.username}</div>
                  <div style={styles.userTag}>@{user.username.toLowerCase().replace(/\s/g, '')}</div>
                </div>
              </div>
              <button onClick={handleProfileClick} style={styles.mobileLinkSecondary}>👤 My Profile</button>
              <button onClick={() => { setMobileMenuOpen(false); setIsFeedbackOpen(true); }} style={styles.mobileLinkSecondary}>💬 Feedback</button>
              <button onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }} style={styles.mobileLogoutBtn}>Logout</button>
            </div>
          )}
        </div>
      )}

      {isFeedbackOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={{ color: "#1b5e20", marginBottom: "15px" }}>💬 We Value Your Feedback</h3>
            <form onSubmit={handleFeedbackSubmit}>
              <textarea rows="4" value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="How can we improve EcoKafe?" required style={styles.textarea} />
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setIsFeedbackOpen(false)} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.submitBtn}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  nav: { display: "flex", justifyContent: "space-between", padding: "12px 25px", background: "rgba(28, 39, 56, 0.95)", backdropFilter: "blur(12px)", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100, boxSizing: "border-box", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)" },
  logoContainer: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", zIndex: 101 },
  logoImage: { height: "55px", width: "55px", borderRadius: "50%", objectFit: "cover", border: "2px solid #00bfa5", display: "block"},
  logoText: { fontSize: "1.7rem", fontWeight: "800", color: "#00bfa5", letterSpacing: "-0.5px" },
  navLinks: { display: "flex", gap: "30px", alignItems: "center" },
  link: { background: "none", color: "#f8fafc", border: "none", cursor: "pointer", fontSize: "0.95rem", fontWeight: "600", transition: "color 0.2s" },
  loginBtn: { background: "#00bfa5", color: "white", padding: "8px 22px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: "bold" },
  avatar: { width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#00bfa5", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", cursor: "pointer", border: "2px solid white", transition: "all 0.3s" },
  dropdown: { position: "absolute", top: "60px", right: "0", backgroundColor: "#ffffff", borderRadius: "16px", boxShadow: "0 15px 35px rgba(0,0,0,0.2)", width: "250px", padding: "16px", zIndex: 100, border: "1px solid #f1f5f9" },
  userInfo: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "5px" },
  headerAvatar: { width: "45px", height: "45px", borderRadius: "12px", backgroundColor: "#1b5e20", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: "bold" },
  userName: { fontWeight: "700", color: "#1e293b", fontSize: "1.05rem" },
  userTag: { color: "#64748b", fontSize: "0.8rem" },
  divider: { height: "1px", backgroundColor: "#f1f5f9", margin: "12px 0" },
  menuItem: { display: "flex", alignItems: "center", gap: "12px", padding: "10px", cursor: "pointer", borderRadius: "10px", transition: "background 0.2s", color: "#334155", fontWeight: "600", fontSize: "0.9rem" },
  logoutBtn: { marginTop: "12px", width: "100%", padding: "10px", backgroundColor: "#fff5f5", color: "#e11d48", border: "2px solid #ffe4e6", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "0.95rem", transition: "all 0.2s" },
  hamburgerBtn: { background: "none", border: "none", color: "white", fontSize: "1.8rem", cursor: "pointer", zIndex: 101 },
  mobileMenu: { position: "fixed", top: "68px", left: 0, width: "100%", height: "calc(100vh - 68px)", backgroundColor: "rgba(15, 23, 42, 0.98)", backdropFilter: "blur(10px)", zIndex: 99, display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", boxSizing: "border-box", gap: "20px", overflowY: "auto" },
  mobileLink: { background: "none", border: "none", color: "white", fontSize: "1.3rem", fontWeight: "700", cursor: "pointer" },
  mobileLinkSecondary: { background: "none", border: "none", color: "#cbd5e1", fontSize: "1.1rem", fontWeight: "600", cursor: "pointer" },
  mobileLoginBtn: { width: "100%", maxWidth: "250px", background: "#00bfa5", color: "white", padding: "15px", borderRadius: "12px", border: "none", fontSize: "1.1rem", fontWeight: "bold" },
  mobileLogoutBtn: { width: "100%", maxWidth: "250px", padding: "12px", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid #ef4444", borderRadius: "10px", fontWeight: "700", fontSize: "1rem" },
  userInfoMobile: { display: "flex", alignItems: "center", gap: "15px", marginBottom: "10px", backgroundColor: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "16px", width: "100%", maxWidth: "250px" },
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalBox: { backgroundColor: "white", padding: "30px", borderRadius: "16px", width: "90%", maxWidth: "400px" },
  textarea: { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #ddd", marginBottom: "20px", resize: "none" },
  cancelBtn: { background: "#f1f5f9", border: "none", padding: "10px 18px", borderRadius: "8px", cursor: "pointer" },
  submitBtn: { background: "#1b5e20", color: "white", border: "none", padding: "10px 18px", borderRadius: "8px", cursor: "pointer" }
};