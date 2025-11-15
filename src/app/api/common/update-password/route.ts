import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { passwordChangedEmailBody } from "@/components/emails/passwordChanged"; 

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { token, password, confirmPassword } = await request.json();
    if (!token || !password || !confirmPassword) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, message: "Passwords do not match" }, { status: 400 });
    }
    const resetToken = await PasswordResetToken.findOne({
      token,
      expiresAt: { $gt: new Date() },
      active: true,
    });
    if (!resetToken) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
    }
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    user.password = await bcrypt.hash(password, 10);
    user.plain_password = password; // Store plain password temporarily
    await user.save();
    resetToken.active = false;
    await resetToken.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const htmlBody = passwordChangedEmailBody({ name: user.name || "User" });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Changed Successfully",
      html: htmlBody,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Password updated and user notified" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update password" }, { status: 500 });
  }
}