"use client";

import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const allCafes = [
  { id: 1, name: "Green Leaf Cafe", location: "Dehradun", features: ["Vegan Options", "Composting", "Solar Powered"], score: 92, surplus: true },
  { id: 2, name: "Earth Kitchen", location: "Delhi", features: ["Organic", "Zero Plastic"], score: 88, surplus: false },
  { id: 3, name: "Sustainable Sips", location: "Bangalore", features: ["Vegan Options", "Reusable Packaging"], score: 95, surplus: true },
  { id: 4, name: "The Roast Cafe", location: "Chandigarh", features: ["Vegan Options", "Composting"], score: 81, surplus: true },
  { id: 5, name: "Himalayan Roots", location: "Roorkee", features: ["Organic", "Zero Plastic"], score: 85, surplus: false },
  { id: 6, name: "Zero Waste Bites", location: "Mumbai", features: ["Vegan Options", "Surplus Available"], score: 90, surplus: true }
];

const quickChips = ["Surplus food today 🍱", "Highest AI score 🌱", "Veg cafes in Dehradun 📍"];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false); 
  const [isHovered, setIsHovered] = useState(false); // 🟢 NAYA: Hover track karne ke liye state
  
  const [messages, setMessages] = useState([
    { role: "EcoBot", text: "Hi! I'm EcoBot 🌿. Ask me anything, or try using the mic! 🎤" }
  ]);
  
  const messagesEndRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Oops! Your browser doesn't support Voice Search. Try Chrome. 🎤");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSend = async (textToSend = input) => {
    if (!textToSend.trim()) return;
    
    setInput("");
    setMessages((prev) => [...prev, { role: "User", text: textToSend }]);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      // 🟢 Latest Active Model
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const conversationHistory = messages.map(m => `${m.role}: ${m.text}`).join("\n");

      const prompt = `
        You are EcoBot, a helpful AI for the EcoKafe platform.
        Database: ${JSON.stringify(allCafes)}
        
        Rules:
        1. Keep answers short, friendly, and use emojis.
        2. Based on the Chat History, remember the context of the conversation.
        3. VERY IMPORTANT: If you mention a cafe, ALWAYS provide a markdown link to it using this exact format: [Cafe Name](/cafe/CAFE_ID). Example: [Green Leaf Cafe](/cafe/1)
        4. If they ask about surplus food, provide the claim link: [Claim Surplus at Cafe Name](/surplus-alerts/CAFE_ID).
        5. ALWAYS format lists clearly. Put EACH cafe on a NEW LINE.
        
        Chat History:
        ${conversationHistory}
        
        User: "${textToSend}"
        EcoBot:
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      setMessages((prev) => [...prev, { role: "EcoBot", text: response.text() }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prev) => [...prev, { role: "EcoBot", text: "Oops! My AI servers are resting. Try again! 🔄" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTextWithLinks = (text) => {
    let formattedText = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #00bfa5; text-decoration: none; font-weight: bold;">$1</a>');
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); 
    formattedText = formattedText.replace(/\n/g, '<br/>'); 
    formattedText = formattedText.replace(/\*\s/g, '• '); 
    
    return <span dangerouslySetInnerHTML={{ __html: formattedText }} style={{ lineHeight: '1.6' }} />;
  };

  return (
    <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 9999 }}>
      
      {isOpen && (
        <div style={{ width: "360px", height: "520px", backgroundColor: "white", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", overflow: "hidden", marginBottom: "15px", border: "1px solid #e2e8f0" }}>
          
          {/* Header */}
          <div style={{ backgroundColor: "#0f172a", color: "white", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.5rem" }}>🤖</span>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem" }}>EcoBot AI</h3>
                <span style={{ fontSize: "0.75rem", color: "#10b981" }}>● Online</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "white", fontSize: "1.2rem", cursor: "pointer" }}>✖</button>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: "20px", overflowY: "auto", backgroundColor: "#f8fafc", display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ alignSelf: msg.role === "User" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                <div style={{ backgroundColor: msg.role === "User" ? "#00bfa5" : "white", color: msg.role === "User" ? "white" : "#334155", padding: "12px 16px", borderRadius: "16px", borderBottomRightRadius: msg.role === "User" ? "4px" : "16px", borderBottomLeftRadius: msg.role === "EcoBot" ? "4px" : "16px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", border: msg.role === "EcoBot" ? "1px solid #e2e8f0" : "none", fontSize: "0.95rem", lineHeight: "1.5" }}>
                  {formatTextWithLinks(msg.text)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: "flex-start", backgroundColor: "white", padding: "10px 15px", borderRadius: "16px", borderBottomLeftRadius: "4px", border: "1px solid #e2e8f0", color: "#94a3b8", fontSize: "0.9rem" }}>
                EcoBot is thinking... 🧠
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div style={{ padding: "10px 15px", backgroundColor: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", gap: "8px", overflowX: "auto", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
            {quickChips.map((chip, idx) => (
              <button key={idx} onClick={() => handleSend(chip)} style={{ backgroundColor: "white", border: "1px solid #cbd5e1", color: "#475569", padding: "6px 12px", borderRadius: "20px", fontSize: "0.8rem", cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}>
                {chip}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div style={{ padding: "15px", backgroundColor: "white", borderTop: "1px solid #e2e8f0", display: "flex", gap: "8px", alignItems: "center" }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              placeholder={isListening ? "Listening..." : "Type a message..."} 
              style={{ flex: 1, padding: "10px 15px", borderRadius: "30px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
            />
            
            <button onClick={handleVoiceSearch} style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: isListening ? "#ef4444" : "#94a3b8", transition: "color 0.2s", padding: "0 5px" }} title="Voice Search">
              {isListening ? "🔴" : "🎤"}
            </button>
            
            <button onClick={() => handleSend(input)} disabled={isLoading || !input.trim()} style={{ backgroundColor: input.trim() ? "#0f172a" : "#cbd5e1", color: "white", border: "none", minWidth: "42px", height: "42px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", cursor: input.trim() ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
              ➤
            </button>
          </div>
        </div>
      )}

      {/* 🟢 NAYA FIX: Hover Hover Tooltip effect */}
      {!isOpen && (
        <div 
          style={{ display: "flex", alignItems: "center", gap: "15px" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Ye text bubble sirf tab dikhega jab cursor button par hoga */}
          <div style={{ 
            backgroundColor: "white", 
            padding: "10px 18px", 
            borderRadius: "20px", 
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)", 
            fontSize: "0.95rem", 
            fontWeight: "bold", 
            color: "#0f172a", 
            border: "1px solid #e2e8f0",
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateX(0)" : "translateX(10px)",
            transition: "all 0.3s ease-in-out",
            pointerEvents: isHovered ? "auto" : "none"
          }}>
            Hey, I am EcoKafeBot 👋
          </div>
          
          <button 
            onClick={() => setIsOpen(true)}
            style={{ width: "65px", height: "65px", borderRadius: "50%", backgroundColor: "#00bfa5", color: "white", border: "none", boxShadow: "0 10px 25px rgba(0, 191, 165, 0.4)", fontSize: "2rem", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", transition: "transform 0.2s" }}
          >
            🤖
          </button>
        </div>
      )}
    </div>
  );
}