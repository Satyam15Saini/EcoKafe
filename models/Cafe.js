import mongoose from "mongoose";

const CafeSchema = new mongoose.Schema({
  // Owner Information
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  
  // Cafe Basic Info
  cafeName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  city: { 
    type: String, 
    required: true 
  },
  pincode: { 
    type: String, 
    required: true 
  },
  
  // Cafe Description & Tags
  description: { 
    type: String, 
    default: "" 
  },
  cuisineType: { 
    type: [String], 
    default: [] // ["Vegan", "Organic", "Traditional", etc]
  },
  ecoRating: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 100 
  }, // Eco-friendliness rating
  
  // Operating Hours
  openingTime: { 
    type: String, 
    default: "09:00" 
  }, // HH:MM format
  closingTime: { 
    type: String, 
    default: "21:00" 
  },
  
  // Availability & Tables
  totalTables: { 
    type: Number, 
    default: 0 
  },
  availableTables: { 
    type: Number, 
    default: 0 
  },
  
  // Social & Web
  website: { 
    type: String, 
    default: "" 
  },
  instagramHandle: { 
    type: String, 
    default: "" 
  },
  
  // Status
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  isActive: { 
    type: Boolean, 
    default: true 
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

export default mongoose.models.Cafe || mongoose.model("Cafe", CafeSchema);
