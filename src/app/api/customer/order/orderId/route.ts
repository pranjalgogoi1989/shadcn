import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";


export async function GET(req: NextRequest) {
  const  orderId  = req.nextUrl.searchParams.get("orderId");
  if(!orderId) return NextResponse.json({ success: false, message: "Order ID required" });
  try {
    await dbConnect();
    const order = await Order.findById(orderId)
      .populate({
        path: "items.productId",
        model: Product,
        select: "title mainImage variants",
      })
      .lean();

    if (!order) {
      return NextResponse.json({ success: false, message: "Order details not found" });
    }
    //console.log(order);

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message });
  }
}