import mongoose from "mongoose";

const SurplusFoodSchema = new mongoose.Schema({
  // Cafe Information
  cafeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Cafe", 
    required: true 
  },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  
  // Food Details
  itemName: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    default: "" 
  },
  category: { 
    type: String, 
    enum: ["Vegan", "Vegetarian", "Non-Veg", "Bakery", "Beverage", "Other"],
    default: "Vegetarian"
  },
  
  // Quantity & Pricing
  quantityAvailable: { 
    type: Number, 
    required: true 
  },
  originalPrice: { 
    type: Number, 
    required: true 
  },
  discountedPrice: { 
    type: Number, 
    required: true 
  },
  discountPercentage: { 
    type: Number,
    default: 0
  },
  
  // Eco Friendly Tags
  isOrganic: { 
    type: Boolean, 
    default: false 
  },
  isLocallySourced: { 
    type: Boolean, 
    default: false 
  },
  allergens: { 
    type: [String], 
    default: [] 
  },
  
  // Availability
  availableFrom: { 
    type: Date, 
    required: true 
  },
  availableUntil: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["Available", "Reserved", "Sold Out"],
    default: "Available"
  },
  
  // Booking Tracking
  totalBooked: { 
    type: Number, 
    default: 0 
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.models.SurplusFood || mongoose.model("SurplusFood", SurplusFoodSchema);
