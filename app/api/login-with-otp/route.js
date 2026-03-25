import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user for OTP login
      user = await User.create({
        username: email.split('@')[0],
        email,
        role: 'user',
        loginMethod: 'email',
      });
    }

    // Generate OTP (valid for 10 minutes)
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await user.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"EcoKafe" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your EcoKafe Login OTP 🌿',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 15px; background-color: #f8fafc;">
          <h2 style="color: #00bfa5; text-align: center;">🌿 Welcome to EcoKafe</h2>
          <p style="color: #334155; font-size: 16px; text-align: center;">Here's your One-Time Password to log in:</p>
          
          <div style="background-color: #ffffff; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0; border: 2px solid #00bfa5;">
            <span style="font-size: 48px; font-weight: bold; letter-spacing: 8px; color: #0f172a;">${otp}</span>
          </div>
          
          <p style="color: #64748b; font-size: 14px; text-align: center;">This OTP is valid for 10 minutes</p>
          <p style="color: #94a3b8; font-size: 13px; text-align: center;">If you didn't request this, please ignore this email.</p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">🌍 Together, we're making food waste history!</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: 'OTP sent successfully to your email' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
