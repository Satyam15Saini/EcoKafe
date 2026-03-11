"use client"; 

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; 
import { useSession } from "next-auth/react"; // 🟢 FIX: Session import kiya taaki pata chale kis user ne rate kiya hai
import Navbar from "../../../Components/Navbar"; 
import Footer from "../../../Components/Footer"; 

const allCafes = [
  { id: 1, name: "Green Leaf Cafe", location: "Dehradun", lat: 30.3165, lng: 78.0322, features: ["Vegan Options", "Composting", "Solar Powered"], score: 92, rating: 4.8, distance: "1.2 km", surplus: true, image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1200", menuImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800", desc: "A pioneer in sustainable dining with 100% compostable packaging and locally sourced organic ingredients.", openTime: "08:00 AM - 10:00 PM" },
  { id: 2, name: "Earth Kitchen", location: "Delhi", lat: 28.6139, lng: 77.2090, features: ["Organic", "Zero Plastic"], score: 88, rating: 4.6, distance: "2.8 km", surplus: false, image: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&q=80&w=1200", menuImage: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800", desc: "Farm-to-table restaurant supporting local farmers and significantly reducing food miles.", openTime: "09:00 AM - 11:00 PM" },
  { id: 3, name: "Sustainable Sips", location: "Bangalore", lat: 12.9716, lng: 77.5946, features: ["Vegan Options", "Reusable Packaging"], score: 95, rating: 4.7, distance: "0.8 km", surplus: true, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=1200", menuImage: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=800", desc: "A cozy cafe with excellent coffee and a strict commitment to reusable packaging and zero waste.", openTime: "07:00 AM - 09:00 PM" },
  { id: 4, name: "The Roast Cafe", location: "Chandigarh", lat: 30.7333, lng: 76.7794, features: ["Vegan Options", "Composting"], score: 81, rating: 3.9, distance: "1.5 km", surplus: true, image: "https://plus.unsplash.com/premium_photo-1674327105074-46dd8319164b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", menuImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800", desc: "A small and comfortable café in Chandigarh known for its great coffee.", openTime: "08:00 AM - 11:00 PM" },
  { id: 5, name: "Himalayan Roots", location: "Roorkee", lat: 29.8543, lng: 77.8880, features: ["Organic", "Zero Plastic"], score: 85, rating: 4.5, distance: "3.2 km", surplus: false, image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600", menuImage: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800", desc: "A peaceful spot offering organic teas and locally sourced snacks.", openTime: "10:00 AM - 08:00 PM" },
  { id: 6, name: "Zero Waste Bites", location: "Mumbai", lat: 19.0760, lng: 72.8777, features: ["Vegan Options", "Surplus Available"], score: 90, rating: 4.9, distance: "5.0 km", surplus: true, image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=600", menuImage: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=800", desc: "Mumbai's premier zero-waste cafe, fighting food waste every day.", openTime: "09:00 AM - 12:00 AM" }
];

export default function CafeDetail() {
  const params = useParams(); 
  const router = useRouter(); 
  const { data: session } = useSession(); 
  const userName = session?.user?.name;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [guests, setGuests] = useState("2");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const cafeId = params?.id;
  const cafe = allCafes.find(c => c.id.toString() === cafeId);

  // 🟢 NAYA: Rating States
  const [ratingHover, setRatingHover] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [cafeStats, setCafeStats] = useState({ rating: cafe?.rating || 0, totalReviews: 12 });

  // 🟢 NAYA: Load ratings from LocalStorage when page opens
  useEffect(() => {
    if (!cafe) return;
    const storedRatings = JSON.parse(localStorage.getItem(`ratings_${cafe.id}`)) || [];
    
    if (storedRatings.length > 0) {
      const newTotalReviews = 12 + storedRatings.length;
      const userRatingsSum = storedRatings.reduce((sum, r) => sum + r.rating, 0);
      const baseRatingsSum = cafe.rating * 12; // Base dummy reviews
      const newAverage = (baseRatingsSum + userRatingsSum) / newTotalReviews;
      
      setCafeStats({ rating: newAverage.toFixed(1), totalReviews: newTotalReviews });

      if (userName) {
        const existingRating = storedRatings.find(r => r.username === userName);
        if (existingRating) setUserRating(existingRating.rating);
      }
    }
  }, [cafe, userName]);

  // 🟢 NAYA: Submit Rating Function
  const handleRate = (rateValue) => {
    if (!userName) {
      alert("Please log in to rate this cafe! 🌿");
      router.push("/login");
      return;
    }
    if (userRating > 0) return; // Already rated

    const storedRatings = JSON.parse(localStorage.getItem(`ratings_${cafe.id}`)) || [];
    const newRatings = [...storedRatings, { username: userName, rating: rateValue }];
    localStorage.setItem(`ratings_${cafe.id}`, JSON.stringify(newRatings));

    setUserRating(rateValue);

    // Update Live Average
    const newTotalReviews = 12 + newRatings.length;
    const userRatingsSum = newRatings.reduce((sum, r) => sum + r.rating, 0);
    const baseRatingsSum = cafe.rating * 12;
    const newAverage = (baseRatingsSum + userRatingsSum) / newTotalReviews;
    
    setCafeStats({ rating: newAverage.toFixed(1), totalReviews: newTotalReviews });
    alert(`Thank you! You rated ${cafe.name} ${rateValue} Stars. ⭐`);
  };

  const handleConfirmClaim = () => setIsClaimed(true); 
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setIsClaimed(false), 300); 
  };

  const handleGetDirections = () => {
    if (cafe && cafe.lat && cafe.lng) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${cafe.lat},${cafe.lng}`;
      window.open(mapsUrl, '_blank'); 
    } else if (cafe) {
      const query = encodeURIComponent(`${cafe.name}, ${cafe.location}`);
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
      window.open(mapsUrl, '_blank'); 
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if(!bookingDate || !bookingTime) {
      alert("Please select a date and time for your booking! 📅");
      return;
    }

    setIsProcessingPayment(true);
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsProcessingPayment(false);
      return;
    }

    const options = {
      key: "rzp_test_SO7JF1hwSrLE2x", 
      amount: "10000", 
      currency: "INR",
      name: "EcoKafe Booking",
      description: `Table Reservation at ${cafe.name}`,
      image: "https://cdn-icons-png.flaticon.com/512/755/755051.png",
      handler: function (response) {
        alert(`🎉 Booking Confirmed at ${cafe.name}!\nPayment ID: ${response.razorpay_payment_id}\nSee you on ${bookingDate} at ${bookingTime}.`);
        setIsProcessingPayment(false);
      },
      prefill: {
        name: "EcoKafe User",
        email: "user@ecokafe.com",
        contact: "9999999999",
      },
      hidden: {
        contact: true,
        email: true
      },
      theme: {
        color: "#00bfa5",
      },
      modal: {
        ondismiss: function() {
          setIsProcessingPayment(false);
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  if (!cafe) {
    return (
        <div style={styles.pageContainer}>
            <Navbar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '80px' }}>
                <h2>Oops! Cafe details not found. 🌿</h2>
                <button onClick={() => router.push("/")} style={styles.primaryBtn}>Go back Home</button>
            </div>
            <Footer />
        </div>
    )
  }

  return (
    <div style={styles.pageContainer}>
      <Navbar />
      <div style={styles.contentWrapper}>
        <button onClick={() => router.back()} style={styles.backBtn}>← Back to Results</button>
        <div style={{ ...styles.heroBanner, backgroundImage: `url(${cafe.image})` }}>
          <div style={styles.overlay}></div>
          <div style={styles.bannerContent}>
            <div style={styles.badgeWrapper}>
              {cafe.surplus && <span style={styles.surplusBadge}>🍱 Surplus Available</span>}
              <span style={styles.scoreBadge}>🌱 AI Score: {cafe.score}/100</span>
            </div>
            <h1 style={styles.cafeName}>{cafe.name}</h1>
            {/* 🟢 FIX: Rating ab dynamically stats se aayegi */}
            <p style={styles.cafeLocation}>📍 {cafe.location} • ⭐ {cafeStats.rating} ({cafeStats.totalReviews} Reviews) • ({cafe.distance})</p>
          </div>
        </div>

        <div style={styles.gridContainer}>
          <div style={styles.mainInfo}>
            <h2 style={styles.sectionTitle}>About this Cafe</h2>
            <p style={styles.description}>{cafe.desc}</p>
            <h3 style={styles.subTitle}>Eco-Friendly Features</h3>
            <div style={styles.featuresList}>
              {cafe.features.map((feature, index) => <span key={index} style={styles.featureTag}>✓ {feature}</span>)}
            </div>

            {/* 🟢 NAYA: Rating Section UI */}
            <div style={styles.ratingSection}>
              <h3 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>Rate Your Experience</h3>
              <div style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      ...styles.star,
                      color: star <= (ratingHover || userRating) ? "#f5a623" : "#cbd5e1",
                      cursor: userRating ? "default" : "pointer"
                    }}
                    onMouseEnter={() => !userRating && setRatingHover(star)}
                    onMouseLeave={() => !userRating && setRatingHover(0)}
                    onClick={() => handleRate(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p style={styles.reviewText}>
                {userRating 
                  ? `Thank you! You rated this cafe ${userRating} stars.` 
                  : "Click a star to submit your rating."}
              </p>
            </div>

          </div>

          <div style={styles.actionCard}>
            <h3 style={styles.subTitle}>Plan Your Visit</h3>
            <p style={{ color: "#64748b", marginBottom: "20px" }}>🕒 Hours: {cafe.openTime}</p>
            
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <button style={{ ...styles.primaryBtn, marginBottom: 0, flex: 1 }} onClick={handleGetDirections}>🗺️ Directions</button>
              <button style={{ ...styles.secondaryBtn, flex: 1 }} onClick={() => setIsMenuOpen(true)}>📄 View Menu</button>
            </div>

            <div style={styles.bookingBox}>
              <h4 style={{ margin: "0 0 15px 0", color: "#1e293b", fontSize: "1.1rem" }}>🗓️ Book a Table</h4>
              <input 
                type="date" 
                value={bookingDate} 
                onChange={(e) => setBookingDate(e.target.value)} 
                style={styles.inputField} 
                min={new Date().toISOString().split('T')[0]} 
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "10px", marginBottom: "15px" }}>
                
                <select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} style={styles.inputField}>
                  <option value="">Time Slot</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                  <option value="08:00 PM">08:00 PM</option>
                  <option value="10:00 PM">10:00 PM</option>
                </select>

                <select value={guests} onChange={(e) => setGuests(e.target.value)} style={styles.inputField}>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="6+">6+ Guests</option>
                </select>
              </div>
              <button onClick={handlePayment} disabled={isProcessingPayment} style={styles.payBtn}>
                {isProcessingPayment ? "Processing..." : "Pay ₹100 to Reserve"}
              </button>
            </div>
            
            {cafe.surplus ? (
              <div style={styles.surplusBox}>
                <h4 style={{ margin: "0 0 10px 0", color: "#b45309" }}>Surplus Food Alert!</h4>
                <p style={{ margin: "0 0 15px 0", fontSize: "0.9rem", color: "#d97706" }}>Grab high-quality leftover food at 50% off and help prevent food waste.</p>
                <button style={styles.surplusBtn} onClick={() => setIsModalOpen(true)}>Claim Surplus Now</button>
              </div>
            ) : (
              <p style={styles.noSurplusText}>No surplus food available today.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />

      {isMenuOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsMenuOpen(false)}>
          <div style={styles.menuModalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", padding: "0 20px", marginTop: "20px" }}>
              <h2 style={{ margin: 0, color: "#1e293b" }}>{cafe.name} - Menu</h2>
              <button onClick={() => setIsMenuOpen(false)} style={styles.closeBtn}>✖</button>
            </div>
            <div style={{ width: "100%", height: "70vh", backgroundImage: `url(${cafe.menuImage})`, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}></div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            {!isClaimed ? (
              <>
                <div style={styles.modalIcon}>🍱</div>
                <h2 style={styles.modalTitle}>Confirm Your Claim</h2>
                <p style={styles.modalText}>Are you sure you want to claim the surplus food from <strong>{cafe.name}</strong> at a 50% discount?</p>
                <div style={styles.modalActions}>
                  <button onClick={closeModal} style={styles.cancelBtn}>Cancel</button>
                  <button onClick={handleConfirmClaim} style={styles.confirmBtn}>Yes, Claim It</button>
                </div>
              </>
            ) : (
              <>
                <div style={styles.modalIconSuccess}>🎉</div>
                <h2 style={styles.modalTitle}>Claim Successful!</h2>
                <p style={styles.modalText}>Your order is reserved at <strong>{cafe.name}</strong>. Show your confirmation email at the counter within the next hour.</p>
                <button onClick={closeModal} style={styles.successBtn}>Done</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  pageContainer: { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8fafc", fontFamily: "'Inter', sans-serif" },
  contentWrapper: { flex: 1, maxWidth: "1200px", margin: "0 auto", padding: "100px 20px 60px 20px", width: "100%", boxSizing: "border-box" },
  backBtn: { background: "none", border: "none", color: "#64748b", fontSize: "1rem", cursor: "pointer", marginBottom: "20px", fontWeight: "bold", padding: 0 },
  heroBanner: { height: "400px", borderRadius: "24px", backgroundSize: "cover", backgroundPosition: "center", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8))" },
  bannerContent: { position: "relative", zIndex: 1, padding: "40px", width: "100%" },
  badgeWrapper: { display: "flex", gap: "10px", marginBottom: "15px", flexWrap: "wrap" },
  surplusBadge: { backgroundColor: "#f5a623", color: "white", padding: "6px 14px", borderRadius: "30px", fontSize: "0.9rem", fontWeight: "bold" },
  scoreBadge: { backgroundColor: "#00bfa5", color: "white", padding: "6px 14px", borderRadius: "30px", fontSize: "0.9rem", fontWeight: "bold" },
  cafeName: { color: "white", fontSize: "3rem", fontWeight: "800", margin: "0 0 10px 0", letterSpacing: "-1px" },
  cafeLocation: { color: "#e2e8f0", fontSize: "1.1rem", margin: 0 },
  gridContainer: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "40px", marginTop: "40px", alignItems: "start" },
  mainInfo: { backgroundColor: "white", padding: "40px", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" },
  sectionTitle: { color: "#1e293b", fontSize: "1.8rem", marginTop: 0, marginBottom: "20px", fontWeight: "800" },
  description: { color: "#475569", fontSize: "1.1rem", lineHeight: "1.8", marginBottom: "30px" },
  subTitle: { color: "#1e293b", fontSize: "1.3rem", marginBottom: "15px", fontWeight: "700" },
  featuresList: { display: "flex", flexWrap: "wrap", gap: "12px" },
  featureTag: { backgroundColor: "#f1f5f9", color: "#334155", padding: "8px 16px", borderRadius: "8px", fontSize: "0.95rem", fontWeight: "600" },
  actionCard: { backgroundColor: "white", padding: "30px", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", position: "sticky", top: "100px" },
  
  // 🟢 NAYA: Rating styles
  ratingSection: { backgroundColor: "#f8fafc", padding: "25px", borderRadius: "16px", marginTop: "30px", border: "1px dashed #cbd5e1", textAlign: "center" },
  starsContainer: { display: "flex", gap: "8px", justifyContent: "center", fontSize: "2.5rem", marginBottom: "10px" },
  star: { transition: "color 0.2s, transform 0.2s" },
  reviewText: { color: "#64748b", fontSize: "0.95rem", margin: 0 },

  primaryBtn: { backgroundColor: "#1e293b", color: "white", border: "none", padding: "12px", borderRadius: "10px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer", transition: "background 0.2s" },
  secondaryBtn: { backgroundColor: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1", padding: "12px", borderRadius: "10px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" },
  
  bookingBox: { backgroundColor: "#f8fafc", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0", marginBottom: "20px" },
  inputField: { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem", outline: "none" },
  payBtn: { width: "100%", backgroundColor: "#3b82f6", color: "white", border: "none", padding: "12px", borderRadius: "10px", fontSize: "1.05rem", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 10px rgba(59, 130, 246, 0.3)" },
  
  surplusBox: { backgroundColor: "#fffbeb", border: "1px solid #fde68a", padding: "20px", borderRadius: "16px", marginTop: "10px" },
  surplusBtn: { width: "100%", backgroundColor: "#f5a623", color: "white", border: "none", padding: "14px", borderRadius: "12px", fontSize: "1.05rem", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 10px rgba(245, 166, 35, 0.3)", transition: "transform 0.1s" },
  noSurplusText: { textAlign: "center", color: "#94a3b8", fontSize: "0.9rem", margin: "20px 0 0 0", padding: "15px", backgroundColor: "#f8fafc", borderRadius: "12px" },
  
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalBox: { backgroundColor: "white", padding: "40px", borderRadius: "24px", width: "90%", maxWidth: "450px", textAlign: "center", boxShadow: "0 25px 50px rgba(0,0,0,0.15)", animation: "fadeIn 0.3s ease" },
  menuModalBox: { backgroundColor: "white", borderRadius: "24px", width: "90%", maxWidth: "800px", overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.25)" },
  closeBtn: { background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#64748b" },
  
  modalIcon: { fontSize: "3rem", marginBottom: "15px" },
  modalIconSuccess: { fontSize: "3rem", marginBottom: "15px", color: "#00bfa5" },
  modalTitle: { margin: "0 0 15px 0", color: "#1e293b", fontSize: "1.6rem", fontWeight: "800" },
  modalText: { color: "#64748b", lineHeight: "1.6", marginBottom: "30px", fontSize: "1.05rem" },
  modalActions: { display: "flex", gap: "15px", justifyContent: "center" },
  cancelBtn: { flex: 1, backgroundColor: "#f1f5f9", color: "#475569", border: "none", padding: "12px", borderRadius: "12px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer" },
  confirmBtn: { flex: 1, backgroundColor: "#f5a623", color: "white", border: "none", padding: "12px", borderRadius: "12px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 10px rgba(245, 166, 35, 0.3)" },
  successBtn: { width: "100%", backgroundColor: "#00bfa5", color: "white", border: "none", padding: "14px", borderRadius: "12px", fontSize: "1.05rem", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 10px rgba(0, 191, 165, 0.3)" }
};