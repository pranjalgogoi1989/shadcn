import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import Wishlist from "@/models/WishList";
import User from "@/models/User";

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { product_id } = await req.json();
  console.log(product_id);
  if (!product_id)
    return NextResponse.json({ error: "Missing product_id" }, { status: 400 });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const wishlist = await Wishlist.findOne({ user_id: user._id });
  if (wishlist) {
    wishlist.items = wishlist.items.filter(
      (item: any) => String(item.product_id) !== String(product_id)
    );
    await wishlist.save();
  }

  return NextResponse.json({ success: true });
}