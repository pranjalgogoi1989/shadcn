import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { userId, shippingAddress, paymentMethod } = body;
    if (!userId)
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    const cart = await Cart.findOne({ userId });
    if (!cart || !cart.items.length)
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    const defaultDelivery = Number(process.env.DEFAULT_DELIVERY_CHARGE || 0);
    const grouped = {};
    cart.items.forEach((item) => {
      const seller = item.sellerId || "unknown";
      if (!grouped[seller]) grouped[seller] = [];
      grouped[seller].push(item);
    });

    const sellers = Object.keys(grouped).map((sellerId) => {
      const items = grouped[sellerId];
      const subtotal = items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      const deliveryTotal = items.reduce(
        (sum, i) =>
          sum + (i.deliveryCharge != null ? i.deliveryCharge : defaultDelivery),
        0
      );
      const grandTotal = Number((subtotal + deliveryTotal).toFixed(2));

      return {
        sellerId,
        items,
        subtotal: Number(subtotal.toFixed(2)),
        deliveryTotal: Number(deliveryTotal.toFixed(2)),
        grandTotal,
      };
    });
    const totalAmount = sellers.reduce((sum, s) => sum + s.grandTotal, 0);
    const totalItems = cart.totalItems;
    const newOrder = new Order({
      userId,
      sellers,
      totalAmount: Number(totalAmount.toFixed(2)),
      totalItems,
      shippingAddress,
      paymentMethod,
    });
    await newOrder.save();

    //for adjusting the stock of products
    for (const item of cart.items) {
      const productId = item.product_id || item._id;
      const quantity = item.quantity || 1;
      await Product.updateOne({ _id: productId },{ $inc: { stock: -quantity } } // Decrease stock
      );
    }

    await Cart.findOneAndUpdate({ userId }, { items: [], totalPrice: 0, totalItems: 0 });
    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (err) {
    console.error("Place order error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}