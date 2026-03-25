import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, required: true, default: "user" }, // 'user', 'owner', 'admin'
  points: { type: Number, default: 350 },
  
  // OAuth providers
  googleId: { type: String },
  appleId: { type: String },
  
  // OTP verification
  otp: { type: String },
  otpExpiry: { type: Date },
  isEmailVerified: { type: Boolean, default: false },
  loginMethod: { type: String, enum: ['email', 'google', 'apple'], default: 'email' },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);