import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";

export async function POST(req) {
  await dbConnect();
  const { userId, productId } = await req.json();

  if (!userId || !productId)
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const cart = await Cart.findOne({ userId });
  if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  cart.items = cart.items.filter((i) => i.productId !== productId);
  await cart.save();

  return NextResponse.json({
    success: true,
    totalItems: cart.totalItems,
    subTotal: cart.subTotal,
    delivery: cart.delivery,
    totalPrice: cart.totalPrice,
    items: cart.items,
  });
}