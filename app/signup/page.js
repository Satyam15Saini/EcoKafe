"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import Link from "next/link"; 
import { signIn } from "next-auth/react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [step, setStep] = useState("signup"); // "signup" or "verify-otp"
  const [signupEmail, setSignupEmail] = useState("");
  
  const router = useRouter();

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []); 

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        // Move to OTP verification step
        setSignupEmail(email);
        setStep("verify-otp");
        setOtp("");
        setLoading(false);
      } else {
        setError(data.message || "Registration failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError("Failed to connect to the server.");
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        // OTP verified, now auto-login
        const signInRes = await signIn("credentials", {
          redirect: false,
          email: signupEmail,
          password,
        });

        if (signInRes?.error) {
          setError("OTP verified, but login failed. Please go to Login page.");
          setLoading(false);
          return;
        }

        alert("🎉 Email verified! Welcome to EcoKafe.");

        if (role === "admin") {
          router.push("/admin-dashboard");
        } else if (role === "owner") {
          router.push("/owner-dashboard");
        } else {
          router.push("/user-dashboard");
        }
      } else {
        setError(data.message || "OTP verification failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      setError("Failed to verify OTP. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <Navbar />

      <div style={isMobile ? {...styles.contentWrapper, padding: "50px 15px 30px 15px"} : styles.contentWrapper}>
        <div style={isMobile ? {...styles.signupCard, padding: "20px"} : styles.signupCard}>
          <div style={isMobile ? {...styles.header, marginBottom: "15px"} : styles.header}>
            <img src="/Logo.png" alt="EcoKafe Logo" style={isMobile ? {...styles.logoImage, height: "45px", width: "45px"} : styles.logoImage} />
            <h2 style={isMobile ? {...styles.title, fontSize: "1.3rem", margin: "0 0 5px 0"} : styles.title}>Join EcoKafe</h2>
            <p style={isMobile ? {...styles.subtitle, fontSize: "0.85rem"} : styles.subtitle}>Create an account to reduce food waste.</p>
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          {step === "signup" ? (
            <form onSubmit={handleSignup} style={isMobile ? {...styles.form, gap: "12px"} : styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rahul Sharma" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                  style={isMobile ? {...styles.input, fontSize: "16px", padding: "10px 12px"} : styles.input} 
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  style={isMobile ? {...styles.input, fontSize: "16px", padding: "10px 12px"} : styles.input} 
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input 
                  type="password" 
                  placeholder="Create a strong password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  style={isMobile ? {...styles.input, fontSize: "16px", padding: "10px 12px"} : styles.input} 
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>I want to join as a:</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  style={isMobile ? {...styles.selectInput, fontSize: "16px", padding: "10px 12px"} : styles.selectInput} 
                >
                  <option value="user">User</option>
                  <option value="owner">Cafe Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                style={isMobile ? { ...styles.submitBtn, opacity: loading ? 0.7 : 1, padding: "12px", fontSize: "0.95rem" } : { ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} style={isMobile ? {...styles.form, gap: "12px"} : styles.form}>
              <div style={{textAlign: "center", marginBottom: "15px"}}>
                <p style={{color: "#64748b", margin: "0 0 5px 0"}}>Verification code sent to</p>
                <p style={{fontWeight: "600", color: "#0f172a", margin: 0}}>{signupEmail}</p>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Enter 6-Digit OTP</label>
                <input 
                  type="text" 
                  placeholder="000000" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value.slice(0, 6))} 
                  maxLength="6"
                  required 
                  style={isMobile ? {...styles.input, fontSize: "16px", padding: "10px 12px", textAlign: "center", letterSpacing: "4px", fontWeight: "bold"} : {...styles.input, textAlign: "center", letterSpacing: "4px", fontWeight: "bold"}} 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || otp.length !== 6} 
                style={isMobile ? { ...styles.submitBtn, opacity: loading || otp.length !== 6 ? 0.7 : 1, padding: "12px", fontSize: "0.95rem" } : { ...styles.submitBtn, opacity: loading || otp.length !== 6 ? 0.7 : 1 }}
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>

              <p style={{textAlign: "center", color: "#94a3b8", fontSize: "0.85rem", marginTop: "15px"}}>
                Didn't receive the code? Check spam folder or try signing up again.
              </p>
            </form>
          )}

          <div style={isMobile ? {...styles.footerText, fontSize: "0.85rem"} : styles.footerText}>
            Already have an account?{" "}
            <Link href="/login" style={styles.link}>
              Log in here
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  pageContainer: { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f4f7f6", fontFamily: "'Inter', sans-serif" },
  contentWrapper: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px 20px 20px" },
  signupCard: { backgroundColor: "white", width: "100%", maxWidth: "420px", padding: "30px", borderRadius: "20px", boxShadow: "0 15px 35px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" },
  header: { textAlign: "center", marginBottom: "15px" },
  logoImage: { height: "50px", width: "50px", borderRadius: "50%", objectFit: "cover", border: "2px solid #00bfa5", marginBottom: "10px", display: "inline-block" },
  title: { margin: "0 0 5px 0", fontSize: "1.5rem", fontWeight: "800", color: "#0f172a" },
  subtitle: { margin: 0, color: "#64748b", fontSize: "0.9rem" },
  errorBox: { backgroundColor: "#fee2e2", color: "#ef4444", padding: "10px", borderRadius: "8px", textAlign: "center", marginBottom: "15px", fontSize: "0.85rem", fontWeight: "600", border: "1px solid #fca5a5" },
  

  
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "4px" },
  label: { fontSize: "0.85rem", color: "#334155", fontWeight: "700" },
  input: { padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "0.95rem", color: "#0f172a", backgroundColor: "#f8fafc", outline: "none", transition: "border 0.2s" },
  selectInput: { padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "0.95rem", color: "#0f172a", backgroundColor: "#f8fafc", outline: "none", cursor: "pointer", appearance: "none" },
  submitBtn: { backgroundColor: "#00bfa5", color: "white", border: "none", padding: "12px", borderRadius: "10px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer", marginTop: "5px", boxShadow: "0 4px 15px rgba(0, 191, 165, 0.2)", transition: "transform 0.1s" },
  footerText: { marginTop: "15px", textAlign: "center", color: "#64748b", fontSize: "0.9rem" },
  link: { color: "#00bfa5", fontWeight: "bold", textDecoration: "none" }
};