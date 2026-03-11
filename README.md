# 🍃 EcoKafe - AI-Powered Sustainable Cafe Platform

EcoKafe is a modern, AI-driven web application designed to connect eco-conscious consumers with sustainable dining options. It features smart cafe recommendations, a real-time surplus food marketplace to combat food waste, and secure role-based portals for users, cafe owners, and administrators.



## 🚀 Live Demo 
**[Visit EcoKafe Live](https://eco-kafe-ac4i.vercel.app/)** *(Deployed on Vercel)*


## 🛠️ Full Tech Stack

### **Frontend**
* **Framework:** Next.js (App Router)
* **Library:** React.js 
* **Data Visualization:** Chart.js & `react-chartjs-2` (Admin Analytics)
* **Styling:** Custom CSS-in-JS (Inline styling)
* **Routing:** Next.js built-in `useRouter` and `useSearchParams` (with React Suspense Boundaries)

### **Backend & Authentication**
* **Authentication Engine:** NextAuth.js (Credentials Provider)
* **Session Management:** Secure HTTP-only cookies with JWT
* **API Architecture:** Next.js Serverless API Routes

### **Database & AI Integration**
* **Database:** MongoDB (via Mongoose) - *Used for secure credential storage and user management*
* **AI Engine:** Google Generative AI SDK (`@google/generative-ai` - Gemini 2.5 Flash) - *Used for dynamic, parameter-based JSON cafe filtering*
* **Client-side Caching:** Browser LocalStorage - *Used for fast, low-latency UI rendering of user history and points*

### **Deployment & Version Control**
* **Hosting:** Vercel (CI/CD Integrated)
* **Version Control:** Git & GitHub


## ✨ Key Features

### 👤 User Features
* **AI Smart Search:** Filter cafes based on location, search terms, and strict eco-features (Vegan, Composting, Zero Plastic) using Google Gemini.
* **Surplus Food Alerts:** Claim high-quality leftover food at heavily discounted rates to prevent food waste.
* **Gamified Sustainability:** Earn and track "Eco Points" and view personal environmental impact history.
* **Saved Cafes:** Bookmark favorite sustainable spots.

### 🏪 Cafe Owner Dashboard
* **Live Inventory Management:** Publish real-time surplus food alerts (item name, discount, time) to nearby users.
* **Impact Tracking:** Monitor food waste recovered (kg) and estimated revenue saved.
* **Order Management:** Mark active deals as "Sold Out" instantly.

### 🛡️ Admin Dashboard
* **Platform Analytics:** Interactive charts (Chart.js) displaying platform performance, total waste saved, and user growth.
* **Verification System:** Approve or revoke cafe verifications based on FSSAI and Green Audit report submissions.
* **User Management:** Secure route protection ensuring only authorized admin accounts can access platform-wide data.
