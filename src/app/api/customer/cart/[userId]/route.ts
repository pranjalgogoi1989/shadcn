import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";

export async function GET(req, { params }) {
  await dbConnect();
  const { userId } = await params;
  if(!userId) return NextResponse.json({ items: [], totalItems: 0, subTotal: 0, delivery: 0, totalPrice: 0 });
  const cart = await Cart.findOne({ userId });
  if (!cart)
    return NextResponse.json({ items: [], totalItems: 0, subTotal: 0, delivery: 0, totalPrice: 0 });

  return NextResponse.json(cart);
}