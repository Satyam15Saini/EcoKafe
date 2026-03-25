import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req) {
  try {
    const { username, email, password, role } = await req.json();
    
    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json({ message: "Please provide username, email, and password" }, { status: 400 });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Please provide a valid email address" }, { status: 400 });
    }
    
    // Validate password length
    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 });
    }
    
    await connectToDatabase();

    // Check karo agar email pehle se exist karti hai
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists with this email" }, { status: 400 });
    }

    // Password ko secure (hash) karna
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
    
    // Naya user DB mein save karna with unverified email
    const newUser = await User.create({ 
      username, 
      email, 
      password: hashedPassword, 
      role,
      isEmailVerified: false,
      otp,
      otpExpiry,
      loginMethod: "email"
    });

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🔐 EcoKafe Email Verification OTP",
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #00bfa5; text-align: center; margin-bottom: 30px;">Verify Your Email</h2>
          <p style="color: #64748b; font-size: 16px; line-height: 1.6;">Hi <strong>${username}</strong>,</p>
          <p style="color: #64748b; font-size: 16px; line-height: 1.6;">Welcome to EcoKafe! Please verify your email by entering this OTP:</p>
          
          <div style="background-color: #f0fffe; border: 2px solid #00bfa5; border-radius: 10px; padding: 20px; text-align: center; margin: 25px 0;">
            <p style="font-size: 12px; color: #64748b; margin: 0 0 10px 0;">One-Time Password</p>
            <p style="font-size: 32px; font-weight: bold; color: #00bfa5; letter-spacing: 5px; margin: 0;">${otp}</p>
          </div>
          
          <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 20px;">
            <strong>⏰ This OTP expires in 10 minutes</strong>
          </p>
          
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 30px;">
            If you didn't create this account, please ignore this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      message: "Account created! Check your email for OTP verification.",
      userId: newUser._id,
      email: newUser.email
    }, { status: 201 });
  } catch (error) {
    console.error("Signup Error Details:", error.message, error.code);
    
    // Handle specific errors
    if (error.message && error.message.includes("EAUTH")) {
      console.error("Email authentication failed. Check EMAIL_USER and EMAIL_PASS in .env.local");
      return NextResponse.json({ message: "Email service error. Please contact support." }, { status: 500 });
    }
    
    if (error.name === "ValidationError") {
      return NextResponse.json({ message: "Please fill in all required fields correctly" }, { status: 400 });
    }
    
    if (error.code === 11000) {
      return NextResponse.json({ message: "This email is already registered" }, { status: 400 });
    }
    
    return NextResponse.json({ message: "An error occurred during signup. Please try again." }, { status: 500 });
}