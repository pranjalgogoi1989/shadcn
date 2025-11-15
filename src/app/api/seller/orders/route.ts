import { NextRequest, NextResponse } from "next/server";
import  dbConnect  from "@/lib/dbConnect";
import Order from "@/models/Order";
import User from "@/models/User";
import OrderTracking from "@/models/OrderTracking";
import { getServerSession } from "next-auth";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  const limit_page_default = Number(process.env.NEXT_PUBLIC_DISPLAY_PER_PAGE);

  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(limit_page_default);

    const session = await getServerSession();
    if(!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const seller_email = session?.user?.email;
    
    await dbConnect();
    const user = await User.findOne({ email: seller_email });
    if(!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const sellerId = user._id;
    //const orders = await Order.find({ "sellerId": sellerId }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    const orders = await Order.find({})
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit).lean();

    const productCount = orders.length;
    
    return NextResponse.json({ success: true, orders: orders, totalPages: Math.ceil(productCount / limit), status:200 });
  } catch (error) {
    return NextResponse.json({ success: false, message:"Error in getting orders", status:500 });
  }
}