// src/app/api/payment/create-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { orderId } = await req.json();

  const order = await Order.findById(orderId);
  if (!order) return NextResponse.json({ success: false, message: "Order not found" });

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_SECRET!,
  });

  const options = {
    amount: Math.round(order.items.reduce((sum, s) => sum + s.grandTotal, 0) * 100), // in paise
    currency: "INR",
    receipt: orderId,
  };

  const razorpayOrder = await instance.orders.create(options);

  // Mark order as pending payment
  await Order.findByIdAndUpdate(orderId, { $set: { status: "Payment Pending" } });

  return NextResponse.json({
    success: true,
    id: razorpayOrder.id,
    currency: razorpayOrder.currency,
    amount: razorpayOrder.amount,
  });
}