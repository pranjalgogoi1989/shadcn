import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function GET(req, { params }) {
  await dbConnect();
  const { id } = await params;

  if (!id)
    return NextResponse.json({ error: "Please login first" }, { status: 400 });

  const orders = await Order.find({ id }).sort({ createdAt: -1 });

  return NextResponse.json(orders);
}