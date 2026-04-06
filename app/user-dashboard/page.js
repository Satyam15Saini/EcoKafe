"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

function DashboardContent() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [activeTab, setActiveTab] = useState("overview");
  const [userInfo, setUserInfo] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    pointsEarned: 0,
    foodItemsClaimed: 0
  });
  const [loading, setLoading] = useState(true);

  // Security Guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch user data on authentication
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchUserData();
      fetchBookingHistory();
    }
  }, [status, session?.user?.id]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/user/${session?.user?.id}`);
      const data = await response.json();
      if (data.success) {
        setUserInfo(data.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bookings");
      const data = await response.json();

      if (data.success) {
        setBookingHistory(data.data || []);

        // Calculate stats
        let totalSpent = 0;
        let pointsEarned = 0;
        let foodClaimed = 0;

        data.data?.forEach(booking => {
          totalSpent += booking.totalPrice || 0;
          pointsEarned += booking.pointsEarned || 0;
          if (booking.bookingType === "SurplusFood") {
            foodClaimed += booking.quantityClaimed || 0;
          }
        });

        setStats({
          totalBookings: data.data?.length || 0,
          totalSpent,
          pointsEarned,
          foodItemsClaimed: foodClaimed
        });
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" })
      });

      const data = await response.json();
      if (data.success) {
        alert("✅ Booking cancelled successfully");
        fetchBookingHistory();
      } else {
        alert(data.message || "Error cancelling booking");
      }
    } catch (error) {
      alert("Error cancelling booking: " + error.message);
    }
  };

  if (status === "loading" || loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-3xl">
                  👤
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {userInfo?.name || session?.user?.name || "User Profile"}
                  </h1>
                  <p className="text-gray-600 mt-2">{userInfo?.email || session?.user?.email}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-green-600">{stats.pointsEarned}</div>
                <p className="text-gray-600 font-semibold">Eco Points Earned</p>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <p className="text-gray-600 text-sm font-semibold">Total Bookings</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBookings}</h2>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm font-semibold">Total Spent</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">₹{stats.totalSpent}</h2>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
              <p className="text-gray-600 text-sm font-semibold">Food Items</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">{stats.foodItemsClaimed}</h2>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <p className="text-gray-600 text-sm font-semibold">Points Earned</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                +{stats.pointsEarned}
              </h2>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === "overview"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-white text-gray-700 shadow hover:shadow-lg"
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === "history"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-white text-gray-700 shadow hover:shadow-lg"
              }`}
            >
              📜 Booking History
            </button>
            <button
              onClick={() => setActiveTab("impact")}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === "impact"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-white text-gray-700 shadow hover:shadow-lg"
              }`}
            >
              🌍 My Impact
            </button>
          </div>

          {/* Content Sections */}
          {activeTab === "overview" && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Welcome to Your Dashboard 👋</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">🎯 Your Activity</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">📍</span>
                      <span>{stats.totalBookings} total bookings made</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">💰</span>
                      <span>₹{stats.totalSpent} spent on bookings</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">🍽️</span>
                      <span>{stats.foodItemsClaimed} food items claimed</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">⭐</span>
                      <span>{stats.pointsEarned} eco points earned</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">🌱 Eco Impact</h3>
                  <p className="text-gray-700 mb-4">
                    By using EcoKafe, you're making a real difference! Every booking and food claim reduces food waste and supports sustainable cafes.
                  </p>
                  <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
                    <p className="text-lg font-bold text-green-700">
                      🌿 You've helped save food for {stats.foodItemsClaimed} meals!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">📜 Your Booking History</h2>
              {bookingHistory.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-2xl">No bookings yet</p>
                  <p className="text-gray-600 mt-2">Start by booking a table or claiming surplus food!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookingHistory.map(booking => (
                    <div
                      key={booking._id}
                      className="border rounded-xl p-6 hover:shadow-lg transition flex justify-between items-start bg-gradient-to-r from-gray-50 to-white"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">
                            {booking.bookingType === "Table" ? "🪑" : "🍽️"}
                          </span>
                          <h3 className="text-lg font-bold">
                            {booking.bookingType === "Table"
                              ? `Table Booking - ${booking.cafeId?.cafeName || "Unknown Cafe"}`
                              : `Food Claim - ${booking.surplusFoodId?.itemName || "Surplus Food"}`}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          {new Date(booking.createdAt).toLocaleDateString()} at{" "}
                          {new Date(booking.createdAt).toLocaleTimeString()}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Price</p>
                            <p className="font-bold">₹{booking.totalPrice}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Points Earned</p>
                            <p className="font-bold text-green-600">+{booking.pointsEarned}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Status</p>
                            <p className="font-bold">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  booking.status === "Completed"
                                    ? "bg-green-100 text-green-700"
                                    : booking.status === "Cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {booking.status}
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Quantity</p>
                            <p className="font-bold">{booking.quantityClaimed || 1}</p>
                          </div>
                        </div>
                      </div>
                      {booking.status === "Confirmed" && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "impact" && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">🌍 Your Environmental Impact</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-8 text-center">
                  <p className="text-gray-700 font-semibold mb-2">Food Waste Prevented</p>
                  <p className="text-5xl font-bold text-green-700">{stats.foodItemsClaimed}</p>
                  <p className="text-gray-600 mt-2">items claimed and saved</p>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-8 text-center">
                  <p className="text-gray-700 font-semibold mb-2">CO₂ Offset</p>
                  <p className="text-5xl font-bold text-blue-700">
                    {(stats.foodItemsClaimed * 0.5).toFixed(1)}
                  </p>
                  <p className="text-gray-600 mt-2">kg equivalent reduced</p>
                </div>
                <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl p-8 text-center">
                  <p className="text-gray-700 font-semibold mb-2">Money Saved</p>
                  <p className="text-5xl font-bold text-amber-700">₹{stats.totalSpent}</p>
                  <p className="text-gray-600 mt-2">spent responsibly</p>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-8 text-center">
                  <p className="text-gray-700 font-semibold mb-2">Eco Points</p>
                  <p className="text-5xl font-bold text-purple-700">{stats.pointsEarned}</p>
                  <p className="text-gray-600 mt-2">badges earned</p>
                </div>
              </div>
              <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <p className="text-lg text-green-800 font-semibold">
                  ✨ Keep up the amazing work! Every booking makes a difference for our planet. 🌱
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function UserDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
