import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import SellerRequest from "@/models/SellerRequest";
import { getServerSession } from "next-auth";
import nodemailer from "nodemailer";
import User from "@/models/User";
import { SellerRequestEmailBody } from "@/components/emails/SellerRequest";
import Seller from "@/models/Seller";
import { stat } from "fs";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const data = await SellerRequest.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ data: data, status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const email= session?.user?.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const user_id = user._id;
    const data = await req.json();
    const { business_name, business_email, business_phone, business_address, description, gst } = data;

    const existingRequest = await SellerRequest.findOne({ user_id: user_id });
    if (existingRequest) {
      return NextResponse.json({ message: "Request already submitted" }, { status: 400 });
    }

    const newRequest = await SellerRequest.insertOne({
      user_id: user_id,
      business_name,
      business_email,
      business_phone,
      business_address,
      description,
      gst,
    });

    return NextResponse.json({ status: 200, message: "Request submitted successfully" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const { key_id, status } = data;
    console.log(key_id, status);
    const existingRequest = await SellerRequest.findOne({ _id: key_id });
    if (!existingRequest) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }
    await SellerRequest.updateOne({ _id: key_id }, { $set: {status: status} });

    const user_id = existingRequest.user_id;
    const user = await User.findOne({ _id: user_id });
    const email = user.email;
    if(status === "Approved"){
      await User.updateOne({ _id: user_id }, { $set: {role : "seller"} });
      await Seller.create({
        userId: user_id,
        name: existingRequest.business_name,
        email: existingRequest.business_email,
        phone: existingRequest.business_phone,
        address: existingRequest.business_address,
        description: existingRequest.description,
        bankDetails:{
          accountName: "",
          accountNumber: "",
          bankName: "",
          bankAddress: "",
          ifsc: "",
          branch: ""
        },
        gst: existingRequest.gst
      });
    }else{
      await User.updateOne({ _id: user_id }, { $set: {role : "user"} });
      await Seller.deleteOne({ userId: user_id });
    }
    try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
        const htmlBody = SellerRequestEmailBody({ 
          name: user.name,
          status: status
        });
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: "Seller Request Processed Successfully",
          html: htmlBody,
        };
        await transporter.sendMail(mailOptions);
      } catch (error) {
        console.log(error);
        
      }

    return NextResponse.json({ message: "Request updated successfully" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const { key_id } = data;
    const existingRequest = await SellerRequest.findOne({ _id: key_id });
    if (!existingRequest) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }
    await SellerRequest.deleteOne({ _id: key_id });
    return NextResponse.json({ message: "Request deleted successfully" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}