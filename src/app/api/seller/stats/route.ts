import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession();
  if(!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const seller_email = session?.user?.email;
  const user = await User.findOne({ email: seller_email });
  if(!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const sellerId = user._id;
  const totalProducts = await Product.countDocuments({ sellerId });
  const orders = await Order.find({ "sellers.sellerId": sellerId });
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => {
    const sg = (o.sellers || []).find(s => String(s.sellerId) === String(sellerId));
    return sum + (sg?.grandTotal || 0);
  }, 0);

  const sales = (() => {
    const map = {};
    orders.forEach(o => {
      const month = new Date(o.createdAt).toLocaleString("default", { month: "short", year: "numeric" });
      const sg = (o.sellers || []).find(s => String(s.sellerId) === String(sellerId));
      map[month] = (map[month] || 0) + (sg?.grandTotal || 0);
    });
    return Object.entries(map).map(([month, revenue]) => ({ month, revenue }));
  })();

  return NextResponse.json({ success: true, stats: { totalProducts, totalOrders, totalRevenue, sales } });
}