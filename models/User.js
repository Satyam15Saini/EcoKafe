import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "user" }, // 'user', 'owner', 'admin'
  points: { type: Number, default: 350 },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);