// src/app/api/payment/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET!)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature)
    return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });

  const event = JSON.parse(body);

  if (event.event === "payment.captured") {
    const orderId = event.payload.payment.entity.notes.order_id;

    await Order.findByIdAndUpdate(orderId, {
      $set: { status: "Paid" },
    });
  }

  return NextResponse.json({ success: true });
}