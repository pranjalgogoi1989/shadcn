import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";
import { passwordResetEmailBody } from "@/components/emails/passwordResetEmail";


export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: false, message: "Invalid email" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "Email not found" }, { status: 404 });
    }

    // Generate token and expiry
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Check for existing active token
    let resetToken = await PasswordResetToken.findOne({ userId: user._id, expiresAt: { $gt: new Date() } });

    if (resetToken) {
      // Update existing token
      resetToken.token = token;
      resetToken.expiresAt = expiresAt;
      await resetToken.save();
    } else {
      // Create new token
      resetToken = await PasswordResetToken.create({
        userId: user._id,
        token,
        expiresAt,
      });
    }

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const htmlBody = passwordResetEmailBody({ name: user.name || "User", token });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset Token",
      html: htmlBody,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Token sent to email" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 });
  }
}