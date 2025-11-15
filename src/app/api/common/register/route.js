import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { registrationEmailBody } from "@/components/emails/registration";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  try {
    const { cname, email, password } = body;
    //console.log(cname, email, password);
    if (!cname || !email || !password) {
      return new Response(JSON.stringify({ success: false, message: "All fields required" }), {
        status: 400,
      });
    }

    await dbConnect();
    const existingUser = await User.findOne({ email:email });
    if (existingUser) {
      return new Response(JSON.stringify({ success: false, message: "User already exists" }), {
        status: 400,
      });
    }
    const role = "user";
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.insertOne({ name: cname, email:email, password: hashedPassword, plain_password:password, role:role });
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const htmlBody = registrationEmailBody({ name: user.name || "User" });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Registration Successful",
      html: htmlBody,
    };
    await transporter.sendMail(mailOptions);
    // Only return safe user fields
    return NextResponse.json({success: true,message: "Registration successful",status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ success: false, message: "Registration failed" }), {
      status: 500,
    });
  }
}