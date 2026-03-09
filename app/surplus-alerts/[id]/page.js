"use client"; 

import React from "react";
import { useParams, useRouter } from "next/navigation"; 
import Navbar from "../../../Components/Navbar"; 
import Footer from "../../../Components/Footer"; 

const allCafes = [
  { id: 1, name: "Green Leaf Cafe", surplusItems: "2x Veg Sandwich, 3x Muffins", originalPrice: "₹400", discountedPrice: "₹150", pickupTime: "08:00 PM - 09:30 PM", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1200" },
  { id: 3, name: "Sustainable Sips", surplusItems: "1x Cold Brew, 2x Croissant", originalPrice: "₹550", discountedPrice: "₹200", pickupTime: "07:30 PM - 09:00 PM", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=1200" },
  { id: 4, name: "The Roast Cafe", surplusItems: "4x Bagels, 1x Pasta Portion", originalPrice: "₹700", discountedPrice: "₹250", pickupTime: "09:00 PM - 10:30 PM", image: "https://plus.unsplash.com/premium_photo-1674327105074-46dd8319164b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 6, name: "Zero Waste Bites", surplusItems: "3x Salads, 2x Fresh Juice", originalPrice: "₹600", discountedPrice: "₹220", pickupTime: "10:00 PM - 11:30 PM", image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=600" }
];

export default function SurplusAlertDetail() {
  const params = useParams(); 
  const router = useRouter(); 
  const cafeId = params?.id;
  
  const alertData = allCafes.find(c => c.id.toString() === cafeId);

  if (!alertData) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8fafc" }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <h2>No active surplus alerts for this cafe right now. 🍃</h2>
          <button onClick={() => router.back()} style={{ padding: "10px 20px", backgroundColor: "#0f172a", color: "white", borderRadius: "8px", border: "none", cursor: "pointer", marginTop: "15px" }}>Go Back</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8fafc" }}>
      <Navbar />
      <div style={{ flex: 1, maxWidth: "800px", margin: "0 auto", padding: "100px 20px 60px 20px", width: "100%" }}>
        
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#64748b", fontSize: "1rem", cursor: "pointer", marginBottom: "20px", fontWeight: "bold" }}>← Back</button>

        <div style={{ backgroundColor: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "2px solid #fde68a" }}>
          <div style={{ backgroundColor: "#f5a623", color: "white", padding: "15px 20px", textAlign: "center", fontWeight: "bold", fontSize: "1.2rem" }}>
            🚨 Live Surplus Alert from {alertData.name}
          </div>
          
          <div style={{ height: "250px", backgroundImage: `url(${alertData.image})`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
          
          <div style={{ padding: "30px" }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#0f172a" }}>Available Items:</h3>
            <p style={{ fontSize: "1.2rem", color: "#334155", backgroundColor: "#f1f5f9", padding: "15px", borderRadius: "10px" }}>{alertData.surplusItems}</p>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "25px", padding: "20px", borderTop: "1px dashed #cbd5e1", borderBottom: "1px dashed #cbd5e1" }}>
              <div>
                <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>Original Price</p>
                <p style={{ margin: "5px 0 0 0", color: "#94a3b8", fontSize: "1.2rem", textDecoration: "line-through" }}>{alertData.originalPrice}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, color: "#b45309", fontSize: "0.9rem", fontWeight: "bold" }}>Surplus Price</p>
                <p style={{ margin: "5px 0 0 0", color: "#10b981", fontSize: "1.8rem", fontWeight: "900" }}>{alertData.discountedPrice}</p>
              </div>
            </div>

            <div style={{ marginTop: "25px", backgroundColor: "#fffbeb", padding: "15px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.5rem" }}>🕒</span>
              <div>
                <p style={{ margin: 0, fontWeight: "bold", color: "#b45309" }}>Pickup Window</p>
                <p style={{ margin: 0, color: "#d97706" }}>{alertData.pickupTime} (Today)</p>
              </div>
            </div>

            <button onClick={() => alert("Surplus Claimed! Your order ID is #ECO" + Math.floor(Math.random() * 10000))} style={{ width: "100%", backgroundColor: "#0f172a", color: "white", padding: "16px", borderRadius: "12px", border: "none", fontSize: "1.1rem", fontWeight: "bold", marginTop: "30px", cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
              Reserve & Claim Now
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}