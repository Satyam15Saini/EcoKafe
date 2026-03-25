import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    // Gmail ka setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email ka format aur design
    const mailOptions = {
      from: `"EcoKafe Alerts" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your EcoKafe Account 🌿',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 15px;">
          <h2 style="color: #00bfa5; text-align: center;">Welcome to EcoKafe!</h2>
          <p style="color: #334155; font-size: 16px;">Thank you for taking a step towards a sustainable future.</p>
          <p style="color: #334155; font-size: 16px;">Here is your One-Time Password (OTP) to verify your email address:</p>
          <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-radius: 10px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0f172a;">${otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: 'OTP sent successfully' });

  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ success: false, message: 'Failed to send OTP' }, { status: 500 });
  }
}