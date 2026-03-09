"use client"; 

import React, { useState, useEffect } from "react"; 
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; 
import Navbar from "../Components/Navbar"; 
import Footer from "../Components/Footer"; 
import { GoogleGenerativeAI } from "@google/generative-ai"; 

const allCafesDatabase = [
  { id: 1, name: "Green Leaf Cafe", location: "Dehradun", features: ["Vegan Options", "Composting"], score: 92, rating: 4.8, distance: "1.2 km", surplus: true, image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600", desc: "A pioneer in sustainable dining with 100% compostable packaging and locally sourced organic ingredients." },
  { id: 2, name: "Earth Kitchen", location: "Delhi", features: ["Organic", "Zero Plastic"], score: 88, rating: 4.6, distance: "2.8 km", surplus: false, image: "https://images.unsplash.com/photo-1559305616-3f99cd43e353?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", desc: "Farm-to-table restaurant supporting local farmers and significantly reducing food miles." },
  { id: 3, name: "Sustainable Sips", location: "Bangalore", features: ["Vegan Options", "Reusable Packaging"], score: 95, rating: 4.7, distance: "0.8 km", surplus: true, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600", desc: "A cozy cafe with excellent coffee and a strict commitment to reusable packaging and zero waste." },
  { id: 4, name: "The Roast Cafe", location: "Chandigarh", features: ["Vegan Options", "Composting"], score: 81, rating: 3.9, distance: "1.5 km", surplus: true, image: "https://plus.unsplash.com/premium_photo-1674327105074-46dd8319164b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", desc: "A small and comfortable café in Chandigarh known for its great coffee. The Roast Cafe focuses on being eco-friendly by offering vegan food options, composting waste, and using reusable packaging to reduce waste." },
  { id: 5, name: "Himalayan Roots", location: "Roorkee", features: ["Organic", "Zero Plastic"], score: 85, rating: 4.5, distance: "3.2 km", surplus: false, image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600", desc: "A peaceful spot offering organic teas and locally sourced snacks, completely free from single-use plastics." },
  { id: 6, name: "Zero Waste Bites", location: "Mumbai", features: ["Vegan Options", "Surplus Available"], score: 90, rating: 4.9, distance: "5.0 km", surplus: true, image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=600", desc: "Mumbai's premier zero-waste cafe, fighting food waste every day by distributing surplus to the needy." }
];

const availableFilters = [
  { label: "High Sustainability", icon: "🌱" },
  { label: "Surplus Available", icon: "🍱" },
  { label: "Vegan Options", icon: "🥗" },
  { label: "Organic", icon: "🥦" }
];

export default function Home() {
  const [locationQuery, setLocationQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [savedCafes, setSavedCafes] = useState([]);
  
  const [displayCafes, setDisplayCafes] = useState(allCafesDatabase);
  const [isAILoading, setIsAILoading] = useState(false);
  
  const router = useRouter(); 
  const { data: session } = useSession(); 
  
  // 🟢 FIX: Infinite loop issue resolved. Only depending on a string value now.
  const userName = session?.user?.name;

  useEffect(() => {
    if (userName) {
      const storedSaved = JSON.parse(localStorage.getItem(`saved_${userName}`)) || [];
      setSavedCafes(storedSaved);
    }
  }, [userName]);

  const fetchAIRecommendations = async () => {
    if (activeFilters.length === 0 && searchQuery === "" && locationQuery === "") {
        setDisplayCafes(allCafesDatabase);
        return;
    }
    
    setIsAILoading(true);
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY); 
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        You are an API that ONLY returns valid JSON arrays. Do not add markdown like \`\`\`json.
        Task: Filter these cafes based on: Location="${locationQuery}", Search="${searchQuery}", Features="${activeFilters.join(", ")}".
        Database: ${JSON.stringify(allCafesDatabase)}
        Return ONLY a JSON array of matching cafe objects.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      
      let cleanJsonStr = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const startIdx = cleanJsonStr.indexOf('[');
      const endIdx = cleanJsonStr.lastIndexOf(']');
      if (startIdx !== -1 && endIdx !== -1) {
          cleanJsonStr = cleanJsonStr.substring(startIdx, endIdx + 1);
      }
      setDisplayCafes(JSON.parse(cleanJsonStr));

    } catch (error) {
      console.log("AI Filtering Failed Exact Error:", error); 
      
      const manualFiltered = allCafesDatabase.filter(cafe => {
        const matchLocation = locationQuery === "" || cafe.location.toLowerCase().includes(locationQuery.toLowerCase());
        
        const matchSearch = searchQuery === "" || 
          cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          cafe.desc.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchFeatures = activeFilters.every(f => 
          cafe.features.includes(f) || 
          (f === "High Sustainability" && cafe.score >= 90) ||
          (f === "Surplus Available" && cafe.surplus)
        );

        return matchLocation && matchSearch && matchFeatures;
      });
      setDisplayCafes(manualFiltered);
      
    } finally {
      setIsAILoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAIRecommendations();
    }, 800); 
    return () => clearTimeout(delayDebounceFn);
  }, [activeFilters, searchQuery, locationQuery]);

  const handleToggleSave = (e, cafe) => {
    e.stopPropagation();
    if (!userName) {
      alert("Please log in to save your favorite cafes! 🌿");
      router.push("/login");
      return;
    }
    const storageKey = `saved_${userName}`;
    let currentSaved = [...savedCafes];
    const isSaved = currentSaved.some(c => c.id === cafe.id);

    if (isSaved) {
      currentSaved = currentSaved.filter(c => c.id !== cafe.id);
    } else {
      currentSaved.push({ id: cafe.id, name: cafe.name, score: cafe.score });
    }
    setSavedCafes(currentSaved);
    localStorage.setItem(storageKey, JSON.stringify(currentSaved));
  };

  const toggleFilter = (filterLabel) => {
    setActiveFilters(prev => prev.includes(filterLabel) ? prev.filter(f => f !== filterLabel) : [...prev, filterLabel]);
  };

  const handleSearch = () => {
    document.getElementById("cafes-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ backgroundColor: "#f8fafd", minHeight: "100vh", fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      <div style={{ flex: 1, paddingBottom: "60px" }}>
        <div className="hero-section" style={{ paddingBottom: "40px", marginTop: "85px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px", marginBottom: "10px", paddingTop: "20px" }}>
            <img src="/Logo.png" alt="EcoKafe Logo" style={{ height: "65px", width: "65px", borderRadius: "50%", objectFit: "cover", backgroundColor: "white", border: "2px solid #00bfa5" }} />
            <h1 className="hero-title" style={{ margin: 0, marginTop: 0 }}>EcoKafe</h1>
          </div>
          <p className="hero-subtitle" style={{ textAlign: "center" }}>Real AI-Powered Sustainable Cafe Recommendations.</p>
          
          <div style={{ display: "flex", gap: "15px", width: "85%", maxWidth: "800px", marginTop: "20px", flexWrap: "wrap", justifyContent: "center", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", backgroundColor: "white", padding: "12px 20px", borderRadius: "12px", flex: "1", minWidth: "220px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
              <span style={{ fontSize: "1.2rem", color: "#ff5722" }}>📍</span>
              <input type="text" placeholder="Location..." value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} style={{ border: "none", outline: "none", width: "100%", fontSize: "1.05rem", color: "#333", marginLeft: "10px" }} />
            </div>

            <div style={{ display: "flex", alignItems: "center", backgroundColor: "white", padding: "12px 20px", borderRadius: "12px", flex: "2", minWidth: "300px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
              <input type="text" placeholder="Search cafes, eco-features..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} style={{ border: "none", outline: "none", width: "100%", fontSize: "1.05rem", color: "#333" }} />
              <span onClick={handleSearch} style={{ fontSize: "1.3rem", cursor: "pointer", marginLeft: "10px" }} title="Search">🔍</span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px 20px" }}>
          <div style={{ marginBottom: "40px" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "10px", color: "#222", fontSize: "1.2rem", marginBottom: "15px" }}>🎯 Filter by Preferences</h3>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {availableFilters.map(filter => {
                const isActive = activeFilters.includes(filter.label);
                return (
                  <button
                    key={filter.label} onClick={() => toggleFilter(filter.label)}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "30px", border: isActive ? "none" : "1px solid #ddd", backgroundColor: isActive ? "#00bfa5" : "white", color: isActive ? "white" : "#555", fontSize: "0.95rem", fontWeight: isActive ? "bold" : "normal", cursor: "pointer", boxShadow: isActive ? "0 4px 10px rgba(0, 191, 165, 0.3)" : "none", transition: "all 0.2s" }}
                  >
                    <span>{filter.icon}</span> {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div id="cafes-section">
            <h3 style={{ display: "flex", alignItems: "center", gap: "10px", color: "#222", fontSize: "1.4rem", marginBottom: "25px" }}>🤖 Real-time AI Recommended Cafes</h3>
            {isAILoading ? (
              <div style={{ textAlign: "center", padding: "50px", color: "#00bfa5", fontSize: "1.2rem", fontWeight: "bold" }}>
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite", fontSize: "2rem" }}>⚙️</span>
                <p>AI is analyzing the best cafes for you...</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
                {displayCafes.length > 0 ? (
                  displayCafes.map((cafe) => {
                    const isSaved = savedCafes.some(c => c.id === cafe.id);
                    return (
                      <div 
                        key={cafe.id} onClick={() => router.push(`/cafe/${cafe.id}`)}
                        style={{ backgroundColor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", cursor: "pointer", transition: "transform 0.2s" }}
                      >
                        <div style={{ height: "180px", position: "relative", backgroundColor: cafe.bgColor || "#eee", backgroundImage: cafe.image ? `url(${cafe.image})` : "none", backgroundSize: "cover", backgroundPosition: "center" }}>
                          {cafe.surplus && (
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/surplus-alerts/${cafe.id}`); 
                              }}
                              style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#f5a623", color: "white", padding: "5px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", zIndex: 10 }}
                            >
                              🍱 Surplus Available
                            </div>
                          )}
                          <div 
                            onClick={(e) => handleToggleSave(e, cafe)} 
                            style={{ position: "absolute", top: "12px", right: "12px", width: "32px", height: "32px", borderRadius: "50%", backgroundColor: isSaved ? "#fee2e2" : "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10 }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "#ef4444" : "none"} stroke={isSaved ? "#ef4444" : "#94a3b8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                          </div>
                          <div style={{ position: "absolute", bottom: "12px", right: "12px", backgroundColor: "white", color: "#00bfa5", padding: "5px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold" }}>🌱 {cafe.score}/100</div>
                        </div>
                        <div style={{ padding: "20px" }}>
                          <h3 style={{ margin: "0 0 10px 0", color: "#222", fontSize: "1.25rem" }}>{cafe.name}</h3>
                          <div style={{ display: "flex", alignItems: "center", gap: "15px", color: "#666", fontSize: "0.9rem", marginBottom: "12px" }}>
                            <span>⭐ {cafe.rating}</span><span>📍 {cafe.distance}</span>
                          </div>
                          <p style={{ margin: 0, color: "#777", fontSize: "0.95rem", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{cafe.desc}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#666", padding: "40px", backgroundColor: "white", borderRadius: "12px" }}>AI couldn't find a perfect match. Try different filters! 🌿</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}