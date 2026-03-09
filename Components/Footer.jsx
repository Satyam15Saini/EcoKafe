"use client"; 

import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  // 🟢 NAYA LOGIC: Smart Scroll for Home & Browse Cafes
  const handleHomeClick = () => {
    if (window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  const handleBrowseClick = () => {
    if (window.location.pathname === "/") {
      document.getElementById("cafes-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/#cafes-section");
    }
  };

  return (
    <footer style={styles.footerContainer}>
      <div style={styles.gridContainer}>
        
        {/* Column 1: Brand & Logo Section */}
        <div style={styles.column}>
          <div style={styles.logoWrapper}>
            <img 
              src="/Logo.png" 
              alt="EcoKafe Logo" 
              style={styles.footerBrandLogo} 
            />
            <h3 style={styles.commonHeading}>EcoKafe</h3>
          </div>
          <p style={styles.brandText}>
            Connecting conscious consumers with sustainable cafes. Together, we're building a zero-waste future.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div style={styles.column}>
          <h3 style={styles.commonHeading}>Quick Links</h3>
          <ul style={styles.list}>
            {/* 🟢 FIXED: Ab ye properly scroll aur route karenge */}
            <li style={styles.listItem} onClick={handleHomeClick}>Home</li>
            <li style={styles.listItem} onClick={handleBrowseClick}>Browse Cafes</li>
            
            <li style={styles.listItem} onClick={() => router.push("/user-dashboard?tab=deals")}>Surplus Food</li>
            <li style={styles.listItem} onClick={() => router.push("/about")}>About Us</li>
          </ul>
        </div>

        {/* Column 3: For Cafe Owners */}
        <div style={styles.column}>
          <h3 style={styles.commonHeading}>For Cafe Owners</h3>
          <ul style={styles.list}>
            <li style={styles.listItem} onClick={() => router.push("/signup")}>Register Your Cafe</li>
            <li style={styles.listItem} onClick={() => router.push("/support")}>Partner Support</li>
            <li style={styles.listItem} onClick={() => router.push("/eco-standards")}>Eco-Standards</li>
          </ul>
        </div>

        {/* Column 4: Connect */}
        <div style={styles.column}>
          <h3 style={styles.commonHeading}>Connect</h3>
          <ul style={styles.list}>
            <li style={styles.listItem} onClick={() => router.push("/contact")}>Contact Us</li>
            <li style={styles.listItem} onClick={() => router.push("/privacy")}>Privacy Policy</li>
            <li style={styles.listItem} onClick={() => router.push("/terms")}>Terms of Service</li>
          </ul>
        </div>

      </div>

      {/* BOTTOM COPYRIGHT SECTION */}
      <div style={styles.bottomSection}>
        <div style={styles.copyrightWrapper}>
          <img 
            src="/Logo.png" 
            alt="EcoKafe Icon" 
            style={styles.tinyLogo} 
          />
          <p style={styles.copyrightText}>
            © 2026 EcoKafe. Built for a sustainable future.
          </p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footerContainer: {
    backgroundColor: "#0b1120", 
    color: "#e2e8f0",
    padding: "60px 20px 20px 20px",
    fontFamily: "'Inter', sans-serif", 
    marginTop: "auto"
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)", 
    gap: "30px",
    maxWidth: "1100px",
    margin: "0 auto 40px auto",
    alignItems: "start"
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    textAlign: "left"
  },
  logoWrapper: {
    display: "flex",
    alignItems: "center", 
    gap: "12px",
    marginBottom: "5px",
  },
  footerBrandLogo: {
    height: "40px",     
    width: "40px",
    borderRadius: "50%", 
    objectFit: "cover",
    border: "0.01px solid #00bfa5",
    backgroundColor: "white"
  },
  commonHeading: {
    color: "#00bfa5",
    fontSize: "1.2rem",
    fontWeight: "bold",
    margin: 0,           
    padding: 0,
    lineHeight: "1.2",
    display: "flex",
    alignItems: "center"
  },
  brandText: {
    color: "#cbd5e1",
    lineHeight: "1.6",
    fontSize: "0.9rem",
    margin: 0
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  listItem: {
    color: "#cbd5e1",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "color 0.2s ease"
  },
  bottomSection: {
    borderTop: "1px solid #1e293b",
    maxWidth: "1100px",
    margin: "0 auto",
    paddingTop: "20px",
    display: "flex",
    justifyContent: "center"
  },
  copyrightWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  tinyLogo: {
    height: "30px",     
    width: "30px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "0.01px solid #00bfa5",
    backgroundColor: "white"
  },
  copyrightText: {
    color: "#64748b",
    fontSize: "0.85rem",
    margin: 0
  }
};