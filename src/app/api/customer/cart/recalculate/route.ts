import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";

export async function POST(req) {
  await dbConnect();
  const { userId } = await req.json();
  if (!userId)
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  const cart = await Cart.findOne({ userId });
  if (!cart)
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  const defaultDelivery = Number(process.env.NEXT_PUBLIC_DELIVERY_CHARGE || 0);

  cart.totalItems = cart.items.reduce((sum, i) => sum + Number(i.quantity || 0), 0);

  const deliveryTot = cart.items.reduce((sum, i) => {
    const delivery = i.deliveryCharge != null ? i.deliveryCharge : defaultDelivery;
    return sum + delivery;
  },0);
  const total = cart.items.reduce((sum, i) => {
    const price = Number(i.price) || 0;
    const qty = Number(i.quantity) || 0;
    const sum_tot = sum + price * qty;
    return Number(sum_tot.toFixed(2));
  }, 0);

  cart.subTotal = Number(total.toFixed(2));
  cart.delivery = Number(deliveryTot.toFixed(2));
  cart.totalPrice = Number(total.toFixed(2)) + Number(deliveryTot.toFixed(2));
  await cart.save();

  return NextResponse.json({
    success: true,
    totalItems: cart.totalItems,
    subTotal: cart.subTotal,
    delivery: cart.delivery,
    totalPrice: cart.totalPrice,
    cart,
  });
}