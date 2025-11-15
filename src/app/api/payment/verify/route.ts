// src/app/api/payment/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.formData();

  const razorpay_order_id = body.get("razorpay_order_id");
  const razorpay_payment_id = body.get("razorpay_payment_id");
  const razorpay_signature = body.get("razorpay_signature");
  const orderId = body.get("order_id"); // from notes

  const sign = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET!)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (sign === razorpay_signature) {
    await Order.findByIdAndUpdate(orderId, { $set: { status: "Paid" } });
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order-success?orderId=${orderId}`);
  } else {
    await Order.findByIdAndUpdate(orderId, { $set: { status: "Payment Failed" } });
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order-failed?orderId=${orderId}`);
  }
}