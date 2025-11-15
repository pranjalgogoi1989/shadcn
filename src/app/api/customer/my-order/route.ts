import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import OrderTracking from "@/models/OrderTracking";

const limit_page_default = Number(process.env.NEXT_PUBLIC_DISPLAY_PER_PAGE);

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(limit_page_default);

    const user_id = searchParams.get("id");
    if (!user_id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }
    const orderDocuments = await Order.find({userId: user_id}).countDocuments();
    const order = await Order.find({userId: user_id}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    if (!order) {
      return NextResponse.json({ error: "You haven’t placed any orders yet." }, { status: 404 });
    }
    return NextResponse.json({ success: true, order, totalPages: Math.ceil(orderDocuments / limit), status: 200  });
    
  } catch (err) {
    console.error("Error retrieving orders:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}