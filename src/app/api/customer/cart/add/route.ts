import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { userId, productId,variantId, title, image, variant, price, deliveryCharge, quantity } = body;
    
    if(!userId) return NextResponse.json({ success: false, message: "User Not logged in" }, { status: 400 });

    if (!productId) return NextResponse.json({ success: false, message: "Please select the product variants first" }, { status: 400 });

    if (!quantity || quantity <= 0) return NextResponse.json({ success: false, message: "Please select the quantity first" }, { status: 400 });

    let cart = await Cart.findOne({ userId });
    const subtotal = (price + (deliveryCharge || 0)) * quantity;

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId,variantId, title, image, variant, price, deliveryCharge, quantity, subtotal }],
      });
    } else {
      // Check if same product + same variant already exists
      const existingItem = cart.items.find(
        (item) =>
          item.productId.toString() === productId &&
          JSON.stringify(item.variant) === JSON.stringify(variant)
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.subtotal += subtotal;
      } else {
        cart.items.push({ productId,variantId, title, image, variant, price, deliveryCharge, quantity, subtotal });
      }
    }

    await cart.save();
    return NextResponse.json({ success: true, message: "Product added to cart successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Cart Add Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}