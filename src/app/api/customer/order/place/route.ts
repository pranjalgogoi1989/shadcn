import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { userId, items, address } = body;

    if(!userId) return NextResponse.json({ success: false, message: "User Not logged in", status: 400 });
    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Please select product variants first", status: 400 });
    }

    const totalAmount = items.reduce((sum: number, i: any) => sum + (i.price + (i.deliveryCharge || 0)) * i.quantity, 0);

    const order = new Order({
      userId,
      items,
      totalAmount,
      deliveryAddress: address || {},
      paymentMethod: "Online",
      paymentStatus: "Pending",
      status: "Pending",
    });

    await order.save();

    return NextResponse.json({ success: true, orderId: order._id });
  } catch (error: any) {
    console.error("Order Create Error:", error);
    return NextResponse.json({ success: false, message: error.message, status: 500 });
  }
}