"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useSession } from "next-auth/react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function OwnerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter(); 

  const [cafe, setCafe] = useState(null);
  const [surplusFoods, setSurplusFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddFood, setShowAddFood] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCafeData();
    }
  }, [status]);

  const fetchCafeData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cafes?ownerId=${session.user.id}`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        const cafeData = data.data[0];
        setCafe(cafeData);
        fetchSurplusFoods(cafeData._id);
      } else {
        setCafe(null);
      }
    } catch (error) {
      console.error("Error fetching cafe:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurplusFoods = async (cafeId) => {
    try {
      const response = await fetch(`/api/cafes/${cafeId}/surplus`);
      const data = await response.json();
      if (data.success) {
        setSurplusFoods(data.data);
      }
    } catch (error) {
      console.error("Error fetching surplus foods:", error);
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const newFood = {
      itemName: formData.get("itemName"),
      description: formData.get("description"),
      category: formData.get("category"),
      quantityAvailable: parseInt(formData.get("quantity")),
      originalPrice: parseFloat(formData.get("originalPrice")),
      discountedPrice: parseFloat(formData.get("discountedPrice")),
      isOrganic: formData.get("isOrganic") === "on",
      isLocallySourced: formData.get("isLocallySourced") === "on",
      availableUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };

    try {
      const response = await fetch(`/api/cafes/${cafe._id}/surplus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFood)
      });

      const data = await response.json();
      if (data.success) {
        setSurplusFoods([data.data, ...surplusFoods]);
        e.target.reset();
        setShowAddFood(false);
        alert("✅ Surplus food added successfully!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error adding food: " + error.message);
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await fetch(`/api/cafes/${cafe._id}/surplus/${foodId}`, {
          method: "DELETE"
        });

        const data = await response.json();
        if (data.success) {
          setSurplusFoods(surplusFoods.filter(f => f._id !== foodId));
          alert("✅ Item deleted successfully!");
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("Error deleting food: " + error.message);
      }
    }
  };

  const handleUpdateFood = async (foodId, updates) => {
    try {
      const response = await fetch(`/api/cafes/${cafe._id}/surplus/${foodId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      if (data.success) {
        setSurplusFoods(surplusFoods.map(f => f._id === foodId ? data.data : f));
        alert("✅ Updated successfully!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error updating food: " + error.message);
    }
  };

  const handleCreateCafe = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const newCafe = {
      cafeName: formData.get("cafeName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      pincode: formData.get("pincode"),
      description: formData.get("description"),
      cuisineType: formData.get("cuisineType").split(",").map(c => c.trim()),
      ecoRating: parseInt(formData.get("ecoRating")) || 0,
      openingTime: formData.get("openingTime"),
      closingTime: formData.get("closingTime"),
      totalTables: parseInt(formData.get("totalTables"))
    };

    try {
      const response = await fetch("/api/cafes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCafe)
      });

      const data = await response.json();
      if (data.success) {
        setCafe(data.data);
        setActiveTab("overview");
        alert("✅ Cafe created successfully!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error creating cafe: " + error.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-green-700 mb-8">🏪 Cafe Owner Dashboard</h1>

          {!cafe ? (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Register Your Cafe</h2>
              <form onSubmit={handleCreateCafe} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="cafeName" placeholder="Cafe Name" required className="border p-2 rounded" />
                  <input type="email" name="email" placeholder="Email" required className="border p-2 rounded" />
                  <input type="tel" name="phone" placeholder="Phone" required className="border p-2 rounded" />
                  <input type="text" name="address" placeholder="Address" required className="border p-2 rounded" />
                  <input type="text" name="city" placeholder="City" required className="border p-2 rounded" />
                  <input type="text" name="pincode" placeholder="Pincode" required className="border p-2 rounded" />
                  <input type="text" name="cuisineType" placeholder="Cuisine Types (comma separated)" required className="border p-2 rounded col-span-2" />
                  <textarea name="description" placeholder="Cafe Description" className="border p-2 rounded col-span-2" />
                  <input type="number" name="ecoRating" placeholder="Eco Rating (0-100)" min="0" max="100" className="border p-2 rounded" />
                  <input type="number" name="totalTables" placeholder="Total Tables" required className="border p-2 rounded" />
                  <input type="time" name="openingTime" defaultValue="09:00" className="border p-2 rounded" />
                  <input type="time" name="closingTime" defaultValue="21:00" className="border p-2 rounded" />
                </div>
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg w-full">
                  Create Cafe
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">{cafe.cafeName}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-600">📍 City</p>
                    <p className="font-bold">{cafe.city}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">⏰ Hours</p>
                    <p className="font-bold">{cafe.openingTime} - {cafe.closingTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">🌿 Eco Rating</p>
                    <p className="font-bold">{cafe.ecoRating}/100</p>
                  </div>
                  <div>
                    <p className="text-gray-600">🪑 Total Tables</p>
                    <p className="font-bold">{cafe.totalTables}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 py-2 rounded-lg ${activeTab === "overview" ? "bg-green-600 text-white" : "bg-white"}`}
                >
                  Surplus Food
                </button>
                <button
                  onClick={() => setActiveTab("stats")}
                  className={`px-4 py-2 rounded-lg ${activeTab === "stats" ? "bg-green-600 text-white" : "bg-white"}`}
                >
                  Stats
                </button>
              </div>

              {activeTab === "overview" && (
                <div>
                  {showAddFood ? (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                      <h3 className="text-xl font-bold mb-4">Add Surplus Food</h3>
                      <form onSubmit={handleAddFood} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" name="itemName" placeholder="Item Name" required className="border p-2 rounded" />
                          <select name="category" className="border p-2 rounded">
                            <option>Vegan</option>
                            <option>Vegetarian</option>
                            <option>Non-Veg</option>
                            <option>Bakery</option>
                            <option>Beverage</option>
                          </select>
                          <input type="number" name="quantity" placeholder="Quantity Available" required min="1" className="border p-2 rounded" />
                          <input type="number" name="originalPrice" placeholder="Original Price" required step="0.01" className="border p-2 rounded" />
                          <input type="number" name="discountedPrice" placeholder="Discounted Price" required step="0.01" className="border p-2 rounded" />
                          <input type="text" name="description" placeholder="Description" className="border p-2 rounded col-span-2" />
                          <label className="flex items-center">
                            <input type="checkbox" name="isOrganic" className="mr-2" />
                            <span>Is Organic?</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" name="isLocallySourced" className="mr-2" />
                            <span>Locally Sourced?</span>
                          </label>
                        </div>
                        <div className="flex space-x-4">
                          <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                            Add Item
                          </button>
                          <button type="button" onClick={() => setShowAddFood(false)} className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddFood(true)}
                      className="mb-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
                    >
                      ➕ Add Surplus Food
                    </button>
                  )}

                  <div className="space-y-4">
                    {surplusFoods.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No surplus food items yet. Add one to get started!</p>
                    ) : (
                      surplusFoods.map(food => (
                        <div key={food._id} className="bg-white rounded-lg shadow-lg p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold">{food.itemName}</h3>
                              <p className="text-gray-600">{food.description}</p>
                              <div className="grid grid-cols-3 gap-4 mt-4">
                                <div>
                                  <p className="text-sm text-gray-600">Category</p>
                                  <p className="font-bold">{food.category}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">Available</p>
                                  <p className="font-bold">{food.quantityAvailable} units</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">Price</p>
                                  <p className="font-bold">₹{food.discountedPrice} (₹{food.originalPrice})</p>
                                </div>
                              </div>
                              <p className="text-sm mt-2">
                                {food.isOrganic && "🌱 Organic "}
                                {food.isLocallySourced && "🏘️ Locally Sourced"}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  const newQty = prompt("New quantity:", food.quantityAvailable);
                                  if (newQty) handleUpdateFood(food._id, { quantityAvailable: parseInt(newQty) });
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteFood(food._id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === "stats" && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4">📊 Dashboard Stats</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-gray-600">Total Items</p>
                      <p className="text-3xl font-bold">{surplusFoods.length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Total Booked</p>
                      <p className="text-3xl font-bold">{surplusFoods.reduce((acc, f) => acc + (f.totalBooked || 0), 0)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Available Now</p>
                      <p className="text-3xl font-bold">{surplusFoods.reduce((acc, f) => acc + f.quantityAvailable, 0)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
