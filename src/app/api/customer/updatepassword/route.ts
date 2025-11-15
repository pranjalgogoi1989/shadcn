import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { passwordChangedEmailBody } from "@/components/emails/passwordChanged"; 

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const email=user.email;
  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.plain_password = newPassword;
  await user.save();


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
        to: email,
        subject: "Password Changed Successfully",
        html: htmlBody,
      };
  
      await transporter.sendMail(mailOptions);

  return NextResponse.json({ message: "Password updated successfully" });
}