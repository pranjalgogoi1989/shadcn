import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";

export async function POST(req:NextRequest) {
  try {
    await dbConnect();
    const { userId, localCart } = await req.json();

    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: localCart || [] });
      console.log("New cart created");
    } else {
      // merge items intelligently
      for (const localItem of localCart || []) {
        const existing = cart.items.find(
          (i) =>
            i.productId === localItem.productId &&
            i.color === localItem.color &&
            i.size === localItem.size
        );

        if (existing) {
          existing.quantity += localItem.quantity || 1;
        } else {
          cart.items.push(localItem);
        }
      }
    }

    await cart.save();

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error("Cart Sync Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}