"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react"; // 🟢 Import NextAuth hooks
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession(); // 🟢 Check current session

  // 🟢 If user is already logged in, redirect them immediately
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      handleRedirect(session.user.role);
    }
  }, [status, session, router]);

  // 🟢 Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleRedirect = (role) => {
    if (role === "owner") {
      router.push("/owner-dashboard");
    } else if (role === "admin") {
      router.push("/admin-dashboard");
    } else {
      router.push("/user-dashboard");
    }
  };

  // Standard Email/Password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🟢 Authenticate using NextAuth Credentials provider
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      
      if(sessionData?.user) {
          handleRedirect(sessionData.user.role);
      } else {
          router.refresh(); 
      }

    } catch (err) {
      console.error("Login Error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Send OTP for email login
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login-with-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to send OTP");
        return;
      }

      alert("Check your email for the 6-digit OTP code.");
    } catch (err) {
      console.error("OTP Error:", err);
      setError("Failed to send OTP. Please try again.");
    }
  };

  // Google OAuth
  const handleGoogleLogin = async () => {
    await signIn("google", { redirect: false });
  };

  const responsiveStyles = isMobile ? {
    contentWrapper: { ...styles.contentWrapper, padding: "60px 15px" },
    loginCard: { ...styles.loginCard, padding: "24px" },
    title: { ...styles.title, fontSize: "1.4rem" },
    logoImage: { ...styles.logoImage, height: "50px", width: "50px" },
    googleBtn: { ...styles.googleBtn, padding: "12px 14px", fontSize: "0.95rem" },

    submitBtn: { ...styles.submitBtn, padding: "14px", fontSize: "1rem" },
    input: { ...styles.input, fontSize: "16px", padding: "12px 14px" },
  } : styles;

  return (
    <div style={styles.pageContainer}>
      <Navbar />

      <div style={responsiveStyles.contentWrapper}>
        <div style={responsiveStyles.loginCard}>
          <div style={responsiveStyles.header}>
            <img src="/Logo.png" alt="EcoKafe Logo" style={responsiveStyles.logoImage} />
            <h2 style={responsiveStyles.title}>Welcome Back</h2>
            <p style={responsiveStyles.subtitle}>Log in to claim surplus food and save the planet.</p>
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          {/* OAuth Buttons */}
          <div style={responsiveStyles.oauthSection}>
            <button
              type="button"
              onClick={handleGoogleLogin}
              style={responsiveStyles.googleBtn}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: "10px" }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div style={styles.divider} />

          {/* Password Login Form */}
          <form onSubmit={handleLogin} style={responsiveStyles.form}>
              <div style={responsiveStyles.inputGroup}>
                <label style={responsiveStyles.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={responsiveStyles.input}
                />
              </div>

              <div style={responsiveStyles.inputGroup}>
                <label style={responsiveStyles.label}>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={responsiveStyles.input}
                />
              </div>

              <button
                type="submit"
                disabled={loading || status === "loading"}
                style={{ ...responsiveStyles.submitBtn, opacity: loading || status === "loading" ? 0.7 : 1 }}
              >
                {loading || status === "loading" ? "Logging In..." : "Log In"}
              </button>
            </form>

          <div style={responsiveStyles.footerText}>
            Don't have an account?{" "}
            <Link href="/signup" style={responsiveStyles.link}>
              Sign up here
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Styles
const styles = {
  pageContainer: { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f4f7f6", fontFamily: "'Inter', sans-serif" },
  contentWrapper: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 20px" },
  loginCard: { backgroundColor: "white", width: "100%", maxWidth: "450px", padding: "40px", borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" },
  header: { textAlign: "center", marginBottom: "30px" },
  logoImage: { height: "65px", width: "65px", borderRadius: "50%", objectFit: "cover", border: "2px solid #00bfa5", marginBottom: "15px", display: "inline-block" },
  title: { margin: "0 0 10px 0", fontSize: "1.8rem", fontWeight: "800", color: "#0f172a" },
  subtitle: { margin: 0, color: "#64748b", fontSize: "1rem" },
  errorBox: { backgroundColor: "#fee2e2", color: "#ef4444", padding: "12px", borderRadius: "10px", textAlign: "center", marginBottom: "20px", fontSize: "0.9rem", fontWeight: "600", border: "1px solid #fca5a5" },
  
  // OAuth Section
  oauthSection: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" },
  googleBtn: { 
    backgroundColor: "white", 
    color: "#1f2937", 
    border: "1px solid #d1d5db", 
    padding: "14px 16px", 
    borderRadius: "12px", 
    fontSize: "1rem", 
    fontWeight: "600", 
    cursor: "pointer", 
    transition: "all 0.2s", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    "&:hover": { backgroundColor: "#f9fafb", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }
  },

  
  divider: { height: "1px", backgroundColor: "#e2e8f0", margin: "20px 0" },
  // Tab Container
  tabContainer: { display: "none", gap: "10px", marginBottom: "20px" },
  tab: { flex: 1, padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "600", transition: "all 0.2s" },
  
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "0.9rem", color: "#334155", fontWeight: "700" },
  input: { padding: "14px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "1rem", color: "#0f172a", backgroundColor: "#f8fafc", outline: "none", transition: "border 0.2s" },
  submitBtn: { backgroundColor: "#00bfa5", color: "white", border: "none", padding: "16px", borderRadius: "12px", fontSize: "1.05rem", fontWeight: "bold", cursor: "pointer", marginTop: "10px", boxShadow: "0 4px 15px rgba(0, 191, 165, 0.2)", transition: "transform 0.1s" },
  secondaryBtn: { backgroundColor: "transparent", color: "#00bfa5", border: "1px solid #00bfa5", padding: "12px", borderRadius: "12px", fontSize: "0.95rem", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" },
  footerText: { marginTop: "25px", textAlign: "center", color: "#64748b", fontSize: "0.95rem" },
  link: { color: "#00bfa5", fontWeight: "bold", textDecoration: "none" }
};