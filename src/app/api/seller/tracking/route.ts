import { NextResponse } from "next/server";
import  dbConnect  from "@/lib/dbConnect";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import OrderTracking from "@/models/OrderTracking";
import mongoose from "mongoose";


export async function POST(req) {
  await dbConnect();
  const session = await getServerSession();
  if(!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const seller_email = session?.user?.email;
  const user = await User.findOne({ email: seller_email });
  if(!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  
  const { orderId, itemId, trackingNumber, trackingVia, status } = await req.json();
  if (!orderId) return NextResponse.json({ success:false, error: "Missing orderId" }, { status: 400 });
  const order = await Order.findOne({
    _id: orderId,
    "items.variantId": itemId,
  });
  if (!order) return NextResponse.json({ success:false, error: "Order not found" }, { status: 400 });
  

  const result = await OrderTracking.findOneAndUpdate({ orderId, itemId},{$set:{trackingNumber: trackingNumber, trackingVia:trackingVia, status: status }}, { upsert: true, new: true });
  if(!result) return NextResponse.json({ error: "Tracking can't be updated" }, { status: 404 });
  const resultant = await Order.updateOne(
    { _id: orderId, "items.variantId": itemId },
    { $set: { "items.$.trackingVia": result._id } }
  );

  return NextResponse.json({ success: true, message: "Tracking details updated", status: 200 });
}