import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { NextResponse } from "next/server";


export async function PUT(req: Request) {
  try {
    const { id, reason } = await req.json();
    await dbConnect();
    const order = await Order.findById(id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (["Delivered", "Cancelled"].includes(order.status)) {
      return NextResponse.json({ error: "Order cannot be cancelled now" }, { status: 400 });
    }
    order.paymentStatus = "Cancelled";
    if(order.paymentMethod === "ONLINE" && order.paymentStatus === "Paid") {
      order.paymentStatus = "Initiating Refund";
    }
    order.status = "Cancelled";
    order.remarks = reason || "No reason provided";
    await order.save();

    order.items.forEach(async (item) => {
        await Product.updateOne(
        {
          _id: item.productId,
          "variants.attributes": item.variant,
        },
        {
          $inc: { "variants.$.stock": +item.quantity },
        }
        );
    })

    return NextResponse.json({ message: "Order cancelled successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}