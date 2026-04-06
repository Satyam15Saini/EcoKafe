import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  // User Information
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  
  // Cafe Information
  cafeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Cafe", 
    required: true 
  },
  cafeName: { 
    type: String, 
    required: true 
  },
  
  // Booking Type
  bookingType: { 
    type: String, 
    enum: ["Table", "SurplusFood"],
    required: true
  },
  
  // Table Booking Details (if bookingType === "Table")
  numberOfPeople: { 
    type: Number, 
    default: null 
  },
  numberOfTables: { 
    type: Number, 
    default: null 
  },
  bookingDate: { 
    type: Date, 
    default: null 
  },
  bookingTime: { 
    type: String, 
    default: null 
  },
  
  // Surplus Food Booking Details (if bookingType === "SurplusFood")
  surplusFoodId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "SurplusFood", 
    default: null 
  },
  foodItemName: { 
    type: String, 
    default: null 
  },
  quantityClaimed: { 
    type: Number, 
    default: null 
  },
  
  // Pricing
  basePrice: { 
    type: Number, 
    required: true 
  },
  discountApplied: { 
    type: Number, 
    default: 0 
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  
  // Points Earned
  pointsEarned: { 
    type: Number, 
    default: 0 
  },
  
  // Status
  status: { 
    type: String, 
    enum: ["Confirmed", "Completed", "Cancelled"],
    default: "Confirmed"
  },
  
  // Timestamps
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  completedAt: { 
    type: Date, 
    default: null 
  },
  cancelledAt: { 
    type: Date, 
    default: null 
  },
  
  // Additional Notes
  notes: { 
    type: String, 
    default: "" 
  }
});

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
