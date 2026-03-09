import "./globals.css";
// 🟢 FIX: Apne naye NextAuth client wrapper ko import kiya
import { NextAuthProvider } from "../Components/NextAuthProvider"; 
import AIChatbot from "../Components/AIChatbot";

export const metadata = {
  title: "EcoKafe | AI-Powered Sustainable Cafes",
  description: "Discover eco-friendly cafes and claim surplus food alerts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* 🟢 Ab officially NextAuth tera poora app handle kar raha hai! */}
        <NextAuthProvider>
          {children}
          
          <AIChatbot />
        </NextAuthProvider>
      </body>
    </html>
  );
}