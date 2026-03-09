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

  const router = useRouter();
  const { data: session, status } = useSession(); // 🟢 Check current session

  // 🟢 If user is already logged in, redirect them immediately
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      handleRedirect(session.user.role);
    }
  }, [status, session, router]);

  const handleRedirect = (role) => {
    if (role === "owner") {
      router.push("/owner-dashboard");
    } else if (role === "admin") {
      router.push("/admin-dashboard");
    } else {
      router.push("/user-dashboard");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🟢 Authenticate using NextAuth Credentials provider
      const res = await signIn("credentials", {
        redirect: false, // Prevent NextAuth's default redirect so we can handle it manually
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      // 🟢 Note: Because we set redirect: false, the page doesn't reload.
      // NextAuth updates the session context internally.
      // The useEffect above will catch the 'authenticated' state change and route the user!
      
      // We can also forcefully fetch the session just in case the hook is slow
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      
      if(sessionData?.user) {
          alert("🎉 Logged in successfully!");
          handleRedirect(sessionData.user.role);
      } else {
          // Fallback if session isn't immediately available
          router.refresh(); 
      }

    } catch (err) {
      console.error("Login Error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      // Only turn off loading if we didn't redirect
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <Navbar />

      <div style={styles.contentWrapper}>
        <div style={styles.loginCard}>
          <div style={styles.header}>
            <img src="/Logo.png" alt="EcoKafe Logo" style={styles.logoImage} />
            <h2 style={styles.title}>Welcome Back</h2>
            <p style={styles.subtitle}>Log in to claim surplus food and save the planet.</p>
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <button
              type="submit"
              disabled={loading || status === "loading"}
              style={{ ...styles.submitBtn, opacity: loading || status === "loading" ? 0.7 : 1 }}
            >
              {loading || status === "loading" ? "Logging In..." : "Log In"}
            </button>
          </form>

          <div style={styles.footerText}>
            Don't have an account?{" "}
            <Link href="/signup" style={styles.link}>
              Sign up here
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Styles remain completely unchanged
const styles = {
  pageContainer: { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f4f7f6", fontFamily: "'Inter', sans-serif" },
  contentWrapper: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 20px" },
  loginCard: { backgroundColor: "white", width: "100%", maxWidth: "450px", padding: "40px", borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" },
  header: { textAlign: "center", marginBottom: "30px" },
  logoImage: { height: "65px", width: "65px", borderRadius: "50%", objectFit: "cover", border: "2px solid #00bfa5", marginBottom: "15px", display: "inline-block" },
  title: { margin: "0 0 10px 0", fontSize: "1.8rem", fontWeight: "800", color: "#0f172a" },
  subtitle: { margin: 0, color: "#64748b", fontSize: "1rem" },
  errorBox: { backgroundColor: "#fee2e2", color: "#ef4444", padding: "12px", borderRadius: "10px", textAlign: "center", marginBottom: "20px", fontSize: "0.9rem", fontWeight: "600", border: "1px solid #fca5a5" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "0.9rem", color: "#334155", fontWeight: "700" },
  input: { padding: "14px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "1rem", color: "#0f172a", backgroundColor: "#f8fafc", outline: "none", transition: "border 0.2s" },
  submitBtn: { backgroundColor: "#00bfa5", color: "white", border: "none", padding: "16px", borderRadius: "12px", fontSize: "1.05rem", fontWeight: "bold", cursor: "pointer", marginTop: "10px", boxShadow: "0 4px 15px rgba(0, 191, 165, 0.2)", transition: "transform 0.1s" },
  footerText: { marginTop: "25px", textAlign: "center", color: "#64748b", fontSize: "0.95rem" },
  link: { color: "#00bfa5", fontWeight: "bold", textDecoration: "none" }
};