import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { username, email, password, role } = await req.json();
    await connectToDatabase();

    // Check karo agar email pehle se exist karti hai
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists with this email" }, { status: 400 });
    }

    // Password ko secure (hash) karna
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Naya user DB mein save karna
    await User.create({ username, email, password: hashedPassword, role });

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.log("Signup Error:", error);
    return NextResponse.json({ message: "An error occurred during signup" }, { status: 500 });
  }
}