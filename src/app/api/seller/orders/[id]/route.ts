import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function GET(req, { params }) {
  const {id} = await params;
  if (!id) {
    return NextResponse.json({ success:false, error: "Order ID is required" ,status: 400 });
  }
  dbConnect();
  const orders = await Order.findOne({ _id: id }).populate("items.trackingVia");
  if (!orders) {
    return NextResponse.json({ success:false, error: "Order not found", status: 404 });
  }
  return NextResponse.json({ success: true, order: orders, status:200 });
}
